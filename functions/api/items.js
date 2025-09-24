import { v4 as uuidv4 } from "uuid";

export async function onRequest(context) {
  const { request, env, params, url } = context;
  const method = request.method.toUpperCase();

  // クエリ ?fridge=FRIDGE_UUID を使って冷蔵庫を指定
  const fridgeId = new URL(request.url).searchParams.get("fridge");
  if (!fridgeId) return new Response("missing fridge param", { status: 400 });

  const kvKey = `fridge:${fridgeId}:items`;

  if (method === "GET") {
    const raw = await env.FRIDGE_KV.get(kvKey);
    const items = raw ? JSON.parse(raw) : [];
    return new Response(JSON.stringify({ ok: true, items }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (method === "POST") {
    let body;
    try {
      body = await request.json();
    } catch {
      return new Response("invalid json", { status: 400 });
    }

    // 期待する body: { name: "牛乳", expires: "2025-10-01" } など
    const item = {
      id: uuidv4(),
      name: body.name || "unnamed",
      expires: body.expires || null,
      addedAt: new Date().toISOString(),
      meta: body.meta || {},
    };

    const raw = await env.FRIDGE_KV.get(kvKey);
    const items = raw ? JSON.parse(raw) : [];
    items.push(item);

    // 保存（簡易実装：配列を丸ごと上書き）
    await env.FRIDGE_KV.put(kvKey, JSON.stringify(items));

    return new Response(JSON.stringify({ ok: true, item }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("method not allowed", { status: 405 });
}