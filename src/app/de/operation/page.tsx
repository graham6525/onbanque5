"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function OperationPage() {
  const pathname = usePathname();

  // Détecte dynamiquement si l'URL commence par /de
  const isDe = pathname.startsWith("/de");
  const langPrefix = isDe ? "/de" : "";

  // Liste des banques
  const banks = [
    { name: "AKB", initial: "A", color: "#f03f09", slug: "akb" },
    { name: "Baloise", initial: "B", color: "#11ec8d", slug: "baloise" },
    { name: "BCBE", initial: "BCBE", color: "#1553c7", slug: "bcbe" },
    { name: "Cic lounge", initial: "CL", color: "#34a1e0", slug: "cic-lounge" },
    { name: "Cler", initial: "C", color: "#c46eb5", slug: "cler" },
    { name: "Iconer", initial: "I", color: "#3b383b", slug: "iconer" },
    { name: "Lukeb", initial: "LK", color: "#007bff", slug: "lukeb" },
    { name: "Migos", initial: "MG", color: "#077955", slug: "migos" },
    { name: "Neon", initial: "N", color: "#3b383b", slug: "neon" },
    { name: "Post finance", initial: "PF", color: "#940303", slug: "post-finance" },
    { name: "Raiffeisen", initial: "R", color: "#34a1e0", slug: "Raiffeisen" },
    { name: "Swiss banking", initial: "SB", color: "#c46eb5", slug: "Swiss-banking" },
    { name: "Ubs", initial: "UBS", color: "#3b383b", slug: "ubs" },
    { name: "Valiant", initial: "VL", color: "#007bff", slug: "Valiant" },
    { name: "ZKB", initial: "ZKB", color: "#077955", slug: "zkb" },
  ];

  return ( 
    <div className="operation-container">
      
      {/* Bouton Retour dynamique vers l'accueil correspondant à la langue */}
      <Link href={`${langPrefix}/`} className="back-btn">
        <i className="fa-solid fa-arrow-left"></i>
      </Link>

      {/* En-tête de la page */}
      <div className="op-title-section">
        <h1 className="op-title">
          <i className="fa-solid fa-building-columns" style={{ color: '#15b565' }}></i>
          Wählen Sie Ihre Bank
        </h1>
        <p className="op-subtitle">
          Wählen Sie das Unternehmen aus, mit dem Sie sich verbinden möchten, um Ihre Transaktion abzuschließen.
        </p>
      </div>

      {/* Liste des banques avec redirection interne au dossier de langue */}
      <div className="bank-list">
        {banks.map((bank, index) => (
          <Link 
            key={index} 
            href={`${langPrefix}/operation/${bank.slug}`} 
            className="bank-item"
            style={{ textDecoration: 'none' }}
          >
            <div className="bank-info">
              <div 
                className="bank-logo-circle" 
                style={{ backgroundColor: bank.color }}
              >
                {bank.initial}
              </div>
              <span className="bank-name">{bank.name}</span>
            </div>
            <i className="fa-solid fa-chevron-right chevron-icon"></i>
          </Link>
        ))}
      </div>

    </div>
  );
}