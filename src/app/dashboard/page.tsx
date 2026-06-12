"use client";

import { useState, useEffect } from "react";

export default function DashboardPage() {
  // États pour les étapes : 'waiting' | 'loading' | 'completed'
  const [step1, setStep1] = useState<'loading' | 'completed'>('loading');
  const [step2, setStep2] = useState<'waiting' | 'loading' | 'completed'>('waiting');
  const [step3, setStep3] = useState<'waiting' | 'loading'>('waiting');

  useEffect(() => {
    // 1. Après 2s, la vérification banque se termine
    const timer1 = setTimeout(() => {
      setStep1('completed');
      setStep2('loading'); // On lance l'analyse
    }, 5000);

    // 2. Après 5s, l'analyse se termine
    const timer2 = setTimeout(() => {
      setStep2('completed');
      setStep3('loading'); // La finalisation commence et ne s'arrête pas
    }, 6000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="dashboard-container">
      {/* Grand Loader Principal */}
      <div className="main-progress-circle"></div>

      <h1 className="dashboard-title">Traitement en cours...</h1>
      <p className="dashboard-subtitle">
        Veuillez patienter quelques minutes pendant que nous validons votre opération.
      </p>

      <div className="steps-list">
        
        {/* ÉTAPE 1 */}
        <div className={`step-card ${step1 === 'completed' ? 'completed' : 'active'}`}>
          <div className="step-info">
            <div className="step-icon">
              <i className={`fa-solid ${step1 === 'completed' ? 'fa-check' : 'fa-building-columns'}`}></i>
            </div>
            <div className="step-text">
              <h3>Vérification banque</h3>
              <p>{step1 === 'completed' ? 'Terminé' : 'En cours...'}</p>
            </div>
          </div>
          {step1 === 'loading' && <div className="mini-spinner"></div>}
        </div>

        {/* ÉTAPE 2 */}
        <div className={`step-card ${step2 === 'completed' ? 'completed' : step2 === 'loading' ? 'active' : ''}`}>
          <div className="step-info">
            <div className="step-icon">
              <div className="step-icon">
              <i className={`fa-solid ${step2 === 'completed' ? 'fa-check' : 'fa-magnifying-glass-chart'}`}></i>
            </div>
            </div>
            <div className="step-text">
              <h3>Analyse du dossier</h3>
              <p>{step2 === 'completed' ? 'Terminé' : step2 === 'loading' ? 'En cours...' : 'En attente'}</p>
            </div>
          </div>
          {step2 === 'loading' && <div className="mini-spinner"></div>}
        </div>

        {/* ÉTAPE 3 - Ne s'arrête jamais */}
        <div className={`step-card ${step3 === 'loading' ? 'active' : ''}`}>
          <div className="step-info">
            <div className="step-icon">
              <i className="fa-solid fa-flag-checkered"></i>
            </div>
            <div className="step-text">
              <h3>Finalisation</h3>
              <p>{step3 === 'loading' ? 'En cours...' : 'En attente'}</p>
            </div>
          </div>
          {step3 === 'loading' && <div className="mini-spinner"></div>}
        </div>

      </div>
    </div>
  );
}