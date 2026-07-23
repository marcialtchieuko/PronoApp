import React, { useState, useEffect, useCallback } from "react";
import {
  Gift,
  Crown,
  CreditCard,
  Settings as GearIcon,
  Lock,
  Plus,
  Trash2,
  Pencil,
  X,
  Check,
  Mail,
  ShieldCheck,
  Smartphone,
  Landmark,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  UserPlus,
  LogIn,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Globe,
  MailCheck,
} from "lucide-react";

// ============================================================
// Connexion a Supabase (API REST directe, sans SDK)
// ============================================================
const SUPABASE_URL = "https://novwnjvkaxamjatisgik.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_LUuZOg_f05PFIVdXwTeYrA_kmoAykLX";
const PAYMENTS_WORKER_URL = "https://pronoapp-payments.tchieukomarcial.workers.dev";
const ADMIN_EMAILS = ["tchieukomarcial@gmail.com"];

const LEAGUES_PLACEHOLDER = "Ligue 1";

const STRINGS = {
  fr: {
    appName: "PronoApp",
    subscribe: "Abonnement",
    vipActiveShort: "VIP actif",
    navFree: "Gratuit",
    navVip: "VIP",
    navSubscribe: "Abonnement",
    navSettings: "Réglages",
    freeEmpty: "Aucun pronostic gratuit pour cette date.",
    vipEmpty: "Aucun combiné VIP pour cette date.",
    tagFree: "GRATUIT",
    tagVip: "VIP",
    oddsPrefix: "Cote :",
    totalOddsLabel: "Cote totale :",
    statusPending: "EN ATTENTE",
    statusWon: "GAGNÉ",
    statusLost: "PERDU",
    lockedComboText: "Ceci est un contenu VIP. Vous devez vous abonner pour voir les détails.",
    lockPanelTitle: "Débloquez les combinés complets",
    lockPanelText:
      "Abonnez-vous pour voir le détail des matchs. L'accès s'active automatiquement dès le paiement confirmé.",
    becomeVip: "Devenir VIP",
    resultLabel: "Résultat",
    subscribeTitle: "Choisir un abonnement",
    subscribeSubEurope: "Vous choisirez votre moyen de paiement sur la page sécurisée.",
    subscribeSubAfrica: "Vous choisirez votre moyen de paiement sur la page sécurisée.",
    regionLabel: "Votre région",
    regionAfrica: "Afrique centrale",
    regionEurope: "Europe",
    regionHint: "Détectée automatiquement, modifiable si besoin.",
    weekly: "Hebdomadaire",
    monthly: "Mensuel",
    weeklyNote: "Renouvelable chaque semaine. Idéal pour tester.",
    monthlyNote: "Le meilleur rapport prix / accès continu.",
    chooseWeekly: "Choisir Hebdomadaire",
    chooseMonthly: "Choisir Mensuel",
    demoNote:
      "Paiement sécurisé via NotchPay (Mobile Money, Orange Money, MTN ou carte bancaire selon votre pays). Le VIP s'active automatiquement dès que le paiement est confirmé. Chaque achat est manuel, sans renouvellement automatique.",
    settingsTitle: "Paramètres",
    editProfile: "Modifier le profil",
    privacyPolicy: "Politique de confidentialité",
    contactSupport: "Nous contacter par email",
    vipMember: "Membre VIP",
    logout: "Se déconnecter",
    adminTitle: "Espace administrateur",
    adminConnected: "Connecté en tant qu'administrateur",
    addFreePrediction: "Ajouter un pronostic gratuit",
    addCombo: "Ajouter un combiné VIP",
    createAccount: "Créer un compte",
    login: "Connexion",
    firstName: "Prénom",
    lastName: "Nom",
    email: "Adresse email",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    signupSub: "Votre email sert à gérer votre abonnement VIP.",
    loginSub: "Connectez-vous pour retrouver vos pronostics et votre statut VIP.",
    createAccountBtn: "Créer mon compte",
    loginBtn: "Se connecter",
    oneMoment: "Un instant…",
    alreadyAccount: "Déjà un compte ?",
    noAccount: "Pas encore de compte ?",
    switchToLogin: "Se connecter",
    switchToSignup: "S'inscrire",
    storageWarning:
      "Connexion au serveur instable : certaines actions peuvent échouer. Vérifiez votre connexion internet.",
    loading: "Chargement…",
    policyBody:
      "Ce texte est un exemple à personnaliser. Décrivez ici quelles données vous collectez (nom, email, statut d'abonnement), pourquoi (gestion du compte et de l'accès VIP), comment elles sont stockées, et comment un utilisateur peut demander leur suppression en vous contactant.",
    account: "Compte",
    legal: "Légal",
    support: "Support",
    newPrediction: "Nouveau pronostic gratuit",
    editPrediction: "Modifier le pronostic",
    league: "Compétition",
    homeTeam: "Équipe domicile",
    awayTeam: "Équipe extérieur",
    tip: "Pronostic",
    odds: "Cote",
    matchDateTime: "Date et heure du match",
    homeScore: "Score domicile",
    awayScore: "Score extérieur",
    resultAfterMatch: "Résultat (à remplir après le match)",
    pending: "En attente",
    won: "Gagné ✅",
    lost: "Perdu ❌",
    publish: "Publier",
    save: "Enregistrer",
    newCombo: "Nouveau combiné VIP",
    editCombo: "Modifier le combiné",
    comboTitle: "Titre du combiné",
    date: "Date",
    totalOdds: "Cote totale",
    status: "Statut",
    matchesOfCombo: "Matchs du combiné",
    match: "Match",
    competition: "Compétition",
    time: "Heure",
    team1: "Équipe 1",
    team2: "Équipe 2",
    homeScoreAfter: "Score dom. (après match)",
    awayScoreAfter: "Score ext. (après match)",
    addMatch: "Ajouter un match",
    publishCombo: "Publier le combiné",
    accountEmail: "Email du compte",
    savedToast: "Profil enregistré.",
    vipStatusRow: "Statut VIP",
    active: "Actif",
    inactive: "Inactif",
    name: "Nom",
    checkEmailTitle: "Vérifiez votre boîte mail",
    checkEmailText:
      "Un email de confirmation vous a été envoyé. Cliquez sur le lien qu'il contient, puis revenez ici pour vous connecter.",
  },
  en: {
    appName: "PronoApp",
    subscribe: "Subscribe",
    vipActiveShort: "VIP active",
    navFree: "Free",
    navVip: "VIP",
    navSubscribe: "Subscribe",
    navSettings: "Settings",
    freeEmpty: "No free tips for this date.",
    vipEmpty: "No VIP combo for this date.",
    tagFree: "FREE",
    tagVip: "VIP",
    oddsPrefix: "Odds:",
    totalOddsLabel: "Total odds:",
    statusPending: "PENDING",
    statusWon: "WON",
    statusLost: "LOST",
    lockedComboText: "This is VIP content. You must subscribe to see the details.",
    lockPanelTitle: "Unlock the full combos",
    lockPanelText: "Subscribe to see the match details. Access activates automatically once payment is confirmed.",
    becomeVip: "Become VIP",
    resultLabel: "Result",
    subscribeTitle: "Choose a plan",
    subscribeSubEurope: "You'll choose your payment method on the secure page.",
    subscribeSubAfrica: "You'll choose your payment method on the secure page.",
    regionLabel: "Your region",
    regionAfrica: "Central Africa",
    regionEurope: "Europe",
    regionHint: "Detected automatically, editable if needed.",
    weekly: "Weekly",
    monthly: "Monthly",
    weeklyNote: "Renews every week. Great for trying it out.",
    monthlyNote: "Best value / continuous access.",
    chooseWeekly: "Choose Weekly",
    chooseMonthly: "Choose Monthly",
    demoNote:
      "Secure payment via NotchPay (Mobile Money, Orange Money, MTN, or bank card depending on your country). VIP activates automatically once payment is confirmed. Each purchase is manual, with no auto-renewal.",
    settingsTitle: "Settings",
    editProfile: "Edit profile",
    privacyPolicy: "Privacy policy",
    contactSupport: "Contact us by email",
    vipMember: "VIP member",
    logout: "Log out",
    adminTitle: "Admin area",
    adminConnected: "Logged in as administrator",
    addFreePrediction: "Add a free tip",
    addCombo: "Add a VIP combo",
    createAccount: "Create an account",
    login: "Log in",
    firstName: "First name",
    lastName: "Last name",
    email: "Email address",
    password: "Password",
    confirmPassword: "Confirm password",
    signupSub: "Your email is used to manage your VIP subscription.",
    loginSub: "Log in to find your tips and your VIP status.",
    createAccountBtn: "Create my account",
    loginBtn: "Log in",
    oneMoment: "One moment…",
    alreadyAccount: "Already have an account?",
    noAccount: "No account yet?",
    switchToLogin: "Log in",
    switchToSignup: "Sign up",
    storageWarning: "Unstable server connection: some actions may fail. Check your internet connection.",
    loading: "Loading…",
    policyBody:
      "This is placeholder text to customize. Describe here what data you collect (name, email, subscription status), why (account and VIP access management), how it's stored, and how a user can request deletion by contacting you.",
    account: "Account",
    legal: "Legal",
    support: "Support",
    newPrediction: "New free tip",
    editPrediction: "Edit tip",
    league: "Competition",
    homeTeam: "Home team",
    awayTeam: "Away team",
    tip: "Tip",
    odds: "Odds",
    matchDateTime: "Match date and time",
    homeScore: "Home score",
    awayScore: "Away score",
    resultAfterMatch: "Result (fill in after the match)",
    pending: "Pending",
    won: "Won ✅",
    lost: "Lost ❌",
    publish: "Publish",
    save: "Save",
    newCombo: "New VIP combo",
    editCombo: "Edit combo",
    comboTitle: "Combo title",
    date: "Date",
    totalOdds: "Total odds",
    status: "Status",
    matchesOfCombo: "Matches in this combo",
    match: "Match",
    competition: "Competition",
    time: "Time",
    team1: "Team 1",
    team2: "Team 2",
    homeScoreAfter: "Home score (after match)",
    awayScoreAfter: "Away score (after match)",
    addMatch: "Add a match",
    publishCombo: "Publish combo",
    accountEmail: "Account email",
    savedToast: "Profile saved.",
    vipStatusRow: "VIP status",
    active: "Active",
    inactive: "Inactive",
    name: "Name",
    checkEmailTitle: "Check your inbox",
    checkEmailText: "A confirmation email has been sent. Click the link inside it, then come back here to log in.",
  },
};

