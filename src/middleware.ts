import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Autoriser l'accès aux fichiers statiques (images, css) et aux routes d'authentification obligatoires
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/img") ||
    pathname.startsWith("/api/auth-client") || // L'API pour se connecter
    pathname === "/login" ||
    pathname === "/admin" || // On laisse l'admin tranquille
    pathname.startsWith("/api/admin")||     // Autorise /api/admin
  pathname.startsWith("/api/admin-users")||
  pathname.startsWith("/api/auth-client")
  ) {
    return NextResponse.next();
  }

  // 2. Récupérer le cookie de session utilisateur
  const userSession = request.cookies.get("user_session");

  // 3. Si aucun cookie n'existe, redirection stricte vers la page de connexion
  if (!userSession) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Configurer sur quelles routes le middleware doit s'exécuter (ici : absolument partout)
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};