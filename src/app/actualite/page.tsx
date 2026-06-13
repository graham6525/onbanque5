"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface LoanNotification {
  id: string;
  user: string;
  amount: string;
  bank: string;
}

export default function ActualitePage() {
  const [notification, setNotification] = useState<LoanNotification | null>(null);

  // Listes de données aléatoires pour simuler les prêts
  const firstNames = ["Marc", "Sophie", "Thomas", "Lucas", "Léa", "Mathieu", "Chloé", "Antoine", "Emma", "Julien", "John", "Carl hernandes"];
 const banks = ["bcbe", "akb", "N26", "cic lounge", "baloise", "cler", "migos", "neon", "post finance ", "raiffeisen"];
  const amounts = ["1 000 CHF", "2 200 CHF", "5 500 CHF", "6 000 CHF", "11 000 CHF", "450 CHF", "2 300 CHF", "500 CHF", "400 CHF", "2 800 CHF"];
  
  // Intervalles possibles en millisecondes (5s, 10s, 15s, 20s)
  const intervals = [5000, 10000, 15000, 20000, 30000];

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const triggerRandomNotification = () => {
      // 1. Génération d'une fausse donnée de prêt
      const randomUser = firstNames[Math.floor(Math.random() * firstNames.length)] + " " + Math.random().toString(36).substring(2, 3).toUpperCase() + ".";
      const randomBank = banks[Math.floor(Math.random() * banks.length)];
      const randomAmount = amounts[Math.floor(Math.random() * amounts.length)];

      // 2. Affichage de la notification
      setNotification({
        id: Math.random().toString(36).substring(2, 9),
        user: randomUser,
        amount: randomAmount,
        bank: randomBank
      });

      // 3. Masquer la notification après 4 secondes (laisse le temps de la lire)
      setTimeout(() => {
        setNotification(null);
      }, 4000);

      // 4. Programmer la PROCHAINE notification avec un délai aléatoire (5s, 10s, 15s ou 20s)
      const nextDelay = intervals[Math.floor(Math.random() * intervals.length)];
      timeoutId = setTimeout(triggerRandomNotification, nextDelay);
    };

    // Lance la première notification après 3 secondes au chargement de la page
    timeoutId = setTimeout(triggerRandomNotification, 3000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="news-container">
      {/* Bouton Retour */}
      <Link href="/dashboard" className="back-btn">
        <i className="fa-solid fa-arrow-left"></i>
      </Link>

      <div className="news-header">
        <div className="news-icon-box">
          <i className="fa-solid fa-newspaper"></i>
        </div>
        <h1 className="news-title">Actualités en Direct</h1>
        <p className="news-subtitle">
          Suivez l'activité de la communauté Onbanque et les derniers micro-prêts accordés.
        </p>
      </div>

      {/* Zone du flux central */}
      <div className="news-feed-zone">
        <div className="waiting-box">
          <div className="pulse-dot"></div>
          <p>Écoute du flux de transactions...</p>
        </div>
      </div>

      {/* COMPOSANT FLOTTANT (POP-UP TOAST) */}
      {notification && (
        <div className="loan-toast">
          <div className="toast-icon">
            <i className="fa-solid fa-circle-check"></i>
          </div>
          <div className="toast-content">
            <h4>Prêt Accordé !</h4>
            <p>
              <strong>{notification.user}</strong> vient de recevoir un virement de <span>{notification.amount}</span> sur son compte <strong>{notification.bank}</strong>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}