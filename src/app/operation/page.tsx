import Link from "next/link";

export default function OperationPage() {
  // Ajout d'une propriété 'slug' pour construire l'URL de navigation
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
      
      {/* Bouton Retour vers l'accueil */}
      <Link href="/" className="back-btn">
        <i className="fa-solid fa-arrow-left"></i>
      </Link>

      {/* En-tête de la page */}
      <div className="op-title-section">
        <h1 className="op-title">
          <i className="fa-solid fa-building-columns" style={{color: '#15b565'}}></i>
          Choisissez votre banque
        </h1>
        <p className="op-subtitle">
          Sélectionnez l'établissement à connecter pour effectuer votre transaction.
        </p>
      </div>

      {/* Liste des banques transformée en liens */}
      <div className="bank-list">
        {banks.map((bank, index) => (
          <Link 
            key={index} 
            href={`/operation/${bank.slug}`} 
            className="bank-item"
            style={{ textDecoration: 'none' }} // Évite le soulignement par défaut des liens
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