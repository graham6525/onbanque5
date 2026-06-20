import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/turso";
import { users } from "@/lib/schema";
import { desc } from "drizzle-orm";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    // 🛠️ Récupération de 'balance' envoyée par le frontend
    const { name, password, balance } = await req.json();

    if (!name || !password) {
      return NextResponse.json({ error: "Tous les champs sont requis." }, { status: 400 });
    }

    // 1. Récupérer le tout dernier utilisateur pour calculer le numéro chronologique
    const lastUser = await db
      .select({ customId: users.customId })
      .from(users)
      .orderBy(desc(users.id))
      .limit(1);

    let nextNumber = 1;
    
    if (lastUser.length > 0 && lastUser[0].customId) {
      // On extrait les 3 derniers chiffres de l'identifiant (ex: "ONBK26005" -> "005" -> 5)
      const lastCustomId = lastUser[0].customId;
      const lastNumberStr = lastCustomId.substring(6); // Coupe après "ONBK26"
      const lastNumber = parseInt(lastNumberStr, 10);
      
      if (!isNaN(lastNumber)) {
        nextNumber = lastNumber + 1;
      }
    }

    // 2. Récupérer les deux derniers chiffres de l'année en cours (ex: 2026 -> "26")
    const currentYearStr = new Date().getFullYear().toString().slice(-2);

    // 3. Formater l'identifiant sur 9 caractères au total (ONBK + Année + 3 chiffres)
    const customId = `BGBK${currentYearStr}${String(nextNumber).padStart(3, "0")}`;

    // 🛠️ Nettoyage du format monétaire reçu (ex: "15 000" -> "15000")
    const cleanBalance = balance ? balance.replace(/\s/g, "").replace("CHF", "").trim() : "0";

    // 4. Insérer le nouvel utilisateur avec son solde initial
    await db.insert(users).values({
      customId,
      name,
      password,
      balance: cleanBalance, // 👈 Sauvegarde du solde initial en BDD
    });

    return NextResponse.json({ success: true, customId });

  } catch (error) {
    console.error("Erreur création utilisateur:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la création du compte." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const allUsers = await db
      .select()
      .from(users)
      .orderBy(desc(users.id));

    return NextResponse.json({ success: true, users: allUsers });
  } catch (error) {
    console.error("Erreur récupération utilisateurs:", error);
    return NextResponse.json(
      { error: "Impossible de charger les utilisateurs." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customId = searchParams.get("customId");

    if (!customId) {
      return NextResponse.json({ error: "Identifiant manquant" }, { status: 400 });
    }

    // Suppression en BDD
    await db.delete(users).where(eq(users.customId, customId));

    return NextResponse.json({ success: true, message: "Utilisateur supprimé" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur lors de la suppression" }, { status: 500 });
  }
}