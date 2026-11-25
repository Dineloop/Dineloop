import "jsr:@supabase/functions-js/edge-runtime.d.ts";
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const { to, text } = await req.json();
  const r = await fetch(
    `https://graph.facebook.com/v21.0/${Deno.env.get("WA_PHONE_ID")}/messages`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${Deno.env.get("WA_TOKEN")}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: "dineloop_update",
          language: { code: "en" },
          components: [{ type: "body", parameters: [{ type: "text", text }] }],
        },
      }),
    },
  );
  return new Response(await r.text(), { status: r.status, headers: { ...cors, "Content-Type": "application/json" } });
});
