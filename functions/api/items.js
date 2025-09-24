// functions/api/items.js
const makeId = () => Date.now().toString(36) + Math.random().toString(36).slice(2,8);

export async function onRequest(context) {
  const { request, env } = context;
  const method = request.method.toUpperCase();
  const fridgeId = new URL(request.url).searchParams.get("fridge");
  if (!fridgeId) return new Response("missing fridge param", { status: 400 });

  const kvKey = `fridge:${fridgeId}:items`;
  const verKey = `fridge:${fridgeId}:ver`;

  if (method === "GET") {
    const raw = await env.FRIDGE_KV.get(kvKey);
    const items = raw ? JSON.parse(raw) : [];
    const verRaw = await env.FRIDGE_KV.get(verKey);
    const version = verRaw ? Number(verRaw) : 0;
    return new Response(JSON.stringify({ ok: true, items, version }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (method === "POST") {
    let body;
    try { body = await request.json(); } catch { return new Response("invalid json", { status: 400 }); }
    const item = {
      id: makeId(),
      name: body.name || "unnamed",
      expires: body.expires || null,
      addedAt: new Date().toISOString(),
      meta: body.meta || {},
    };

    const raw = await env.FRIDGE_KV.get(kvKey);
    const items = raw ? JSON.parse(raw) : [];
    items.push(item);
    await env.FRIDGE_KV.put(kvKey, JSON.stringify(items));

    const verRaw = await env.FRIDGE_KV.get(verKey);
    const version = verRaw ? Number(verRaw) + 1 : 1;
    await env.FRIDGE_KV.put(verKey, String(version));

    return new Response(JSON.stringify({ ok: true, item, version }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (method === "DELETE") {
    let body;
    try { body = await request.json(); } catch { return new Response("invalid json", { status: 400 }); }

    const { id, expectedVersion } = body || {};
    if (!id) return new Response("missing id", { status: 400 });

    const raw = await env.FRIDGE_KV.get(kvKey);
    const items = raw ? JSON.parse(raw) : [];

    const verRaw = await env.FRIDGE_KV.get(verKey);
    const currentVersion = verRaw ? Number(verRaw) : 0;
    if (typeof expectedVersion === "number" && expectedVersion !== currentVersion) {
      return new Response(JSON.stringify({ ok: false, error: "version_mismatch", currentVersion }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    const newItems = items.filter(i => i.id !== id);
    if (newItems.length === items.length) {
      return new Response(JSON.stringify({ ok: false, error: "not_found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    await env.FRIDGE_KV.put(kvKey, JSON.stringify(newItems));
    const newVersion = currentVersion + 1;
    await env.FRIDGE_KV.put(verKey, String(newVersion));

    return new Response(JSON.stringify({ ok: true, version: newVersion }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("method not allowed", { status: 405 });
}