"use client";

import Link from "next/link";
import { useState } from "react";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);

  // Données de la FAQ
  const faqData: FAQItem[] = [
    {
      id: 1,
      category: "connexion",
      question: "Comment lier mon compte bancaire en toute sécurité ?",
      answer: "Pour lier votre compte, rendez-vous sur l'onglet 'Opérations', sélectionnez votre établissement bancaire, puis saisissez vos identifiants. Notre système utilise un chiffrement de bout en bout pour protéger vos accès."
    },
    {
      id: 2,
      category: "securite",
      question: "Qu'est-ce que la validation par code SMS (2FA) ?",
      answer: "La double authentification (2FA) est une étape de sécurité obligatoire exigée par votre banque. Un code temporaire vous est envoyé par SMS pour confirmer que vous êtes bien à l'origine de la demande de liaison."
    },
    {
      id: 3,
      category: "technique",
      question: "Que faire si mon code de confirmation ne fonctionne pas ?",
      answer: "Vérifiez que le code saisi correspond exactement à celui reçu et que le délai de validité n'a pas expiré. Si le problème persiste, cliquez sur 'Renvoyer le code' ou contactez notre support technique."
    },
    {
      id: 4,
      category: "connexion",
      question: "Puis-je lier plusieurs comptes bancaires différents ?",
      answer: "Oui, notre plateforme prend en charge la multi-liaison. Vous pouvez ajouter autant d'établissements financiers que nécessaire depuis votre tableau de bord principal."
    }
  ];

  // Filtrage des questions selon la recherche
  const filteredFaq = faqData.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFaq = (id: number) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <div className="help-container">
      {/* Bouton Retour */}
      <Link href="/dashboard" className="back-btn">
        <i className="fa-solid fa-arrow-left"></i>
      </Link>

      {/* En-tête */}
      <div className="help-header">
        <div className="help-icon-box">
          <i className="fa-solid fa-circle-info"></i>
        </div>
        <h1 className="help-title">Centre d'aide</h1>
        <p className="help-subtitle">
          Trouvez des réponses immédiates à vos questions ou contactez notre équipe technique.
        </p>

        {/* Barre de recherche */}
        <div className="help-search-wrapper">
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
          <input
            type="text"
            className="help-search-input"
            placeholder="Rechercher une question, un mot-clé..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Section des Questions Fréquentes */}
      <div className="faq-section">
        <h2 className="section-title">Questions fréquentes</h2>

        {filteredFaq.length === 0 ? (
          <div className="empty-faq">
            <i className="fa-solid fa-folder-open"></i>
            <p>Aucun résultat ne correspond à votre recherche.</p>
          </div>
        ) : (
          <div className="faq-list">
            {filteredFaq.map((item) => (
              <div 
                key={item.id} 
                className={`faq-item ${openFaqId === item.id ? "active" : ""}`}
                onClick={() => toggleFaq(item.id)}
              >
                <div className="faq-question-block">
                  <span className="faq-question">{item.question}</span>
                  <i className={`fa-solid fa-chevron-down faq-arrow`}></i>
                </div>
                <div className="faq-answer-block">
                  <p>{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

     
    </div>
  );
}