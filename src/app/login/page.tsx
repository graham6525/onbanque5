"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [customId, setCustomId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth-client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customId, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirection vers l'accueil une fois connecté
        router.push("/");
        router.refresh();
      } else {
        setError(data.error || "Une erreur est survenue.");
      }
    } catch (err) {
      setError("Erreur réseau. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  // Sécurité de longueur d'input : bouton désactivé si longueur inférieure à 5 caractères
  const isButtonDisabled = customId.length < 5 || !password || loading;

  return (
    <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", background: "#f3f4f6", padding: "20px" }}>
      <div style={{ background: "#fff", padding: "40px 30px", borderRadius: "16px", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)", width: "100%", maxWidth: "420px", boxSizing: "border-box" }}>
        
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "50px", height: "50px", background: "#2563eb", color: "#fff", borderRadius: "12px", fontSize: "24px", fontWeight: "bold", marginBottom: "15px" }}>
            O
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#111", margin: "0 0 8px 0" }}>Espace Client</h1>
          <p style={{ fontSize: "14px", color: "#666", margin: "0" }}>Connectez-vous pour accéder à votre espace Onbanque.</p>
        </div>

        {error && (
          <div style={{ background: "#fef2f2", color: "#991b1b", padding: "12px", borderRadius: "8px", fontSize: "14px", marginBottom: "20px", border: "1px solid #fca5a5" }}>
            <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: "8px" }}></i>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#4b5563" }}>Identifiant Client</label>
            <input
              type="text"
              placeholder="Ex: ONBK26001"
              value={customId}
              onChange={(e) => setCustomId(e.target.value)}
              required
              style={{ padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "15px", outline: "none", textTransform: "uppercase" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#4b5563" }}>Mot de passe</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "15px", outline: "none" }}
            />
          </div>

          <button
            type="submit"
            disabled={isButtonDisabled}
            style={{
              padding: "14px",
              background: isButtonDisabled ? "#9ca3af" : "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: isButtonDisabled ? "not-allowed" : "pointer",
              transition: "background 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              marginTop: "10px"
            }}
          >
            {loading ? (
              "Vérification..."
            ) : (
              <>
                <i className="fa-solid fa-shield-halved"></i>
                Se connecter en sécurité
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}