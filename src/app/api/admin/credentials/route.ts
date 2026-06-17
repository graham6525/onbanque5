import { NextResponse, NextRequest } from "next/server";
import * as fs from "fs";
import * as path from "path";

// On utilise un stockage local par fichier ou mémoire pour conserver la modification des identifiants
const CREDENTIALS_FILE = path.join(process.cwd(), "data", "admin_creds.json");

function getStoredCredentials() {
  try {
    if (fs.existsSync(CREDENTIALS_FILE)) {
      const data = fs.readFileSync(CREDENTIALS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Erreur de lecture des identifiants", e);
  }
  // Valeurs par défaut si le fichier n'existe pas encore
  return { username: "Admin", password: "Admin015" };
}

// Récupérer les identifiants actuels (Utile pour le login)
export async function GET() {
  const creds = getStoredCredentials();
  return NextResponse.json(creds);
}

// Modifier les identifiants
export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || username.trim().length < 3 || !password || password.trim().length < 5) {
      return NextResponse.json(
        { error: "Identifiants invalides (Username min 3 char, Password min 5 char)." },
        { status: 400 }
      );
    }

    const dirPath = path.dirname(CREDENTIALS_FILE);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify({ username, password }), "utf-8");

    return NextResponse.json({ success: true, message: "Identifiants Admin mis à jour !" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur lors de la mise à jour" }, { status: 500 });
  }
}