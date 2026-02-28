// PlacePrepLogin.jsx — Firebase auth integrated · UI completely unchanged
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  loginWithEmail,
  loginWithGoogle,
  registerWithEmail,
  sendResetEmail,
  friendlyFirebaseError,
} from "./../services/authService";

// ── Icons (unchanged) ──────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);
const EyeIcon = ({ open }) => open ? (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
) : (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);
const ArrowRight = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);
const MailIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);
const LockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);
const UserIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

// ── InputField moved OUTSIDE the main component to prevent remounting on every render ──
const InputField = ({ label, name, type = "text", placeholder, icon, rightElement, form, onChange }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">{label}</label>
    <div className="relative flex items-center">
      <span className="absolute left-3.5 text-gray-600">{icon}</span>
      <input
        type={type} name={name} value={form[name]} onChange={onChange} required
        placeholder={placeholder}
        className="w-full bg-[#1c1c1c] border border-[#2e2e2e] hover:border-[#3a3a3a] focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 rounded-xl pl-10 pr-12 py-3 text-white placeholder-gray-600 text-sm outline-none transition-all duration-200"
      />
      {rightElement && <div className="absolute right-3">{rightElement}</div>}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
export default function PlacePrepLogin() {
  const [mode, setMode]               = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [form, setForm]               = useState({ email: "", password: "", confirm: "", name: "" });
  const [loading, setLoading]         = useState(false);
  const [submitted, setSubmitted]     = useState(false);
  const [error, setError]             = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetState = (newMode) => {
    setMode(newMode);
    setSubmitted(false);
    setError("");
    setForm({ email: "", password: "", confirm: "", name: "" });
  };

  // ── Main submit — real Firebase calls ──────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await loginWithEmail(form.email, form.password);
        navigate("/dashboard");

      } else if (mode === "signup") {
        if (form.password !== form.confirm) {
          setError("Passwords do not match."); setLoading(false); return;
        }
        await registerWithEmail({ name: form.name, email: form.email, password: form.password });

        // ── After registration: go to login with email & password pre-filled ──
        const registeredEmail    = form.email;
        const registeredPassword = form.password;
        setMode("login");
        setSubmitted(false);
        setError("");
        setForm({ email: registeredEmail, password: registeredPassword, confirm: "", name: "" });
        setLoading(false);
        return; // skip the finally block's setLoading(false) duplicate

      } else if (mode === "forgot") {
        await sendResetEmail(form.email);
        setSubmitted(true);
      }
    } catch (err) {
      setError(friendlyFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  // ── Google Sign-In ─────────────────────────────────────────────────────────
  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      setError(friendlyFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  const SubmitBtn = ({ text, loadingText }) => (
    <button type="submit" disabled={loading}
      className="w-full bg-yellow-400 hover:bg-yellow-300 active:scale-[0.98] disabled:opacity-50 text-black font-bold rounded-xl py-3.5 text-sm transition-all duration-200 flex items-center justify-center gap-2 mt-1"
      style={{ boxShadow: "0 0 20px rgba(250,204,21,0.35), 0 4px 15px rgba(250,204,21,0.2)" }}>
      {loading
        ? <><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /><span>{loadingText}</span></>
        : <><ArrowRight /><span>{text}</span></>}
    </button>
  );

  const GoogleBtn = ({ label }) => (
    <button type="button" onClick={handleGoogle} disabled={loading}
      className="w-full bg-[#1c1c1c] hover:bg-[#222] border border-[#2e2e2e] hover:border-yellow-400/25 rounded-xl py-3 text-sm text-white font-medium transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50">
      <GoogleIcon />{label}
    </button>
  );

  const Divider = ({ label }) => (
    <div className="flex items-center gap-3 my-3">
      <div className="flex-1 h-px bg-[#222]" />
      <span className="text-gray-700 text-xs font-semibold tracking-wider">{label}</span>
      <div className="flex-1 h-px bg-[#222]" />
    </div>
  );

  // ── JSX (all existing styles and layout preserved exactly) ────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap');
        .brand { font-family: 'Bebas Neue', sans-serif; }
        html, body, #root { height: 100%; width: 100%; margin: 0; padding: 0; background-color: #0a0a0a; }
        @keyframes pulse-orb { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:.9;transform:scale(1.08)} }
        @keyframes slide-up  { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin-ring { from{transform:translate(-50%,-50%) rotate(0deg)} to{transform:translate(-50%,-50%) rotate(360deg)} }
        @keyframes float     { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-8px)} }
        .orb-1 { animation: pulse-orb 5s ease-in-out infinite; }
        .orb-2 { animation: pulse-orb 7s ease-in-out infinite 2s; }
        .ring-1 { animation: spin-ring 25s linear infinite; }
        .ring-2 { animation: spin-ring 18s linear infinite reverse; }
        .logo-float { animation: float 4s ease-in-out infinite; }
        .card-enter { animation: slide-up 0.55s cubic-bezier(0.16,1,0.3,1) forwards; }
        .grid-dots {
          background-image: radial-gradient(circle, rgba(250,204,21,0.08) 1px, transparent 1px);
          background-size: 30px 30px;
        }
        * { font-family: 'Inter', sans-serif; }
      `}</style>

      <div className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center overflow-y-auto">
        <div className="fixed inset-0 grid-dots pointer-events-none" />
        <div className="orb-1 fixed top-[-160px] right-[-160px] w-[560px] h-[560px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(255,214,0,0.12), transparent 70%)", filter: "blur(80px)" }} />
        <div className="orb-2 fixed bottom-[-120px] left-[-120px] w-[420px] h-[420px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(255,214,0,0.09), transparent 70%)", filter: "blur(80px)" }} />
        <div className="ring-1 fixed w-[820px] h-[820px] rounded-full pointer-events-none"
          style={{ top: "50%", left: "50%", border: "1px solid rgba(255,214,0,0.05)" }} />
        <div className="ring-2 fixed w-[560px] h-[560px] rounded-full pointer-events-none"
          style={{ top: "50%", left: "50%", border: "1px solid rgba(255,214,0,0.07)" }} />

        <div className="relative z-10 w-full max-w-[540px] px-4 py-4 card-enter">
          <div className="bg-[#111111] rounded-2xl border border-[#1f1f1f] p-6"
            style={{ boxShadow: "0 30px 90px rgba(0,0,0,0.8), 0 0 0 1px rgba(250,204,21,0.07), inset 0 1px 0 rgba(255,255,255,0.03)" }}>

            {/* Logo */}
            <div className="flex flex-col items-center mb-5">
              <div className="logo-float relative mb-3">
                <div className="w-16 h-16 rounded-2xl bg-yellow-400 flex items-center justify-center relative overflow-hidden"
                  style={{ boxShadow: "0 0 30px rgba(250,204,21,0.5), 0 8px 20px rgba(250,204,21,0.25)" }}>
                  <span className="brand text-black text-3xl tracking-wider z-10">PP</span>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/25 to-transparent" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-yellow-400 animate-ping opacity-70" />
              </div>
              <h1 className="brand text-yellow-400 text-4xl tracking-[0.15em]">PLACE-PREP</h1>
              <p className="text-gray-600 text-[10px] tracking-[0.3em] uppercase mt-1 font-medium">Ultimate Campus Placement Solution</p>
            </div>

            {/* Error banner — only shows on real errors */}
            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/25 flex items-center gap-3">
                <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* ── FORGOT PASSWORD ── */}
            {mode === "forgot" && (
              submitted ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center mx-auto mb-4"
                    style={{ boxShadow: "0 0 20px rgba(250,204,21,0.15)" }}>
                    <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">Email Sent!</h3>
                  <p className="text-gray-500 text-sm mb-6">Reset link sent to <span className="text-yellow-400 font-medium">{form.email}</span></p>
                  <button onClick={() => resetState("login")} className="text-yellow-400 text-sm hover:underline font-semibold">← Back to Login</button>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h2 className="text-white font-bold text-xl mb-1">Forgot Password?</h2>
                    <p className="text-gray-500 text-sm">Enter your email and we'll send you a reset link.</p>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField label="Email Address" name="email" type="email" placeholder="you@example.com" icon={<MailIcon />} form={form} onChange={handleChange} />
                    <SubmitBtn text="Send Reset Link" loadingText="Sending..." />
                    <button type="button" onClick={() => resetState("login")}
                      className="w-full text-gray-500 hover:text-yellow-400 text-sm transition-colors py-1 font-medium">
                      ← Back to Login
                    </button>
                  </form>
                </>
              )
            )}

            {/* ── SIGN UP ── */}
            {mode === "signup" && (
              <>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <InputField label="Full Name" name="name" placeholder="John Doe" icon={<UserIcon />} form={form} onChange={handleChange} />
                  <InputField label="Email Address" name="email" type="email" placeholder="you@example.com" icon={<MailIcon />} form={form} onChange={handleChange} />
                  <InputField label="Password" name="password" type={showPassword ? "text" : "password"}
                    placeholder="Min. 6 characters" icon={<LockIcon />}
                    form={form} onChange={handleChange}
                    rightElement={
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-600 hover:text-yellow-400 transition-colors">
                        <EyeIcon open={showPassword} />
                      </button>
                    }
                  />
                  <InputField label="Confirm Password" name="confirm" type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter password" icon={<LockIcon />}
                    form={form} onChange={handleChange}
                    rightElement={
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-gray-600 hover:text-yellow-400 transition-colors">
                        <EyeIcon open={showConfirm} />
                      </button>
                    }
                  />
                  <SubmitBtn text="Create Account" loadingText="Creating..." />
                </form>
                <Divider label="OR" />
                <GoogleBtn label="Sign up with Google" />
                <p className="text-center text-gray-600 text-sm mt-4">
                  Already have an account?{" "}
                  <button onClick={() => resetState("login")} className="text-yellow-400 font-bold hover:underline">Sign In</button>
                </p>
              </>
            )}

            {/* ── LOGIN ── */}
            {mode === "login" && (
              <>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <InputField label="Email Address" name="email" type="email" placeholder="you@example.com" icon={<MailIcon />} form={form} onChange={handleChange} />
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Password</label>
                      <button type="button" onClick={() => resetState("forgot")} className="text-yellow-400 text-xs hover:underline font-semibold">
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-gray-600"><LockIcon /></span>
                      <input
                        type={showPassword ? "text" : "password"} name="password" value={form.password}
                        onChange={handleChange} required placeholder="Enter your password"
                        className="w-full bg-[#1c1c1c] border border-[#2e2e2e] hover:border-[#3a3a3a] focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 rounded-xl pl-10 pr-12 py-3 text-white placeholder-gray-600 text-sm outline-none transition-all duration-200"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 text-gray-600 hover:text-yellow-400 transition-colors">
                        <EyeIcon open={showPassword} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="remember" className="accent-yellow-400 w-4 h-4 cursor-pointer" />
                    <label htmlFor="remember" className="text-gray-500 text-sm cursor-pointer select-none">Keep me logged in</label>
                  </div>
                  <SubmitBtn text="Sign In" loadingText="Signing In..." />
                </form>
                <Divider label="OR CONTINUE WITH" />
                <GoogleBtn label="Continue with Google" />
                <div className="mt-4 rounded-xl p-px" style={{ background: "linear-gradient(135deg, rgba(250,204,21,0.3), rgba(250,204,21,0.05))" }}>
                  <div className="bg-[#131313] rounded-xl p-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-white text-sm font-semibold">🎓 New to Place-Prep?</p>
                      <p className="text-gray-500 text-xs mt-0.5">Join us for getting placed!</p>
                    </div>
                    <button onClick={() => resetState("signup")}
                      className="shrink-0 bg-yellow-400/10 hover:bg-yellow-400 border border-yellow-400/40 hover:border-yellow-400 text-yellow-400 hover:text-black rounded-lg px-4 py-2 text-xs font-bold transition-all duration-200 whitespace-nowrap">
                      Sign Up Free →
                    </button>
                  </div>
                </div>
              </>
            )}

            <p className="text-center text-gray-700 text-xs mt-4 font-medium">
              By continuing, you agree to our{" "}
              <span className="text-yellow-400/60 hover:text-yellow-400 cursor-pointer transition-colors">Terms</span>
              {" "}&amp;{" "}
              <span className="text-yellow-400/60 hover:text-yellow-400 cursor-pointer transition-colors">Privacy Policy</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}