# Entre as Ilhas

Base inicial do site/webApp da agência de turismo **Entre as Ilhas**, construída com **Next.js**, **TypeScript**, **Tailwind CSS** e **App Router**.

## Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- ESLint

## Estrutura inicial

```text
app/
  contato/
  passeios/
    [slug]/
  sobre/
  globals.css
  layout.tsx
  page.tsx
components/
data/
lib/
public/
  images/
```

## Scripts

```bash
npm install
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
```

## Organização

- `app/`: rotas e layouts do App Router
- `components/`: componentes reutilizáveis
- `data/`: dados estáticos e mocks iniciais
- `lib/`: utilitários e helpers
- `public/images/`: imagens públicas do projeto

## Deploy futuro

O projeto foi organizado para facilitar deploy posterior na Cloudflare Pages, mantendo:

- estrutura padrão compatível com Next.js moderno
- App Router já configurado
- imagens locais em `public/`
- configuração limpa para acoplar adapter ou pipeline de deploy depois

## Próximos passos sugeridos

1. Instalar as dependências.
2. Rodar o ambiente local.
3. Criar o repositório Git e conectar ao GitHub.
4. Evoluir layout, conteúdo e integrações do negócio.
