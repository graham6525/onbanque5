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

  const isButtonDisabled = customId.length < 5 || !password || loading;

  return (
    <div 
      style={{ 
        display: "flex", 
        minHeight: "100vh", 
        width: "100vw",
        alignItems: "center", 
        justifyContent: "center", 
        background: "#f3f4f6", 
        padding: "20px",
        boxSizing: "border-box"
      }}
    >
      <div 
        style={{ 
          background: "#fff", 
          padding: "40px 30px", 
          borderRadius: "16px", 
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)", 
          width: "100%", 
          maxWidth: "400px", 
          boxSizing: "border-box" 
        }}
      >
        
        {/* En-tête du formulaire */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div 
            style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              justifyContent: "center", 
              width: "55px", 
              height: "55px", 
              background: "#000", 
              color: "#fff", 
              borderRadius: "14px", 
              fontSize: "26px", 
              fontWeight: "bold", 
              marginBottom: "16px" 
            }}
          >
            B
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: "0 0 8px 0", fontFamily: "'Poppins', sans-serif" }}>
            Espace Client
          </h1>
          <p style={{ fontSize: "14px", color: "#4b5563", margin: "0", lineHeight: "1.5" }}>
            Connectez-vous pour accéder à votre espace BergeBank.
          </p>
        </div>

        {/* Bloc d'erreur */}
        {error && (
          <div 
            style={{ 
              background: "#fef2f2", 
              color: "#991b1b", 
              padding: "12px 14px", 
              borderRadius: "10px", 
              fontSize: "14px", 
              marginBottom: "20px", 
              border: "1px solid #fee2e2",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}
          >
            <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: "16px" }}></i>
            <span>{error}</span>
          </div>
        )}

        {/* Formulaire de connexion */}
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
          
          {/* Identifiant */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Identifiant Client</label>
            <input
              type="text"
              placeholder="Ex: BGBK26001"
              value={customId}
              onChange={(e) => setCustomId(e.target.value)}
              required
              style={{ 
                padding: "12px 14px", 
                borderRadius: "10px", 
                border: "1px solid #d1d5db", 
                fontSize: "15px", 
                outline: "none", 
                textTransform: "uppercase",
                transition: "border-color 0.2s",
                width: "100%",
                boxSizing: "border-box"
              }}
            />
          </div>

          {/* Mot de passe */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Mot de passe</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ 
                padding: "12px 14px", 
                borderRadius: "10px", 
                border: "1px solid #d1d5db", 
                fontSize: "15px", 
                outline: "none",
                transition: "border-color 0.2s",
                width: "100%",
                boxSizing: "border-box"
              }}
            />
          </div>

          {/* Bouton de validation */}
          <button
            type="submit"
            disabled={isButtonDisabled}
            style={{
              padding: "14px",
              background: isButtonDisabled ? "#9ca3af" : "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: isButtonDisabled ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              marginTop: "8px",
              width: "100%"
            }}
          >
            {loading ? (
              "Vérification en cours..."
            ) : (
              <>
                <i className="fa-solid fa-shield-halved" style={{ fontSize: "15px" }}></i>
                Se connecter en sécurité
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}