import { NextResponse } from "next/server";
import { sendTransactionalEmail } from "@/lib/admin-security";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, email, telefone, tipo, mensagem } = body || {};

    if (!nome || !email || !telefone || !tipo || !mensagem) {
      return NextResponse.json(
        { error: "Todos os campos obrigatórios devem ser preenchidos." },
        { status: 400 }
      );
    }

    console.log("[Contato] Nova mensagem de atendimento recebida pelo site.");

    // Dispara email automático para a caixa institucional do Entre as Ilhas
    await sendTransactionalEmail({
      to: "entreasilhasturismo@gmail.com",
      replyTo: email,
      subject: `📩 Novo Contato no Site: ${nome} (${tipo})`,
      text: `Novo contato recebido pelo site Entre as Ilhas:\n\nNome: ${nome}\nEmail: ${email}\nTelefone: ${telefone}\nInteresse: ${tipo}\n\nMensagem:\n${mensagem}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
          <div style="border-bottom: 2px solid #0284c7; padding-bottom: 12px; margin-bottom: 16px;">
            <h2 style="color: #0b2244; margin: 0; font-size: 18px;">Novo Contato Recebido pelo Site</h2>
            <p style="color: #64748b; font-size: 12px; margin: 4px 0 0 0;">Mensagem enviada através do formulário de atendimento.</p>
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr><td style="padding: 6px 0; color: #64748b; width: 140px;"><strong>Nome:</strong></td><td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${nome}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;"><strong>E-mail:</strong></td><td style="padding: 6px 0; color: #0284c7;"><a href="mailto:${email}" style="color: #0284c7; text-decoration: none;">${email}</a></td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;"><strong>WhatsApp / Tel:</strong></td><td style="padding: 6px 0; color: #0f172a;"><a href="https://wa.me/${telefone.replace(/\D/g, "")}" style="color: #16a34a; font-weight: bold; text-decoration: none;">${telefone} ↗</a></td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;"><strong>Interesse:</strong></td><td style="padding: 6px 0; color: #0f172a;">${tipo}</td></tr>
          </table>
          <div style="margin-top: 16px; padding: 14px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #0284c7;">
            <strong style="color: #0f172a; display: block; margin-bottom: 6px; font-size: 13px;">Mensagem do Cliente:</strong>
            <p style="margin: 0; color: #334155; line-height: 1.5; font-size: 13px; white-space: pre-wrap;">${mensagem}</p>
          </div>
          <p style="margin-top: 24px; font-size: 11px; color: #94a3b8; text-align: center;">Entre as Ilhas • Passeios Exclusivos de Lancha na Baía de Todos-os-Santos</p>
        </div>
      `
    });

    return NextResponse.json({
      success: true,
      message: "Mensagem recebida com sucesso!"
    });
  } catch (err) {
    console.error("Erro ao processar contato:", err);
    return NextResponse.json(
      { error: "Erro ao processar mensagem." },
      { status: 500 }
    );
  }
}
