"use client"; 

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Home() {

  // À l'intérieur de ton composant de page d'accueil :

const [liveBalance, setLiveBalance] = useState("200 000");


useEffect(() => {

  // Récupère le solde configuré par l'admin

  const getAmount = async () => {  
    try {
      const res = await fetch("/api/global-balance");
      const data = await res.json();
      if (data.balance) setLiveBalance(data.balance);
    } catch (err) {
      console.error(err);
    }
  };



  getAmount();
  // Optionnel : rafraîchir toutes les 5 secondes pour voir le changement en direct
  const interval = setInterval(getAmount, 5000);
  return () => clearInterval(interval);
}, []);

  // État pour savoir si le solde est visible ou caché

  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };
 const pathname = usePathname();
const isDe = pathname.startsWith("/de");

  return (
    <div className="home-wrapper">
      {/* Header */}
      <header className="home-header">
        <div className="user-info">
          <div className="avatar-circle">O</div>
          <div> 
            <p className="welcome-msg">Salut 👋</p>
            <h1 className="user-display-name">Bienvenue sur Onbanque</h1>
          </div>
        </div>
         {/* --- SÉLECTEUR DE LANGUE (À la place des notifications) --- */}
        <div className="topbar-lang-switcher" style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <Link 
            href={pathname.replace(/^\/de/, "") || "/"} 
            style={{ padding: "6px 12px", borderRadius: "8px", border: !isDe ? "2px solid #2563eb" : "1px solid #ccc", background: !isDe ? "#eff6ff" : "#fff", fontWeight: !isDe ? "bold" : "normal", fontSize: "13px", textDecoration: "none", color: "#000" }}
          >
         FR
          </Link>
          <Link 
            href={pathname.startsWith("/de") ? pathname : `/de${pathname === "/" ? "" : pathname}`} 
            style={{ padding: "6px 12px", borderRadius: "8px", border: isDe ? "2px solid #2563eb" : "1px solid #ccc", background: isDe ? "#eff6ff" : "#fff", fontWeight: isDe ? "bold" : "normal", fontSize: "13px", textDecoration: "none", color: "#000" }}
          >
            DE
          </Link> 
        </div>
      </header>

      {/* Carte Solde */}
      <section className="balance-card">
        <div className="balance-label">
          <span><i className="fa-solid fa-wallet"></i> SOLDE DISPONIBLE POSSIBLE</span>
          {/* L'icône change selon l'état isVisible */}
          <button onClick={toggleVisibility} style={{ color: '#fff', fontSize: '18px' }}>
            <i className={`fa-regular ${isVisible ? 'fa-eye' : 'fa-eye-slash'}`}></i>
          </button>
        </div>

        {/* Le texte change selon l'état isVisible */}
        <div className="balance-value">
  {isVisible ? liveBalance : "*******"} CHF
</div>

        <div className="balance-stats">
          <i className="fa-solid fa-chart-line"></i> +28% ce mois-ci
        </div>
        
        <div className="quick-actions-grid">
         <Link href="/operation" style={{ textDecoration: "none", color: "inherit", display: "contents" }}>
  <button className="q-action-btn">
    <i className="fa-solid fa-hand-holding-dollar"></i> Virement
  </button>
</Link>
          {/* <button className="q-action-btn"><i className="fa-regular fa-paper-plane"></i> Envoyer</button> */}
          <Link href="/operation" style={{ textDecoration: "none", color: "inherit", display: "contents" }}>
  <button className="q-action-btn">
    <i className="fa-solid fa-arrow-down-long"></i> Recevoir
  </button>
</Link>
          <Link href="/actualite" style={{ textDecoration: "none", color: "inherit", display: "contents" }}>
  <button className="q-action-btn">
    <i className="fa-solid fa-ellipsis"></i> Plus
  </button>
</Link>
        </div>
      </section>

      {/* Boutons Principaux */}
      <div className="main-buttons-row">
        <Link href="/operation" className="btn-black">
  <i className="fa-solid fa-money-check-dollar"></i>
  Effectuer un virement
  <i className="fa-solid fa-arrow-right"></i>
</Link>
        <Link href="/historique" className="btn-white">
  <i className="fa-solid fa-clock-rotate-left"></i>
          Voir mes opérations
</Link>
        {/* <button className="btn-white">
          <i className="fa-solid fa-clock-rotate-left"></i>
          Voir mes opérations
        </button> */}
      </div>

      {/* Pourquoi Onbanque */}
      <section>
        <h2 className="home-section-title">Pourquoi Onbanque ?</h2>
        <div className="feature-item">
          <div className="feature-icon-box"><i className="fa-solid fa-bolt"></i></div>
          <div className="feature-text">
            <h4>Réponse en quelques minutes</h4>
            <p>Décision instantanée sur votre demande.</p>
          </div>
        </div>
        <div className="feature-item">
          <div className="feature-icon-box"><i className="fa-solid fa-shield-halved"></i></div>
          <div className="feature-text">
            <h4>100% sécurisé</h4>
            <p>Chiffrement  de bout en bout.</p>
          </div>
        </div>
      </section>

      {/* Simulateur */}
      <section className="simulator-card">
        <div className="sim-header">
          <span style={{fontWeight: 600, fontSize: '14px'}}><i className="fa-solid fa-calculator"></i> Simulez en 1 clic</span>
          <span className="sim-tag">Nouveau</span>
        </div>
        {/* <p style={{fontSize: '12px', color: '#888', margin: '10px 0'}}>Empruntez de 500 € à 10 000 € sur 6 à 84 mois.</p> */}
        
        <div className="sim-amount-row">
          <div>
            <p style={{fontSize: '11px', color: '#888'}}>Montant</p>
            <div className="sim-value-big">40 000 CHF</div>
          </div>
          <div style={{textAlign: 'right'}}>
            <p style={{fontSize: '11px', color: '#888'}}>Mensualité dès</p>
            <div className="sim-value-green">142 CHF</div>
          </div>
        </div>


        <Link href="/operation" className="btn-black" style={{background: '#15b565', width: '100%', marginTop: '20px', border: 'none'}}>
   <i className="fa-solid fa-rocket"></i> Démarrer ma demande
</Link>
      </section>

      {/* Partenaires */}
      <section style={{marginTop: '35px', marginBottom: '30px'}}>
        <h2 className="home-section-title"><i className="fa-solid fa-building-columns"></i> Partenaires bancaires</h2>
        <div className="partners-grid">
          <div className="partner-circle-card">
            <img src="/img/bcbe.png" alt="Nickel Logo" />
            <span style={{fontSize: '10px'}}>bcbe</span>
          </div>
          
          <div className="partner-circle-card">
            <img src="/img/akb.png" alt="Wise Logo" />
            <span style={{fontSize: '10px'}}>akb</span>
          </div>
          <div className="partner-circle-card">
            <img src="/img/cic-lounge.png" alt="N26 Logo" />
            <span style={{fontSize: '10px'}}>cic lounge</span>
          </div>
          <div className="partner-circle-card">
            <img src="/img/baloise.png" alt="img" />
            <span style={{fontSize: '10px'}}>baloise</span>
          </div>
          
          <div className="partner-circle-card">
            <img src="/img/clear.png" alt="img" />
            <span style={{fontSize: '10px'}}>cler</span>
          </div>
          <div className="partner-circle-card">
            <img src="/img/creditagricole.jpeg" alt="img" />
            <span style={{fontSize: '10px'}}>Credit agricole</span>
          </div>
          <div className="partner-circle-card">
            <img src="/img/iconer.png" alt="img" />
            <span style={{fontSize: '10px'}}>iconer</span>
          </div>
          <div className="partner-circle-card">
            <img src="/img/lukeb.png" alt="img" />
            <span style={{fontSize: '10px'}}>lukeb</span>
          </div>
          <div className="partner-circle-card">
            <img src="/img/migos.webp" alt=" img" />
            <span style={{fontSize: '10px'}}>migos</span>
          </div>
          <div className="partner-circle-card">
            <img src="/img/neon.jpg" alt=" img" />
            <span style={{fontSize: '10px'}}>neon</span>
          </div>
          <div className="partner-circle-card">
            <img src="/img/post-finance.png" alt=" img" />
            <span style={{fontSize: '10px'}}>post finance </span>
          </div>
          <div className="partner-circle-card">
            <img src="/img/raiffeisen.png" alt=" img" />
            <span style={{fontSize: '10px'}}>raiffeisen</span>
          </div>
          <div className="partner-circle-card">
            <img src="/img/swiss-b.png" alt=" img" />
            <span style={{fontSize: '10px'}}>swiss banking</span>
          </div>
          <div className="partner-circle-card">
            <img src="/img/ubs-key.png" alt=" img" />
            <span style={{fontSize: '10px'}}>ubs key</span>
          </div>
          <div className="partner-circle-card">
            <img src="/img/valiant.jpg" alt=" img" />
            <span style={{fontSize: '10px'}}>valiant</span>
          </div>
          <div className="partner-circle-card">
            <img src="/img/zkb.png" alt=" img" />
            <span style={{fontSize: '10px'}}>zkb</span>
          </div>

        </div>
      </section>
    </div>
  );
}