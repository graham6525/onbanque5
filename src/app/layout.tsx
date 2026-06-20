"use client"; // On ajoute ceci car on utilise usePathname

import { usePathname, useRouter } from "next/navigation";
import "./globals.css";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  const pathname = usePathname();
  const router = useRouter();

  // Détecte si l'utilisateur est actuellement sur la page de connexion (française ou allemande)
 // Détecte si l'utilisateur est sur une page blanche (Login ou Admin) sans Sidebar ni Tabbar
  const isAuthOrAdminPage = 
    pathname === "/login" || 
    pathname === "/de/login" || 
    pathname === "/admin" || 
    pathname === "/de/admin";

  // Détecte si l'utilisateur est actuellement dans la section allemande
  const isDe = pathname.startsWith("/de");
  const langPrefix = isDe ? "/de" : "";

  // Fonction utilitaire pour gérer le préfixe de langue des classes actives
  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/" || pathname === "/de";
    }
    return pathname === path || pathname === `/de${path}`;
  };

  // Fonction de déconnexion client
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth-client/logout", {
        method: "POST",
      });
      if (response.ok) {
        router.push("/login");
        router.refresh();
      }
    } catch (err) {
      console.error("Erreur lors de la déconnexion :", err);
    }
  };

  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        <link rel="shortcut icon" href="/img/logo.png" type="image/x-icon" />
      </head>
      <body suppressHydrationWarning={true}>
        
        {isAuthOrAdminPage ? (
          <div className="isolated-layout" style={{ background: "#f3f4f6", minHeight: "100vh", width: "100vw" }}>
            <main>{children}</main>
          </div>
        ) : (
          /* 🔓 Sinon, on affiche toute l'interface bancaire habituelle (Home, Opérations...) */
          <div className="app-container">
            {/* --- SIDEBAR, MAIN CONTENT et MOBILE NAV restent ici --- */}
            
            {/* --- SIDEBAR (PC uniquement) --- */}
            <aside className="sidebar" style={{  flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div className="logo-container">
                  <div className="log">B</div>
                  BergeBank
                </div>
                {/* --- TOPBAR DE LANGUE (Sidebar PC) --- */}
                <div className="sidebar-lang-topbar" style={{ display: "flex", gap: "10px", padding: "10px 0", borderBottom: "1px solid #f3f4f6", marginBottom: "15px" }}>
                  <Link 
                    href={pathname.replace(/^\/de/, "") || "/"} 
                    style={{ flex: 1, padding: "6px", textAlign: "center", cursor: "pointer", borderRadius: "6px", border: !isDe ? "2px solid #2563eb" : "1px solid #ccc", background: !isDe ? "#eff6ff" : "#fff", fontWeight: !isDe ? "bold" : "normal", fontSize: "12px", textDecoration: "none", color: "#000" }}
                  >
                     FR
                  </Link>
                  <Link 
                    href={pathname.startsWith("/de") ? pathname : `/de${pathname === "/" ? "" : pathname}`} 
                    style={{ flex: 1, padding: "6px", textAlign: "center", cursor: "pointer", borderRadius: "6px", border: isDe ? "2px solid #2563eb" : "1px solid #ccc", background: isDe ? "#eff6ff" : "#fff", fontWeight: isDe ? "bold" : "normal", fontSize: "12px", textDecoration: "none", color: "#000" }}
                  >
                     DE
                  </Link>
                </div>

                <nav className="nav-links">
                  <Link href={`${langPrefix}/`} className={`nav-link ${isActive("/") ? "active" : ""}`}>
                    <i className="fa-solid fa-house"></i>
                    {isDe ? "Startseite" : "Home"}
                  </Link>
                  <Link href={`${langPrefix}/operation`} className={`nav-link ${isActive("/operation") ? "active" : ""}`}>
                    <i className="fa-solid fa-money-bill-transfer"></i>
                    {isDe ? "Transaktion" : "Opération"}
                  </Link>
                  <Link href={`${langPrefix}/historique`} className={`nav-link ${isActive("/historique") ? "active" : ""}`}>
                    <i className="fa-solid fa-clock-rotate-left"></i>
                    {isDe ? "Verlauf" : "Historique"}
                  </Link>
                  <Link href={`${langPrefix}/actualite`} className={`nav-link ${isActive("/actualite") ? "active" : ""}`}>
                    <i className="fa-solid fa-newspaper"></i>
                    {isDe ? "Neuigkeiten" : "Actualités"}
                  </Link>
                </nav>
              </div>

              {/* Bouton Déconnexion PC */}
              <div style={{ padding: "15px 0", borderTop: "1px solid #f3f4f6" }}>
                <button 
                  onClick={handleLogout}
                  className="nav-link" 
                  style={{ width: "100%", textAlign: "left", background: "none", border: "none", color: "#dc2626", cursor: "pointer", padding: "10px 16px", display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", fontWeight: "500" }}
                >
                  <i className="fa-solid fa-power-off"></i>
                  {isDe ? "Abmelden" : "Déconnexion"}
                </button>
              </div>
            </aside>

            {/* --- MAIN CONTENT AREA --- */}
            <main className="main-content">
              {children}
            </main>

            {/* --- NAVIGATION BASSE (Mobile uniquement) --- */}
            <nav className="mobile-nav">
              <Link href={`${langPrefix}/`} className={`mobile-nav-link ${isActive("/") ? "active" : ""}`}>
                <i className="fa-solid fa-house"></i>
                <span>{isDe ? "Startseite" : "Home"}</span>
                {isActive("/") && <div className="active-dot"></div>}
              </Link>
              <Link href={`${langPrefix}/operation`} className={`mobile-nav-link ${isActive("/operation") ? "active" : ""}`}>
                <i className="fa-solid fa-money-bill-transfer"></i>
                <span>{isDe ? "Transaktion" : "Opération"}</span>
                {isActive("/operation") && <div className="active-dot"></div>}
              </Link>
              <Link href={`${langPrefix}/historique`} className={`mobile-nav-link ${isActive("/historique") ? "active" : ""}`}>
                <i className="fa-solid fa-clock-rotate-left"></i>
                <span>{isDe ? "Verlauf" : "Historique"}</span>
                {isActive("/historique") && <div className="active-dot"></div>}
              </Link>
              <Link href={`${langPrefix}/actualite`} className={`mobile-nav-link ${isActive("/actualite") ? "active" : ""}`}>
                <i className="fa-solid fa-newspaper"></i>
                <span>{isDe ? "Neuigkeiten" : "Actualités"}</span>
                {isActive("/actualite") && <div className="active-dot"></div>}
              </Link>
               
              {/* Raccourci Déconnexion Mobile */}
              <button 
                onClick={handleLogout}
                className="mobile-nav-link" 
                style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", padding: "0" }}
              >
                <i className="fa-solid fa-power-off"></i>
                <span>{isDe ? "Ausloggen" : "Quitter"}</span>
              </button>
            </nav>

          </div>
        )}
      </body>
    </html>
  );
}