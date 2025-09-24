export async function onRequestGet(context) {
  await context.env.FRIDGE_KV.put("kv_test_key", "hello-fridge");
  const value = await context.env.FRIDGE_KV.get("kv_test_key");
  return new Response(JSON.stringify({ ok: true, value }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}