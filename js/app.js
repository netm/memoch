const FRIDGE = 'test-fridge';

// 1) 一覧取得（削除前に必ず実行）
async function fetchItems() {
  const res = await fetch(`/api/items?fridge=${encodeURIComponent(FRIDGE)}`);
  if (!res.ok) throw new Error('Failed to fetch items: ' + res.status);
  return res.json(); // { ok, items, version }
}

// 2) 削除関数（id と現在の version を渡す）
async function deleteItem(id, expectedVersion) {
  const res = await fetch(`/api/items?fridge=${encodeURIComponent(FRIDGE)}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, expectedVersion })
  });
  const json = await res.json();
  if (res.status === 200) return json; // { ok: true, version: newVersion }
  if (res.status === 409) throw new Error('Version mismatch: currentVersion=' + json.currentVersion);
  if (res.status === 404) throw new Error('Item not found');
  throw new Error('Delete failed: ' + res.status);
}

// 3) ワンライナーでの実行例（UI の削除ボタンに紐づける想定）
async function onDeleteButtonClick(itemId) {
  const data = await fetchItems();
  const currentVersion = data.version;
  try {
    const result = await deleteItem(itemId, currentVersion);
    console.log('Deleted, new version:', result.version);
    // 必要なら一覧を再取得して UI 更新
  } catch (err) {
    console.error(err);
    if (err.message.startsWith('Version mismatch')) {
      // 再取得してユーザーに通知するなどの処理
    }
  }
}