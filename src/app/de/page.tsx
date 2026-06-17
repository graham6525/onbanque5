"use client"; 

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Home() {

  // À l'intérieur de ton composant de page d'accueil :
const [userName, setUserName] = useState("");
const [liveBalance, setLiveBalance] = useState("200 000");
 

useEffect(() => {
  // 1. Récupérer le solde
  const getAmount = async () => {  
    try {
      const res = await fetch("/api/global-balance");
      const data = await res.json();
      if (data.balance) setLiveBalance(data.balance);
    } catch (err) {
      console.error("Erreur récupération solde:", err);
    }
  };

  // 2. Récupérer le nom de l'utilisateur connecté via la nouvelle API de profil
  const getUserProfile = async () => {
    try {
      const res = await fetch("/api/auth-client/profile");
      const data = await res.json();
      if (data.success && data.name) {
        setUserName(data.name);
      }
    } catch (err) {
      console.error("Erreur récupération nom utilisateur:", err);
    }
  };

  // Exécution immédiate au montage du composant
  getAmount();
  getUserProfile();

  // Rafraîchissement du solde toutes les 5 secondes
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
          <div className="avatar-circle">
            {userName ? userName.charAt(0).toUpperCase() : "O"}
          </div>
          <div> 
            <p className="welcome-msg">{isDe ? "Hallo" : "Salut"} 👋</p>
            <h1 className="user-display-name">Willkommen {userName}</h1>
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
          <span><i className="fa-solid fa-wallet"></i> MÖGLICHES VERFÜGBARES GUTHABEN </span>
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
          <i className="fa-solid fa-chart-line"></i> +28 % diesen Monat
        </div>
        
        <div className="quick-actions-grid">
         <Link href="/de/operation" style={{ textDecoration: "none", color: "inherit", display: "contents" }}>
  <button className="q-action-btn">
    <i className="fa-solid fa-hand-holding-dollar"></i> Zahlung
  </button>
</Link>
          {/* <button className="q-action-btn"><i className="fa-regular fa-paper-plane"></i> Envoyer</button> */}
          <Link href="/de/operation" style={{ textDecoration: "none", color: "inherit", display: "contents" }}>
  <button className="q-action-btn">
    <i className="fa-solid fa-arrow-down-long"></i> Erhalten
  </button>
</Link>
          <Link href="/de/actualite" style={{ textDecoration: "none", color: "inherit", display: "contents" }}>
  <button className="q-action-btn">
    <i className="fa-solid fa-ellipsis"></i> Mehr
  </button>
</Link>
        </div>
      </section>

      {/* Boutons Principaux */}
      <div className="main-buttons-row">
        <Link href="/de/operation" className="btn-black">
  <i className="fa-solid fa-money-check-dollar"></i>
  Machen Sie eine Überweisung
  <i className="fa-solid fa-arrow-right"></i>
</Link>
        <Link href="/de/historique" className="btn-white">
  <i className="fa-solid fa-clock-rotate-left"></i>
          Sehen Sie sich meine Operationen an
</Link>
        
      </div>

      {/* Pourquoi Onbanque */}
      <section>
        <h2 className="home-section-title">Warum Onbanque?</h2>
        <div className="feature-item">
          <div className="feature-icon-box"><i className="fa-solid fa-bolt"></i></div>
          <div className="feature-text">
            <h4>Antwort innerhalb von Minuten</h4>
            <p>Sofortige Entscheidung über Ihre Anfrage.</p>
          </div>
        </div>
        <div className="feature-item">
          <div className="feature-icon-box"><i className="fa-solid fa-shield-halved"></i></div>
          <div className="feature-text">
            <h4>100% sicher</h4>
            <p>Ende-zu-Ende-Verschlüsselung.</p>
          </div>
        </div>
      </section>

      {/* Simulateur */}
      <section className="simulator-card">
        <div className="sim-header">
          <span style={{fontWeight: 600, fontSize: '14px'}}><i className="fa-solid fa-calculator"></i> Mit einem Klick simulieren</span>
          <span className="sim-tag">Neu</span>
        </div>
        {/* <p style={{fontSize: '12px', color: '#888', margin: '10px 0'}}>Empruntez de 500 € à 10 000 € sur 6 à 84 mois.</p> */}
        
        <div className="sim-amount-row">
          <div>
            <p style={{fontSize: '11px', color: '#888'}}>Menge</p>
            <div className="sim-value-big">40 000 CHF</div>
          </div>
          <div style={{textAlign: 'right'}}>
            <p style={{fontSize: '11px', color: '#888'}}>Monatliche Zahlung ab</p>
            <div className="sim-value-green">142 CHF</div>
          </div>
        </div>


        <Link href="/de/operation" className="btn-black" style={{background: '#15b565', width: '100%', marginTop: '20px', border: 'none'}}>
   <i className="fa-solid fa-rocket"></i> Starten Sie meine Anfrage
</Link>
      </section>

      {/* Partenaires */}
      <section style={{marginTop: '35px', marginBottom: '30px'}}>
        <h2 className="home-section-title"><i className="fa-solid fa-building-columns"></i> Bankpartner</h2>
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
            <img src="/img/iconer.png" alt="img" />
            <span style={{fontSize: '10px'}}>iconer</span>
          </div>
           <div className="partner-circle-card">
            <img src="/img/abs.webp" alt=" Logo" />
            <span style={{fontSize: '10px'}}>abs</span>
          </div>
          <div className="partner-circle-card">
            <img src="/img/bcv.png" alt="img" />
            <span style={{fontSize: '10px'}}>BCV</span>
          </div>
          <div className="partner-circle-card">
            <img src="/img/creditagricole.png" alt="img" />
            <span style={{fontSize: '10px'}}>Credit agricole</span>
          </div>
          <div className="partner-circle-card">
            <img src="/img/sgkb.webp" alt="img" />
            <span style={{fontSize: '10px'}}>sgkb</span>
          </div>
          <div className="partner-circle-card">
            <img src="/img/wir.png" alt="img" />
            <span style={{fontSize: '10px'}}>WIR</span>
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