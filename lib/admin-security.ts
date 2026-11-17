import fs from "fs";
import path from "path";
import crypto from "crypto";

export interface SmtpConfig {
  host?: string;
  port?: number;
  user?: string;
  pass?: string;
  secure?: boolean;
  from?: string;
  resendApiKey?: string;
}

export interface AdminSecurityConfig {
  username: string;
  passwordHash: string;
  passwordSalt: string;
  securityEmail: string;
  twoFactorEnabled: boolean;
  emergencyRecoveryCode: string;
  sessionSecret: string;
  smtp?: SmtpConfig;
  updatedAt: string;
}

const SECURITY_FILE_PATH = path.join(process.cwd(), "data", "admin-security.json");

// Cache em memória do arquivo de segurança
let cachedConfig: AdminSecurityConfig | null = null;

// Mapa de desafios 2FA em memória: challengeId -> dados
interface TwoFactorChallenge {
  username: string;
  codeHash: string;
  salt: string;
  expiresAt: number;
  attempts: number;
}
const activeChallenges = new Map<string, TwoFactorChallenge>();

// Limpeza periódica de desafios expirados
function purgeExpiredChallenges() {
  const now = Date.now();
  for (const [id, challenge] of activeChallenges.entries()) {
    if (now > challenge.expiresAt) {
      activeChallenges.delete(id);
    }
  }
}

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
}

function generateEmergencyCode(): string {
  const hex = crypto.randomBytes(6).toString("hex").toUpperCase();
  const parts = hex.match(/.{1,4}/g) || [hex.slice(0, 4), hex.slice(4)];
  return `EAI-${parts.join("-")}`;
}

export function maskEmail(email: string): string {
  const parts = email.split("@");
  if (parts.length !== 2) return email;
  const [user, domain] = parts;
  const visibleLen = Math.min(2, user.length);
  const maskedUser = user.slice(0, visibleLen) + "*".repeat(Math.max(3, user.length - visibleLen));
  return `${maskedUser}@${domain}`;
}

/**
 * Lê ou inicializa o arquivo de configuração de segurança criptográfica
 */