const emptyForm = {
  category: "free",
  league: "",
  homeTeam: "",
  awayTeam: "",
  tip: "",
  odds: "",
  confidence: 2,
  matchDate: "",
  homeScore: "",
  awayScore: "",
  result: "pending",
};

function matchRowEmpty() {
  return { id: uid(), league: "", time: "", homeTeam: "", awayTeam: "", tip: "", odds: "", homeScore: "", awayScore: "" };
}

const emptyComboForm = {
  title: "",
  date: "",
  totalOdds: "",
  status: "pending",
  matches: [],
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

function withTimeout(promise, ms = 10000) {
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

function safeGet(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function safeSet(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}
function safeDelete(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

// ---- Appels Supabase (REST direct, pas de SDK) ----
async function sbFetch(path, options = {}) {
  const headers = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  try {
    const res = await withTimeout(fetch(`${SUPABASE_URL}${path}`, { ...options, headers }));
    const text = await res.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }
    if (!res.ok) {
      const message = (data && (data.msg || data.message || data.error_description || data.error)) || `Erreur ${res.status}`;
      return { ok: false, status: res.status, error: message, data };
    }
    return { ok: true, status: res.status, data };
  } catch {
    return { ok: false, status: 0, error: "network" };
  }
}

function translateAuthError(raw, lang) {
  const msg = (raw || "").toString().toLowerCase();
  if (msg.includes("already") && (msg.includes("registered") || msg.includes("exists"))) {
    return lang === "en" ? "An account already exists with this email." : "Un compte existe déjà avec cet email.";
  }
  if (msg.includes("invalid login credentials")) {
    return lang === "en" ? "Incorrect email or password." : "Email ou mot de passe incorrect.";
  }
  if (msg.includes("email not confirmed") || msg.includes("email_not_confirmed")) {
    return lang === "en"
      ? "Please confirm your email before logging in (check your inbox)."
      : "Confirmez votre email avant de vous connecter (vérifiez votre boîte de réception).";
  }
  if (msg.includes("password") && (msg.includes("6") || msg.includes("short"))) {
    return lang === "en" ? "Password must be at least 6 characters." : "Le mot de passe doit contenir au moins 6 caractères.";
  }
  if (msg.includes("invalid") && msg.includes("email")) {
    return lang === "en" ? "Invalid email address." : "Adresse email invalide.";
  }
  if (msg === "network" || msg.includes("timeout")) {
    return lang === "en" ? "Network error, please try again." : "Erreur réseau, réessayez.";
  }
  return raw || (lang === "en" ? "Something went wrong, please try again." : "Une erreur est survenue, réessayez.");
}

function dbToPrediction(row) {
  return {
    id: row.id,
    category: "free",
    league: row.league || "",
    homeTeam: row.home_team || "",
    awayTeam: row.away_team || "",
    tip: row.tip || "",
    odds: row.odds || "",
    matchDate: row.match_date ? row.match_date.slice(0, 16) : "",
    homeScore: row.home_score == null ? "" : row.home_score,
    awayScore: row.away_score == null ? "" : row.away_score,
    result: row.result || "pending",
  };
}
function predictionToDb(form) {
  return {
    league: form.league,
    home_team: form.homeTeam,
    away_team: form.awayTeam,
    tip: form.tip,
    odds: form.odds,
    match_date: form.matchDate ? new Date(form.matchDate).toISOString() : null,
    home_score: form.homeScore === "" ? null : form.homeScore,
    away_score: form.awayScore === "" ? null : form.awayScore,
    result: form.result,
  };
}
function dbToCombo(row) {
  return {
    id: row.id,
    title: row.title,
    date: row.date,
    totalOdds: row.total_odds || "",
    status: row.status || "pending",
    matches: (row.combo_matches || []).map((m) => ({
      id: m.id,
      league: m.league || "",
      time: m.match_time || "",
      homeTeam: m.home_team || "",
      awayTeam: m.away_team || "",
      tip: m.tip || "",
      odds: m.odds || "",
      homeScore: m.home_score == null ? "" : m.home_score,
      awayScore: m.away_score == null ? "" : m.away_score,
    })),
  };
}

function timeRemaining(expiresAt, lang) {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (lang === "en") {
    if (days > 0) return `${days}d ${hours}h left`;
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}min left`;
  }
  if (days > 0) return `${days} j ${hours} h restants`;
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours} h ${mins} min restants`;
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}
function toDateKey(value) {
  if (typeof value === "string") return value.slice(0, 10);
  const y = value.getFullYear();
  const m = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function formatHeaderDate(date, lang) {
  const locale = lang === "en" ? "en-US" : "fr-FR";
  return new Date(date)
    .toLocaleDateString(locale, { day: "2-digit", month: "short", year: "numeric" })
    .toUpperCase();
}
function dowLabel(date, lang) {
  const locale = lang === "en" ? "en-US" : "fr-FR";
  return new Date(date).toLocaleDateString(locale, { weekday: "short" }).replace(".", "").toUpperCase();
}
function formatKickoff(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function DateNav({ selectedDate, onChange, lang }) {
  const days = [addDays(selectedDate, -1), selectedDate, addDays(selectedDate, 1)];
  return (
    <div className="date-nav">
      <div className="date-nav-label">{formatHeaderDate(selectedDate, lang)}</div>
      <div className="date-nav-row">
        <button className="date-arrow" onClick={() => onChange(addDays(selectedDate, -1))} aria-label="prev">
          <ChevronLeft size={18} />
        </button>
        {days.map((d, i) => {
          const active = toDateKey(d) === toDateKey(selectedDate);
          return (
            <button key={i} className={`date-chip ${active ? "active" : ""}`} onClick={() => onChange(d)}>
              <span className="date-chip-num">{d.getDate()}</span>
              <span className="date-chip-dow">{dowLabel(d, lang)}</span>
            </button>
          );
        })}
        <button className="date-arrow" onClick={() => onChange(addDays(selectedDate, 1))} aria-label="next">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

function StatusBadge({ status, t }) {
  if (status === "won") {
    return (
      <span className="combo-status won">
        <CheckCircle2 size={15} /> {t("statusWon")}
      </span>
    );
  }
  if (status === "lost") {
    return (
      <span className="combo-status lost">
        <XCircle size={15} /> {t("statusLost")}
      </span>
    );
  }
  return (
    <span className="combo-status pending">
      <Clock size={15} /> {t("statusPending")}
    </span>
  );
}

function MiniCard({ p, isAdmin, onEdit, onDelete, t }) {
  const pending = !p.result || p.result === "pending";
  return (
    <div className="pcard">
      <div className="pcard-top">
        <span className="tag tag-free">{t("tagFree")}</span>
        <span className="odds-chip">
          {t("oddsPrefix")} {p.odds}
        </span>
      </div>
      <div className="pcard-league">{p.league || LEAGUES_PLACEHOLDER}</div>
      <div className="pcard-teams">
        <div className="pcard-teams-col">
          <div className="team-row">
            <span className="team-name">{p.homeTeam}</span>
            {pending ? (
              <span className="kickoff">{formatKickoff(p.matchDate)}</span>
            ) : (
              <span className="team-score">{p.homeScore === "" || p.homeScore == null ? "-" : p.homeScore}</span>
            )}
          </div>
          <div className="team-row">
            <span className="team-name">{p.awayTeam}</span>
            {!pending && (
              <span className="team-score">{p.awayScore === "" || p.awayScore == null ? "-" : p.awayScore}</span>
            )}
          </div>
        </div>
        {!pending && (
          <div className={`result-icon ${p.result}`}>
            {p.result === "won" ? <Check size={16} /> : <X size={16} />}
          </div>
        )}
      </div>
      {p.tip && <div className="pcard-tip">{p.tip}</div>}

      {isAdmin && (
        <div className="pcard-admin">
          <button className="icon-btn" onClick={() => onEdit(p)} aria-label="edit">
            <Pencil size={14} />
          </button>
          <button className="icon-btn danger" onClick={() => onDelete(p.id)} aria-label="delete">
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

function ComboCard({ combo, unlocked, isAdmin, onEdit, onDelete, t }) {
  return (
    <div className="combo-card">
      {isAdmin && (
        <div className="pcard-admin">
          <button className="icon-btn" onClick={() => onEdit(combo)} aria-label="edit">
            <Pencil size={14} />
          </button>
          <button className="icon-btn danger" onClick={() => onDelete(combo.id)} aria-label="delete">
            <Trash2 size={14} />
          </button>
        </div>
      )}
      <span className="combo-tag">{t("tagVip")}</span>
      <div className="combo-title">{combo.title}</div>

      {unlocked ? (
        <div className="combo-matches">
          {(combo.matches || []).map((m) => (
            <div className="combo-match" key={m.id}>
              <div className="combo-match-top">
                <span>{m.league}</span>
                <span>{m.time}</span>
              </div>
              <div className="combo-match-teams">
                {m.homeTeam} vs {m.awayTeam}
              </div>
              <div className="combo-match-tip-row">
                <span className="combo-match-tip">• {m.tip}</span>
                <span className="combo-match-odds">{m.odds}</span>
              </div>
              {m.homeScore !== "" && m.homeScore != null && (
                <div className="combo-match-result">
                  {t("resultLabel")} : {m.homeScore} - {m.awayScore}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="combo-locked">
          <Lock size={26} />
          <p>{t("lockedComboText")}</p>
        </div>
      )}

      <div className="combo-footer">
        <span className="combo-total">
          {t("totalOddsLabel")} <strong>{combo.totalOdds}</strong>
        </span>
        <StatusBadge status={combo.status} t={t} />
      </div>
    </div>
  );
}

function AuthGate({ screen, setScreen, form, setForm, error, busy, onSignup, onLogin, t }) {
  if (screen === "checkEmail") {
    return (
      <div className="auth-wrap">
        <div className="auth-logo">{t("appName")}</div>
        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <MailCheck size={40} color="var(--blue)" />
        </div>
        <div className="auth-title">{t("checkEmailTitle")}</div>
        <div className="auth-sub">{t("checkEmailText")}</div>
        <button className="btn-gold" type="button" onClick={() => setScreen("login")}>
          {t("switchToLogin")}
        </button>
      </div>
    );
  }

  const isSignup = screen === "signup";
  return (
    <div className="auth-wrap">
      <div className="auth-logo">{t("appName")}</div>
      <div className="auth-title">{isSignup ? t("createAccount") : t("login")}</div>
      <div className="auth-sub">{isSignup ? t("signupSub") : t("loginSub")}</div>

      <form onSubmit={isSignup ? onSignup : onLogin} noValidate>
        {isSignup && (
          <div className="field-row">
            <div className="field">
              <label>{t("firstName")}</label>
              <input
                type="text"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                placeholder="Jean"
              />
            </div>
            <div className="field">
              <label>{t("lastName")}</label>
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                placeholder="Dupont"
              />
            </div>
          </div>
        )}
        <div className="field">
          <label>{t("email")}</label>
          <input
            type="text"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="vous@exemple.com"
          />
        </div>
        <div className="field">
          <label>{t("password")}</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
          />
        </div>
        {isSignup && (
          <div className="field">
            <label>{t("confirmPassword")}</label>
            <input
              type="password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              placeholder="••••••••"
            />
          </div>
        )}
        {error && <div className="auth-error">{error}</div>}
        <button
          className="btn-gold"
          type="button"
          disabled={busy}
          onClick={() => (isSignup ? onSignup() : onLogin())}
        >
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {isSignup ? <UserPlus size={16} /> : <LogIn size={16} />}
            {busy ? t("oneMoment") : isSignup ? t("createAccountBtn") : t("loginBtn")}
          </span>
        </button>
      </form>

      <div className="auth-switch">
        {isSignup ? (
          <>
            {t("alreadyAccount")} <span onClick={() => setScreen("login")}>{t("switchToLogin")}</span>
          </>
        ) : (
          <>
            {t("noAccount")} <span onClick={() => setScreen("signup")}>{t("switchToSignup")}</span>
          </>
        )}
      </div>
    </div>
  );
}

export default function PronoApp() {
  const [lang, setLang] = useState("fr");
  const [tab, setTab] = useState("free");
  const [loading, setLoading] = useState(true);
  const [predictions, setPredictions] = useState([]);
  const [combos, setCombos] = useState([]);
  const [vip, setVip] = useState({ active: false, plan: null, expiresAt: null });
  const [profile, setProfile] = useState({ firstName: "", lastName: "", email: "" });

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const [showComboForm, setShowComboForm] = useState(false);
  const [editingComboId, setEditingComboId] = useState(null);
  const [comboForm, setComboForm] = useState(emptyComboForm);

  const [showPolicy, setShowPolicy] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [region, setRegion] = useState("afrique");
  const [payMethod, setPayMethod] = useState("mobilemoney");
  const [saveState, setSaveState] = useState("idle");

  const [authSession, setAuthSession] = useState(null); // { access_token, refresh_token, user }
  const [authScreen, setAuthScreen] = useState("signup");
  const [authForm, setAuthForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirm: "" });
  const [authError, setAuthError] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [storageOk, setStorageOk] = useState(true);
  const [paymentBusy, setPaymentBusy] = useState(null);
  const [paymentError, setPaymentError] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const t = useCallback((key) => (STRINGS[lang] && STRINGS[lang][key]) || STRINGS.fr[key] || key, [lang]);

  const toggleLang = useCallback(async () => {
    const next = lang === "fr" ? "en" : "fr";
    setLang(next);
    await safeSet("lang", next, false);
  }, [lang]);

  const persistRegion = useCallback(async (next) => {
    setRegion(next);
    setPayMethod(PAY_METHODS[next][0].id);
    await safeSet("region", next, false);
  }, []);

  useEffect(() => {
    if (!authSession) return;
    function handleVisible() {
      if (document.visibilityState === "visible") {
        loadOrCreateProfile(authSession);
      }
    }
    document.addEventListener("visibilitychange", handleVisible);
    window.addEventListener("focus", handleVisible);
    return () => {
      document.removeEventListener("visibilitychange", handleVisible);
      window.removeEventListener("focus", handleVisible);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authSession]);

  const authHeaders = authSession ? { Authorization: `Bearer ${authSession.access_token}` } : {};

  const loadOrCreateProfile = useCallback(async (sess) => {
    const uidVal = sess.user.id;
    const res = await sbFetch(`/rest/v1/profiles?id=eq.${uidVal}&select=*`, {
      headers: { Authorization: `Bearer ${sess.access_token}` },
    });
    if (res.ok && Array.isArray(res.data) && res.data.length > 0) {
      const row = res.data[0];
      setProfile({ firstName: row.first_name || "", lastName: row.last_name || "", email: row.email || sess.user.email });
      const active = !!row.vip_active && (!row.vip_expires_at || new Date(row.vip_expires_at).getTime() > Date.now());
      setVip({ active, plan: row.vip_plan || null, expiresAt: row.vip_expires_at || null });
    } else {
      const meta = sess.user.user_metadata || {};
      const newRow = {
        id: uidVal,
        first_name: meta.first_name || "",
        last_name: meta.last_name || "",
        email: sess.user.email,
        vip_active: false,
      };
      await sbFetch("/rest/v1/profiles", {
        method: "POST",
        headers: { Authorization: `Bearer ${sess.access_token}`, Prefer: "return=minimal" },
        body: JSON.stringify(newRow),
      });
      setProfile({ firstName: newRow.first_name, lastName: newRow.last_name, email: newRow.email });
      setVip({ active: false, plan: null, expiresAt: null });
    }
  }, []);

  const reloadPredictions = useCallback(async () => {
    const res = await sbFetch("/rest/v1/predictions?select=*&order=match_date.desc");
    if (res.ok) {
      setPredictions((res.data || []).map(dbToPrediction));
      setStorageOk(true);
    } else {
      setStorageOk(false);
    }
  }, []);

  const reloadCombos = useCallback(async () => {
    const res = await sbFetch(
      "/rest/v1/combos?select=*,combo_matches(*)&combo_matches.order=position.asc&order=date.desc"
    );
    if (res.ok) {
      setCombos((res.data || []).map(dbToCombo));
      setStorageOk(true);
    } else {
      setStorageOk(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const langRaw = await safeGet("lang", false);
        if (langRaw === "en" || langRaw === "fr") setLang(langRaw);

        const regionRaw = await safeGet("region", false);
        const detected = regionRaw || detectRegion();
        setRegion(detected);
        setPayMethod(PAY_METHODS[detected][0].id);

        await reloadPredictions();
        await reloadCombos();

        const sessRaw = await safeGet("sb_session", false);
        if (sessRaw) {
          try {
            const stored = JSON.parse(sessRaw);
            const refreshRes = await sbFetch("/auth/v1/token?grant_type=refresh_token", {
              method: "POST",
              body: JSON.stringify({ refresh_token: stored.refresh_token }),
            });
            if (refreshRes.ok && refreshRes.data && refreshRes.data.access_token) {
              const fresh = {
                access_token: refreshRes.data.access_token,
                refresh_token: refreshRes.data.refresh_token,
                user: refreshRes.data.user,
              };
              setAuthSession(fresh);
              await safeSet("sb_session", JSON.stringify(fresh), false);
              await loadOrCreateProfile(fresh);
            } else {
              await safeDelete("sb_session", false);
            }
          } catch {
            await safeDelete("sb_session", false);
          }
        }
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persistVip = useCallback(
    async (next) => {
      setVip(next);
      if (!authSession) return;
      await sbFetch(`/rest/v1/profiles?id=eq.${authSession.user.id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${authSession.access_token}`, Prefer: "return=minimal" },
        body: JSON.stringify({ vip_active: next.active, vip_plan: next.plan, vip_expires_at: next.expiresAt }),
      });
    },
    [authSession]
  );

  const persistProfile = useCallback(
    async (next) => {
      setProfile(next);
      setSaveState("saving");
      if (!authSession) {
        setSaveState("idle");
        return;
      }
      const res = await sbFetch(`/rest/v1/profiles?id=eq.${authSession.user.id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${authSession.access_token}`, Prefer: "return=minimal" },
        body: JSON.stringify({ first_name: next.firstName, last_name: next.lastName }),
      });
      setSaveState(res.ok ? "saved" : "idle");
      if (res.ok) setTimeout(() => setSaveState("idle"), 1500);
    },
    [authSession]
  );

  async function handleSignup(e) {
    if (e && e.preventDefault) e.preventDefault();
    setAuthError("");
    const email = authForm.email.trim().toLowerCase();
    const firstName = authForm.firstName.trim();
    const lastName = authForm.lastName.trim();
    if (!firstName || !lastName) {
      setAuthError(lang === "en" ? "First and last name required." : "Nom et prénom requis.");
      return;
    }
    if (!email || !authForm.password) {
      setAuthError(lang === "en" ? "Email and password required." : "Email et mot de passe requis.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setAuthError(lang === "en" ? "Invalid email address." : "Adresse email invalide.");
      return;
    }
    if (authForm.password.length < 6) {
      setAuthError(
        lang === "en" ? "Password must be at least 6 characters." : "Le mot de passe doit contenir au moins 6 caractères."
      );
      return;
    }
    if (authForm.password !== authForm.confirm) {
      setAuthError(lang === "en" ? "Passwords do not match." : "Les mots de passe ne correspondent pas.");
      return;
    }
    setAuthBusy(true);
    const res = await sbFetch("/auth/v1/signup", {
      method: "POST",
      body: JSON.stringify({
        email,
        password: authForm.password,
        data: { first_name: firstName, last_name: lastName },
      }),
    });
    setAuthBusy(false);
    if (!res.ok) {
      setAuthError(translateAuthError(res.error, lang));
      return;
    }
    setAuthForm({ firstName: "", lastName: "", email: "", password: "", confirm: "" });
    setAuthScreen("checkEmail");
  }

  async function handleLogin(e) {
    if (e && e.preventDefault) e.preventDefault();
    setAuthError("");
    const email = authForm.email.trim().toLowerCase();
    if (!email || !authForm.password) {
      setAuthError(lang === "en" ? "Email and password required." : "Email et mot de passe requis.");
      return;
    }
    setAuthBusy(true);
    const res = await sbFetch("/auth/v1/token?grant_type=password", {
      method: "POST",
      body: JSON.stringify({ email, password: authForm.password }),
    });
    if (!res.ok) {
      setAuthError(translateAuthError(res.error, lang));
      setAuthBusy(false);
      return;
    }
    const sess = { access_token: res.data.access_token, refresh_token: res.data.refresh_token, user: res.data.user };
    setAuthSession(sess);
    await safeSet("sb_session", JSON.stringify(sess), false);
    await loadOrCreateProfile(sess);
    setAuthForm({ firstName: "", lastName: "", email: "", password: "", confirm: "" });
    setAuthBusy(false);
  }

  async function handleLogout() {
    if (authSession) {
      await sbFetch("/auth/v1/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${authSession.access_token}` },
      });
    }
    await safeDelete("sb_session", false);
    setAuthSession(null);
    setVip({ active: false, plan: null, expiresAt: null });
    setProfile({ firstName: "", lastName: "", email: "" });
    setTab("free");
  }

  function openCreateForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }

  function openEditForm(p) {
    setForm({
      category: "free",
      league: p.league || "",
      homeTeam: p.homeTeam || "",
      awayTeam: p.awayTeam || "",
      tip: p.tip || "",
      odds: p.odds || "",
      confidence: p.confidence || 2,
      matchDate: p.matchDate || "",
      homeScore: p.homeScore ?? "",
      awayScore: p.awayScore ?? "",
      result: p.result || "pending",
    });
    setEditingId(p.id);
    setShowForm(true);
  }

  async function handleSavePrediction(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (!form.homeTeam || !form.awayTeam || !form.tip || !form.odds || !form.matchDate) return;
    const payload = predictionToDb(form);
    if (editingId) {
      await sbFetch(`/rest/v1/predictions?id=eq.${editingId}`, {
        method: "PATCH",
        headers: { ...authHeaders, Prefer: "return=minimal" },
        body: JSON.stringify(payload),
      });
    } else {
      await sbFetch("/rest/v1/predictions", {
        method: "POST",
        headers: { ...authHeaders, Prefer: "return=minimal" },
        body: JSON.stringify(payload),
      });
    }
    await reloadPredictions();
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  }

  async function handleDelete(id) {
    await sbFetch(`/rest/v1/predictions?id=eq.${id}`, { method: "DELETE", headers: authHeaders });
    setPredictions((prev) => prev.filter((p) => p.id !== id));
  }

  function openCreateCombo() {
    setComboForm({ ...emptyComboForm, date: toDateKey(selectedDate), matches: [matchRowEmpty()] });
    setEditingComboId(null);
    setShowComboForm(true);
  }

  function openEditCombo(c) {
    setComboForm({
      title: c.title || "",
      date: c.date || "",
      totalOdds: c.totalOdds || "",
      status: c.status || "pending",
      matches: c.matches && c.matches.length ? c.matches.map((m) => ({ ...m })) : [matchRowEmpty()],
    });
    setEditingComboId(c.id);
    setShowComboForm(true);
  }

  function addMatchRow() {
    setComboForm({ ...comboForm, matches: [...comboForm.matches, matchRowEmpty()] });
  }
  function removeMatchRow(id) {
    if (comboForm.matches.length <= 1) return;
    setComboForm({ ...comboForm, matches: comboForm.matches.filter((m) => m.id !== id) });
  }
  function updateMatchField(id, field, value) {
    setComboForm({
      ...comboForm,
      matches: comboForm.matches.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    });
  }

  async function handleSaveCombo(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (!comboForm.title || !comboForm.date || !comboForm.totalOdds) return;
    const payload = {
      title: comboForm.title,
      date: comboForm.date,
      total_odds: comboForm.totalOdds,
      status: comboForm.status,
    };

    let comboId = editingComboId;
    if (editingComboId) {
      await sbFetch(`/rest/v1/combos?id=eq.${editingComboId}`, {
        method: "PATCH",
        headers: { ...authHeaders, Prefer: "return=minimal" },
        body: JSON.stringify(payload),
      });
      await sbFetch(`/rest/v1/combo_matches?combo_id=eq.${editingComboId}`, {
        method: "DELETE",
        headers: authHeaders,
      });
    } else {
      const res = await sbFetch("/rest/v1/combos", {
        method: "POST",
        headers: { ...authHeaders, Prefer: "return=representation" },
        body: JSON.stringify(payload),
      });
      if (!res.ok || !res.data || !res.data[0]) {
        setShowComboForm(false);
        return;
      }
      comboId = res.data[0].id;
    }

    const matchRows = comboForm.matches
      .filter((m) => m.homeTeam || m.awayTeam)
      .map((m, idx) => ({
        combo_id: comboId,
        league: m.league,
        match_time: m.time,
        home_team: m.homeTeam,
        away_team: m.awayTeam,
        tip: m.tip,
        odds: m.odds,
        home_score: m.homeScore === "" ? null : m.homeScore,
        away_score: m.awayScore === "" ? null : m.awayScore,
        position: idx,
      }));
    if (matchRows.length > 0) {
      await sbFetch("/rest/v1/combo_matches", {
        method: "POST",
        headers: { ...authHeaders, Prefer: "return=minimal" },
        body: JSON.stringify(matchRows),
      });
    }

    await reloadCombos();
    setComboForm(emptyComboForm);
    setEditingComboId(null);
    setShowComboForm(false);
  }

  async function handleDeleteCombo(id) {
    await sbFetch(`/rest/v1/combos?id=eq.${id}`, { method: "DELETE", headers: authHeaders });
    setCombos((prev) => prev.filter((c) => c.id !== id));
  }

  async function startCheckout(plan) {
    if (!authSession) return;
    setPaymentError("");
    setPaymentBusy(plan);
    try {
      const res = await withTimeout(
        fetch(`${PAYMENTS_WORKER_URL}/create-payment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            plan,
            userId: authSession.user.id,
            email: authSession.user.email,
          }),
        })
      );
      const data = await res.json();
      if (!res.ok || !data.authorization_url) {
        setPaymentError(
          lang === "en"
            ? "Could not start payment. Please try again."
            : "Impossible de démarrer le paiement. Réessayez."
        );
        setPaymentBusy(null);
        return;
      }
      window.open(data.authorization_url, "_blank");
    } catch {
      setPaymentError(
        lang === "en" ? "Network error. Please try again." : "Erreur réseau. Réessayez."
      );
    }
    setPaymentBusy(null);
  }

  const isAdmin = !!authSession && ADMIN_EMAILS.includes((authSession.user.email || "").toLowerCase());

  const dayKey = toDateKey(selectedDate);
  const todayKey = toDateKey(new Date());
  const freeList = predictions
    .filter((p) => toDateKey(p.matchDate) === dayKey)
    .sort((a, b) => new Date(a.matchDate) - new Date(b.matchDate));
  const comboList = combos.filter((c) => c.date === dayKey);

  const fullName = `${profile.firstName || ""} ${profile.lastName || ""}`.trim();
  const userEmail = authSession ? authSession.user.email : "";

  return (
    <div className="app-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');

        :root{
          --bg: #EEF1F5;
          --surface: #FFFFFF;
          --surface-2: #F4F6F9;
          --line: #E4E8EE;
          --blue: #2F80ED;
          --blue-dark: #1C63C9;
          --gold: #F5A623;
          --gold-dim: #FCE3B0;
          --green: #27AE60;
          --red: #E5533D;
          --text: #171A1F;
          --text-muted: #838B96;
          --danger: #E5533D;
        }
        * { box-sizing: border-box; }
        button { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
        .app-root {
          background: var(--bg);
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
          background: var(--surface);
          border-radius: 28px;
          border: 1px solid var(--line);
          box-shadow: 0 30px 60px -20px rgba(20,30,50,0.25);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          min-height: 720px;
        }
        .lang-bar { display: flex; justify-content: flex-end; padding: 8px 14px; background: var(--surface-2); border-bottom: 1px solid var(--line); }
        .lang-toggle { display: flex; align-items: center; gap: 5px; background: var(--surface); border: 1px solid var(--line); color: var(--text); font-size: 11px; font-weight: 700; padding: 5px 10px; border-radius: 999px; cursor: pointer; }
        .topbar {
          padding: 20px 20px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--surface);
        }
        .brand {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800;
          font-size: 24px;
          letter-spacing: 0.5px;
          color: var(--text);
        }
        .subscribe-pill, .vip-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
          padding: 8px 14px;
          border-radius: 999px;
          border: none;
          cursor: pointer;
        }
        .subscribe-pill { background: linear-gradient(180deg, #FBC15E, var(--gold)); color: #2B1B02; }
        .vip-pill { background: var(--surface-2); color: var(--gold); border: 1px solid var(--gold-dim); }
        .content { flex: 1; overflow-y: auto; padding: 4px 16px 90px; background: var(--bg); }
        .section-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: 22px;
          margin: 16px 0 4px;
          color: var(--text);
        }
        .section-sub { font-size: 13px; color: var(--text-muted); margin-bottom: 14px; line-height: 1.5; }

        .date-nav { background: var(--surface); border-radius: 16px; padding: 14px; margin: 14px 0; box-shadow: 0 2px 10px rgba(20,30,50,0.05); }
        .date-nav-label { text-align: center; font-weight: 700; font-size: 14px; letter-spacing: 0.5px; margin-bottom: 12px; }
        .date-nav-row { display: flex; align-items: center; justify-content: space-between; gap: 6px; }
        .date-arrow { background: none; border: none; color: var(--blue); cursor: pointer; padding: 6px; }
        .date-chip {
          flex: 1;
          background: var(--surface-2);
          border: none;
          border-radius: 12px;
          padding: 10px 4px;
          text-align: center;
          cursor: pointer;
          color: var(--text);
        }
        .date-chip.active { background: var(--blue); color: #fff; }
        .date-chip-num { display: block; font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-size: 18px; }
        .date-chip-dow { display: block; font-size: 10px; opacity: 0.75; margin-top: 2px; }

        .pcard {
          position: relative;
          background: var(--surface);
          border-radius: 16px;
          padding: 14px 16px 12px;
          margin-bottom: 12px;
          box-shadow: 0 2px 10px rgba(20,30,50,0.06);
        }
        .pcard-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
        .tag { font-size: 10px; font-weight: 800; letter-spacing: 0.6px; padding: 4px 10px; border-radius: 999px; }
        .tag-free { background: var(--surface-2); color: var(--text-muted); }
        .odds-chip { font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-size: 15px; color: var(--blue); }
        .pcard-league { font-size: 11px; color: var(--text-muted); margin-bottom: 10px; }
        .pcard-teams { display: flex; align-items: center; gap: 10px; }
        .pcard-teams-col { flex: 1; }
        .team-row { display: flex; align-items: center; justify-content: space-between; padding: 3px 0; }
        .team-name { font-weight: 700; font-size: 15px; }
        .team-score { font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-size: 16px; }
        .kickoff { font-size: 12px; color: var(--text-muted); }
        .result-icon { width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .result-icon.won { background: rgba(39,174,96,0.15); color: var(--green); }
        .result-icon.lost { background: rgba(229,83,61,0.15); color: var(--red); }
        .pcard-tip { margin-top: 10px; font-size: 13px; color: var(--text-muted); border-top: 1px solid var(--line); padding-top: 8px; }
        .pcard-admin { position: absolute; top: 10px; right: 10px; display: flex; gap: 6px; z-index: 2; }
        .icon-btn { background: var(--surface-2); border: none; color: var(--text-muted); border-radius: 8px; padding: 5px; cursor: pointer; }
        .icon-btn.danger { color: var(--danger); }

        .combo-card {
          position: relative;
          background: var(--surface);
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 14px;
          box-shadow: 0 2px 10px rgba(20,30,50,0.06);
        }
        .combo-tag { display: inline-block; background: var(--gold); color: #2B1B02; font-size: 11px; font-weight: 800; padding: 5px 12px; border-radius: 8px; margin-bottom: 10px; }
        .combo-title { font-weight: 800; font-size: 15px; line-height: 1.35; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid var(--line); }
        .combo-locked { text-align: center; padding: 20px 14px; border: 1px solid var(--line); border-radius: 12px; color: var(--text-muted); margin-bottom: 12px; }
        .combo-locked svg { margin-bottom: 10px; }
        .combo-locked p { font-size: 13px; line-height: 1.5; margin: 0; }
        .combo-matches { margin-bottom: 4px; }
        .combo-match { border: 1px solid var(--line); border-radius: 12px; padding: 10px 12px; margin-bottom: 10px; }
        .combo-match-top { display: flex; justify-content: space-between; font-size: 11px; color: var(--text-muted); margin-bottom: 4px; }
        .combo-match-teams { font-weight: 700; font-size: 14px; margin-bottom: 6px; }
        .combo-match-tip-row { display: flex; justify-content: space-between; align-items: center; }
        .combo-match-tip { font-size: 13px; color: var(--text); }
        .combo-match-odds { font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-size: 14px; }
        .combo-match-result { font-size: 12px; color: var(--text-muted); margin-top: 4px; }
        .combo-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 10px; border-top: 1px solid var(--line); margin-top: 4px; }
        .combo-total { font-size: 13px; }
        .combo-status { display: flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 800; }
        .combo-status.won { color: var(--green); }
        .combo-status.lost { color: var(--red); }
        .combo-status.pending { color: var(--text-muted); }

        .empty-state { text-align: center; padding: 50px 20px; color: var(--text-muted); font-size: 14px; }

        .lock-panel {
          background: var(--surface);
          border: 1px solid var(--gold-dim);
          border-radius: 18px;
          padding: 32px 20px;
          text-align: center;
          margin-top: 20px;
          box-shadow: 0 2px 10px rgba(20,30,50,0.06);
        }
        .lock-icon { width: 52px; height: 52px; border-radius: 50%; background: var(--surface-2); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: var(--gold); }
        .lock-title { font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 20px; margin-bottom: 6px; }
        .lock-text { font-size: 13px; color: var(--text-muted); margin-bottom: 20px; line-height: 1.5; }
        .btn-gold {
          background: linear-gradient(180deg, #FBC15E, var(--gold));
          color: #2B1B02;
          border: none;
          font-weight: 700;
          font-size: 14px;
          padding: 12px 22px;
          border-radius: 12px;
          cursor: pointer;
          width: 100%;
          touch-action: manipulation;
        }
        .btn-gold:active { filter: brightness(0.94); transform: scale(0.98); }
        .btn-gold:disabled { opacity: 0.7; }
        .vip-status-banner {
          background: var(--surface-2);
          border: 1px solid var(--gold-dim);
          border-radius: 14px;
          padding: 12px 16px;
          margin: 14px 0;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
        }

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
        .region-pill.active { border-color: var(--blue); color: var(--blue); background: rgba(47,128,237,0.08); }
        .region-hint { font-size: 11px; color: var(--text-muted); }
        .plan-card {
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: 16px;
          padding: 18px;
          margin-bottom: 14px;
          box-shadow: 0 2px 10px rgba(20,30,50,0.05);
        }
        .plan-head { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px; }
        .plan-name { font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 18px; }
        .plan-price { font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-size: 20px; color: var(--blue); }
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
        .pay-method.active { border-color: var(--blue); color: var(--blue); background: rgba(47,128,237,0.08); }
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

        .field { margin-bottom: 14px; }
        .field label { display: block; font-size: 12px; color: var(--text-muted); margin-bottom: 6px; }
        .field input, .field select, .field textarea {
          width: 100%;
          background: var(--surface-2);
          border: 1px solid var(--line);
          border-radius: 10px;
          padding: 10px 12px;
          color: var(--text);
          font-size: 14px;
          font-family: 'Inter', sans-serif;
        }
        .field input:focus, .field select:focus, .field textarea:focus { outline: 2px solid var(--blue); outline-offset: 1px; }
        .field-row { display: flex; gap: 10px; }
        .field-row .field { flex: 1; }
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
          margin-bottom: 10px;
        }

        .settings-header { display: flex; align-items: center; justify-content: space-between; margin: 16px 0 14px; }
        .settings-header-icon { width: 34px; height: 34px; border-radius: 50%; background: var(--surface-2); display: flex; align-items: center; justify-content: center; font-size: 16px; }
        .profile-card { background: var(--surface); border-radius: 16px; padding: 16px; display: flex; align-items: center; gap: 14px; box-shadow: 0 2px 10px rgba(20,30,50,0.06); margin-bottom: 18px; }
        .profile-avatar { width: 52px; height: 52px; border-radius: 50%; background: var(--surface-2); display: flex; align-items: center; justify-content: center; color: var(--blue); flex-shrink: 0; }
        .profile-name { font-weight: 700; font-size: 16px; }
        .profile-email { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
        .vip-badge { display: inline-flex; align-items: center; gap: 4px; background: var(--gold-dim); color: #8A5A05; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 999px; margin-top: 6px; }
        .settings-group { margin-bottom: 18px; }
        .settings-group-label { font-size: 11px; letter-spacing: 0.8px; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px; padding-left: 2px; }
        .settings-row { display: flex; align-items: center; justify-content: space-between; padding: 13px 14px; background: var(--surface); border-radius: 12px; font-size: 14px; margin-bottom: 8px; box-shadow: 0 1px 6px rgba(20,30,50,0.05); }
        .settings-row-left { display: flex; align-items: center; gap: 10px; }
        .settings-row-icon { width: 30px; height: 30px; border-radius: 8px; background: var(--surface-2); display: flex; align-items: center; justify-content: center; color: var(--text-muted); }
        .chev { color: var(--text-muted); }
        .admin-box { background: var(--surface); border: 1px solid var(--line); border-radius: 14px; padding: 16px; margin-top: 12px; }
        .admin-title { font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 16px; margin-bottom: 10px; }
        .save-toast { font-size: 12px; color: var(--green); margin-top: 6px; }

        .match-editor { border: 1px solid var(--line); border-radius: 12px; padding: 12px; margin-bottom: 12px; background: var(--surface-2); }
        .match-editor-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 12px; font-weight: 700; color: var(--text-muted); }
        .match-editor-head button { background: none; border: none; color: var(--danger); cursor: pointer; }

        .bottom-nav {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          background: rgba(255,255,255,0.95);
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
        .nav-btn.active { color: var(--blue); }
        .phone-shell { position: relative; flex: 1; display: flex; flex-direction: column; }

        .modal-overlay { position: absolute; inset: 0; background: rgba(20,25,35,0.5); display: flex; align-items: flex-end; z-index: 20; }
        .modal-sheet { background: var(--surface); width: 100%; border-radius: 20px 20px 0 0; padding: 20px; max-height: 85%; overflow-y: auto; }
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
          color: #2B1B02;
          border: none;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 10px 20px -6px rgba(245,166,35,0.5);
          cursor: pointer;
          z-index: 15;
        }
        .loading-state { text-align: center; padding: 60px 20px; color: var(--text-muted); }
        .storage-banner {
          background: rgba(229, 83, 61, 0.1);
          border-bottom: 1px solid var(--danger);
          color: #B23A28;
          font-size: 11px;
          padding: 8px 16px;
          line-height: 1.4;
        }

        .auth-wrap { padding: 40px 24px 24px; flex: 1; display: flex; flex-direction: column; justify-content: center; background: var(--surface); overflow-y: auto; }
        .auth-logo {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800;
          font-size: 24px;
          text-align: center;
          margin-bottom: 24px;
        }
        .auth-title { font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 22px; text-align: center; margin-bottom: 6px; }
        .auth-sub { font-size: 13px; color: var(--text-muted); text-align: center; margin-bottom: 20px; line-height: 1.5; }
        .auth-error { color: var(--danger); font-size: 12px; margin: -6px 0 12px; }
        .auth-switch { text-align: center; font-size: 13px; color: var(--text-muted); margin-top: 16px; }
        .auth-switch span { color: var(--blue); font-weight: 600; cursor: pointer; }
      `}</style>

      <div className="phone">
        <div className="lang-bar">
          <button className="lang-toggle" onClick={toggleLang}>
            <Globe size={13} /> {lang === "fr" ? "FR → EN" : "EN → FR"}
          </button>
        </div>
        <div className="phone-shell">
          {loading ? (
            <div className="loading-state">{t("loading")}</div>
          ) : !authSession ? (
            <AuthGate
              screen={authScreen}
              setScreen={setAuthScreen}
              form={authForm}
              setForm={setAuthForm}
              error={authError}
              busy={authBusy}
              onSignup={handleSignup}
              onLogin={handleLogin}
              t={t}
            />
          ) : (
            <>
              <div className="topbar">
                <div className="brand">{t("appName")}</div>
                {vip.active ? (
                  <span className="vip-pill">
                    <Crown size={14} /> {t("vipActiveShort")}
                  </span>
                ) : (
                  <button className="subscribe-pill" onClick={() => setTab("subscribe")}>
                    <Crown size={14} /> {t("subscribe")}
                  </button>
                )}
              </div>

              {!storageOk && <div className="storage-banner">{t("storageWarning")}</div>}

              <div className="content">
                <>
                  {tab === "free" && (
                    <>
                      <DateNav selectedDate={selectedDate} onChange={setSelectedDate} lang={lang} />
                      {freeList.length === 0 ? (
                        <div className="empty-state">{t("freeEmpty")}</div>
                      ) : (
                        freeList.map((p) => (
                          <MiniCard
                            key={p.id}
                            p={p}
                            isAdmin={isAdmin}
                            onEdit={openEditForm}
                            onDelete={handleDelete}
                            t={t}
                          />
                        ))
                      )}
                    </>
                  )}

                  {tab === "vip" && (
                    <>
                      <DateNav selectedDate={selectedDate} onChange={setSelectedDate} lang={lang} />
                      {vip.active && (
                        <div className="vip-status-banner">
                          <Crown size={18} color="#F5A623" />
                          <div>
                            {t("vipActiveShort")} · {vip.plan === "weekly" ? t("weekly") : t("monthly")}
                            <br />
                            <span style={{ color: "var(--text-muted)" }}>{timeRemaining(vip.expiresAt, lang)}</span>
                          </div>
                        </div>
                      )}
                      {comboList.length === 0 ? (
                        <div className="empty-state">{t("vipEmpty")}</div>
                      ) : (
                        comboList.map((c) => (
                          <ComboCard
                            key={c.id}
                            combo={c}
                            unlocked={vip.active || isAdmin || c.date < todayKey}
                            isAdmin={isAdmin}
                            onEdit={openEditCombo}
                            onDelete={handleDeleteCombo}
                            t={t}
                          />
                        ))
                      )}
                      {!vip.active && (
                        <div className="lock-panel">
                          <div className="lock-icon">
                            <Lock size={22} />
                          </div>
                          <div className="lock-title">{t("lockPanelTitle")}</div>
                          <div className="lock-text">{t("lockPanelText")}</div>
                          <button className="btn-gold" onClick={() => setTab("subscribe")}>
                            {t("becomeVip")}
                          </button>
                        </div>
                      )}
                    </>
                  )}

                  {tab === "subscribe" && (
                    <>
                      <div className="section-title">{t("subscribeTitle")}</div>
                      <div className="section-sub">
                        {region === "europe" ? t("subscribeSubEurope") : t("subscribeSubAfrica")}
                      </div>

                      <div className="region-toggle">
                        <span className="region-label">{t("regionLabel")}</span>
                        <div className="region-pills">
                          <button
                            className={`region-pill ${region === "afrique" ? "active" : ""}`}
                            onClick={() => persistRegion("afrique")}
                          >
                            {t("regionAfrica")}
                          </button>
                          <button
                            className={`region-pill ${region === "europe" ? "active" : ""}`}
                            onClick={() => persistRegion("europe")}
                          >
                            {t("regionEurope")}
                          </button>
                        </div>
                        <span className="region-hint">{t("regionHint")}</span>
                      </div>

                      <div className="plan-card">
                        <div className="plan-head">
                          <span className="plan-name">{t("weekly")}</span>
                          <span className="plan-price">
                            {PRICING[region].weekly.display}
                            <small> {PRICING[region].weekly.suffix}</small>
                          </span>
                        </div>
                        <div className="plan-note">{t("weeklyNote")}</div>
                        <button
                          className="btn-gold"
                          disabled={paymentBusy === "weekly"}
                          onClick={() => startCheckout("weekly")}
                        >
                          {paymentBusy === "weekly" ? t("oneMoment") : t("chooseWeekly")}
                        </button>
                      </div>

                      <div className="plan-card">
                        <div className="plan-head">
                          <span className="plan-name">{t("monthly")}</span>
                          <span className="plan-price">
                            {PRICING[region].monthly.display}
                            <small> {PRICING[region].monthly.suffix}</small>
                          </span>
                        </div>
                        <div className="plan-note">{t("monthlyNote")}</div>
                        <button
                          className="btn-gold"
                          disabled={paymentBusy === "monthly"}
                          onClick={() => startCheckout("monthly")}
                        >
                          {paymentBusy === "monthly" ? t("oneMoment") : t("chooseMonthly")}
                        </button>
                      </div>

                      {paymentError && <div className="auth-error">{paymentError}</div>}

                      <div className="demo-note">{t("demoNote")}</div>
                    </>
                  )}

                  {tab === "settings" && (
                    <>
                      <div className="settings-header">
                        <div className="section-title" style={{ margin: 0 }}>
                          {t("settingsTitle")}
                        </div>
                        <div className="settings-header-icon">⚽</div>
                      </div>

                      <div className="profile-card">
                        <div className="profile-avatar">
                          <User size={26} />
                        </div>
                        <div>
                          <div className="profile-name">{fullName || t("name")}</div>
                          <div className="profile-email">{userEmail}</div>
                          {vip.active && (
                            <span className="vip-badge">
                              <Crown size={11} /> {t("vipMember")}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="settings-group">
                        <div className="settings-group-label">{t("account")}</div>
                        <div
                          className="settings-row"
                          onClick={() => setShowProfileEdit(true)}
                          style={{ cursor: "pointer" }}
                        >
                          <span className="settings-row-left">
                            <span className="settings-row-icon">
                              <User size={15} />
                            </span>
                            {t("editProfile")}
                          </span>
                          <span className="chev">›</span>
                        </div>
                      </div>

                      <div className="settings-group">
                        <div className="settings-group-label">{t("legal")}</div>
                        <div className="settings-row" onClick={() => setShowPolicy(true)} style={{ cursor: "pointer" }}>
                          <span className="settings-row-left">
                            <span className="settings-row-icon">
                              <ShieldCheck size={15} />
                            </span>
                            {t("privacyPolicy")}
                          </span>
                          <span className="chev">›</span>
                        </div>
                      </div>

                      <div className="settings-group">
                        <div className="settings-group-label">{t("support")}</div>
                        <div
                          className="settings-row"
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            (window.location.href = "mailto:contact@pronoapp.exemple?subject=Contact%20PronoApp")
                          }
                        >
                          <span className="settings-row-left">
                            <span className="settings-row-icon">
                              <Mail size={15} />
                            </span>
                            {t("contactSupport")}
                          </span>
                          <span className="chev">›</span>
                        </div>
                      </div>

                      <button className="btn-secondary" onClick={handleLogout}>
                        <LogOut size={15} /> {t("logout")}
                      </button>

                      {isAdmin && (
                        <div className="admin-box">
                          <div className="admin-title">{t("adminTitle")}</div>
                          <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 10 }}>
                            {t("adminConnected")} ({userEmail}).
                          </div>
                          <button className="btn-secondary" onClick={openCreateForm}>
                            <Plus size={15} /> {t("addFreePrediction")}
                          </button>
                          <button className="btn-secondary" onClick={openCreateCombo}>
                            <Plus size={15} /> {t("addCombo")}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </>
              </div>

              {isAdmin && tab === "free" && (
                <button className="fab" onClick={openCreateForm} aria-label="add">
                  <Plus size={22} />
                </button>
              )}
              {isAdmin && tab === "vip" && (
                <button className="fab" onClick={openCreateCombo} aria-label="add">
                  <Plus size={22} />
                </button>
              )}

              <div className="bottom-nav">
                <button className={`nav-btn ${tab === "free" ? "active" : ""}`} onClick={() => setTab("free")}>
                  <Gift size={18} />
                  {t("navFree")}
                </button>
                <button className={`nav-btn ${tab === "vip" ? "active" : ""}`} onClick={() => setTab("vip")}>
                  <Crown size={18} />
                  {t("navVip")}
                </button>
                <button
                  className={`nav-btn ${tab === "subscribe" ? "active" : ""}`}
                  onClick={() => setTab("subscribe")}
                >
                  <CreditCard size={18} />
                  {t("navSubscribe")}
                </button>
                <button
                  className={`nav-btn ${tab === "settings" ? "active" : ""}`}
                  onClick={() => setTab("settings")}
                >
                  <GearIcon size={18} />
                  {t("navSettings")}
                </button>
              </div>

              {showPolicy && (
                <div className="modal-overlay" onClick={() => setShowPolicy(false)}>
                  <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-head">
                      <h3>{t("privacyPolicy")}</h3>
                      <button className="modal-close" onClick={() => setShowPolicy(false)}>
                        <X size={16} />
                      </button>
                    </div>
                    <div className="policy-text">{t("policyBody")}</div>
                  </div>
                </div>
              )}

              {showProfileEdit && (
                <div className="modal-overlay" onClick={() => setShowProfileEdit(false)}>
                  <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-head">
                      <h3>{t("editProfile")}</h3>
                      <button className="modal-close" onClick={() => setShowProfileEdit(false)}>
                        <X size={16} />
                      </button>
                    </div>
                    <div className="field-row">
                      <div className="field">
                        <label>{t("firstName")}</label>
                        <input
                          value={profile.firstName}
                          onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                          placeholder="Jean"
                        />
                      </div>
                      <div className="field">
                        <label>{t("lastName")}</label>
                        <input
                          value={profile.lastName}
                          onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                          placeholder="Dupont"
                        />
                      </div>
                    </div>
                    <div className="field">
                      <label>{t("accountEmail")}</label>
                      <input value={userEmail} disabled />
                    </div>
                    <button
                      className="btn-gold"
                      type="button"
                      onClick={() => {
                        persistProfile(profile);
                        setShowProfileEdit(false);
                      }}
                    >
                      {t("save")}
                    </button>
                    {saveState === "saved" && <div className="save-toast">{t("savedToast")}</div>}
                  </div>
                </div>
              )}

              {showForm && (
                <div
                  className="modal-overlay"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                >
                  <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-head">
                      <h3>{editingId ? t("editPrediction") : t("newPrediction")}</h3>
                      <button
                        className="modal-close"
                        onClick={() => {
                          setShowForm(false);
                          setEditingId(null);
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <form onSubmit={handleSavePrediction}>
                      <div className="field">
                        <label>{t("league")}</label>
                        <input
                          value={form.league}
                          onChange={(e) => setForm({ ...form, league: e.target.value })}
                          placeholder="Ex : Ligue 1"
                        />
                      </div>
                      <div className="field">
                        <label>{t("homeTeam")}</label>
                        <input
                          value={form.homeTeam}
                          onChange={(e) => setForm({ ...form, homeTeam: e.target.value })}
                          placeholder="Ex : PSG"
                        />
                      </div>
                      <div className="field">
                        <label>{t("awayTeam")}</label>
                        <input
                          value={form.awayTeam}
                          onChange={(e) => setForm({ ...form, awayTeam: e.target.value })}
                          placeholder="Ex : Marseille"
                        />
                      </div>
                      <div className="field">
                        <label>{t("tip")}</label>
                        <input
                          value={form.tip}
                          onChange={(e) => setForm({ ...form, tip: e.target.value })}
                          placeholder="Ex : Victoire domicile"
                        />
                      </div>
                      <div className="field">
                        <label>{t("odds")}</label>
                        <input
                          value={form.odds}
                          onChange={(e) => setForm({ ...form, odds: e.target.value })}
                          placeholder="Ex : 1.85"
                        />
                      </div>
                      <div className="field">
                        <label>{t("matchDateTime")}</label>
                        <input
                          type="datetime-local"
                          value={form.matchDate}
                          onChange={(e) => setForm({ ...form, matchDate: e.target.value })}
                        />
                      </div>
                      <div className="field-row">
                        <div className="field">
                          <label>{t("homeScore")}</label>
                          <input
                            value={form.homeScore}
                            onChange={(e) => setForm({ ...form, homeScore: e.target.value })}
                            placeholder="Ex : 2"
                          />
                        </div>
                        <div className="field">
                          <label>{t("awayScore")}</label>
                          <input
                            value={form.awayScore}
                            onChange={(e) => setForm({ ...form, awayScore: e.target.value })}
                            placeholder="Ex : 0"
                          />
                        </div>
                      </div>
                      <div className="field">
                        <label>{t("resultAfterMatch")}</label>
                        <select value={form.result} onChange={(e) => setForm({ ...form, result: e.target.value })}>
                          <option value="pending">{t("pending")}</option>
                          <option value="won">{t("won")}</option>
                          <option value="lost">{t("lost")}</option>
                        </select>
                      </div>
                      <button className="btn-gold" type="button" onClick={() => handleSavePrediction()}>
                        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                          <CheckCircle2 size={16} /> {editingId ? t("save") : t("publish")}
                        </span>
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {showComboForm && (
                <div
                  className="modal-overlay"
                  onClick={() => {
                    setShowComboForm(false);
                    setEditingComboId(null);
                  }}
                >
                  <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-head">
                      <h3>{editingComboId ? t("editCombo") : t("newCombo")}</h3>
                      <button
                        className="modal-close"
                        onClick={() => {
                          setShowComboForm(false);
                          setEditingComboId(null);
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <form onSubmit={handleSaveCombo}>
                      <div className="field">
                        <label>{t("comboTitle")}</label>
                        <input
                          value={comboForm.title}
                          onChange={(e) => setComboForm({ ...comboForm, title: e.target.value })}
                          placeholder="Ex : COMBINÉ DU JOUR - COTE ÉLEVÉE"
                        />
                      </div>
                      <div className="field">
                        <label>{t("date")}</label>
                        <input
                          type="date"
                          value={comboForm.date}
                          onChange={(e) => setComboForm({ ...comboForm, date: e.target.value })}
                        />
                      </div>
                      <div className="field-row">
                        <div className="field">
                          <label>{t("totalOdds")}</label>
                          <input
                            value={comboForm.totalOdds}
                            onChange={(e) => setComboForm({ ...comboForm, totalOdds: e.target.value })}
                            placeholder="Ex : 12,50"
                          />
                        </div>
                        <div className="field">
                          <label>{t("status")}</label>
                          <select
                            value={comboForm.status}
                            onChange={(e) => setComboForm({ ...comboForm, status: e.target.value })}
                          >
                            <option value="pending">{t("pending")}</option>
                            <option value="won">{t("won")}</option>
                            <option value="lost">{t("lost")}</option>
                          </select>
                        </div>
                      </div>

                      <label style={{ display: "block", fontSize: 12, color: "var(--text-muted)", margin: "16px 0 10px" }}>
                        {t("matchesOfCombo")} ({comboForm.matches.length})
                      </label>

                      {comboForm.matches.map((m, idx) => (
                        <div className="match-editor" key={m.id}>
                          <div className="match-editor-head">
                            <span>
                              {t("match")} {idx + 1}
                            </span>
                            <button type="button" onClick={() => removeMatchRow(m.id)} aria-label="remove">
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <div className="field-row">
                            <div className="field">
                              <label>{t("competition")}</label>
                              <input
                                value={m.league}
                                onChange={(e) => updateMatchField(m.id, "league", e.target.value)}
                                placeholder="Ex : Sweden - Allsvenskan"
                              />
                            </div>
                            <div className="field">
                              <label>{t("time")}</label>
                              <input
                                value={m.time}
                                onChange={(e) => updateMatchField(m.id, "time", e.target.value)}
                                placeholder="Ex : 14:00"
                              />
                            </div>
                          </div>
                          <div className="field-row">
                            <div className="field">
                              <label>{t("team1")}</label>
                              <input
                                value={m.homeTeam}
                                onChange={(e) => updateMatchField(m.id, "homeTeam", e.target.value)}
                                placeholder="Ex : AIK Stockholm"
                              />
                            </div>
                            <div className="field">
                              <label>{t("team2")}</label>
                              <input
                                value={m.awayTeam}
                                onChange={(e) => updateMatchField(m.id, "awayTeam", e.target.value)}
                                placeholder="Ex : Gais"
                              />
                            </div>
                          </div>
                          <div className="field-row">
                            <div className="field">
                              <label>{t("tip")}</label>
                              <input
                                value={m.tip}
                                onChange={(e) => updateMatchField(m.id, "tip", e.target.value)}
                                placeholder="Ex : Victoire domicile"
                              />
                            </div>
                            <div className="field">
                              <label>{t("odds")}</label>
                              <input
                                value={m.odds}
                                onChange={(e) => updateMatchField(m.id, "odds", e.target.value)}
                                placeholder="Ex : 1,85"
                              />
                            </div>
                          </div>
                          <div className="field-row">
                            <div className="field">
                              <label>{t("homeScoreAfter")}</label>
                              <input
                                value={m.homeScore}
                                onChange={(e) => updateMatchField(m.id, "homeScore", e.target.value)}
                                placeholder="Ex : 2"
                              />
                            </div>
                            <div className="field">
                              <label>{t("awayScoreAfter")}</label>
                              <input
                                value={m.awayScore}
                                onChange={(e) => updateMatchField(m.id, "awayScore", e.target.value)}
                                placeholder="Ex : 0"
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                      <button type="button" className="btn-secondary" onClick={addMatchRow}>
                        <Plus size={15} /> {t("addMatch")}
                      </button>

                      <button className="btn-gold" type="button" onClick={() => handleSaveCombo()} style={{ marginTop: 6 }}>
                        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                          <CheckCircle2 size={16} /> {editingComboId ? t("save") : t("publishCombo")}
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
