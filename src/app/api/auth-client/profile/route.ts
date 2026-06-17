import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/turso";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    // 1. Récupérer le cookie de session
    const cookieStore = await cookies();
    const userSession = cookieStore.get("user_session");

    // Si pas de session (sécurité subsidiaire)
    if (!userSession || !userSession.value) {
      return NextResponse.json({ error: "Non connecté" }, { status: 401 });
    }

    const userCustomId = userSession.value;

    // 2. Chercher l'utilisateur en BDD avec son customId
    const foundUser = await db
      .select({ name: users.name })
      .from(users)
      .where(eq(users.customId, userCustomId))
      .limit(1);

    if (foundUser.length === 0) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    // 3. Renvoyer le nom au frontend
    return NextResponse.json({ 
      success: true, 
      name: foundUser[0].name 
    });

  } catch (error) {
    console.error("Erreur API Profile:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la récupération du profil." },
      { status: 500 }
    );
  }
}