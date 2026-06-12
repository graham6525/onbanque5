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
      category: "Verbindung",
      question: "Wie kann ich mein Bankkonto sicher verknüpfen?",
      answer: "Um Ihr Konto zu verknüpfen, gehen Sie zum Tab „Transaktionen“, wählen Sie Ihre Bank aus und geben Sie Ihre Anmeldedaten ein. Unser System verwendet Ende-zu-Ende-Verschlüsselung, um Ihren Zugriff zu schützen."
    },
    {
      id: 2,
      category: "Sicherheit",
      question: "Was ist SMS-Code-Verifizierung (2FA)?",
      answer: "Die Zwei-Faktor-Authentifizierung (2FA) ist eine von Ihrer Bank vorgeschriebene Sicherheitsmaßnahme. Sie erhalten einen temporären Code per SMS, um zu bestätigen, dass Sie tatsächlich die Person sind, die die Verbindungsanfrage initiiert hat."
    },
    {
      id: 3,
      category: "technisch",
      question: "Was soll ich tun, wenn mein Bestätigungscode nicht funktioniert?",
      answer: "Bitte überprüfen Sie, ob der eingegebene Code exakt mit dem erhaltenen übereinstimmt und ob er noch gültig ist. Sollte das Problem weiterhin bestehen, klicken Sie auf „Code erneut senden“ oder kontaktieren Sie unseren technischen Support."
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
      <Link href="/de/dashboard" className="back-btn">
        <i className="fa-solid fa-arrow-left"></i>
      </Link>

      {/* En-tête */}
      <div className="help-header">
        <div className="help-icon-box">
          <i className="fa-solid fa-circle-info"></i>
        </div>
        <h1 className="help-title">Hilfecenter</h1>
        <p className="help-subtitle">
          Hier finden Sie sofort Antworten auf Ihre Fragen oder kontaktieren Sie unser technisches Team.
        </p>

        {/* Barre de recherche */}
        <div className="help-search-wrapper">
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
          <input
            type="text"
            className="help-search-input"
            placeholder="Suche nach einer Frage, einem Stichwort..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Section des Questions Fréquentes */}
      <div className="faq-section">
        <h2 className="section-title">Häufig gestellte Fragen</h2>

        {filteredFaq.length === 0 ? (
          <div className="empty-faq">
            <i className="fa-solid fa-folder-open"></i>
            <p>Ihre Suche ergab keine Treffer.</p>
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