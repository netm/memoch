/* app.js - 全文 */
document.addEventListener('DOMContentLoaded', () => {
  const todayBtn = document.getElementById('btn-today');
  const copyBtn = document.getElementById('btn-copy');
  const pngBtn = document.getElementById('btn-png');
  const nativeShareBtn = document.getElementById('btn-native-share');
  const recipeFrame = document.getElementById('recipe-frame');
  const recipeTextEl = document.getElementById('recipe-text');
  const shareX = document.getElementById('share-x');
  const shareFacebook = document.getElementById('share-fb');
  const shareLine = document.getElementById('share-line');
  const shareEmail = document.getElementById('share-email');

  // サンプル：今日の満腹感レシピ（任意でサーバから取得する想定）
  const sampleRecipe = `満腹感たっぷり豆腐野菜ボウル
材料：
- 絹ごし豆腐 1丁
- キャベツ 200g（千切り）
- にんじん 1本（細切り）
- きのこ類 100g
- ごまドレッシング小さじ2

作り方：
1. 豆腐は軽く水切りし、一口大にする。
2. 野菜を下茹でするかレンチンして食感を残す。
3. 全てを混ぜてドレッシングで和える。
ポイント：食物繊維と水分量が多いので満腹感が続く。`;

  // 初期表示
  recipeTextEl.textContent = sampleRecipe;

  // 今日のレシピをランダムに切り替える（ここはサンプル）
  todayBtn.addEventListener('click', () => {
    // 簡易ローテーションサンプル
    const variants = [
      sampleRecipe,
      `満腹感シーフードサラダ
材料：
- サラダミックス 100g
- サバ缶（オイル不使用）1缶
- もち麦ごはん 50g

作り方：
サラダと魚、もち麦を和えるだけ。プロテインと食物繊維で満腹感持続。`,
      `満腹スピードおからオムレツ
材料：おからパウダー 30g、卵 2個、ほうれん草 適量
作り方：全て混ぜてフライパンで焼く。低カロリーで腹持ち良し。`
    ];
    const idx = Math.floor(Math.random() * variants.length);
    recipeTextEl.textContent = variants[idx];
    flashFrame();
  });

  // 枠をフラッシュして視覚効果
  function flashFrame() {
    recipeFrame.classList.remove('flash');
    void recipeFrame.offsetWidth;
    recipeFrame.classList.add('flash');
  }

  // テキストをコピー
  copyBtn.addEventListener('click', async () => {
    const text = recipeTextEl.textContent || '';
    try {
      await navigator.clipboard.writeText(text);
      showToast('レシピをコピーしました');
    } catch (e) {
      // フォールバック
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      showToast('レシピをコピーしました');
    }
  });

  // PNGで保存（シンプル描画）
  pngBtn.addEventListener('click', () => {
    const padding = 24;
    const lineHeight = 20;
    const font = '16px sans-serif';
    const text = recipeTextEl.textContent || '';
    const lines = text.split('\n');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // 幅を画面幅に合わせて、両端がくるように
    const width = Math.min(window.innerWidth - 32, 1200);
    canvas.width = Math.max(400, width);
    canvas.height = padding * 2 + lines.length * lineHeight + 40;

    // 背景
    ctx.fillStyle = '#fffef6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // タイトル
    ctx.fillStyle = '#ff6fa3';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('満腹感レシピ', padding, padding + 8);

    // 本文
    ctx.fillStyle = '#222';
    ctx.font = font;
    let y = padding + 32;
    lines.forEach((line) => {
      ctx.fillText(line, padding, y);
      y += lineHeight;
    });

    // ダウンロード
    canvas.toBlob((blob) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'manpukurecipe.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(a.href);
    }, 'image/png');
  });

  // ネイティブ共有
  nativeShareBtn.addEventListener('click', async () => {
    const title = '満腹感レシピ';
    const text = recipeTextEl.textContent || '';
    const url = location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (e) {
        showToast('共有がキャンセルされました');
      }
    } else {
      showToast('この端末はネイティブ共有に対応していません');
    }
  });

  // 各SNSシェア
  function openShare(url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  const pageTitle = encodeURIComponent(document.title);
  const pageUrl = encodeURIComponent(location.href);
  const pageText = encodeURIComponent(recipeTextEl.textContent || '');

  shareX.addEventListener('click', () => {
    openShare(`https://twitter.com/intent/tweet?text=${pageText}`);
  });
  shareFacebook.addEventListener('click', () => {
    openShare(`https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`);
  });
  shareLine.addEventListener('click', () => {
    openShare(`https://social-plugins.line.me/lineit/share?url=${pageUrl}`);
  });
  shareEmail.addEventListener('click', () => {
    location.href = `mailto:?subject=${pageTitle}&body=${encodeURIComponent(recipeTextEl.textContent + '\n\n' + location.href)}`;
  });

  // トースト通知
  function showToast(msg, timeout = 2000) {
    let t = document.getElementById('toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), timeout);
  }

  // レスポンシブ時にボタンリンクのurlを更新（recipeが変わったら使う想定）
  recipeTextEl.addEventListener('input', () => {
    // place for dynamic updates if needed
  });
});