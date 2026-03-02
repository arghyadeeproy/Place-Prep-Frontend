import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import ProfileModal from "../src/pages/components/ProfileModal";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../src/services/notificationservice";

const NOTIF_ICONS = { test: "⚡", profile: "🖼️", achievement: "🏆", general: "🔔" };

function timeAgo(ts) {
  if (!ts) return "";
  let d;
  if (ts?.toDate) d = ts.toDate();
  else if (ts?._seconds) d = new Date(ts._seconds * 1000);
  else d = new Date(ts);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function PageLayout({ children, activeRoute }) {
  const navigate = useNavigate();
  const { user, logout, refreshUser } = useAuth();

  const notifRef = useRef(null);
  const userRef  = useRef(null);

  const [notifOpen,    setNotifOpen]    = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [profileOpen,  setProfileOpen]  = useState(false);
  const [profileTab,   setProfileTab]   = useState("edit");

  const [notifs,        setNotifs]        = useState([]);
  const [notifsLoading, setNotifsLoading] = useState(false);
  const [markingAll,    setMarkingAll]    = useState(false);
  const unreadCount = notifs.filter(n => !n.read).length;

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (userRef.current  && !userRef.current.contains(e.target))  setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (notifOpen) fetchNotifs();
  }, [notifOpen]);

  const fetchNotifs = async () => {
    setNotifsLoading(true);
    try {
      const data = await getNotifications();
      setNotifs(data);
    } catch (err) {
      console.error("[notifications] fetch failed:", err?.response?.data || err.message);
      setNotifs([]);
    } finally {
      setNotifsLoading(false);
    }
  };

  const handleMarkOne = async (notif) => {
    if (notif.read) return;
    setNotifs(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
    try { await markNotificationRead(notif.id); }
    catch { setNotifs(prev => prev.map(n => n.id === notif.id ? { ...n, read: false } : n)); }
  };

  const handleMarkAll = async () => {
    if (markingAll || unreadCount === 0) return;
    setMarkingAll(true);
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
    try { await markAllNotificationsRead(); }
    catch { await fetchNotifs(); }
    finally { setMarkingAll(false); }
  };

  const openProfile = (tab = "edit") => {
    setProfileTab(tab);
    setProfileOpen(true);
    setUserMenuOpen(false);
    setNotifOpen(false);
  };

  const handleLogout = async () => { await logout(); };

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
    { id: "test",    label: "Test Your Skill",   icon: "⚡", route: "/skillTest"     },
    { id: "prepare", label: "Prepare Placement", icon: "🎯", route: "/PlacementPrep" },
    { id: "dev2dev", label: "Dev 2 Dev Help",    icon: "🤝", route: "/Dev2DevHelp"   },
    { id: "study",   label: "Study Subjects",    icon: "📚", route: "/StudySub"      },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap');
        .brand { font-family: 'Bebas Neue', sans-serif; }
        html, body, #root { height: 100%; margin: 0; padding: 0; background: #0a0a0a; }
        * { font-family: 'Inter', sans-serif; box-sizing: border-box; }
        @keyframes pulse-orb  { 0%,100%{opacity:.4} 50%{opacity:.75} }
        @keyframes spin-ring  { from{transform:translate(-50%,-50%) rotate(0deg)} to{transform:translate(-50%,-50%) rotate(360deg)} }
        @keyframes fade-in    { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slide-down { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes nd-shimmer { from{transform:translateX(-100%)} to{transform:translateX(100%)} }
        .orb-1 { animation: pulse-orb 6s ease-in-out infinite; }
        .orb-2 { animation: pulse-orb 8s ease-in-out infinite 3s; }
        .ring-spin   { animation: spin-ring 30s linear infinite; }
        .ring-spin-r { animation: spin-ring 20s linear infinite reverse; }
        .fade-in     { animation: fade-in 0.5s cubic-bezier(0.16,1,0.3,1) forwards; }
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
        .nav-tab.active { background: #FFD600; color: #000; border-color: #FFD600; box-shadow: 0 0 24px rgba(255,214,0,0.5), 0 6px 18px rgba(255,214,0,0.25); transform: translateY(-1px); }
        .nav-tab .tab-icon { font-size: 18px; }
        .icon-btn {
          width: 38px; height: 38px; border-radius: 10px; border: 1px solid #2a2a2a;
          background: #161616; color: #888; display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s; position: relative;
        }
        .icon-btn:hover, .icon-btn.active-icon { border-color: rgba(255,214,0,0.35); color: #FFD600; background: rgba(255,214,0,0.06); }
        .dropdown {
          position: absolute; top: 48px; right: 0;
          background: #161616; border: 1px solid #2a2a2a; border-radius: 14px;
          overflow: hidden; z-index: 99999; box-shadow: 0 16px 40px rgba(0,0,0,0.8);
        }
        .dropdown-item {
          display: flex; align-items: center; gap: 10px;
          padding: 11px 16px; font-size: 13px; font-weight: 500; color: #bbb;
          cursor: pointer; transition: all 0.15s; border: none; background: none; width: 100%;
          text-align: left; font-family: 'Inter', sans-serif;
        }
        .dropdown-item:hover { background: rgba(255,214,0,0.07); color: #FFD600; }
        .dropdown-item.danger:hover { background: rgba(255,80,80,0.08); color: #ff6b6b; }
        .tabs-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        @media (min-width: 640px) { .tabs-grid { grid-template-columns: repeat(4, 1fr) !important; } }

        /* notification panel */
        .nd-panel { width: 320px; position: absolute; top: 48px; right: 0; background: #161616; border: 1px solid #242424; border-radius: 16px; overflow: hidden; z-index: 99999; box-shadow: 0 20px 60px rgba(0,0,0,0.85); animation: slide-down 0.2s ease forwards; }
        .nd-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px 10px; border-bottom: 1px solid #1e1e1e; }
        .nd-title { font-size: 12px; font-weight: 700; color: #777; letter-spacing: .08em; text-transform: uppercase; }
        .nd-mark-all { font-size: 11px; font-weight: 600; color: #555; background: none; border: none; cursor: pointer; transition: color .2s; font-family: 'Inter', sans-serif; padding: 0; }
        .nd-mark-all:hover:not(:disabled) { color: #FFD600; }
        .nd-mark-all:disabled { opacity: .3; cursor: not-allowed; }
        .nd-list { max-height: 320px; overflow-y: auto; scrollbar-width: thin; scrollbar-color: #2a2a2a transparent; }
        .nd-item { display: flex; align-items: flex-start; gap: 10px; padding: 12px 16px; cursor: pointer; transition: background .15s; border: none; background: none; width: 100%; text-align: left; font-family: 'Inter', sans-serif; border-bottom: 1px solid #1a1a1a; position: relative; }
        .nd-item:last-child { border-bottom: none; }
        .nd-item:hover { background: rgba(255,255,255,0.025); }
        .nd-item.unread { background: rgba(255,214,0,0.03); }
        .nd-item.unread:hover { background: rgba(255,214,0,0.055); }
        .nd-icon { width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 15px; background: #1e1e1e; border: 1px solid #252525; margin-top: 1px; }
        .nd-item.unread .nd-icon { background: rgba(255,214,0,0.08); border-color: rgba(255,214,0,0.2); }
        .nd-content { flex: 1; min-width: 0; }
        .nd-item-title { font-size: 12px; font-weight: 600; color: #999; line-height: 1.3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .nd-item.unread .nd-item-title { color: #ddd; }
        .nd-item-msg { font-size: 11px; color: #4a4a4a; margin-top: 2px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .nd-item-time { font-size: 10px; color: #333; margin-top: 4px; }
        .nd-dot { width: 6px; height: 6px; border-radius: 50%; background: #FFD600; flex-shrink: 0; margin-top: 7px; box-shadow: 0 0 5px rgba(255,214,0,.5); }
        .nd-skeleton { height: 60px; margin: 8px 16px; border-radius: 10px; background: #1a1a1a; position: relative; overflow: hidden; }
        .nd-skeleton::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg,transparent,rgba(255,255,255,.025),transparent); animation: nd-shimmer 1.5s infinite; }
        .nd-empty { padding: 28px 16px; text-align: center; }
        .nd-empty-icon { font-size: 28px; opacity: .2; margin-bottom: 8px; }
        .nd-empty-text { font-size: 12px; color: #333; }
        .nd-footer { padding: 10px 16px; border-top: 1px solid #1e1e1e; text-align: center; }
        .nd-footer-btn { font-size: 11px; font-weight: 600; color: #444; background: none; border: none; cursor: pointer; transition: color .2s; font-family: 'Inter', sans-serif; }
        .nd-footer-btn:hover { color: #FFD600; }
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

        {/* Navbar */}
        <nav className="sticky top-0 w-full px-6 py-3 flex items-center justify-between"
          style={{ background: "rgba(10,10,10,0.85)", backdropFilter: "blur(16px)", borderBottom: "1px solid #1a1a1a", zIndex: 9999 }}>

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

            {/* Bell */}
            <div ref={notifRef}
              className={`icon-btn${notifOpen ? " active-icon" : ""}`}
              title="Notifications"
              onClick={() => { setNotifOpen(prev => !prev); setUserMenuOpen(false); }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>

              {/* Badge */}
              {unreadCount > 0 ? (
                <div style={{ position: "absolute", top: 5, right: 5, minWidth: 14, height: 14, background: "#FFD600", borderRadius: 7, border: "1.5px solid #0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 800, color: "#000", padding: "0 3px" }}>
                  {unreadCount > 9 ? "9+" : unreadCount}
                </div>
              ) : (
                <div style={{ position: "absolute", top: 7, right: 7, width: 7, height: 7, background: "#FFD600", borderRadius: "50%", border: "1.5px solid #0a0a0a" }} />
              )}

              {notifOpen && (
                <div className="nd-panel" onClick={e => e.stopPropagation()}>
                  <div className="nd-header">
                    <span className="nd-title">Notifications</span>
                    <button className="nd-mark-all" onClick={handleMarkAll}
                      disabled={markingAll || unreadCount === 0}>
                      {markingAll ? "Marking..." : "Mark all read"}
                    </button>
                  </div>
                  <div className="nd-list">
                    {notifsLoading ? (
                      [1,2,3].map(i => <div key={i} className="nd-skeleton" />)
                    ) : notifs.length === 0 ? (
                      <div className="nd-empty">
                        <div className="nd-empty-icon">🔔</div>
                        <p className="nd-empty-text">No notifications yet</p>
                      </div>
                    ) : notifs.map(n => (
                      <button key={n.id}
                        className={`nd-item${!n.read ? " unread" : ""}`}
                        onClick={() => handleMarkOne(n)}>
                        <div className="nd-icon">{NOTIF_ICONS[n.type] || "🔔"}</div>
                        <div className="nd-content">
                          <div className="nd-item-title">{n.title}</div>
                          <div className="nd-item-msg">{n.message}</div>
                          <div className="nd-item-time">{timeAgo(n.created_at)}</div>
                        </div>
                        {!n.read && <div className="nd-dot" />}
                      </button>
                    ))}
                  </div>
                  <div className="nd-footer">
                    <button className="nd-footer-btn"
                      onClick={() => { setNotifOpen(false); openProfile("notifs"); }}>
                      View all in Profile
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Settings disabled */}
            <div className="icon-btn" title="Settings"
              style={{ opacity: 0.4, cursor: "not-allowed", pointerEvents: "none" }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>

            {/* Avatar */}
            <div ref={userRef}
              className={`icon-btn${userMenuOpen ? " active-icon" : ""}`}
              title="Account"
              onClick={() => { setUserMenuOpen(prev => !prev); setNotifOpen(false); }}
              style={{ position: "relative", width: 38, height: 38 }}>

              {user?.photoURL ? (
                <div style={{ width: 30, height: 30, borderRadius: "50%", overflow: "hidden", flexShrink: 0 }}>
                  <img src={user.photoURL} alt="" referrerPolicy="no-referrer"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
              ) : (
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg, #FFD600, #ff9f43)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#000", lineHeight: 1 }}>
                    {user?.initials || "??"}
                  </span>
                </div>
              )}

              {userMenuOpen && (
                <div className="dropdown dropdown-anim" style={{ minWidth: 190 }}
                  onClick={e => e.stopPropagation()}>
                  <div style={{ padding: "12px 16px", borderBottom: "1px solid #222" }}>
                    <p style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>{user?.name || "User"}</p>
                    <p style={{ color: "#555", fontSize: 11, marginTop: 2 }}>{user?.email || ""}</p>
                  </div>
                  <button className="dropdown-item" onClick={() => openProfile("edit")}>
                    👤 My Profile
                  </button>
                  <button className="dropdown-item" onClick={() => openProfile("stats")}>
                    📊 My Stats
                  </button>
                  <button className="dropdown-item" onClick={() => openProfile("notifs")}>
                    🔔 Notifications
                    {unreadCount > 0 && (
                      <span style={{ marginLeft: "auto", background: "#FFD600", color: "#000", fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 20 }}>
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  <button className="dropdown-item"
                    onClick={() => { setUserMenuOpen(false); scrollToSection("achievements"); }}>
                    🏆 Achievements
                  </button>
                  <div style={{ borderTop: "1px solid #222", marginTop: 4 }} />
                  <button className="dropdown-item danger"
                    onClick={() => handleLogout()} style={{ color: "#ff6b6b" }}>
                    <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Tab bar */}
        <div style={{ borderBottom: "1px solid #1a1a1a", background: "rgba(10,10,10,0.6)", backdropFilter: "blur(10px)" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
            <div className="tabs-grid">
              {tabs.map(tab => (
                <button key={tab.id}
                  className={`nav-tab ${activeRoute === tab.route ? "active" : ""}`}
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

      <ProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        initialTab={profileTab}
        user={user}
        onProfileUpdate={refreshUser}
      />
    </>
  );
}