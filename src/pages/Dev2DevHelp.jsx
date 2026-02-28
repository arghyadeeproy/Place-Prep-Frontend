// pages/Dev2DevHelp.jsx — Backend connected · UI unchanged
// Features: posts, comments, likes, upvotes, delete post (author), delete comment (author)
import { useState, useEffect, useCallback } from "react";
import PageLayout from "../PageLayout";
import { useAuth } from "../AuthContext";
import {
  fetchPosts, createPost, deletePost, togglePostLike,
  fetchComments, createComment, deleteComment,
  toggleCommentLike, toggleCommentUpvote,
} from "../services/dev2devService";

const tagColor = (tag) => {
  const m = { DSA: "#FFD600", "System Design": "#54a0ff", TCS: "#ff9f43", OS: "#00d2d3", React: "#61dafb", Frontend: "#ff6b81", Aptitude: "#5f27cd", Graphs: "#FFD600", DBMS: "#ff9f43", CN: "#00d2d3", OOPs: "#ff6b81" };
  return m[tag] || "#aaa";
};

const ALL_TAGS = ["All", "DSA", "System Design", "OS", "React", "Frontend", "Aptitude", "TCS", "DBMS", "CN"];

const initials = (name = "") => name.trim().split(" ").map(w => w[0] || "").join("").toUpperCase().slice(0, 2) || "??";

const avatarColors = ["#FFD600","#54a0ff","#ff9f43","#1dd1a1","#ff6b81","#a29bfe","#00d2d3"];
const avaColor = (str) => avatarColors[(str?.charCodeAt(0) || 0) % avatarColors.length];

