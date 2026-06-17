import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/turso";
import { adminSettings } from "@/lib/schema"; // Remplace par ta table contenant les accès admin
import { eq } from "drizzle-orm";

// 1. Récupérer les identifiants admin depuis la BDD (pour la connexion)
export async function GET() {
  try {
    const config = await db.select().from(adminSettings).limit(1);
    
    if (config.length === 0) {
      // Valeurs de secours si la table est complètement vide à l'initialisation
      return NextResponse.json({ username: "Admin", password: "Admin015" });
    }
    
    return NextResponse.json({ 
      username: config[0].username, 
      password: config[0].password 
    });
  } catch (error) {
    console.error("Erreur BDD lors de la récupération :", error);
    return NextResponse.json({ error: "Erreur de base de données" }, { status: 500 });
  }
}

// 2. Modifier les identifiants admin dans la BDD
export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || username.trim().length < 3 || !password || password.trim().length < 5) {
      return NextResponse.json(
        { error: "Identifiants invalides (Username min 3, Password min 5 caractères)." },
        { status: 400 }
      );
    }

    // Récupère la configuration existante
    const existingConfig = await db.select().from(adminSettings).limit(1);

    if (existingConfig.length > 0) {
      // Met à jour la ligne existante (Id : existingConfig[0].id)
      await db.update(adminSettings)
        .set({ username, password })
        .where(eq(adminSettings.id, existingConfig[0].id));
    } else {
      // Crée la ligne si elle n'existe pas encore du tout
      await db.insert(adminSettings).values({ username, password });
    }

    return NextResponse.json({ success: true, message: "Identifiants Admin sauvegardés en BDD !" });
  } catch (error) {
    console.error("Erreur BDD lors de la mise à jour :", error);
    return NextResponse.json({ error: "Erreur serveur lors de la sauvegarde" }, { status: 500 });
  }
}