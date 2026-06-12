import { NextResponse } from "next/server";
import { db } from "@/lib/turso";
import { appSettings } from "@/lib/schema";
import { eq } from "drizzle-orm";

// 1. LIRE le montant global unique
export async function GET() {
  try {
    const setting = await db
      .select({ value: appSettings.value })
      .from(appSettings)
      .where(eq(appSettings.id, "current_balance")) 
      .limit(1);

    const balance = setting.length > 0 ? setting[0].value : "40 500 €";
    return NextResponse.json({ balance });
  } catch (error) {
    console.error("Erreur GET global-balance:", error);
    return NextResponse.json({ balance: "40 500 €" });
  }
}

// 2. MODIFIER le montant global unique depuis l'admin
export async function POST(request: Request) {
  try {
    const { balance } = await request.json();

    if (!balance) {
      return NextResponse.json({ error: "Montant manquant" }, { status: 400 });
    }

    // Met à jour directement la ligne unique 'current_balance'
    await db
      .update(appSettings)
      .set({ 
        value: balance,
        updatedAt: new Date().toISOString()
      })
      .where(eq(appSettings.id, "current_balance"));

    return NextResponse.json({ success: true, balance });
  } catch (error) {
    console.error("Erreur POST global-balance:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}