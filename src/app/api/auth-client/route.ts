import { NextResponse } from "next/server";
import { db } from "@/lib/turso";
import { users } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { customId, password } = await req.json();

    if (!customId || !password) {
      return NextResponse.json(
        { error: "Identifiant et mot de passe requis." },
        { status: 400 }
      );
    }

    // Rechercher l'utilisateur avec l'identifiant exact ET le mot de passe
    const foundUsers = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.customId, customId.trim().toUpperCase()),
          eq(users.password, password)
        )
      )
      .limit(1);

    if (foundUsers.length === 0) {
      return NextResponse.json(
        { error: "Identifiant ou mot de passe incorrect." },
        { status: 401 }
      );
    }

    // Connexion réussie : On crée la réponse et on injecte le cookie de session
    const response = NextResponse.json({ success: true });
    
   // Trouve cette ligne dans ton fichier existant :
// response.cookies.set("user_session", "active", { ... })

// Et remplace-la par celle-ci :
response.cookies.set("user_session", foundUsers[0].customId, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24 * 7, // 7 jours
  path: "/",
});

    return response;

  } catch (error) {
    console.error("Erreur Auth Client API:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de l'authentification." },
      { status: 500 }
    );
  }
}