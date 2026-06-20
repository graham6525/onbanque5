import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/turso";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
// Importe ton utilitaire de session ou de cookies si tu en as un (ex: import { cookies } from "next/headers")

// 1. LIRE : Chaque utilisateur connecté récupère son propre solde
export async function GET(request: NextRequest) {
  try {
    // 🛠️ ÉTAPE A : Récupérer l'identifiant de l'utilisateur connecté.
    // Exemple via les SearchParams pour tester, ou remplace par ton système de cookie/JWT :
    const { searchParams } = new URL(request.url);
    const customId = searchParams.get("customId"); 

    if (!customId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Requête BDD sur la table users
    const userRow = await db
      .select({ balance: users.balance })
      .from(users)
      .where(eq(users.customId, customId))
      .limit(1);

    if (userRow.length === 0) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    // Renvoie le solde personnalisé de l'utilisateur
    return NextResponse.json({ balance: userRow[0].balance });
  } catch (error) {
    console.error("Erreur GET global-balance:", error);
    return NextResponse.json({ balance: "0" }, { status: 500 });
  }
}

// 2. MODIFIER : L'admin met à jour le solde d'un utilisateur spécifique
export async function POST(request: Request) {
  try {
    const { customId, balance } = await request.json();

    if (!customId || !balance) {
      return NextResponse.json({ error: "Identifiant utilisateur ou montant manquant" }, { status: 400 });
    }

    // Nettoyage des espaces pour le stockage
    const cleanBalance = balance.replace(/\s/g, "").replace("CHF", "").trim();

    // Met à jour la colonne 'balance' uniquement pour cet utilisateur
    await db
      .update(users)
      .set({ balance: cleanBalance })
      .where(eq(users.customId, customId));

    return NextResponse.json({ success: true, balance: cleanBalance });
  } catch (error) {
    console.error("Erreur POST global-balance:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}