export function getSecurityConfig(): AdminSecurityConfig {
  if (cachedConfig) {
    return cachedConfig;
  }

  try {
    if (fs.existsSync(SECURITY_FILE_PATH)) {
      const raw = fs.readFileSync(SECURITY_FILE_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed.passwordHash && parsed.passwordSalt && parsed.username) {
        cachedConfig = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.error("Erro ao ler data/admin-security.json, recriando...", err);
  }

  // Se não existir, gera configuração inicial com credenciais salvas de forma segura (hash PBKDF2)
  const initialSalt = crypto.randomBytes(16).toString("hex");
  const initialPass = process.env.ADMIN_PASSWORD?.trim() || "entreasilhas2026!";
  const initialHash = hashPassword(initialPass, initialSalt);
  const initialSecret =
    process.env.ADMIN_SESSION_SECRET?.trim() ||
    crypto.randomBytes(32).toString("hex");

  const config: AdminSecurityConfig = {
    username: process.env.ADMIN_USERNAME?.trim() || "admin",
    passwordHash: initialHash,
    passwordSalt: initialSalt,
    securityEmail: "contato.felipepetri@gmail.com",
    twoFactorEnabled: true,
    emergencyRecoveryCode: generateEmergencyCode(),
    sessionSecret: initialSecret,
    smtp: {
      from: "Entre as Ilhas <nao-responda@entreasilhas.com.br>"
    },
    updatedAt: new Date().toISOString()
  };

  try {
    const dir = path.dirname(SECURITY_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(SECURITY_FILE_PATH, JSON.stringify(config, null, 2), "utf-8");
    cachedConfig = config;
  } catch (writeErr) {
    console.error("Falha ao salvar data/admin-security.json:", writeErr);
  }

  return config;
}

export function saveSecurityConfig(config: AdminSecurityConfig): void {
  config.updatedAt = new Date().toISOString();
  const dir = path.dirname(SECURITY_FILE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(SECURITY_FILE_PATH, JSON.stringify(config, null, 2), "utf-8");
  cachedConfig = config;
}

/**
 * Validação segura de senha com timingSafeEqual
 */
export function verifyAdminPassword(passwordAttempt: string): boolean {
  const config = getSecurityConfig();
  try {
    const computedHash = hashPassword(passwordAttempt, config.passwordSalt);
    const a = Buffer.from(computedHash, "hex");
    const b = Buffer.from(config.passwordHash, "hex");
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/**
 * Validação de usuário e senha
 */
export function verifyAdminLogin(usernameAttempt: string, passwordAttempt: string): boolean {
  const config = getSecurityConfig();
  if (usernameAttempt.trim() !== config.username) {
    return false;
  }
  return verifyAdminPassword(passwordAttempt);
}

/**
 * Cria desafio de 2FA e envia código de 6 dígitos para o email de segurança
 */
export async function createTwoFactorChallenge(username: string): Promise<{
  tempToken: string;
  maskedEmail: string;
  expiresInSeconds: number;
}> {
  purgeExpiredChallenges();
  const config = getSecurityConfig();

  // Código aleatório de 6 dígitos numéricos
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const salt = crypto.randomBytes(8).toString("hex");
  const codeHash = crypto
    .createHash("sha256")
    .update(`${code}:${salt}`)
    .digest("hex");

  const challengeId = crypto.randomBytes(16).toString("hex");
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutos de validade

  activeChallenges.set(challengeId, {
    username,
    codeHash,
    salt,
    expiresAt,
    attempts: 5
  });

  // Assina o tempToken contendo challengeId
  const payload = `${challengeId}:${username}:${expiresAt}`;
  const sig = crypto
    .createHmac("sha256", config.sessionSecret)
    .update(payload)
    .digest("hex");
  const tempToken = `${payload}:${sig}`;

  // Envio do email para o email de segurança
  await sendSecurityEmail({
    to: config.securityEmail,
    subject: `🔐 Seu código de acesso ao painel Entre as Ilhas: ${code}`,
    code,
    username
  });

  // Log de segurança no console para auditoria ou depuração
  console.log(
    `[2FA SECURITY] Código de verificação para ${config.securityEmail} (usuário: ${username}): ${code}`
  );

  return {
    tempToken,
    maskedEmail: maskEmail(config.securityEmail),
    expiresInSeconds: 600
  };
}

/**
 * Valida o código de 6 dígitos do 2FA ou a Chave de Emergência
 */
export function verifyTwoFactorChallenge(
  tempToken: string,
  codeInput: string
): { success: boolean; username?: string; error?: string } {
  purgeExpiredChallenges();
  const config = getSecurityConfig();

  if (!tempToken || !codeInput) {
    return { success: false, error: "Dados incompletos para verificação." };
  }

  const parts = tempToken.split(":");
  if (parts.length !== 4) {
    return { success: false, error: "Token de verificação inválido." };
  }

  const [challengeId, tokenUser, expStr, sig] = parts;
  const expiresAt = Number(expStr);

  // Validação da assinatura do tempToken
  const expectedSig = crypto
    .createHmac("sha256", config.sessionSecret)
    .update(`${challengeId}:${tokenUser}:${expStr}`)
    .digest("hex");

  const a = Buffer.from(sig, "hex");
  const b = Buffer.from(expectedSig, "hex");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return { success: false, error: "Token de verificação inválido ou adulterado." };
  }

  if (Date.now() > expiresAt) {
    activeChallenges.delete(challengeId);
    return { success: false, error: "O código de verificação expirou. Solicite um novo código." };
  }

  const normalizedInput = codeInput.trim().toUpperCase();

  // 1. Verificação se digitou a Chave de Emergência Master (EAI-XXXX-XXXX)
  if (
    config.emergencyRecoveryCode &&
    normalizedInput === config.emergencyRecoveryCode.trim().toUpperCase()
  ) {
    activeChallenges.delete(challengeId);
    return { success: true, username: tokenUser };
  }

  // 2. Verificação do código OTP normal de 6 dígitos
  const challenge = activeChallenges.get(challengeId);
  if (!challenge) {
    return {
      success: false,
      error: "Sessão de verificação não encontrada ou expirada. Tente fazer login novamente."
    };
  }

  if (challenge.attempts <= 0) {
    activeChallenges.delete(challengeId);
    return {
      success: false,
      error: "Número de tentativas excedido. Faça login novamente para gerar um novo código."
    };
  }

  const computedHash = crypto
    .createHash("sha256")
    .update(`${normalizedInput}:${challenge.salt}`)
    .digest("hex");

  const ha = Buffer.from(computedHash, "hex");
  const hb = Buffer.from(challenge.codeHash, "hex");

  if (ha.length === hb.length && crypto.timingSafeEqual(ha, hb)) {
    activeChallenges.delete(challengeId);
    return { success: true, username: challenge.username };
  }

  challenge.attempts -= 1;
  if (challenge.attempts <= 0) {
    activeChallenges.delete(challengeId);
    return {
      success: false,
      error: "Código incorreto. Limite de tentativas atingido. Gere um novo código."
    };
  }

  return {
    success: false,
    error: `Código de verificação incorreto. Você ainda tem ${challenge.attempts} tentativa(s).`
  };
}

/**
 * Atualiza credenciais, senha com novo salt e/ou email de recuperação
 */
export function updateAdminSecurity(
  currentPassword: string,
  updates: {
    newUsername?: string;
    newPassword?: string;
    securityEmail?: string;
    twoFactorEnabled?: boolean;
    smtp?: SmtpConfig;
  }
): {
  success: boolean;
  username: string;
  securityEmail: string;
  twoFactorEnabled: boolean;
  emergencyRecoveryCode: string;
  error?: string;
} {
  const config = getSecurityConfig();

  // Validação obrigatória da senha atual
  if (!verifyAdminPassword(currentPassword)) {
    return {
      success: false,
      username: config.username,
      securityEmail: config.securityEmail,
      twoFactorEnabled: config.twoFactorEnabled,
      emergencyRecoveryCode: config.emergencyRecoveryCode,
      error: "A senha atual informada está incorreta."
    };
  }

  let emergencyCode = config.emergencyRecoveryCode;

  if (updates.newPassword && updates.newPassword.trim()) {
    const newPass = updates.newPassword.trim();
    if (newPass.length < 8) {
      return {
        success: false,
        username: config.username,
        securityEmail: config.securityEmail,
        twoFactorEnabled: config.twoFactorEnabled,
        emergencyRecoveryCode: config.emergencyRecoveryCode,
        error: "A nova senha deve ter no mínimo 8 caracteres."
      };
    }
    const newSalt = crypto.randomBytes(16).toString("hex");
    config.passwordSalt = newSalt;
    config.passwordHash = hashPassword(newPass, newSalt);
    // Ao trocar a senha, gera uma nova chave de recuperação para o admin salvar
    emergencyCode = generateEmergencyCode();
    config.emergencyRecoveryCode = emergencyCode;
  }

  if (updates.newUsername && updates.newUsername.trim()) {
    config.username = updates.newUsername.trim();
  }

  if (updates.securityEmail && updates.securityEmail.trim()) {
    const email = updates.securityEmail.trim().toLowerCase();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      config.securityEmail = email;
    }
  }

  if (typeof updates.twoFactorEnabled === "boolean") {
    config.twoFactorEnabled = updates.twoFactorEnabled;
  }

  if (updates.smtp) {
    config.smtp = {
      ...config.smtp,
      ...updates.smtp
    };
  }

  saveSecurityConfig(config);

  return {
    success: true,
    username: config.username,
    securityEmail: config.securityEmail,
    twoFactorEnabled: config.twoFactorEnabled,
    emergencyRecoveryCode: emergencyCode
  };
}

/**
 * Regenera a Chave de Emergência Master
 */
export function regenerateEmergencyCode(currentPassword: string): {
  success: boolean;
  emergencyRecoveryCode?: string;
  error?: string;
} {
  const config = getSecurityConfig();
  if (!verifyAdminPassword(currentPassword)) {
    return { success: false, error: "Senha atual incorreta." };
  }

  const newCode = generateEmergencyCode();
  config.emergencyRecoveryCode = newCode;
  saveSecurityConfig(config);
  return { success: true, emergencyRecoveryCode: newCode };
}

/**
 * Envia email de segurança (código de 2FA ou teste)
 */
export async function sendSecurityEmail(options: {
  to: string;
  subject: string;
  code: string;
  username: string;
}): Promise<{ success: boolean; method: string; message: string }> {
  const config = getSecurityConfig();
  const to = options.to || config.securityEmail;

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 28px; background: #0b1a2e; color: #ffffff; border-radius: 16px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #38bdf8; font-size: 20px; margin: 0;">Entre as Ilhas</h1>
        <p style="color: #94a3b8; font-size: 13px; margin-top: 4px;">Autenticação em Duas Etapas (2FA)</p>
      </div>
      <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); padding: 24px; border-radius: 12px; text-align: center;">
        <p style="font-size: 14px; color: #cbd5e1; margin-bottom: 16px;">Olá, <strong>${options.username}</strong>! Use o código abaixo para autenticar seu acesso ao painel:</p>
        <div style="display: inline-block; font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #38bdf8; background: #071526; padding: 14px 28px; border-radius: 10px; border: 1px solid #38bdf8; margin: 8px 0;">
          ${options.code}
        </div>
        <p style="font-size: 12px; color: #94a3b8; margin-top: 16px;">Este código expira em <strong>10 minutos</strong>. Nunca compartilhe este código com ninguém.</p>
      </div>
      <div style="text-align: center; margin-top: 24px; font-size: 11px; color: #64748b;">
        Entre as Ilhas • Baía de Todos-os-Santos • Salvador, Bahia
      </div>
    </div>
  `;

  // 1. Tentar envio via Resend API se chave configurada
  const resendApiKey = config.smtp?.resendApiKey || process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: config.smtp?.from || process.env.SMTP_FROM || "Entre as Ilhas <nao-responda@entreasilhas.com.br>",
          to: [to],
          subject: options.subject,
          html: htmlContent
        })
      });
      if (res.ok) {
        console.log(`[2FA Resend] Email enviado com sucesso para ${to}`);
        return { success: true, method: "resend", message: `Email enviado com sucesso via Resend para ${to}!` };
      } else {
        const errorText = await res.text();
        console.warn(`[2FA Resend] Erro Resend (${res.status}): ${errorText}`);
      }
    } catch (e) {
      console.error("[2FA Resend] Falha ao enviar via API:", e);
    }
  }

  // 2. Tentar envio via SMTP com Nodemailer (Gmail, Hostinger, Outlook, etc.)
  const smtpHost = config.smtp?.host || process.env.SMTP_HOST;
  const smtpPort = Number(config.smtp?.port || process.env.SMTP_PORT || 465);
  const smtpUser = config.smtp?.user || process.env.SMTP_USER;
  const smtpPass = config.smtp?.pass || process.env.SMTP_PASS;
  const smtpFrom = config.smtp?.from || process.env.SMTP_FROM || `Entre as Ilhas <${smtpUser || "nao-responda@entreasilhas.com.br"}>`;

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });

      await transporter.sendMail({
        from: smtpFrom,
        to,
        subject: options.subject,
        text: `Olá ${options.username}! Seu código de verificação 2FA Entre as Ilhas é: ${options.code}. Válido por 10 minutos.`,
        html: htmlContent
      });

      console.log(`[2FA SMTP] Email enviado com sucesso via ${smtpHost} para ${to}`);
      return { success: true, method: "smtp", message: `Email enviado com sucesso via SMTP (${smtpHost}) para ${to}!` };
    } catch (smtpErr) {
      console.error("[2FA SMTP] Erro no envio SMTP:", smtpErr);
      const errMsg = smtpErr instanceof Error ? smtpErr.message : "Erro desconhecido no servidor SMTP.";
      return { success: false, method: "smtp", message: `Falha na conexão SMTP (${smtpHost}): ${errMsg}` };
    }
  }

  // 3. Fallback: Log estruturado no console do servidor Docker (Portainer)
  console.log(
    `[2FA SECURITY DISPATCH] Código enviado com sucesso para ${to}: [${options.code}] (Usuário: ${options.username})`
  );

  return {
    success: false,
    method: "console_fallback",
    message: `Aviso: Nenhum servidor SMTP (como Gmail) ou chave Resend foi configurado ainda. O código [${options.code}] foi gerado e registrado nos logs do servidor (Portainer). Para receber no Gmail, configure o SMTP abaixo.`
  };
}
