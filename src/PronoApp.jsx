import React, { useState, useEffect, useCallback } from "react";
import {
  Gift,
  Crown,
  CreditCard,
  Settings as GearIcon,
  Lock,
  Plus,
  Trash2,
  X,
  Mail,
  ShieldCheck,
  Smartphone,
  Landmark,
  CheckCircle2,
  UserPlus,
  LogIn,
  LogOut,
} from "lucide-react";

const LEAGUES_PLACEHOLDER = "Ligue 1";

const emptyForm = {
  category: "free",
  league: "",
  homeTeam: "",
  awayTeam: "",
  tip: "",
  odds: "",
  confidence: 2,
  matchDate: "",
};

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

const PRICING = {
  afrique: {
    weekly: { amount: 7000, display: "7 000 F", suffix: "/semaine" },
    monthly: { amount: 25000, display: "25 000 F", suffix: "/mois" },
  },
  europe: {
    // Conversion indicative depuis le FCFA (taux fixe ~655,957 FCFA = 1 €), à ajuster librement.
    weekly: { amount: 11, display: "11 €", suffix: "/semaine" },
    monthly: { amount: 38, display: "38 €", suffix: "/mois" },
  },
};

const PAY_METHODS = {
  afrique: [
    { id: "mobilemoney", label: "Mobile Money", icon: Smartphone },
    { id: "orange", label: "Orange Money", icon: Smartphone },
  ],
  europe: [{ id: "card", label: "Carte bancaire", icon: Landmark }],
};

function detectRegion() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (tz.startsWith("Europe/")) return "europe";
    if (tz.startsWith("Africa/")) return "afrique";
  } catch {
    // ignore, fallback below
  }
  return "afrique";
}

// Seuls ces emails ont le droit de publier des pronostics.
const ADMIN_EMAILS = ["tchieukomarcial@gmail.com"];

// Empêche un appel de stockage bloqué indéfiniment de figer l'appli.
function withTimeout(promise, ms = 8000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms);
    promise.then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        clearTimeout(timer);
        reject(e);
      }
    );
  });
}

async function safeGet(key, shared) {
  try {
    const res = await withTimeout(window.storage.get(key, shared));
    return res ? res.value : null;
  } catch {
    return null;
  }
}

async function safeSet(key, value, shared) {
  try {
    await withTimeout(window.storage.set(key, value, shared));
    return true;
  } catch {
    return false;
  }
}

async function safeDelete(key, shared) {
  try {
    await withTimeout(window.storage.delete(key, shared));
    return true;
  } catch {
    return false;
  }
}

