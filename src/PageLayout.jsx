import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function PageLayout({ children, activeRoute }) {
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const userMenuRef = useRef(null);
  const settingsRef = useRef(null);

  const { user, logout } = useAuth();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const scrollToSection = (id) => {
    setUserMenuOpen(false);
    if (activeRoute !== "/dashboard") {
      navigate("/dashboard");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 400);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const tabs = [
    { id: "test", label: "Test Your Skill", icon: "⚡", route: "/skillTest" },
    { id: "prepare", label: "Prepare Placement", icon: "🎯", route: "/PlacementPrep" },
    { id: "dev2dev", label: "Dev 2 Dev Help", icon: "🤝", route: "/Dev2DevHelp" },
    { id: "study", label: "Study Subjects", icon: "📚", route: "/StudySub" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap');
        .brand { font-family: 'Bebas Neue', sans-serif; }
        html, body, #root { height: 100%; margin: 0; padding: 0; background: #0a0a0a; }
        * { font-family: 'Inter', sans-serif; box-sizing: border-box; }
        @keyframes pulse-orb { 0%,100%{opacity:.4} 50%{opacity:.75} }
        @keyframes spin-ring { from{transform:translate(-50%,-50%) rotate(0deg)} to{transform:translate(-50%,-50%) rotate(360deg)} }
        @keyframes fade-in { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slide-down { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        .orb-1 { animation: pulse-orb 6s ease-in-out infinite; }
        .orb-2 { animation: pulse-orb 8s ease-in-out infinite 3s; }
        .ring-spin { animation: spin-ring 30s linear infinite; }
        .ring-spin-r { animation: spin-ring 20s linear infinite reverse; }
        .fade-in { animation: fade-in 0.5s cubic-bezier(0.16,1,0.3,1) forwards; }
        .dropdown-anim { animation: slide-down 0.2s ease forwards; }
        .grid-dots {
          background-image: radial-gradient(circle, rgba(255,214,0,0.06) 1px, transparent 1px);
          background-size: 30px 30px;
        }
        .nav-tab {
          position: relative; display: flex; align-items: center; gap: 10px;
          padding: 13px 24px; border-radius: 14px; font-size: 14px; font-weight: 700;
          border: 1px solid #2a2a2a; background: #161616; color: #777;
          cursor: pointer; transition: all 0.25s; white-space: nowrap; letter-spacing: 0.01em;
        }
        .nav-tab:hover { border-color: rgba(255,214,0,0.4); color: #FFD600; background: rgba(255,214,0,0.07); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,0,0,0.4); }
        .nav-tab.active {
          background: #FFD600; color: #000; border-color: #FFD600;
          box-shadow: 0 0 24px rgba(255,214,0,0.5), 0 6px 18px rgba(255,214,0,0.25);
          transform: translateY(-1px);
        }
        .nav-tab .tab-icon { font-size: 18px; }
        .icon-btn {
          width: 38px; height: 38px; border-radius: 10px; border: 1px solid #2a2a2a;
          background: #161616; color: #888; display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s; position: relative;
        }
        .icon-btn:hover { border-color: rgba(255,214,0,0.35); color: #FFD600; background: rgba(255,214,0,0.06); }
        .dropdown {
          position: absolute; top: 48px; right: 0; min-width: 160px;
          background: #161616; border: 1px solid #2a2a2a; border-radius: 12px;
          overflow: hidden; z-index: 9999;
          box-shadow: 0 16px 40px rgba(0,0,0,0.7);
        }
        .dropdown-item {
          display: flex; align-items: center; gap: 10px;
          padding: 11px 16px; font-size: 13px; font-weight: 500; color: #bbb;
          cursor: pointer; transition: all 0.15s; border: none; background: none; width: 100%;
          text-align: left;
        }
        .dropdown-item:hover { background: rgba(255,214,0,0.07); color: #FFD600; }
        .dropdown-item.danger:hover { background: rgba(255,80,80,0.08); color: #ff6b6b; }
        .tabs-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        @media (min-width: 640px) { .tabs-grid { grid-template-columns: repeat(4, 1fr) !important; } }
      `}</style>

      <div className="fixed inset-0 bg-[#0a0a0a] overflow-y-auto">
        <div className="fixed inset-0 grid-dots pointer-events-none" />
        <div className="orb-1 fixed top-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(255,214,0,0.09), transparent 70%)", filter: "blur(90px)" }} />
        <div className="orb-2 fixed bottom-[-150px] left-[-150px] w-[450px] h-[450px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(255,214,0,0.07), transparent 70%)", filter: "blur(90px)" }} />
        <div className="ring-spin fixed w-[900px] h-[900px] rounded-full pointer-events-none"
          style={{ top: "50%", left: "50%", border: "1px solid rgba(255,214,0,0.04)" }} />
        <div className="ring-spin-r fixed w-[620px] h-[620px] rounded-full pointer-events-none"
          style={{ top: "50%", left: "50%", border: "1px solid rgba(255,214,0,0.05)" }} />

        <nav className="sticky top-0 w-full px-6 py-3 flex items-center justify-between"
          style={{ background: "rgba(10,10,10,0.85)", backdropFilter: "blur(16px)", borderBottom: "1px solid #1a1a1a", position: "sticky", zIndex: 9999 }}>
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/dashboard")}>
            <div className="w-9 h-9 rounded-xl bg-yellow-400 flex items-center justify-center"
              style={{ boxShadow: "0 0 16px rgba(255,214,0,0.4)" }}>
              <span className="brand text-black text-lg">PP</span>
            </div>
            <div>
              <span className="brand text-yellow-400 text-xl tracking-widest">PLACE-PREP</span>
              <span className="text-[#333] text-[10px] ml-2 font-medium uppercase tracking-wider hidden sm:inline">Dashboard</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="icon-btn" title="Notifications">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <div style={{ position: "absolute", top: 7, right: 7, width: 7, height: 7, background: "#FFD600", borderRadius: "50%", border: "1.5px solid #0a0a0a" }} />
            </div>

            <div ref={settingsRef} className="icon-btn" title="Settings" style={{ position: "relative", opacity: 0.4, cursor: "not-allowed", pointerEvents: "none" }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {settingsOpen && (
                <div className="dropdown dropdown-anim">
                  {[["🎨", "Appearance"], ["🔔", "Notifications"], ["🔒", "Privacy"], ["💳", "Billing"]].map(([icon, label]) => (
                    <button key={label} className="dropdown-item">{icon} {label}</button>
                  ))}
                </div>
              )}
            </div>

            <div
              ref={userMenuRef}
              className="icon-btn"
              title="Account"
              onClick={() => { setUserMenuOpen(prev => !prev); setSettingsOpen(false); }}
              style={{ position: "relative", width: 38, height: 38 }}
            >
              {user?.photoURL
                ? <img src={user.photoURL} alt="" style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover" }} />
                : (
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #FFD600, #ff9f43)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#000" }}>{user?.initials || "??"}</span>
                  </div>
                )
              }
              {userMenuOpen && (
                <div className="dropdown dropdown-anim" style={{ minWidth: 180 }}>
                  <div style={{ padding: "12px 16px", borderBottom: "1px solid #222" }}>
                    <p style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>{user?.name || "User"}</p>
                    <p style={{ color: "#555", fontSize: 11, marginTop: 2 }}>{user?.email || ""}</p>
                  </div>
                  <button className="dropdown-item" onClick={(e) => { e.stopPropagation(); }}>👤 My Profile</button>
                  <button className="dropdown-item" onClick={(e) => { e.stopPropagation(); scrollToSection("my-progress"); }}>📊 My Progress</button>
                  <button className="dropdown-item" onClick={(e) => { e.stopPropagation(); scrollToSection("achievements"); }}>🏆 Achievements</button>
                  <div style={{ borderTop: "1px solid #222", marginTop: 4 }} />
                  <button className="dropdown-item danger" onClick={(e) => { e.stopPropagation(); handleLogout(); }} style={{ color: "#ff6b6b" }}>
                    <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>

        <div style={{ borderBottom: "1px solid #1a1a1a", background: "rgba(10,10,10,0.6)", backdropFilter: "blur(10px)" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
            <div className="tabs-grid">
              {tabs.map(tab => (
                <button key={tab.id} className={`nav-tab ${activeRoute === tab.route ? "active" : ""}`}
                  onClick={() => navigate(tab.route)}
                  style={{ justifyContent: "center", flexDirection: "column", padding: "16px 12px", gap: 8, borderRadius: 16 }}>
                  <span className="tab-icon">{tab.icon}</span>
                  <span style={{ fontSize: 13 }}>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <main className="relative z-10 px-4 sm:px-6 py-6 max-w-7xl mx-auto fade-in">
          {children}
        </main>
      </div>
    </>
  );
}