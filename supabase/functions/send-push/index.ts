// Edge Function : envoi des notifications push de PronoApp.
// mode "daily"        -> appelé par l'admin (JWT) : "Les pronos du jour sont en ligne"
// mode "vip_reminder" -> appelé par la tâche planifiée (en-tête x-cron-secret) : VIP qui expire dans 24 h
import webpush from "npm:web-push@3.6.7";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const VAPID_PUBLIC = Deno.env.get("VAPID_PUBLIC_KEY")!;
const VAPID_PRIVATE = Deno.env.get("VAPID_PRIVATE_KEY")!;
const CRON_SECRET = Deno.env.get("CRON_SECRET") ?? "";
const ADMIN_EMAILS = ["tchieukomarcial@gmail.com"];

webpush.setVapidDetails("mailto:pronoapp.contacts@gmail.com", VAPID_PUBLIC, VAPID_PRIVATE);

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

const rest = (path: string, init: RequestInit = {}) =>
  fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });

async function isAdmin(authHeader: string | null): Promise<boolean> {
  if (!authHeader) return false;
  const r = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: SERVICE_KEY, Authorization: authHeader },
  });
  if (!r.ok) return false;
  const u = await r.json();
  return ADMIN_EMAILS.includes(String(u.email || "").toLowerCase());
}

async function sendAll(subs: any[], payload: Record<string, unknown>) {
  let sent = 0;
  const dead: string[] = [];
  await Promise.all(
    subs.map(async (s) => {
      try {
        await webpush.sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          JSON.stringify(payload),
        );
        sent++;
      } catch (e: any) {
        if (e?.statusCode === 404 || e?.statusCode === 410) dead.push(s.endpoint);
      }
    }),
  );
  for (const ep of dead) {
    await rest(`push_subscriptions?endpoint=eq.${encodeURIComponent(ep)}`, { method: "DELETE" });
  }
  return sent;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let body: any = {};
  try {
    body = await req.json();
  } catch (_) {}
  const mode = body.mode;

  if (mode === "daily") {
    if (!(await isAdmin(req.headers.get("Authorization")))) return json({ error: "Non autorisé" }, 403);
    const subs = await (await rest("push_subscriptions?select=endpoint,p256dh,auth")).json();
    const sent = await sendAll(subs, {
      title: "PronoApp ⚽",
      body: "Les pronos du jour sont en ligne !",
      tag: "daily",
      url: "/",
    });
    return json({ ok: true, sent, total: subs.length });
  }

  if (mode === "vip_reminder") {
    if (!CRON_SECRET || req.headers.get("x-cron-secret") !== CRON_SECRET) return json({ error: "Non autorisé" }, 403);
    const now = new Date();
    const in24h = new Date(now.getTime() + 24 * 3600 * 1000);
    const profiles = await (
      await rest(
        `profiles?select=id&vip_active=eq.true&vip_expires_at=gt.${now.toISOString()}&vip_expires_at=lte.${in24h.toISOString()}`,
      )
    ).json();
    if (!Array.isArray(profiles) || profiles.length === 0) return json({ ok: true, sent: 0, users: 0 });
    const ids = profiles.map((p: any) => p.id).join(",");
    const subs = await (await rest(`push_subscriptions?select=endpoint,p256dh,auth&user_id=in.(${ids})`)).json();
    const sent = await sendAll(subs, {
      title: "Ton VIP expire bientôt ⏳",
      body: "Ton accès VIP se termine dans moins de 24 h. Renouvelle-le pour garder les combinés.",
      tag: "vip-reminder",
      url: "/",
    });
    return json({ ok: true, sent, users: profiles.length });
  }

  return json({ error: "Mode inconnu" }, 400);
});
