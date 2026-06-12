"use client"; // Obligatoire pour utiliser l'interaction (useState)

import { useState } from "react";
import Link from "next/link";


export default function HistoriquePage() {
  return (
    <div className="history-container">
      
      <h1 className="history-header">Historique</h1>

      <div className="empty-history-card">
        <div className="empty-icon-circle">
          <i className="fa-solid fa-clock-rotate-left"></i>
        </div>
        
        <h3>Aucune opération</h3>
        <p>Vos opérations apparaîtront ici.</p>
      </div>

    </div>
  );
}