// ── Confirm Delete Modal ───────────────────────────────────────────────────
function ConfirmDeleteModal({ open, type, title, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onCancel} style={{ zIndex: 300 }}>
      <div className="modal-box confirm-modal" onClick={e => e.stopPropagation()}>
        {/* Icon */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%",
            background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20
          }}>🗑</div>
        </div>

        {/* Text */}
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <h2 style={{ color: "#fff", fontWeight: 800, fontSize: 15, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: "0.06em", marginBottom: 6 }}>
            DELETE {type === "post" ? "QUESTION" : "COMMENT"}?
          </h2>
          {title && (
            <p style={{ color: "#555", fontSize: 12, lineHeight: 1.5, background: "#0e0e0e", borderRadius: 8, padding: "7px 11px", border: "1px solid #1e1e1e", marginBottom: 8 }}>
              "{title}"
            </p>
          )}
          <p style={{ color: "#444", fontSize: 11 }}>
            This action <span style={{ color: "#ff6b6b", fontWeight: 700 }}>cannot be undone</span>.{" "}
            {type === "post" ? "All comments will also be removed." : ""}
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: "9px 0", background: "#1a1a1a", color: "#666",
            border: "1px solid #2a2a2a", borderRadius: 9, fontWeight: 700,
            fontSize: 12, cursor: "pointer", transition: "all 0.18s"
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#333"; e.currentTarget.style.color = "#aaa"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2a2a"; e.currentTarget.style.color = "#666"; }}
          >
            Cancel
          </button>
          <button onClick={onConfirm} style={{
            flex: 1, padding: "9px 0", background: "rgba(255,80,80,0.12)", color: "#ff6b6b",
            border: "1px solid rgba(255,80,80,0.35)", borderRadius: 9, fontWeight: 700,
            fontSize: 12, cursor: "pointer", transition: "all 0.18s"
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,80,80,0.22)"; e.currentTarget.style.borderColor = "rgba(255,80,80,0.6)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,80,80,0.12)"; e.currentTarget.style.borderColor = "rgba(255,80,80,0.35)"; }}
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Dev2DevHelp() {
  const { user } = useAuth();

  // ── State ──────────────────────────────────────────────────
  const [posts, setPosts]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [activeTag, setActiveTag]       = useState("All");
  const [expandedPost, setExpandedPost] = useState(null);
  const [comments, setComments]         = useState({});
  const [commentsLoading, setCommentsLoading] = useState({});
  const [commentInputs, setCommentInputs]     = useState({});
  const [showAskModal, setShowAskModal] = useState(false);
  const [newQ, setNewQ]                 = useState({ title: "", body: "", tags: "" });
  const [submitting, setSubmitting]     = useState(false);
  const [error, setError]               = useState("");

  // ── Delete confirm modal state ─────────────────────────────
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    type: "post",       // "post" | "comment"
    title: "",
    onConfirm: null,
  });

  const openConfirm = ({ type, title, onConfirm }) =>
    setConfirmModal({ open: true, type, title, onConfirm });
  const closeConfirm = () =>
    setConfirmModal(m => ({ ...m, open: false, onConfirm: null }));

  // ── Fetch posts ────────────────────────────────────────────
  const loadPosts = useCallback(async (tag = activeTag) => {
    setLoading(true);
    try {
      const data = await fetchPosts(tag);
      setPosts(Array.isArray(data) ? data : (data.results || []));
    } catch {
      setError("Failed to load posts.");
    } finally {
      setLoading(false);
    }
  }, [activeTag]);

  useEffect(() => { loadPosts(activeTag); }, [activeTag]);

  // ── Fetch comments when post expanded ──────────────────────
  useEffect(() => {
    if (!expandedPost) return;
    if (comments[expandedPost]) return;
    setCommentsLoading(prev => ({ ...prev, [expandedPost]: true }));
    fetchComments(expandedPost)
      .then(data => setComments(prev => ({ ...prev, [expandedPost]: Array.isArray(data) ? data : [] })))
      .catch(() => setComments(prev => ({ ...prev, [expandedPost]: [] })))
      .finally(() => setCommentsLoading(prev => ({ ...prev, [expandedPost]: false })));
  }, [expandedPost]);

  // ── Like a post ────────────────────────────────────────────
  const likePost = async (id, e) => {
    e.stopPropagation();
    setPosts(ps => ps.map(p => p.id === id
      ? { ...p, like_count: p.liked_by_user ? p.like_count - 1 : p.like_count + 1, liked_by_user: !p.liked_by_user }
      : p
    ));
    try {
      const result = await togglePostLike(id);
      setPosts(ps => ps.map(p => p.id === id
        ? { ...p, like_count: result.like_count, liked_by_user: result.liked }
        : p
      ));
    } catch {
      setPosts(ps => ps.map(p => p.id === id
        ? { ...p, like_count: p.liked_by_user ? p.like_count + 1 : p.like_count - 1, liked_by_user: !p.liked_by_user }
        : p
      ));
    }
  };

  // ── Delete a post (author only) ────────────────────────────
  const handleDeletePost = (post, e) => {
    e.stopPropagation();
    openConfirm({
      type: "post",
      title: post.title,
      onConfirm: async () => {
        closeConfirm();
        setPosts(ps => ps.filter(p => p.id !== post.id));
        if (expandedPost === post.id) setExpandedPost(null);
        try {
          await deletePost(post.id);
        } catch {
          loadPosts(activeTag);
        }
      },
    });
  };

  // ── Like/upvote a comment ──────────────────────────────────
  const handleCommentAction = async (postId, commentId, type) => {
    const fn = type === "like" ? toggleCommentLike : toggleCommentUpvote;
    setComments(prev => ({
      ...prev,
      [postId]: (prev[postId] || []).map(c => c.id === commentId
        ? type === "like"
          ? { ...c, like_count: c.liked_by_user ? (c.like_count||0) - 1 : (c.like_count||0) + 1, liked_by_user: !c.liked_by_user }
          : { ...c, upvoted_by_user: !c.upvoted_by_user }
        : c)
    }));
    try { await fn(postId, commentId); } catch { /* silent */ }
  };

  // ── Delete a comment (author only) ────────────────────────
  const handleDeleteComment = (postId, comment) => {
    openConfirm({
      type: "comment",
      title: comment.body?.length > 80 ? comment.body.slice(0, 80) + "…" : comment.body,
      onConfirm: async () => {
        closeConfirm();
        setComments(prev => ({
          ...prev,
          [postId]: (prev[postId] || []).filter(c => c.id !== comment.id),
        }));
        setPosts(ps => ps.map(p => p.id === postId
          ? { ...p, comment_count: Math.max(0, (p.comment_count || 1) - 1) }
          : p
        ));
        try {
          await deleteComment(postId, comment.id);
        } catch {
          fetchComments(postId).then(data =>
            setComments(prev => ({ ...prev, [postId]: Array.isArray(data) ? data : [] }))
          );
        }
      },
    });
  };

  // ── Add comment ────────────────────────────────────────────
  const addComment = async (postId) => {
    const text = (commentInputs[postId] || "").trim();
    if (!text) return;
    setCommentInputs(prev => ({ ...prev, [postId]: "" }));
    try {
      const newComment = await createComment(postId, text);
      setComments(prev => ({ ...prev, [postId]: [...(prev[postId] || []), newComment] }));
      setPosts(ps => ps.map(p => p.id === postId
        ? { ...p, comment_count: (p.comment_count || 0) + 1 }
        : p
      ));
    } catch { /* silent */ }
  };

  // ── Submit new question ────────────────────────────────────
  const submitQuestion = async () => {
    if (!newQ.title.trim()) return;
    setSubmitting(true);
    try {
      const tagList = newQ.tags.split(",").map(t => t.trim()).filter(Boolean);
      const post = await createPost({ title: newQ.title, body: newQ.body, tags: tagList.length ? tagList : ["General"] });
      setPosts(ps => [post, ...ps]);
      setNewQ({ title: "", body: "", tags: "" });
      setShowAskModal(false);
    } catch {
      setError("Failed to post question.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout activeRoute="/Dev2DevHelp">
      <style>{`
        .post-card { background: #111; border: 1px solid #1f1f1f; border-radius: 16px; padding: 20px; transition: all 0.2s; cursor: pointer; }
        .post-card:hover { border-color: rgba(255,214,0,0.2); box-shadow: 0 10px 30px rgba(0,0,0,0.4); }
        .post-card.expanded { border-color: rgba(255,214,0,0.35); box-shadow: 0 0 0 1px rgba(255,214,0,0.1), 0 16px 40px rgba(0,0,0,0.5); cursor: default; }
        .ask-btn { padding: 11px 24px; background: #FFD600; color: #000; font-weight: 700; font-size: 13px; border: none; border-radius: 12px; cursor: pointer; transition: all 0.2s; }
        .ask-btn:hover { background: #ffe033; box-shadow: 0 0 18px rgba(255,214,0,0.4); }
        .ask-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .tag-filter { padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; border: 1px solid #2a2a2a; background: #161616; color: #666; transition: all 0.18s; }
        .tag-filter:hover { border-color: rgba(255,214,0,0.3); color: #FFD600; }
        .tag-filter.active { background: #FFD600; color: #000; border-color: #FFD600; }
        .comment-box { background: #0e0e0e; border-radius: 12px; padding: 14px 16px; margin-top: 4px; border-left: 2px solid #1e1e1e; transition: border-color 0.2s; }
        .comment-box:hover { border-left-color: rgba(255,214,0,0.3); }
        .icon-action-btn { display: flex; align-items: center; gap: 5px; padding: 5px 10px; border-radius: 8px; border: 1px solid #2a2a2a; background: #161616; color: #555; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.18s; }
        .icon-action-btn:hover { border-color: rgba(255,214,0,0.3); color: #FFD600; background: rgba(255,214,0,0.06); }
        .icon-action-btn.active-like { border-color: rgba(255,100,100,0.4); color: #ff6b6b; background: rgba(255,100,100,0.08); }
        .icon-action-btn.active-up { border-color: rgba(255,214,0,0.4); color: #FFD600; background: rgba(255,214,0,0.08); }
        .icon-action-btn.delete-btn { border-color: rgba(255,80,80,0.2); color: #555; }
        .icon-action-btn.delete-btn:hover { border-color: rgba(255,80,80,0.5); color: #ff6b6b; background: rgba(255,80,80,0.08); }
        .comment-input { width: 100%; background: #161616; border: 1px solid #2a2a2a; border-radius: 10px; padding: 10px 14px; color: #fff; font-size: 13px; outline: none; resize: none; transition: border-color 0.2s; font-family: 'Inter', sans-serif; }
        .comment-input:focus { border-color: rgba(255,214,0,0.45); }
        .comment-input::placeholder { color: #444; }
        .send-btn { padding: 9px 18px; background: #FFD600; color: #000; font-weight: 700; font-size: 12px; border: none; border-radius: 9px; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
        .send-btn:hover { background: #ffe033; box-shadow: 0 0 12px rgba(255,214,0,0.35); }
        .send-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.82); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(8px); }
        .modal-box { background: #111; border: 1px solid #2a2a2a; border-radius: 20px; padding: 28px; width: 100%; max-width: 540px; box-shadow: 0 30px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,214,0,0.08); animation: modalIn 0.25s cubic-bezier(0.16,1,0.3,1) forwards; }
        .confirm-modal { max-width: 320px; padding: 22px; border-color: rgba(255,80,80,0.15); box-shadow: 0 30px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,80,80,0.08); }
        @keyframes modalIn { from{opacity:0;transform:scale(0.93) translateY(12px)} to{opacity:1;transform:scale(1) translateY(0)} }
        .modal-input { width: 100%; background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 10px; padding: 11px 14px; color: #fff; font-size: 13px; outline: none; transition: border-color 0.2s; font-family: 'Inter', sans-serif; }
        .modal-input:focus { border-color: rgba(255,214,0,0.45); }
        .modal-input::placeholder { color: #444; }
        @keyframes commentIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .comment-anim { animation: commentIn 0.3s ease forwards; }
        .post-skeleton { background: #111; border: 1px solid #1f1f1f; border-radius: 16px; padding: 20px; }
        .sk { background: linear-gradient(90deg,#1a1a1a 25%,#222 50%,#1a1a1a 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 6px; }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* ── Confirm Delete Modal ── */}
      <ConfirmDeleteModal
        open={confirmModal.open}
        type={confirmModal.type}
        title={confirmModal.title}
        onConfirm={confirmModal.onConfirm}
        onCancel={closeConfirm}
      />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <span style={{ fontSize: 30 }}>🤝</span>
            <h1 style={{ color: "#fff", fontSize: 26, fontWeight: 800, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: "0.05em" }}>DEV 2 DEV HELP</h1>
          </div>
          <p style={{ color: "#555", fontSize: 13 }}>Ask doubts, answer peers and grow together as a community.</p>
        </div>
        <button className="ask-btn" onClick={() => setShowAskModal(true)}>+ Ask a Question</button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
        {[["👥","2,340","Members"],["💬",`${posts.length}+`,"Questions"],["✅","94%","Answered"]].map(([icon,val,label]) => (
          <div key={label} style={{ background: "#111", border: "1px solid #1f1f1f", borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 22 }}>{icon}</span>
            <div>
              <p style={{ color: "#FFD600", fontWeight: 800, fontSize: 18, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: "0.05em" }}>{val}</p>
              <p style={{ color: "#444", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div style={{ background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.2)", borderRadius: 10, padding: "10px 14px", marginBottom: 16, color: "#ff6b6b", fontSize: 13 }}>
          ⚠️ {error}
        </div>
      )}

      {/* Tag filters */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        {ALL_TAGS.map(tag => (
          <button key={tag} className={`tag-filter ${activeTag === tag ? "active" : ""}`} onClick={() => setActiveTag(tag)}>{tag}</button>
        ))}
      </div>

      {/* Posts */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {loading
          ? Array(4).fill(0).map((_, i) => (
              <div key={i} className="post-skeleton">
                <div style={{ display: "flex", gap: 12 }}>
                  <div className="sk" style={{ width: 38, height: 38, borderRadius: "50%", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div className="sk" style={{ height: 14, width: "40%", marginBottom: 8 }} />
                    <div className="sk" style={{ height: 16, width: "80%", marginBottom: 8 }} />
                    <div className="sk" style={{ height: 12, width: "30%" }} />
                  </div>
                </div>
              </div>
            ))
          : posts.map(p => {
              const isExpanded   = expandedPost === p.id;
              const postComments = comments[p.id] || [];
              const avatarColor  = avaColor(p.author_name || p.author_uid);
              const avatar       = p.author_initials || initials(p.author_name);
              const liked        = p.liked_by_user || false;
              const likeCount    = p.like_count || 0;
              const commentCount = p.comment_count || postComments.length;
              const isMyPost     = user?.uid === p.author_uid;

              return (
                <div key={p.id} className={`post-card ${isExpanded ? "expanded" : ""}`}
                  onClick={() => !isExpanded && setExpandedPost(p.id)}>

                  {/* Post header */}
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: `${avatarColor}22`, border: `1px solid ${avatarColor}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ color: avatarColor, fontSize: 11, fontWeight: 800 }}>{avatar}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>

                      {/* Author row */}
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                        <span style={{ color: "#ddd", fontSize: 13, fontWeight: 700 }}>{p.author_name || "User"}</span>
                        <span style={{ color: "#333", fontSize: 11 }}>· {_relTime(p.created_at)}</span>
                        {isMyPost && (
                          <span style={{ background: "rgba(255,214,0,0.1)", color: "#FFD600", fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 4, border: "1px solid rgba(255,214,0,0.2)" }}>You</span>
                        )}
                        {/* Close + Delete buttons — only when expanded */}
                        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }} onClick={e => e.stopPropagation()}>
                          {isExpanded && isMyPost && (
                            <button
                              className="icon-action-btn delete-btn"
                              onClick={e => handleDeletePost(p, e)}
                              style={{ fontSize: 11, padding: "3px 10px" }}
                            >
                              🗑 Delete
                            </button>
                          )}
                          {isExpanded && (
                            <button
                              onClick={e => { e.stopPropagation(); setExpandedPost(null); }}
                              style={{ background: "none", border: "1px solid #2a2a2a", color: "#555", borderRadius: 8, padding: "3px 10px", fontSize: 11, cursor: "pointer" }}
                            >
                              ✕ Close
                            </button>
                          )}
                        </div>
                      </div>

                      <p style={{ color: "#fff", fontWeight: 700, fontSize: 15, marginBottom: isExpanded ? 8 : 10, lineHeight: 1.4 }}>{p.title}</p>

                      {isExpanded && p.body && (
                        <p style={{ color: "#888", fontSize: 13, marginBottom: 12, lineHeight: 1.7, background: "#0e0e0e", borderRadius: 10, padding: "10px 14px" }}>{p.body}</p>
                      )}

                      {/* Tags + like/comment */}
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        {(p.tags || []).map(tag => (
                          <span key={tag} style={{ background: `${tagColor(tag)}15`, color: tagColor(tag), fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 5, border: `1px solid ${tagColor(tag)}30` }}>{tag}</span>
                        ))}
                        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }} onClick={e => e.stopPropagation()}>
                          <button className={`icon-action-btn ${liked ? "active-like" : ""}`} onClick={e => likePost(p.id, e)}>
                            {liked ? "❤️" : "🤍"} {likeCount}
                          </button>
                          <button className="icon-action-btn" onClick={e => { e.stopPropagation(); setExpandedPost(isExpanded ? null : p.id); }}>
                            💬 {commentCount}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ── Comments section ── */}
                  {isExpanded && (
                    <div style={{ marginTop: 18, paddingTop: 18, borderTop: "1px solid #1a1a1a" }} onClick={e => e.stopPropagation()}>
                      <p style={{ color: "#555", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 14 }}>
                        {commentsLoading[p.id] ? "Loading..." : `${postComments.length} ${postComments.length === 1 ? "Answer" : "Answers"}`}
                      </p>

                      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                        {commentsLoading[p.id] && (
                          <div style={{ textAlign: "center", padding: "20px 0" }}>
                            <div style={{ width: 24, height: 24, border: "2px solid #222", borderTopColor: "#FFD600", borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto" }} />
                          </div>
                        )}
                        {!commentsLoading[p.id] && postComments.length === 0 && (
                          <div style={{ textAlign: "center", padding: "20px 0", color: "#333", fontSize: 13 }}>No answers yet. Be the first to help! 👇</div>
                        )}

                        {postComments.map((c, idx) => {
                          const cAvatar     = avaColor(c.author_name || c.author_uid);
                          const cInit       = c.author_initials || initials(c.author_name);
                          const isMyComment = user?.uid === c.author_uid;
                          return (
                            <div key={c.id} className="comment-box comment-anim" style={{ animationDelay: `${idx * 0.05}s` }}>
                              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                                <div style={{ width: 30, height: 30, borderRadius: "50%", background: `${cAvatar}22`, border: `1px solid ${cAvatar}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                  <span style={{ color: cAvatar, fontSize: 9, fontWeight: 800 }}>{cInit}</span>
                                </div>
                                <div style={{ flex: 1 }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                                    <span style={{ color: "#ccc", fontSize: 12, fontWeight: 700 }}>{c.author_name || "User"}</span>
                                    <span style={{ color: "#333", fontSize: 11 }}>· {_relTime(c.created_at)}</span>
                                    {isMyComment && (
                                      <span style={{ background: "rgba(255,214,0,0.1)", color: "#FFD600", fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 4, border: "1px solid rgba(255,214,0,0.2)" }}>You</span>
                                    )}
                                  </div>
                                  <p style={{ color: "#aaa", fontSize: 13, lineHeight: 1.65, marginBottom: 10 }}>{c.body || c.text}</p>
                                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                    <button className={`icon-action-btn ${c.liked_by_user ? "active-like" : ""}`}
                                      onClick={() => handleCommentAction(p.id, c.id, "like")} style={{ fontSize: 11 }}>
                                      {c.liked_by_user ? "❤️" : "🤍"} {c.like_count || 0}
                                    </button>
                                    <button className={`icon-action-btn ${c.upvoted_by_user ? "active-up" : ""}`}
                                      onClick={() => handleCommentAction(p.id, c.id, "upvote")} style={{ fontSize: 11 }}>
                                      {c.upvoted_by_user ? "▲" : "△"} Upvote
                                    </button>
                                    {isMyComment && (
                                      <button
                                        className="icon-action-btn delete-btn"
                                        onClick={() => handleDeleteComment(p.id, c)}
                                        style={{ fontSize: 11, marginLeft: "auto" }}
                                      >
                                        🗑 Delete
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Comment input */}
                      <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                        <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,214,0,0.15)", border: "1px solid rgba(255,214,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <span style={{ color: "#FFD600", fontSize: 9, fontWeight: 800 }}>{user?.initials || "ME"}</span>
                        </div>
                        <textarea rows={2} className="comment-input"
                          placeholder="Write your answer or comment..."
                          value={commentInputs[p.id] || ""}
                          onChange={e => setCommentInputs(prev => ({ ...prev, [p.id]: e.target.value }))}
                          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); addComment(p.id); } }}
                        />
                        <button className="send-btn" disabled={!(commentInputs[p.id] || "").trim()} onClick={() => addComment(p.id)}>
                          Send →
                        </button>
                      </div>
                      <p style={{ color: "#333", fontSize: 11, marginTop: 6, paddingLeft: 40 }}>Press Enter to send · Shift+Enter for new line</p>
                    </div>
                  )}
                </div>
              );
            })
        }
        {!loading && posts.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#444" }}>
            <p style={{ fontSize: 36, marginBottom: 12 }}>💬</p>
            <p style={{ fontWeight: 700, color: "#555", marginBottom: 6 }}>No posts yet for this tag.</p>
            <p style={{ fontSize: 13 }}>Be the first to ask a question!</p>
          </div>
        )}
      </div>

      {/* ── ASK QUESTION MODAL ── */}
      {showAskModal && (
        <div className="modal-overlay" onClick={() => setShowAskModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
              <div>
                <h2 style={{ color: "#fff", fontWeight: 800, fontSize: 18, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: "0.05em" }}>ASK THE COMMUNITY</h2>
                <p style={{ color: "#555", fontSize: 12, marginTop: 3 }}>Describe your problem clearly for better answers.</p>
              </div>
              <button onClick={() => setShowAskModal(false)}
                style={{ background: "none", border: "1px solid #2a2a2a", color: "#555", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ color: "#555", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", display: "block", marginBottom: 7 }}>Question Title *</label>
                <input className="modal-input" placeholder="e.g. How to reverse a linked list in O(n)?"
                  value={newQ.title} onChange={e => setNewQ(q => ({ ...q, title: e.target.value }))} />
              </div>
              <div>
                <label style={{ color: "#555", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", display: "block", marginBottom: 7 }}>Details (optional)</label>
                <textarea className="modal-input" rows={4} placeholder="Add more context, what you've tried, code snippets..."
                  style={{ resize: "vertical" }} value={newQ.body} onChange={e => setNewQ(q => ({ ...q, body: e.target.value }))} />
              </div>
              <div>
                <label style={{ color: "#555", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", display: "block", marginBottom: 7 }}>Tags (comma separated)</label>
                <input className="modal-input" placeholder="e.g. DSA, Graphs, Arrays"
                  value={newQ.tags} onChange={e => setNewQ(q => ({ ...q, tags: e.target.value }))} />
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                  {["DSA","OS","DBMS","CN","OOPs","System Design","Aptitude","React"].map(t => (
                    <button key={t} onClick={() => setNewQ(q => ({ ...q, tags: q.tags ? `${q.tags}, ${t}` : t }))}
                      style={{ padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer", background: `${tagColor(t)}15`, color: tagColor(t), border: `1px solid ${tagColor(t)}30` }}>
                      + {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 22, justifyContent: "flex-end" }}>
              <button onClick={() => setShowAskModal(false)}
                style={{ padding: "10px 20px", background: "#1a1a1a", color: "#666", border: "1px solid #2a2a2a", borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                Cancel
              </button>
              <button className="ask-btn" onClick={submitQuestion} disabled={!newQ.title.trim() || submitting}
                style={{ opacity: !newQ.title.trim() ? 0.5 : 1, display: "flex", alignItems: "center", gap: 8 }}>
                {submitting && <span style={{ width: 14, height: 14, border: "2px solid rgba(0,0,0,0.3)", borderTop: "2px solid #000", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />}
                {submitting ? "Posting..." : "Post Question →"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }`}</style>
    </PageLayout>
  );
}

function _relTime(iso) {
  if (!iso) return "";
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 60)    return "just now";
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}