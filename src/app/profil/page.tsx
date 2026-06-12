"use client"; // Obligatoire pour utiliser l'interaction (useState)

import { useState } from "react";
import Link from "next/link";

export default function ProfilPage() {
  const menuItems = [
    { icon: "fa-newspaper", label: "Actualités", path: "/actualite" },
    { icon: "fa-circle-question", label: "Aide & support", path: "/aide" },
    { icon: "fa-right-from-bracket", label: "Se déconnecter", path: "/login", isLogout: true },
  ];

  return (
    <div className="profile-container">
      <h1 className="profile-header">Profil</h1>

      {/* Carte d'identité utilisateur */}
      <div className="profile-user-card">
        <div className="profile-avatar">U</div>
        <div className="user-details">
          <h2>Utilisateur Onbanque</h2>
          {/* <p>user@onbanque.com</p> */}
        </div>
      </div>

      {/* Liste des options avec liens de navigation */}
      <div className="profile-menu">
        {menuItems.map((item, index) => (
          <Link 
            key={index} 
            href={item.path} 
            className="menu-item"
            style={{ textDecoration: "none", color: "inherit" }} // Évite les styles par défaut des liens bleus
          >
            <div className="menu-item-left">
              <i className={`fa-solid ${item.icon} ${item.isLogout ? 'logout-text' : ''}`}></i>
              <span className={item.isLogout ? 'logout-text' : ''}>{item.label}</span>
            </div>
            <i className="fa-solid fa-chevron-right menu-chevron"></i>
          </Link>
        ))}
      </div>
    </div>
  );
}