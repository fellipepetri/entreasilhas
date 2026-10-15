import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  createSessionToken,
  getAdminCredentials,
  isRequestAuthenticated
} from "@/lib/admin-auth";

export async function GET(request: Request) {
  const authenticated = isRequestAuthenticated(request);
  const { username } = getAdminCredentials();

  return NextResponse.json({
    authenticated,
    username: authenticated ? username : null
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    const credentials = getAdminCredentials();

    if (
      username !== credentials.username ||
      password !== credentials.password
    ) {
      return NextResponse.json(
        { error: "Usuário ou senha inválidos." },
        { status: 401 }
      );
    }

    const token = createSessionToken(username);
    const response = NextResponse.json({
      success: true,
      username
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 // 7 dias
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Erro ao processar login." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });

  return response;
}
