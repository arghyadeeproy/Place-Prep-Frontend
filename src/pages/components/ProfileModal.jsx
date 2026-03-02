import { useState, useEffect, useRef } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { auth, storage } from "../../firebase";
import api from "../../services/api";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../../services/notificationservice";

/* helpers */
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

const YEAR_OPTIONS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"];

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap');

  .pm-overlay { position:fixed; inset:0; z-index:99999; background:rgba(0,0,0,0.75); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; padding:16px; animation:pm-fade-in .2s ease forwards; }
  @keyframes pm-fade-in  { from{opacity:0} to{opacity:1} }
  @keyframes pm-slide-up { from{opacity:0;transform:translateY(24px) scale(.98)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes pm-spin     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes pm-shimmer  { from{transform:translateX(-100%)} to{transform:translateX(100%)} }

  .pm-modal { width:100%; max-width:520px; max-height:92vh; background:#111; border:1px solid #222; border-radius:24px; overflow:hidden; display:flex; flex-direction:column; box-shadow:0 32px 80px rgba(0,0,0,.9),0 0 0 1px rgba(255,214,0,.05); animation:pm-slide-up .3s cubic-bezier(.16,1,.3,1) forwards; }

  .pm-header { position:relative; background:linear-gradient(160deg,#161616,#111); border-bottom:1px solid #1e1e1e; flex-shrink:0; }
  .pm-cover { height:90px; background:linear-gradient(135deg,#1a1600,#0a0a0a 40%,#1a1000); position:relative; overflow:hidden; }
  .pm-cover::before { content:''; position:absolute; inset:0; background-image:radial-gradient(circle,rgba(255,214,0,.08) 1px,transparent 1px); background-size:20px 20px; }
  .pm-cover-accent { position:absolute; top:-40px; right:-40px; width:160px; height:160px; border-radius:50%; background:radial-gradient(circle,rgba(255,214,0,.15),transparent 70%); filter:blur(30px); }
  .pm-avatar-row { display:flex; align-items:flex-end; justify-content:space-between; padding:0 24px 18px; margin-top:-28px; position:relative; }
  .pm-avatar-wrap { position:relative; width:72px; height:72px; flex-shrink:0; }
  .pm-avatar { width:72px; height:72px; border-radius:50%; border:3px solid #111; object-fit:cover; background:linear-gradient(135deg,#FFD600,#ff9f43); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:22px; color:#000; font-family:'Bebas Neue',sans-serif; letter-spacing:1px; overflow:hidden; }
  .pm-avatar-edit { position:absolute; bottom:0; right:-2px; width:24px; height:24px; border-radius:50%; background:#FFD600; border:2px solid #111; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:transform .2s; }
  .pm-avatar-edit:hover { transform:scale(1.15); }
  .pm-avatar-uploading { position:absolute; inset:0; border-radius:50%; background:rgba(0,0,0,.6); display:flex; align-items:center; justify-content:center; }
  .pm-close-btn { width:32px; height:32px; border-radius:10px; border:1px solid #2a2a2a; background:#161616; color:#666; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all .2s; align-self:flex-start; margin-top:10px; flex-shrink:0; }
  .pm-close-btn:hover { border-color:rgba(255,214,0,.3); color:#FFD600; }

  .pm-tabs { display:flex; padding:0 24px; border-bottom:1px solid #1a1a1a; flex-shrink:0; overflow-x:auto; scrollbar-width:none; }
  .pm-tabs::-webkit-scrollbar { display:none; }
  .pm-tab { padding:12px 16px; font-size:12px; font-weight:600; color:#555; cursor:pointer; border-bottom:2px solid transparent; transition:all .2s; letter-spacing:.04em; text-transform:uppercase; background:none; border-top:none; border-left:none; border-right:none; white-space:nowrap; font-family:'Inter',sans-serif; }
  .pm-tab:hover { color:#888; }
  .pm-tab.active { color:#FFD600; border-bottom-color:#FFD600; }
  .pm-tab-badge { display:inline-flex; align-items:center; justify-content:center; width:16px; height:16px; border-radius:50%; background:#FFD600; color:#000; font-size:9px; font-weight:800; margin-left:5px; vertical-align:middle; line-height:1; }

  .pm-body { overflow-y:auto; padding:24px; flex:1; scrollbar-width:thin; scrollbar-color:#2a2a2a transparent; }
  .pm-section { margin-bottom:24px; }
  .pm-section-label { font-size:10px; font-weight:700; color:#444; letter-spacing:.1em; text-transform:uppercase; margin-bottom:12px; }

  .pm-field { margin-bottom:14px; }
  .pm-label { display:block; font-size:11px; font-weight:600; color:#555; margin-bottom:6px; letter-spacing:.04em; }
  .pm-input { width:100%; padding:10px 14px; background:#161616; border:1px solid #252525; border-radius:10px; color:#eee; font-size:13px; font-family:'Inter',sans-serif; outline:none; transition:border-color .2s; box-sizing:border-box; }
  .pm-input:focus { border-color:rgba(255,214,0,.4); }
  .pm-input::placeholder { color:#3a3a3a; }
  .pm-textarea { resize:vertical; min-height:80px; max-height:150px; line-height:1.5; }
  .pm-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }

  .pm-stat-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
  .pm-stat { background:#161616; border:1px solid #222; border-radius:12px; padding:14px 10px; text-align:center; }
  .pm-stat-value { font-family:'Bebas Neue',sans-serif; font-size:26px; color:#FFD600; line-height:1; letter-spacing:1px; }
  .pm-stat-label { font-size:10px; color:#555; margin-top:4px; font-weight:600; text-transform:uppercase; letter-spacing:.05em; }

  .pm-tag-wrap { display:flex; flex-wrap:wrap; gap:8px; margin-top:8px; }
  .pm-tag { padding:5px 12px; border-radius:20px; font-size:11px; font-weight:600; background:rgba(255,214,0,.08); border:1px solid rgba(255,214,0,.2); color:#FFD600; display:flex; align-items:center; gap:6px; }
  .pm-tag-remove { cursor:pointer; opacity:.6; background:none; border:none; color:#FFD600; padding:0; font-size:13px; transition:opacity .2s; }
  .pm-tag-remove:hover { opacity:1; }
  .pm-tag-input-row { display:flex; gap:8px; margin-top:8px; }
  .pm-tag-add-btn { padding:8px 14px; border-radius:9px; font-size:12px; font-weight:600; background:rgba(255,214,0,.1); border:1px solid rgba(255,214,0,.25); color:#FFD600; cursor:pointer; white-space:nowrap; transition:all .2s; flex-shrink:0; font-family:'Inter',sans-serif; }
  .pm-tag-add-btn:hover { background:rgba(255,214,0,.18); }

  .pm-badge-row { display:flex; flex-wrap:wrap; gap:8px; }
  .pm-badge { padding:6px 14px; border-radius:20px; font-size:11px; font-weight:600; background:#1a1a1a; border:1px solid #252525; color:#444; display:flex; align-items:center; gap:6px; }
  .pm-badge.earned { background:rgba(255,214,0,.06); border-color:rgba(255,214,0,.2); color:#FFD600; }

  .pm-link-input-row { display:flex; align-items:center; gap:10px; }
  .pm-link-icon { width:34px; height:34px; border-radius:9px; background:#1a1a1a; border:1px solid #252525; display:flex; align-items:center; justify-content:center; flex-shrink:0; }

  .pm-progress-bar-wrap { height:3px; background:#1a1a1a; border-radius:2px; margin-top:6px; overflow:hidden; }
  .pm-progress-bar { height:100%; background:#FFD600; border-radius:2px; transition:width .3s; }

  .pm-footer { padding:16px 24px; border-top:1px solid #1a1a1a; display:flex; gap:10px; justify-content:flex-end; flex-shrink:0; background:#111; position:relative; }
  .pm-btn { padding:10px 22px; border-radius:11px; font-size:13px; font-weight:600; cursor:pointer; transition:all .2s; border:1px solid transparent; font-family:'Inter',sans-serif; }
  .pm-btn-ghost { background:transparent; border-color:#252525; color:#666; }
  .pm-btn-ghost:hover { border-color:#333; color:#888; }
  .pm-btn-primary { background:#FFD600; color:#000; border-color:#FFD600; box-shadow:0 0 16px rgba(255,214,0,.25); }
  .pm-btn-primary:hover { background:#ffe033; box-shadow:0 0 24px rgba(255,214,0,.4); }
  .pm-btn-primary:disabled { opacity:.5; cursor:not-allowed; }
  .pm-spinner { width:14px; height:14px; border:2px solid rgba(0,0,0,.3); border-top-color:#000; border-radius:50%; animation:pm-spin .7s linear infinite; display:inline-block; margin-right:6px; }
  .pm-toast { position:absolute; bottom:68px; left:50%; transform:translateX(-50%); background:#1a1a1a; border:1px solid #2a2a2a; border-radius:10px; padding:10px 18px; font-size:12px; color:#ccc; white-space:nowrap; z-index:10; box-shadow:0 8px 24px rgba(0,0,0,.5); animation:pm-fade-in .2s ease; pointer-events:none; }
  .pm-toast.success { border-color:rgba(255,214,0,.3); color:#FFD600; }
  .pm-toast.error   { border-color:rgba(255,80,80,.3);  color:#ff6b6b; }

  .pm-notif-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
  .pm-notif-mark-all { font-size:11px; font-weight:600; color:#555; background:none; border:none; cursor:pointer; padding:0; transition:color .2s; font-family:'Inter',sans-serif; }
  .pm-notif-mark-all:hover:not(:disabled) { color:#FFD600; }
  .pm-notif-mark-all:disabled { opacity:.3; cursor:not-allowed; }
  .pm-notif-list { display:flex; flex-direction:column; gap:10px; }
  .pm-notif-item { display:flex; align-items:flex-start; gap:12px; background:#161616; border:1px solid #222; border-radius:14px; padding:14px; cursor:pointer; transition:all .2s; text-align:left; width:100%; font-family:'Inter',sans-serif; }
  .pm-notif-item:hover { border-color:#2a2a2a; background:#1a1a1a; }
  .pm-notif-item.unread { border-color:rgba(255,214,0,.15); background:rgba(255,214,0,.03); }
  .pm-notif-item.unread:hover { border-color:rgba(255,214,0,.28); background:rgba(255,214,0,.06); }
  .pm-notif-icon { width:36px; height:36px; border-radius:10px; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:17px; background:#1e1e1e; border:1px solid #252525; }
  .pm-notif-item.unread .pm-notif-icon { background:rgba(255,214,0,.08); border-color:rgba(255,214,0,.2); }
  .pm-notif-content { flex:1; min-width:0; }
  .pm-notif-title { font-size:13px; font-weight:600; color:#bbb; line-height:1.3; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .pm-notif-item.unread .pm-notif-title { color:#eee; }
  .pm-notif-msg  { font-size:11px; color:#555; margin-top:3px; line-height:1.45; }
  .pm-notif-time { font-size:10px; color:#3a3a3a; margin-top:5px; font-weight:500; }
  .pm-notif-dot { width:7px; height:7px; border-radius:50%; background:#FFD600; flex-shrink:0; margin-top:6px; box-shadow:0 0 6px rgba(255,214,0,.5); }
  .pm-notif-empty { text-align:center; padding:48px 20px; }
  .pm-notif-skeleton { height:74px; background:#161616; border:1px solid #1e1e1e; border-radius:14px; overflow:hidden; position:relative; margin-bottom:10px; }
  .pm-notif-skeleton::after { content:''; position:absolute; inset:0; background:linear-gradient(90deg,transparent,rgba(255,255,255,.025),transparent); animation:pm-shimmer 1.5s infinite; }
`;

export default function ProfileModal({ isOpen, onClose, initialTab = "edit", user, onProfileUpdate }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [saving, setSaving]       = useState(false);
  const [toast, setToast]         = useState(null);
  const [tagInput, setTagInput]   = useState("");
  const [photoUploading, setPhotoUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  // Notifications
  const [notifs, setNotifs]           = useState([]);
  const [notifsLoading, setNotifsLoading] = useState(false);
  const [markingAll, setMarkingAll]   = useState(false);
  const unreadCount = notifs.filter(n => !n.read).length;

  // Form — fields exactly match backend allowed_fields
  const [form, setForm] = useState({
    name: "", bio: "", dob: "", college: "",
    branch: "", year: 1, linkedin: "", github: "", resume: "", targets: [],
  });

  // Sync tab when initialTab or open changes
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setToast(null);
    }
  }, [isOpen, initialTab]);

  // Populate form from user (Firestore profile via AuthContext)
  useEffect(() => {
    if (isOpen && user) {
      setForm({
        name:     user.name     || "",
        bio:      user.bio      || "",
        dob:      user.dob      || "",
        college:  user.college  || "",
        branch:   user.branch   || "",
        year:     user.year     || 1,
        linkedin: user.linkedin || "",
        github:   user.github   || "",
        resume:   user.resume   || "",
        targets:  Array.isArray(user.targets) ? user.targets : [],
      });
    }
  }, [isOpen, user]);

  // Fetch notifications when tab opens
  useEffect(() => {
    if (activeTab === "notifs" && isOpen) fetchNotifs();
  }, [activeTab, isOpen]);

  const fetchNotifs = async () => {
    setNotifsLoading(true);
    try {
      const data = await getNotifications();
      setNotifs(data);
    } catch (err) {
      console.error("[notifs]", err?.response?.data || err.message);
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

  // Photo upload — Firebase Storage → update Firestore via PATCH
  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      showToast("Please upload a JPG, PNG, WebP or GIF.", "error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast("Image must be under 5MB.", "error");
      return;
    }

    setPhotoUploading(true);
    setUploadProgress(0);

    try {
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error("Not authenticated");

      // Upload to Firebase Storage: avatars/<uid>/profile.<ext>
      const ext = file.name.split(".").pop();
      const storageRef = ref(storage, `avatars/${uid}/profile.${ext}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snap) => {
            setUploadProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100));
          },
          reject,
          resolve
        );
      });

      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

      // Update Firebase Auth profile
      await updateProfile(auth.currentUser, { photoURL: downloadURL });

      // Save to Firestore via backend PATCH
      await api.patch("/auth/profile/", { photoURL: downloadURL });

      // Update local AuthContext state immediately
      if (onProfileUpdate) onProfileUpdate({ photoURL: downloadURL });

      showToast("Photo updated ✓");
    } catch (err) {
      console.error("[photo upload]", err);
      showToast(err?.message || "Upload failed.", "error");
    } finally {
      setPhotoUploading(false);
      setUploadProgress(0);
      // reset input so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const addTarget = () => {
    const v = tagInput.trim();
    if (v && !form.targets.includes(v)) set("targets", [...form.targets, v]);
    setTagInput("");
  };
  const removeTarget = (t) => set("targets", form.targets.filter(x => x !== t));

  const handleSave = async () => {
    if (!form.name.trim()) { showToast("Name cannot be empty.", "error"); return; }
    setSaving(true);
    try {
      // Exact fields that backend ProfileView.patch allows
      const payload = {
        name:     form.name.trim(),
        bio:      form.bio.trim(),
        dob:      form.dob,
        college:  form.college.trim(),
        branch:   form.branch.trim(),
        year:     Number(form.year),
        linkedin: form.linkedin.trim(),
        github:   form.github.trim(),
        resume:   form.resume.trim(),
        targets:  form.targets,
      };
      await api.patch("/auth/profile/", payload);

      // Update AuthContext immediately — modal re-populates on next open
      if (onProfileUpdate) onProfileUpdate(payload);

      showToast("Profile saved ✓");
    } catch (err) {
      showToast(err?.response?.data?.detail || "Save failed.", "error");
    } finally {
      setSaving(false);
    }
  };

  const stats = user?.stats || {};

  if (!isOpen) return null;

  const TABS = [
    { id: "edit",   label: "Edit Profile" },
    { id: "stats",  label: "Stats"        },
    { id: "links",  label: "Links"        },
    { id: "notifs", label: "Notifications", badge: unreadCount },
  ];

  const hasFooterSave = activeTab === "edit" || activeTab === "links";

  return (
    <>
      <style>{STYLES}</style>
      <div className="pm-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
        <div className="pm-modal">

          {/* Header */}
          <div className="pm-header">
            <div className="pm-cover"><div className="pm-cover-accent" /></div>
            <div className="pm-avatar-row">
              <div className="pm-avatar-wrap">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="" referrerPolicy="no-referrer"
                    className="pm-avatar" style={{ fontFamily: "unset" }} />
                ) : (
                  <div className="pm-avatar">{user?.initials || "??"}</div>
                )}
                {photoUploading && (
                  <div className="pm-avatar-uploading">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFD600" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" strokeOpacity=".3" />
                      <path d="M12 2a10 10 0 010 20" strokeLinecap="round" style={{ animation: "pm-spin .7s linear infinite", transformOrigin: "center" }} />
                    </svg>
                  </div>
                )}
                <div className="pm-avatar-edit" title="Change photo"
                  onClick={() => !photoUploading && fileInputRef.current?.click()}>
                  {photoUploading ? (
                    <span style={{ fontSize: 8, fontWeight: 800, color: "#000" }}>{uploadProgress}%</span>
                  ) : (
                    <svg width="11" height="11" fill="none" stroke="#000" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                        d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-1.414a2 2 0 01.586-1.414z" />
                    </svg>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif"
                  style={{ display: "none" }} onChange={handlePhotoChange} />
              </div>

              <div style={{ flex: 1, marginLeft: 14, marginBottom: 2 }}>
                <p style={{ color: "#fff", fontWeight: 700, fontSize: 15, lineHeight: 1.2 }}>
                  {user?.name || "Your Name"}
                </p>
                <p style={{ color: "#444", fontSize: 11, marginTop: 3 }}>{user?.email || ""}</p>
                {user?.college && (
                  <p style={{ color: "#333", fontSize: 11, marginTop: 2 }}>
                    {user.college}{user.branch ? ` · ${user.branch}` : ""}
                  </p>
                )}
              </div>

              <button className="pm-close-btn" onClick={onClose} title="Close">
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="pm-tabs">
              {TABS.map(({ id, label, badge }) => (
                <button key={id} className={`pm-tab${activeTab === id ? " active" : ""}`}
                  onClick={() => setActiveTab(id)}>
                  {label}
                  {badge > 0 && <span className="pm-tab-badge">{badge > 9 ? "9+" : badge}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="pm-body">

            {/* EDIT */}
            {activeTab === "edit" && (
              <>
                <div className="pm-section">
                  <p className="pm-section-label">Basic Info</p>
                  <div className="pm-field">
                    <label className="pm-label">Full Name *</label>
                    <input className="pm-input" value={form.name}
                      onChange={e => set("name", e.target.value)} placeholder="Your full name" />
                  </div>
                  <div className="pm-field">
                    <label className="pm-label">Bio</label>
                    <textarea className="pm-input pm-textarea" value={form.bio}
                      onChange={e => set("bio", e.target.value)}
                      placeholder="Tell people a bit about yourself..." />
                  </div>
                  <div className="pm-row">
                    <div className="pm-field" style={{ marginBottom: 0 }}>
                      <label className="pm-label">Date of Birth</label>
                      <input className="pm-input" type="date" value={form.dob}
                        onChange={e => set("dob", e.target.value)} style={{ colorScheme: "dark" }} />
                    </div>
                    <div className="pm-field" style={{ marginBottom: 0 }}>
                      <label className="pm-label">Year of Study</label>
                      <select className="pm-input" value={form.year}
                        onChange={e => set("year", e.target.value)} style={{ cursor: "pointer" }}>
                        {YEAR_OPTIONS.map((y, i) => (
                          <option key={i} value={i + 1}>{y}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pm-section">
                  <p className="pm-section-label">Academic</p>
                  <div className="pm-field">
                    <label className="pm-label">College</label>
                    <input className="pm-input" value={form.college}
                      onChange={e => set("college", e.target.value)} placeholder="Your college name" />
                  </div>
                  <div className="pm-field" style={{ marginBottom: 0 }}>
                    <label className="pm-label">Branch / Department</label>
                    <input className="pm-input" value={form.branch}
                      onChange={e => set("branch", e.target.value)} placeholder="e.g. Computer Science" />
                  </div>
                </div>

                <div className="pm-section" style={{ marginBottom: 0 }}>
                  <p className="pm-section-label">Target Companies</p>
                  <p style={{ fontSize: 11, color: "#444", marginBottom: 10 }}>
                    Add companies you are targeting for placement
                  </p>
                  <div className="pm-tag-wrap">
                    {form.targets.map(t => (
                      <span key={t} className="pm-tag">
                        {t}
                        <button className="pm-tag-remove" onClick={() => removeTarget(t)}>×</button>
                      </span>
                    ))}
                  </div>
                  <div className="pm-tag-input-row">
                    <input className="pm-input" value={tagInput} placeholder="e.g. Google"
                      onChange={e => setTagInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && addTarget()}
                      style={{ flex: 1, marginBottom: 0 }} />
                    <button className="pm-tag-add-btn" onClick={addTarget}>+ Add</button>
                  </div>
                </div>
              </>
            )}

            {/* STATS */}
            {activeTab === "stats" && (
              <>
                <div className="pm-section">
                  <p className="pm-section-label">Activity Stats</p>
                  <div className="pm-stat-grid">
                    {[
                      ["Tests Taken",  stats.tests_taken  || 0, "⚡"],
                      ["Total Score",  stats.total_score  || 0, "🎯"],
                      ["Modules Done", stats.modules_done || 0, "📚"],
                      ["Posts",        stats.posts        || 0, "🤝"],
                      ["Comments",     stats.comments     || 0, "💬"],
                      ["Avg Score",
                        stats.tests_taken ? Math.round(stats.total_score / stats.tests_taken) : 0,
                        "📊"],
                    ].map(([label, val, icon]) => (
                      <div key={label} className="pm-stat">
                        <div style={{ fontSize: 18, marginBottom: 4 }}>{icon}</div>
                        <div className="pm-stat-value">{val}</div>
                        <div className="pm-stat-label">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pm-section" style={{ marginBottom: 0 }}>
                  <p className="pm-section-label">Badges</p>
                  <div className="pm-badge-row">
                    {[
                      { label: "First Test",   icon: "🏁", earned: (stats.tests_taken  || 0) >= 1   },
                      { label: "10 Tests",     icon: "⚡", earned: (stats.tests_taken  || 0) >= 10  },
                      { label: "Top Scorer",   icon: "🥇", earned: (stats.total_score  || 0) >= 100 },
                      { label: "5 Modules",    icon: "📚", earned: (stats.modules_done || 0) >= 5   },
                      { label: "Community",    icon: "🤝", earned: (stats.posts        || 0) >= 1   },
                      { label: "Study Streak", icon: "🔥", earned: false },
                    ].map(b => (
                      <div key={b.label} className={`pm-badge${b.earned ? " earned" : ""}`}>
                        <span>{b.icon}</span> {b.label}
                      </div>
                    ))}
                  </div>
                  <p style={{ fontSize: 11, color: "#2e2e2e", marginTop: 12 }}>
                    Greyed badges are locked - keep going!
                  </p>
                </div>
              </>
            )}

            {/* LINKS */}
            {activeTab === "links" && (
              <>
                <div className="pm-section">
                  <p className="pm-section-label">Social and Professional Links</p>
                  {[
                    { key: "linkedin", label: "LinkedIn",   icon: "in", placeholder: "https://linkedin.com/in/yourhandle" },
                    { key: "github",   label: "GitHub",     icon: "GH", placeholder: "https://github.com/yourhandle"       },
                    { key: "resume",   label: "Resume URL", icon: "📄", placeholder: "https://drive.google.com/..."        },
                  ].map(({ key, label, icon, placeholder }) => (
                    <div key={key} className="pm-field">
                      <label className="pm-label">{label}</label>
                      <div className="pm-link-input-row">
                        <div className="pm-link-icon">
                          <span style={{ fontSize: 11, fontWeight: 700, color: "#555" }}>{icon}</span>
                        </div>
                        <input className="pm-input" value={form[key]}
                          onChange={e => set(key, e.target.value)}
                          placeholder={placeholder} style={{ marginBottom: 0, flex: 1 }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ background: "#161616", border: "1px solid #1e1e1e", borderRadius: 12, padding: "14px 16px" }}>
                  <p style={{ fontSize: 11, color: "#444", lineHeight: 1.6 }}>
                    Your links will be visible to other users in Dev2Dev posts and your public profile.
                  </p>
                </div>
              </>
            )}

            {/* NOTIFICATIONS */}
            {activeTab === "notifs" && (
              <>
                <div className="pm-notif-header">
                  <p className="pm-section-label" style={{ margin: 0 }}>Recent Notifications</p>
                  <button className="pm-notif-mark-all"
                    onClick={handleMarkAll} disabled={markingAll || unreadCount === 0}>
                    {markingAll ? "Marking..." : "Mark all read"}
                  </button>
                </div>
                {notifsLoading ? (
                  [1, 2, 3].map(i => <div key={i} className="pm-notif-skeleton" />)
                ) : notifs.length === 0 ? (
                  <div className="pm-notif-empty">
                    <div style={{ fontSize: 40, marginBottom: 12, opacity: .25 }}>🔔</div>
                    <p style={{ color: "#333", fontSize: 13 }}>No notifications yet</p>
                    <p style={{ fontSize: 11, color: "#252525", marginTop: 6 }}>
                      Complete a test or update your profile to get started
                    </p>
                  </div>
                ) : (
                  <div className="pm-notif-list">
                    {notifs.map(n => (
                      <button key={n.id}
                        className={`pm-notif-item${!n.read ? " unread" : ""}`}
                        onClick={() => handleMarkOne(n)}>
                        <div className="pm-notif-icon">{NOTIF_ICONS[n.type] || "🔔"}</div>
                        <div className="pm-notif-content">
                          <div className="pm-notif-title">{n.title}</div>
                          <div className="pm-notif-msg">{n.message}</div>
                          <div className="pm-notif-time">{timeAgo(n.created_at)}</div>
                        </div>
                        {!n.read && <div className="pm-notif-dot" />}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="pm-footer">
            {toast && <div className={`pm-toast ${toast.type}`}>{toast.msg}</div>}
            {hasFooterSave ? (
              <>
                <button className="pm-btn pm-btn-ghost" onClick={onClose}>Cancel</button>
                <button className="pm-btn pm-btn-primary" onClick={handleSave} disabled={saving}>
                  {saving && <span className="pm-spinner" />}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </>
            ) : (
              <button className="pm-btn pm-btn-ghost" onClick={onClose}>Close</button>
            )}
          </div>

        </div>
      </div>
    </>
  );
}