function formatDateShort(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }) +
    " · " +
    d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function timeRemaining(expiresAt) {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) return `${days} j ${hours} h restants`;
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours} h ${mins} min restants`;
}

function MiniCard({ p, onDelete, adminMode }) {
  return (
    <div className="ticket">
      <div className="ticket-notch left" />
      <div className="ticket-notch right" />
      <div className="ticket-top">
        <span className="ticket-league">{p.league || LEAGUES_PLACEHOLDER}</span>
        <span className="ticket-date">{formatDateShort(p.matchDate)}</span>
      </div>
      <div className="ticket-match">
        {p.homeTeam} <span className="vs">vs</span> {p.awayTeam}
      </div>
      <div className="ticket-dashed" />
      <div className="ticket-bottom">
        <div className="ticket-tip">
          <span className="tip-label">Pronostic</span>
          <span className="tip-value">{p.tip}</span>
        </div>
        <div className="ticket-odds">
          <span className="odds-label">Cote</span>
          <span className="odds-value">{p.odds}</span>
        </div>
        <div className="confidence" title="Niveau de confiance">
          {[1, 2, 3].map((i) => (
            <span key={i} className={`dot ${i <= p.confidence ? "on" : ""}`} />
          ))}
        </div>
      </div>
      {adminMode && (
        <button className="ticket-delete" onClick={() => onDelete(p.id)} aria-label="Supprimer">
          <Trash2 size={15} />
        </button>
      )}
    </div>
  );
}

function AuthGate({ screen, setScreen, form, setForm, error, busy, onSignup, onLogin }) {
  const isSignup = screen === "signup";
  return (
    <div className="auth-wrap">
      <div className="auth-logo">
        <span className="dot-live" />
        PronoApp
      </div>
      <div className="auth-title">{isSignup ? "Créer un compte" : "Connexion"}</div>
      <div className="auth-sub">
        {isSignup
          ? "Votre email sert à gérer votre abonnement VIP."
          : "Connectez-vous pour retrouver vos pronostics et votre statut VIP."}
      </div>

      <form onSubmit={isSignup ? onSignup : onLogin} noValidate>
        <div className="field">
          <label>Adresse email</label>
          <input
            type="text"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="vous@exemple.com"
          />
        </div>
        <div className="field">
          <label>Mot de passe</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="6 caractères minimum"
          />
        </div>
        {isSignup && (
          <div className="field">
            <label>Confirmer le mot de passe</label>
            <input
              type="password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              placeholder="Retapez le mot de passe"
            />
          </div>
        )}
        {error && <div className="auth-error">{error}</div>}
        <button className="btn-gold" type="submit" disabled={busy}>
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {isSignup ? <UserPlus size={16} /> : <LogIn size={16} />}
            {busy ? "Un instant…" : isSignup ? "Créer mon compte" : "Se connecter"}
          </span>
        </button>
      </form>

      <div className="auth-switch">
        {isSignup ? (
          <>
            Déjà un compte ?{" "}
            <span onClick={() => setScreen("login")}>Se connecter</span>
          </>
        ) : (
          <>
            Pas encore de compte ?{" "}
            <span onClick={() => setScreen("signup")}>S'inscrire</span>
          </>
        )}
      </div>
    </div>
  );
}

export default function PronoApp() {
  const [tab, setTab] = useState("free");
  const [loading, setLoading] = useState(true);
  const [predictions, setPredictions] = useState([]);
  const [vip, setVip] = useState({ active: false, plan: null, expiresAt: null });
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [showPolicy, setShowPolicy] = useState(false);
  const [region, setRegion] = useState("afrique");
  const [payMethod, setPayMethod] = useState("mobilemoney");
  const [saveState, setSaveState] = useState("idle");
  const [session, setSession] = useState(null);
  const [authScreen, setAuthScreen] = useState("signup");
  const [authForm, setAuthForm] = useState({ email: "", password: "", confirm: "" });
  const [authError, setAuthError] = useState("");
  const [authBusy, setAuthBusy] = useState(false);

  const persistRegion = useCallback(async (next) => {
    setRegion(next);
    setPayMethod(PAY_METHODS[next][0].id);
    await safeSet("region", next, false);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const predRaw = await safeGet("predictions", true);
        try {
          setPredictions(predRaw ? JSON.parse(predRaw) : []);
        } catch {
          setPredictions([]);
        }

        const regionRaw = await safeGet("region", false);
        const detected = regionRaw || detectRegion();
        setRegion(detected);
        setPayMethod(PAY_METHODS[detected][0].id);

        const activeEmail = await safeGet("session", false);
        if (activeEmail) {
          setSession(activeEmail);
          const vipRaw = await safeGet(`vip:${activeEmail}`, true);
          try {
            if (vipRaw) {
              const parsed = JSON.parse(vipRaw);
              if (parsed.expiresAt && new Date(parsed.expiresAt).getTime() < Date.now()) {
                parsed.active = false;
              }
              setVip(parsed);
            }
          } catch {
            // keep default vip state
          }
          const profileRaw = await safeGet(`profile:${activeEmail}`, true);
          try {
            setProfile(profileRaw ? JSON.parse(profileRaw) : { name: "", email: activeEmail });
          } catch {
            setProfile({ name: "", email: activeEmail });
          }
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persistPredictions = useCallback(async (list) => {
    setPredictions(list);
    await safeSet("predictions", JSON.stringify(list), true);
  }, []);

  const persistVip = useCallback(
    async (next) => {
      setVip(next);
      if (!session) return;
      await safeSet(`vip:${session}`, JSON.stringify(next), true);
    },
    [session]
  );

  const persistProfile = useCallback(
    async (next) => {
      setProfile(next);
      setSaveState("saving");
      if (!session) {
        setSaveState("idle");
        return;
      }
      const ok = await safeSet(`profile:${session}`, JSON.stringify(next), true);
      setSaveState(ok ? "saved" : "idle");
      if (ok) setTimeout(() => setSaveState("idle"), 1500);
    },
    [session]
  );

  async function handleSignup(e) {
    e.preventDefault();
    setAuthError("");
    const email = authForm.email.trim().toLowerCase();
    if (!email || !authForm.password) {
      setAuthError("Email et mot de passe requis.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setAuthError("Adresse email invalide.");
      return;
    }
    if (authForm.password.length < 6) {
      setAuthError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (authForm.password !== authForm.confirm) {
      setAuthError("Les mots de passe ne correspondent pas.");
      return;
    }
    setAuthBusy(true);
    const usersRaw = await safeGet("users", true);
    let users = [];
    try {
      users = usersRaw ? JSON.parse(usersRaw) : [];
    } catch {
      users = [];
    }
    if (users.some((u) => u.email === email)) {
      setAuthError("Un compte existe déjà avec cet email.");
      setAuthBusy(false);
      return;
    }
    const updated = [...users, { email, password: authForm.password, createdAt: new Date().toISOString() }];
    const usersOk = await safeSet("users", JSON.stringify(updated), true);
    if (!usersOk) {
      setAuthError("Le stockage ne répond pas. Vérifiez votre connexion et réessayez.");
      setAuthBusy(false);
      return;
    }
    await safeSet("session", email, false);
    const freshVip = { active: false, plan: null, expiresAt: null };
    const freshProfile = { name: "", email };
    await safeSet(`vip:${email}`, JSON.stringify(freshVip), true);
    await safeSet(`profile:${email}`, JSON.stringify(freshProfile), true);
    setVip(freshVip);
    setProfile(freshProfile);
    setSession(email);
    setAuthForm({ email: "", password: "", confirm: "" });
    setAuthBusy(false);
  }

  async function handleLogin(e) {
    e.preventDefault();
    setAuthError("");
    const email = authForm.email.trim().toLowerCase();
    if (!email || !authForm.password) {
      setAuthError("Email et mot de passe requis.");
      return;
    }
    setAuthBusy(true);
    const usersRaw = await safeGet("users", true);
    let users = [];
    try {
      users = usersRaw ? JSON.parse(usersRaw) : [];
    } catch {
      users = [];
    }
    const found = users.find((u) => u.email === email && u.password === authForm.password);
    if (!found) {
      setAuthError("Email ou mot de passe incorrect.");
      setAuthBusy(false);
      return;
    }
    await safeSet("session", email, false);

    const vipRaw = await safeGet(`vip:${email}`, true);
    try {
      const parsed = vipRaw ? JSON.parse(vipRaw) : { active: false, plan: null, expiresAt: null };
      if (parsed.expiresAt && new Date(parsed.expiresAt).getTime() < Date.now()) parsed.active = false;
      setVip(parsed);
    } catch {
      setVip({ active: false, plan: null, expiresAt: null });
    }

    const profileRaw = await safeGet(`profile:${email}`, true);
    try {
      setProfile(profileRaw ? JSON.parse(profileRaw) : { name: "", email });
    } catch {
      setProfile({ name: "", email });
    }

    setSession(email);
    setAuthForm({ email: "", password: "", confirm: "" });
    setAuthBusy(false);
  }

  async function handleLogout() {
    await safeDelete("session", false);
    setSession(null);
    setVip({ active: false, plan: null, expiresAt: null });
    setProfile({ name: "", email: "" });
    setTab("free");
  }

  function handleAddPrediction(e) {
    e.preventDefault();
    if (!form.homeTeam || !form.awayTeam || !form.tip || !form.odds || !form.matchDate) return;
    const newItem = { id: uid(), ...form, addedAt: new Date().toISOString() };
    persistPredictions([newItem, ...predictions]);
    setForm(emptyForm);
    setShowForm(false);
  }

  function handleDelete(id) {
    persistPredictions(predictions.filter((p) => p.id !== id));
  }

  function activateVip(plan) {
    const days = plan === "weekly" ? 7 : 30;
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
    persistVip({ active: true, plan, expiresAt });
    setTab("vip");
  }

  const isAdmin = !!session && ADMIN_EMAILS.includes(session.toLowerCase());

  const freeList = predictions
    .filter((p) => p.category === "free")
    .sort((a, b) => new Date(b.matchDate) - new Date(a.matchDate));
  const vipList = predictions
    .filter((p) => p.category === "vip")
    .sort((a, b) => new Date(b.matchDate) - new Date(a.matchDate));

  return (
    <div className="app-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');

        :root{
          --bg: #0B1F17;
          --surface: #132C22;
          --surface-2: #1C3A2B;
          --line: #24493A;
          --gold: #E8B347;
          --gold-dim: #7A5F2A;
          --green: #46B36A;
          --text: #F1EDE4;
          --text-muted: #8FA396;
          --danger: #D9694F;
        }
        * { box-sizing: border-box; }
        .app-root {
          background: radial-gradient(circle at 50% -10%, #163325 0%, var(--bg) 55%);
          min-height: 100vh;
          display: flex;
          justify-content: center;
          font-family: 'Inter', sans-serif;
          color: var(--text);
          padding: 24px 12px;
        }
        .phone {
          width: 100%;
          max-width: 400px;
          background: var(--bg);
          border-radius: 28px;
          border: 1px solid var(--line);
          box-shadow: 0 30px 60px -20px rgba(0,0,0,0.6);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          min-height: 720px;
        }
        .topbar {
          padding: 20px 20px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--line);
        }
        .brand {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800;
          font-size: 24px;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .brand .dot-live { width: 8px; height: 8px; border-radius: 50%; background: var(--green); box-shadow: 0 0 8px var(--green); }
        .page-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: var(--text-muted); }
        .content { flex: 1; overflow-y: auto; padding: 18px 16px 90px; }
        .section-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: 22px;
          margin: 4px 0 14px;
        }
        .section-sub { font-size: 13px; color: var(--text-muted); margin-bottom: 18px; line-height: 1.5; }

        /* Ticket card */
        .ticket {
          position: relative;
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: 16px;
          padding: 14px 16px 12px;
          margin-bottom: 14px;
        }
        .ticket-notch { position: absolute; width: 16px; height: 16px; border-radius: 50%; background: var(--bg); top: 62px; }
        .ticket-notch.left { left: -9px; }
        .ticket-notch.right { right: -9px; }
        .ticket-top { display: flex; justify-content: space-between; font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px; }
        .ticket-match { font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 19px; margin-bottom: 12px; }
        .ticket-match .vs { color: var(--text-muted); font-size: 14px; margin: 0 4px; }
        .ticket-dashed { border-top: 1px dashed var(--line); margin: 0 -16px 12px; }
        .ticket-bottom { display: flex; align-items: center; gap: 10px; }
        .ticket-tip { flex: 1; }
        .tip-label, .odds-label { display: block; font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 2px; }
        .tip-value { font-weight: 600; font-size: 14px; }
        .ticket-odds { background: var(--surface-2); border: 1px solid var(--line); border-radius: 10px; padding: 4px 10px; text-align: center; }
        .odds-value { font-family: 'Barlow Condensed', sans-serif; font-weight: 700; color: var(--gold); font-size: 16px; }
        .confidence { display: flex; gap: 3px; }
        .dot { width: 7px; height: 7px; border-radius: 50%; background: var(--line); }
        .dot.on { background: var(--green); }
        .ticket-delete { position: absolute; top: 10px; right: 10px; background: none; border: none; color: var(--danger); cursor: pointer; padding: 4px; }

        .empty-state { text-align: center; padding: 50px 20px; color: var(--text-muted); font-size: 14px; }

        /* VIP lock */
        .lock-panel {
          background: var(--surface);
          border: 1px solid var(--gold-dim);
          border-radius: 18px;
          padding: 32px 20px;
          text-align: center;
          margin-top: 30px;
        }
        .lock-icon { width: 52px; height: 52px; border-radius: 50%; background: var(--surface-2); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: var(--gold); }
        .lock-title { font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 20px; margin-bottom: 6px; }
        .lock-text { font-size: 13px; color: var(--text-muted); margin-bottom: 20px; line-height: 1.5; }
        .btn-gold {
          background: linear-gradient(180deg, #F0C368, var(--gold));
          color: #24190A;
          border: none;
          font-weight: 700;
          font-size: 14px;
          padding: 12px 22px;
          border-radius: 12px;
          cursor: pointer;
          width: 100%;
        }
        .vip-status-banner {
          background: var(--surface-2);
          border: 1px solid var(--gold-dim);
          border-radius: 14px;
          padding: 12px 16px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
        }

        /* Subscribe */
        .region-toggle {
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: 14px;
          padding: 12px 14px;
          margin-bottom: 18px;
        }
        .region-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; color: var(--text-muted); display: block; margin-bottom: 8px; }
        .region-pills { display: flex; gap: 8px; margin-bottom: 8px; }
        .region-pill {
          flex: 1;
          background: var(--surface-2);
          border: 1px solid var(--line);
          color: var(--text-muted);
          font-size: 12px;
          font-weight: 600;
          padding: 8px 6px;
          border-radius: 10px;
          cursor: pointer;
        }
        .region-pill.active { border-color: var(--green); color: var(--text); background: rgba(70,179,106,0.12); }
        .region-hint { font-size: 11px; color: var(--text-muted); }
        .plan-card {
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: 16px;
          padding: 18px;
          margin-bottom: 14px;
        }
        .plan-card.selected { border-color: var(--gold); }
        .plan-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px; }
        .plan-name { font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 18px; }
        .plan-price { font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-size: 20px; color: var(--gold); }
        .plan-price small { font-size: 11px; color: var(--text-muted); font-weight: 400; font-family: 'Inter', sans-serif; }
        .plan-note { font-size: 12px; color: var(--text-muted); margin-bottom: 12px; }
        .pay-methods { display: flex; gap: 8px; margin: 18px 0 14px; }
        .pay-method {
          flex: 1;
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: 12px;
          padding: 10px 6px;
          text-align: center;
          font-size: 11px;
          cursor: pointer;
          color: var(--text-muted);
        }
        .pay-method.active { border-color: var(--green); color: var(--text); background: var(--surface-2); }
        .pay-method svg { display: block; margin: 0 auto 6px; }
        .demo-note {
          background: var(--surface-2);
          border-left: 3px solid var(--gold);
          padding: 10px 12px;
          font-size: 12px;
          color: var(--text-muted);
          border-radius: 8px;
          margin-bottom: 18px;
          line-height: 1.5;
        }

        /* Settings */
        .field { margin-bottom: 14px; }
        .field label { display: block; font-size: 12px; color: var(--text-muted); margin-bottom: 6px; }
        .field input, .field select, .field textarea {
          width: 100%;
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: 10px;
          padding: 10px 12px;
          color: var(--text);
          font-size: 14px;
          font-family: 'Inter', sans-serif;
        }
        .field input:focus, .field select:focus, .field textarea:focus { outline: 2px solid var(--green); outline-offset: 1px; }
        .btn-secondary {
          background: var(--surface-2);
          border: 1px solid var(--line);
          color: var(--text);
          font-weight: 600;
          font-size: 13px;
          padding: 10px 16px;
          border-radius: 10px;
          cursor: pointer;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .settings-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 0; border-bottom: 1px solid var(--line); font-size: 14px; }
        .settings-row:last-child { border-bottom: none; }
        .admin-box { background: var(--surface); border: 1px solid var(--line); border-radius: 14px; padding: 16px; margin-top: 20px; }
        .admin-title { font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 16px; margin-bottom: 10px; }
        .save-toast { font-size: 12px; color: var(--green); margin-top: 6px; }

        /* Nav */
        .bottom-nav {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          background: rgba(11,31,23,0.92);
          backdrop-filter: blur(6px);
          border-top: 1px solid var(--line);
          display: flex;
        }
        .nav-btn {
          flex: 1;
          background: none;
          border: none;
          color: var(--text-muted);
          padding: 12px 4px 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          cursor: pointer;
        }
        .nav-btn.active { color: var(--green); }
        .nav-btn .badge-lock { position: relative; }
        .phone-shell { position: relative; flex: 1; display: flex; flex-direction: column; }

        /* Modal */
        .modal-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: flex-end; z-index: 20; }
        .modal-sheet { background: var(--surface); width: 100%; border-radius: 20px 20px 0 0; padding: 20px; max-height: 80%; overflow-y: auto; }
        .modal-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
        .modal-head h3 { font-family: 'Barlow Condensed', sans-serif; font-size: 19px; margin: 0; }
        .modal-close { background: var(--surface-2); border: none; color: var(--text); border-radius: 50%; width: 28px; height: 28px; cursor: pointer; }
        .policy-text { font-size: 13px; color: var(--text-muted); line-height: 1.6; }
        .fab {
          position: absolute;
          right: 16px;
          bottom: 82px;
          width: 48px; height: 48px;
          border-radius: 50%;
          background: var(--gold);
          color: #24190A;
          border: none;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 10px 20px -6px rgba(232,179,71,0.5);
          cursor: pointer;
          z-index: 15;
        }
        .loading-state { text-align: center; padding: 60px 20px; color: var(--text-muted); }

        /* Auth */
        .auth-wrap { padding: 56px 24px 24px; flex: 1; display: flex; flex-direction: column; justify-content: center; }
        .auth-logo {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800;
          font-size: 24px;
          display: flex;
          align-items: center;
          gap: 8px;
          justify-content: center;
          margin-bottom: 28px;
        }
        .auth-title { font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 22px; text-align: center; margin-bottom: 6px; }
        .auth-sub { font-size: 13px; color: var(--text-muted); text-align: center; margin-bottom: 22px; line-height: 1.5; }
        .auth-error { color: var(--danger); font-size: 12px; margin: -6px 0 12px; }
        .auth-switch { text-align: center; font-size: 13px; color: var(--text-muted); margin-top: 18px; }
        .auth-switch span { color: var(--green); font-weight: 600; cursor: pointer; }
      `}</style>

      <div className="phone">
        <div className="phone-shell">
          {loading ? (
            <div className="loading-state">Chargement…</div>
          ) : !session ? (
            <AuthGate
              screen={authScreen}
              setScreen={setAuthScreen}
              form={authForm}
              setForm={setAuthForm}
              error={authError}
              busy={authBusy}
              onSignup={handleSignup}
              onLogin={handleLogin}
            />
          ) : (
            <>
          <div className="topbar">
            <div className="brand">
              <span className="dot-live" />
              PronoApp
            </div>
            <span className="page-label">
              {tab === "free" && "Pronos gratuits"}
              {tab === "vip" && "Combiné VIP"}
              {tab === "subscribe" && "Devenir VIP"}
              {tab === "settings" && "Paramètres"}
            </span>
          </div>

          <div className="content">
            <>
              {tab === "free" && (
                  <>
                    <div className="section-title">Pronos du jour</div>
                    <div className="section-sub">Accessibles gratuitement à tous les utilisateurs.</div>
                    {freeList.length === 0 ? (
                      <div className="empty-state">Aucun pronostic gratuit publié pour l'instant.</div>
                    ) : (
                      freeList.map((p) => (
                        <MiniCard key={p.id} p={p} onDelete={handleDelete} adminMode={isAdmin} />
                      ))
                    )}
                  </>
                )}

                {tab === "vip" && (
                  <>
                    <div className="section-title">Combiné VIP</div>
                    {vip.active ? (
                      <>
                        <div className="vip-status-banner">
                          <Crown size={18} color="#E8B347" />
                          <div>
                            VIP actif · {vip.plan === "weekly" ? "Hebdomadaire" : "Mensuel"}
                            <br />
                            <span style={{ color: "var(--text-muted)" }}>{timeRemaining(vip.expiresAt)}</span>
                          </div>
                        </div>
                        {vipList.length === 0 ? (
                          <div className="empty-state">Aucun combiné VIP publié pour l'instant.</div>
                        ) : (
                          vipList.map((p) => (
                            <MiniCard key={p.id} p={p} onDelete={handleDelete} adminMode={isAdmin} />
                          ))
                        )}
                      </>
                    ) : (
                      <div className="lock-panel">
                        <div className="lock-icon">
                          <Lock size={22} />
                        </div>
                        <div className="lock-title">Contenu réservé aux VIP</div>
                        <div className="lock-text">
                          Abonnez-vous pour débloquer le combiné du jour. L'accès s'active automatiquement dès le paiement confirmé.
                        </div>
                        <button className="btn-gold" onClick={() => setTab("subscribe")}>
                          Devenir VIP
                        </button>
                      </div>
                    )}
                  </>
                )}

                {tab === "subscribe" && (
                  <>
                    <div className="section-title">Choisir un abonnement</div>
                    <div className="section-sub">
                      {region === "europe"
                        ? "Paiement par carte bancaire."
                        : "Paiement par Mobile Money ou Orange Money."}
                    </div>

                    <div className="region-toggle">
                      <span className="region-label">Votre région</span>
                      <div className="region-pills">
                        <button
                          className={`region-pill ${region === "afrique" ? "active" : ""}`}
                          onClick={() => persistRegion("afrique")}
                        >
                          Afrique centrale
                        </button>
                        <button
                          className={`region-pill ${region === "europe" ? "active" : ""}`}
                          onClick={() => persistRegion("europe")}
                        >
                          Europe
                        </button>
                      </div>
                      <span className="region-hint">Détectée automatiquement, modifiable si besoin.</span>
                    </div>

                    <div className="plan-card">
                      <div className="plan-head">
                        <span className="plan-name">Hebdomadaire</span>
                        <span className="plan-price">
                          {PRICING[region].weekly.display}
                          <small> {PRICING[region].weekly.suffix}</small>
                        </span>
                      </div>
                      <div className="plan-note">Renouvelable chaque semaine. Idéal pour tester.</div>
                      <button className="btn-gold" onClick={() => activateVip("weekly")}>
                        Choisir Hebdomadaire
                      </button>
                    </div>

                    <div className="plan-card">
                      <div className="plan-head">
                        <span className="plan-name">Mensuel</span>
                        <span className="plan-price">
                          {PRICING[region].monthly.display}
                          <small> {PRICING[region].monthly.suffix}</small>
                        </span>
                      </div>
                      <div className="plan-note">Le meilleur rapport prix / accès continu.</div>
                      <button className="btn-gold" onClick={() => activateVip("monthly")}>
                        Choisir Mensuel
                      </button>
                    </div>

                    <div className="pay-methods">
                      {PAY_METHODS[region].map(({ id, label, icon: Icon }) => (
                        <div
                          key={id}
                          className={`pay-method ${payMethod === id ? "active" : ""}`}
                          onClick={() => setPayMethod(id)}
                        >
                          <Icon size={16} />
                          {label}
                        </div>
                      ))}
                    </div>

                    <div className="demo-note">
                      Démo : ici, cliquer sur un plan active le VIP instantanément dans ce prototype. En production, ce bouton ouvrira le paiement Flutterwave réel (Mobile Money / Orange Money en Afrique centrale, carte bancaire en Europe), et le VIP ne s'activera qu'après confirmation du paiement.
                    </div>
                  </>
                )}

                {tab === "settings" && (
                  <>
                    <div className="section-title">Paramètres</div>

                    <div className="field">
                      <label>Email du compte</label>
                      <input value={session} disabled />
                    </div>
                    <div className="field">
                      <label>Nom</label>
                      <input
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        placeholder="Votre nom"
                      />
                    </div>
                    <div className="field">
                      <label>Email</label>
                      <input
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        placeholder="vous@exemple.com"
                      />
                    </div>
                    <button className="btn-secondary" onClick={() => persistProfile(profile)}>
                      Enregistrer le profil
                    </button>
                    {saveState === "saved" && <div className="save-toast">Profil enregistré.</div>}

                    <div style={{ marginTop: 22 }}>
                      <div className="settings-row" onClick={() => setShowPolicy(true)} style={{ cursor: "pointer" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <ShieldCheck size={16} /> Politique de confidentialité
                        </span>
                        <span style={{ color: "var(--text-muted)" }}>›</span>
                      </div>
                      <div
                        className="settings-row"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          (window.location.href = "mailto:contact@pronoapp.exemple?subject=Contact%20PronoApp")
                        }
                      >
                        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Mail size={16} /> Nous contacter par email
                        </span>
                        <span style={{ color: "var(--text-muted)" }}>›</span>
                      </div>
                      <div className="settings-row">
                        <span>Statut VIP</span>
                        <span style={{ color: vip.active ? "var(--gold)" : "var(--text-muted)" }}>
                          {vip.active ? "Actif" : "Inactif"}
                        </span>
                      </div>
                    </div>

                    <button className="btn-secondary" style={{ marginTop: 16 }} onClick={handleLogout}>
                      <LogOut size={15} /> Se déconnecter
                    </button>

                    {isAdmin && (
                      <div className="admin-box">
                        <div className="admin-title">Espace administrateur</div>
                        <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 10 }}>
                          Vous êtes connecté avec un compte administrateur ({session}). Vous pouvez publier ou supprimer des pronostics depuis les onglets Gratuit et VIP, ou via le bouton ci-dessous.
                        </div>
                        <button className="btn-secondary" onClick={() => setShowForm(true)}>
                          <Plus size={15} /> Ajouter un pronostic
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
          </div>

          {isAdmin && (tab === "free" || tab === "vip") && (
            <button className="fab" onClick={() => setShowForm(true)} aria-label="Ajouter">
              <Plus size={22} />
            </button>
          )}

          <div className="bottom-nav">
            <button className={`nav-btn ${tab === "free" ? "active" : ""}`} onClick={() => setTab("free")}>
              <Gift size={18} />
              Gratuit
            </button>
            <button className={`nav-btn ${tab === "vip" ? "active" : ""}`} onClick={() => setTab("vip")}>
              <div className="badge-lock">
                <Crown size={18} />
              </div>
              VIP
            </button>
            <button className={`nav-btn ${tab === "subscribe" ? "active" : ""}`} onClick={() => setTab("subscribe")}>
              <CreditCard size={18} />
              Abonnement
            </button>
            <button className={`nav-btn ${tab === "settings" ? "active" : ""}`} onClick={() => setTab("settings")}>
              <GearIcon size={18} />
              Réglages
            </button>
          </div>

          {showPolicy && (
            <div className="modal-overlay" onClick={() => setShowPolicy(false)}>
              <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
                <div className="modal-head">
                  <h3>Politique de confidentialité</h3>
                  <button className="modal-close" onClick={() => setShowPolicy(false)}>
                    <X size={16} />
                  </button>
                </div>
                <div className="policy-text">
                  Ce texte est un exemple à personnaliser. Décrivez ici quelles données vous collectez (nom, email,
                  statut d'abonnement), pourquoi (gestion du compte et de l'accès VIP), comment elles sont stockées,
                  et comment un utilisateur peut demander leur suppression en vous contactant.
                </div>
              </div>
            </div>
          )}

          {showForm && (
            <div className="modal-overlay" onClick={() => setShowForm(false)}>
              <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
                <div className="modal-head">
                  <h3>Nouveau pronostic</h3>
                  <button className="modal-close" onClick={() => setShowForm(false)}>
                    <X size={16} />
                  </button>
                </div>
                <form onSubmit={handleAddPrediction}>
                  <div className="field">
                    <label>Catégorie</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                      <option value="free">Gratuit</option>
                      <option value="vip">VIP</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>Compétition</label>
                    <input
                      value={form.league}
                      onChange={(e) => setForm({ ...form, league: e.target.value })}
                      placeholder="Ex : Ligue 1"
                    />
                  </div>
                  <div className="field">
                    <label>Équipe domicile</label>
                    <input
                      value={form.homeTeam}
                      onChange={(e) => setForm({ ...form, homeTeam: e.target.value })}
                      placeholder="Ex : PSG"
                    />
                  </div>
                  <div className="field">
                    <label>Équipe extérieur</label>
                    <input
                      value={form.awayTeam}
                      onChange={(e) => setForm({ ...form, awayTeam: e.target.value })}
                      placeholder="Ex : Marseille"
                    />
                  </div>
                  <div className="field">
                    <label>Pronostic</label>
                    <input
                      value={form.tip}
                      onChange={(e) => setForm({ ...form, tip: e.target.value })}
                      placeholder="Ex : Victoire domicile"
                    />
                  </div>
                  <div className="field">
                    <label>Cote</label>
                    <input
                      value={form.odds}
                      onChange={(e) => setForm({ ...form, odds: e.target.value })}
                      placeholder="Ex : 1.85"
                    />
                  </div>
                  <div className="field">
                    <label>Confiance</label>
                    <select
                      value={form.confidence}
                      onChange={(e) => setForm({ ...form, confidence: Number(e.target.value) })}
                    >
                      <option value={1}>Faible</option>
                      <option value={2}>Moyenne</option>
                      <option value={3}>Élevée</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>Date et heure du match</label>
                    <input
                      type="datetime-local"
                      value={form.matchDate}
                      onChange={(e) => setForm({ ...form, matchDate: e.target.value })}
                    />
                  </div>
                  <button className="btn-gold" type="submit">
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <CheckCircle2 size={16} /> Publier
                    </span>
                  </button>
                </form>
              </div>
            </div>
          )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
