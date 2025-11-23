        // JavaScript全文
        const recipes = {
            teiban: [
  "豚の生姜焼き", "肉じゃが", "カレーライス", "ハンバーグ", "鮭の塩焼き", "鶏の唐揚げ", "麻婆豆腐", "オムライス",
  "ぶりの照り焼き", "さんまの塩焼き", "鯖の味噌煮", "親子丼", "すき焼き", "ぶり大根", "白身魚のムニエル",
  "えびチリ", "焼き餃子", "揚げ出し豆腐", "ちゃんぽん", "ちゃんちゃん焼き", "焼きそば", "たこ焼き", "焼きうどん",
  "豚汁", "天ぷら盛り合わせ", "鶏の照り焼き", "さんまの蒲焼", "牛丼", "カツ丼", "とんかつ", "メンチカツ", "コロッケ",
  "鶏の水炊き", "しゃぶしゃぶ", "もつ煮込み", "豆腐ステーキ", "野菜炒め", "ミートソーススパゲティ", "ナポリタン",
  "ペペロンチーノ", "カルボナーラ", "グラタン", "ドリア", "クリームシチュー", "ビーフシチュー", "醤油ラーメン",
  "味噌ラーメン", "塩ラーメン", "つけ麺", "チャーハン", "天津飯", "中華丼", "エビフライ", "アジフライ", "カキフライ",
  "ほっけの開き", "竜田揚げ", "手巻き寿司", "おでん", "湯豆腐", "茶碗蒸し", "いわしの梅煮", "刺身盛り合わせ",
  "鰻の蒲焼", "うな丼", "ピーマンの肉詰め", "きのこパスタ", "豚の角煮", "牛すじ煮込み", "ほうれん草の白和え",
  "鰹のたたき", "ささみの梅しそ巻き", "海鮮丼", "炊き込みご飯", "たこ飯", "鮭フレーク丼", "まぐろ丼",
  "じゃがいもとソーセージ炒め", "豆腐ハンバーグ", "お好み焼き", "もんじゃ焼き", "だし巻き卵定食", "焼きカレー",
  "カレードリア", "ホイコーロー", "青椒肉絲", "天ぷらそば", "きんぴらごぼう", "ぶりカマの塩焼き", "ツナマヨ丼",
  "カプレーゼ", "ロールキャベツ", "スペアリブの照り焼き", "ガパオライス", "タコライス",
  "ビビンバ", "焼肉定食", "チキンカツ", "キーマカレー", "カレーうどん"
],
            kotteri: [
  "豚骨ラーメン", "とんかつ", "ビーフシチュー", "カルビと野菜炒め", "スタミナ丼", "油淋鶏", "濃厚クリームパスタ",
  "エビチリ", "豚角煮", "カルボナーラ", "ラザニア", "グラタン", "チーズフォンデュ", "クリームシチュー",
  "ビーフストロガノフ", "ポークソテー", "スペアリブの照り焼き", "ガーリックステーキ", "バターチキンカレー",
  "カツカレー", "ミートソースドリア", "ミートローフ", "煮込みハンバーグ", "チーズハンバーグ", "牛すじ煮込み",
  "豚バラ焼き", "メンチカツ", "コロッケ盛り合わせ", "カニクリームコロッケ", "エビフライタルタル", "チキン南蛮",
  "トリュフバターのリゾット", "ベーコンとクリームのパスタ", "明太クリームパスタ", "ポークチャップ", "ホルモン炒め",
  "焼肉盛り合わせ", "ガーリックシュリンプ", "チーズたっぷりピザ", "ポークカツレツ", "牛タンのステーキ", "ビーフカツ",
  "鶏の照り焼き（こってり）", "照り焼きチキンのチーズ焼き", "バター醤油ステーキ", "牛肉の赤ワイン煮",
  "豚ロースの味噌漬け焼き", "濃厚トマトクリームパスタ", "チーズたっぷりオムライス", "キーマカレー（濃厚）",
  "スパイシーチキンウィング", "BBQリブ", "ホワイトソースのドリア", "豆腐ステーキの濃厚ソース",
  "牛ホホ肉の赤ワイン煮", "ポルチーニクリームパスタ", "エスニック濃厚カレー", "クリームコロッケグラタン",
  "グリーンカレー", "チーズフォンデュ風焼き野菜と肉", "テリヤキポークスペアリブ", "カマンベールのベーコン巻き",
  "バターポークの煮込み", "濃厚ホタテのクリーム煮", "チーズベーコン巻きグリル", "味噌煮込みうどん", "豚赤味噌丼",
  "スタミナ焼きそば", "濃厚牛たまご丼", "ガーリックバタークラムチャウダー", "エッグベネディクト", "ビーフパイ",
  "チーズたっぷり焼きカレー", "ホイコーロー", "牛ホルモンの味噌炒め", "ジャージャー麺", "バジルクリームパスタ",
  "トマトクリームの鶏肉煮込み", "ガーリックバターシュリンプライス", "バターポークカレー", "チーズのナチョス風グラタン",
  "ベーコン巻きアスパラのソテー", "クラムソースパスタ", "ウニクリームパスタ", "サーロインステーキのガーリックソース",
  "チーズオムレツ", "ビーフトマト煮込み", "濃厚豚骨つけ麺", "豚味噌角煮丼", "チーズとロールキャベツ", "バター醤油の帆立ソテー",
  "牛カルビのコチュジャン炒め", "クリームビーフシチュー", "マヨネーズのポテトサラダ", "ガーリックバター鶏もも肉のロースト"
            ],
            assari: [
  "冷奴と焼き魚", "鶏むね肉と野菜の和え物", "冷製パスタ", "茶碗蒸し", "水炊き", "さっぱりレモン鍋", "鶏団子スープ",
  "アボカドとトマトのサラダ", "鮭の塩焼きとおひたし", "冷やし中華", "きのこと豆腐のすまし汁", "きゅうりとわかめの酢の物",
  "ほうれん草のおひたしとご飯", "ささみの梅しそ和え", "冷やしトマトサラダ", "大根とツナのサラダ", "鯵のたたき",
  "さっぱりポン酢の鯖水煮", "豆腐と野菜の蒸し物", "かぶと浅蜊のさっと煮", "白菜としらすのさっぱり和え", "きのこのポン酢和え",
  "鶏胸肉のレモンマリネ", "冷やし茶碗蒸し", "鮭ときのこのホイル焼き", "春菊と大根のサラダ", "冷製コーンスープ",
  "茹で卵とアスパラのサラダ", "モヤシとしらすのおひたし", "冷しゃぶサラダ", "いんげんの胡麻和え", "焼きナスのせ冷奴",
  "さっぱり鯖の塩麹焼き", "ほたてと大根のサラダ", "鯖缶とキャベツのさっぱり煮", "きのこたっぷりの和風スープ",
  "タコときゅうりの酢の物", "れんこんと柚子のサラダ", "白菜と鶏ささみのさっぱり煮", "きゅうりの浅漬けと焼き魚",
  "鯛の酒蒸し", "蒸し鶏のネギポン酢がけ", "青菜と油揚げの煮びたし", "冷やしそばサラダ", "湯豆腐と薬味たっぷり",
  "きのこの和風ペペロンチーノ", "白身魚の昆布締め", "豆腐ハンバーグ和風あん", "ほっけの塩焼きと大根おろし",
  "あさりと豆苗の酒蒸し", "野菜たっぷりミネストローネ", "キャベツとツナのさっぱり和え", "昆布と椎茸のだし炊き豆",
  "もずく酢と小鉢盛り合わせ", "きのこと春菊のさっぱり和え", "枝豆とトマトのサラダ", "鶏と白菜のさっぱり煮込み",
  "鯖の塩焼きレモン添え", "おくらと長芋の和え物", "鮭の南蛮漬け", "わかめと胡瓜の中華風和え物",
  "こんにゃくと野菜の煮物", "しらすおろしと焼き魚定食", "白菜と豚肉のさっと蒸し（ポン酢）", "鯵の南蛮漬け",
  "さっぱり和風ビビンバ", "豆腐とアボカドの柚子胡椒和え", "温野菜と鶏ささみの和風ドレッシング", "菜の花としらすのお浸し",
  "れんこんと人参の酢の物", "鮭のムニエル バター控えめ", "冷やし牛しゃぶ", "焼き茄子と鰹節の和え物",
  "しめじと豆腐のあっさり煮", "きのこと豆腐の冷やし和え", "アジの干物と青菜の煮浸し", "もやしときゅうりのナムル",
  "はまぐりのお吸い物と小鉢", "鶏皮を使わないヘルシー照り焼き", "根菜の煮物", "お刺身定食", "鰹のたたきポン酢がけ",
  "鮭の炊き込みご飯", "トマトと豆腐のさっぱりサラダ", "ブロッコリーとツナの和え物", "さっぱり柚子風味の鯖煮",
  "長芋の梅和え", "青菜のシンプル塩炒め", "しいたけの醤油バター控えめ焼き", "九条ねぎたっぷりの卵焼き",
  "小松菜と油揚げの炒め煮", "鯛のカルパッチョ", "アスパラとトマトのさっぱりマリネ", "豆腐となめこのおろし和え",
  "鮭のホイル蒸し（柑橘風味）", "冷たい和風ポタージュ", "春雨サラダ", "さっぱり味の海鮮サラダ",
  "白菜と鶏ひき肉のあっさりスープ", "ねぎ塩レモンの蒸し鶏", "とうもろこしと豆腐のサラダ"
            ]
        };

const rouletteList = document.getElementById('rouletteList');
const recipeDisplay = document.getElementById('recipeDisplay');
const stopButton = document.getElementById('stopButton');
const messageBox = document.getElementById('messageBox');
const messageText = document.getElementById('messageText');

let currentGenre = 'teiban';
let isSpinning = false;
let animationTimeout = null;
const RECIPE_HEIGHT = 80; // CSS の --recipe-height と整合させてください
let currentTranslateY = 0; // 内部で管理する translateY

/**
 * ルーレットリストを初期化・更新する
 * genre: 'teiban' | 'kotteri' | 'assari'
 */
function updateRouletteList(genre) {
  currentGenre = genre;
  const list = recipes[genre];
  const repeatedList = [...list, ...list, ...list, ...list];

  rouletteList.innerHTML = '';
  repeatedList.forEach(recipe => {
    const li = document.createElement('li');
    li.className = 'roulette-item';
    li.textContent = recipe;
    rouletteList.appendChild(li);
  });

  // 初期表示は 2 回目の先頭あたりを中央に寄せる
  const centerIndex = list.length * 2;
  currentTranslateY = -(centerIndex * RECIPE_HEIGHT);
  applyTransformImmediate(currentTranslateY);

  // CSS カスタムプロパティも更新しておく（アニメーション開始時に利用）
  rouletteList.style.setProperty('--tmp-pos', `${currentTranslateY}px`);
}

/**
 * トランスフォームを即時に反映（transitionなし）
 */
function applyTransformImmediate(y) {
  rouletteList.style.transition = 'none';
  rouletteList.style.transform = `translateY(${y}px)`;
  currentTranslateY = y;
  // カスタムプロパティも合わせて更新
  rouletteList.style.setProperty('--tmp-pos', `${y}px`);
}

/**
 * トランスフォームをトランジション付きで反映
 */
function applyTransformWithTransition(y, durationSec, easing = 'cubic-bezier(0.2, 0.8, 0.5, 1)') {
  // set transition then apply transform on next frame
  rouletteList.style.transition = `transform ${durationSec}s ${easing}`;
  requestAnimationFrame(() => {
    rouletteList.style.transform = `translateY(${y}px)`;
  });
  currentTranslateY = y;
  // カスタムプロパティはトランジションに入る前の基準値として保持しておく
  rouletteList.style.setProperty('--tmp-pos', `${y}px`);
}

/**
 * getComputedStyle から現在の translateY をパースして返す（px）
 */
function readCurrentTranslateYFromComputed() {
  const style = getComputedStyle(rouletteList);
  const transform = style.transform || style.webkitTransform;
  if (!transform || transform === 'none') return currentTranslateY;
  // 形式: matrix(a, b, c, d, tx, ty) または matrix3d(...)
  const m = transform.match(/matrix.*\((.+)\)/);
  if (m) {
    const values = m[1].split(',').map(v => v.trim());
    // 2D matrix: tx is values[4], ty is values[5]
    const ty = parseFloat(values[5] || 0);
    return ty;
  }
  return currentTranslateY;
}

/**
 * ルーレット回転開始（ボタンクリックで呼ばれる）
 */
function startRoulette(genre) {
  if (isSpinning) return;

  // リスト更新（ジャンル切替）
  updateRouletteList(genre);

  isSpinning = true;
  stopButton.disabled = false;
  stopButton.textContent = 'ルーレットストップ！';

  // 現在 transform を CSS 変数に入れておく（アニメーションが var(--tmp-pos) を参照するため）
  rouletteList.style.setProperty('--tmp-pos', `${currentTranslateY}px`);

  // 高速回転は CSS の .is-spinning に任せる
  // ただし、アニメーション開始前に transform を確定しておくため、少し遅延してクラスを付与する
  requestAnimationFrame(() => {
    rouletteList.classList.add('is-spinning');
  });

  // 表示リセット
  recipeDisplay.textContent = '回転中...';
}

/**
 * ルーレット停止処理（ストップボタンで呼ばれる）
 */
function stopRoulette() {
  if (!isSpinning) return;

  // すぐに連打防止
  stopButton.disabled = true;

  // まず、アニメーション中の見た目 transform を取得して currentTranslateY に反映する
  // （CSS アニメーションで transform が上書きされているため、computed style を読む）
  const computedY = readCurrentTranslateYFromComputed();
  // computedY は translateY の値（px, 正または負）
  currentTranslateY = computedY;

  // カスタムプロパティも更新しておく（アニメーションの基準）
  rouletteList.style.setProperty('--tmp-pos', `${currentTranslateY}px`);

  // 高速回転クラスを外して減速アニメーションへ移行
  rouletteList.classList.remove('is-spinning');

  const list = recipes[currentGenre];
  const recipeCount = list.length;

  // 2回目のリスト（中央付近）からランダムに選ぶ
  const randomIndexInMiddle = Math.floor(Math.random() * recipeCount);
  const targetIndex = recipeCount + randomIndexInMiddle; // repeatedList 上の index

  // 表示コンテナの中央に来るようにオフセットを調整
  const indexOffsetForCenter = RECIPE_HEIGHT; // 中央合わせの補正
  const targetTranslateY = -(targetIndex * RECIPE_HEIGHT) + indexOffsetForCenter;

  // 減速アニメーション（直接 target にトランジション）
  const animationDurationMs = 3000;
  // 確実に現在の transform が反映されたあとにトランジションをかける
  // （ブラウザが "transition: none -> transform" を認識するように少し待つ）
  requestAnimationFrame(() => {
    // apply transform with transition
    applyTransformWithTransition(targetTranslateY, animationDurationMs / 1000);
  });

  // transitionend で確実に終了処理を走らせる（プロパティ名で判定）
  const onTransitionEnd = (e) => {
    if (e.propertyName !== 'transform') return;
    rouletteList.removeEventListener('transitionend', onTransitionEnd);
    clearTimeout(animationTimeout);
    finalizeStop(randomIndexInMiddle, targetIndex);
  };
  rouletteList.addEventListener('transitionend', onTransitionEnd);

  // 保険としてタイムアウトも設定（transitionend が発生しない場合）
  clearTimeout(animationTimeout);
  animationTimeout = setTimeout(() => {
    rouletteList.removeEventListener('transitionend', onTransitionEnd);
    finalizeStop(randomIndexInMiddle, targetIndex);
  }, animationDurationMs + 300);
}

/**
 * 停止後の共通後処理
 */
function finalizeStop(randomIndexInMiddle, targetIndex) {
  isSpinning = false;
  stopButton.disabled = true;
  stopButton.textContent = '停止しました';

  // transition を解除してピクセルレベルで整合
  // （現在の computed transform を再読み取りして即時反映）
  const finalComputedY = readCurrentTranslateYFromComputed();
  applyTransformImmediate(finalComputedY);

  // 決定レシピを表示
  const selectedRecipe = recipes[currentGenre][randomIndexInMiddle];
  recipeDisplay.textContent = selectedRecipe;

  // ハイライト
  highlightSelectedItem(targetIndex);
}

/**
 * 停止したアイテムをハイライト
 */
function highlightSelectedItem(targetIndex) {
  document.querySelectorAll('.roulette-item').forEach(item => {
    item.classList.remove('bg-yellow-300', 'ring-4', 'ring-yellow-500');
    item.style.backgroundColor = '';
  });

  const children = Array.from(rouletteList.children);
  const selectedItem = children[targetIndex];
  if (selectedItem) {
    selectedItem.classList.add('bg-yellow-300', 'ring-4', 'ring-yellow-500');
    selectedItem.style.backgroundColor = '#fcd34d';
    // スクロール等で見切れないようにフォーカス移動（任意）
    if (typeof selectedItem.scrollIntoView === 'function') {
      // 中央に来るようにスクロール（ただし overflow:hidden のため効果は限定的）
      selectedItem.scrollIntoView({ block: 'center', inline: 'nearest' });
    }
  }
}

/**
 * メッセージボックス表示
 */
function showMessage(text) {
  messageText.textContent = text;
  messageBox.style.display = 'flex';
}

/**
 * 文章コピー
 */
function copyText() {
  const recipe = recipeDisplay.textContent;
  if (isSpinning || recipe === 'ボタンを押してルーレット開始！' || recipe === '回転中...') {
    showMessage("レシピが決定してからコピーしてください！");
    return;
  }

  const textToCopy = `今日の晩御飯は「${recipe}」に決定！ #晩御飯ルーレット #献立決定`;

  const textarea = document.createElement('textarea');
  textarea.value = textToCopy;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    const successful = document.execCommand('copy');
    if (successful) {
      showMessage(`「${recipe}」の情報をコピーしました！`);
    } else {
      showMessage('コピーに失敗しました。手動でコピーしてください。');
    }
  } catch (err) {
    showMessage('コピー機能にアクセスできませんでした。');
  }

  document.body.removeChild(textarea);
}

/**
 * 簡易 PNG 保存
 */
function saveAsPng() {
  const recipe = recipeDisplay.textContent;
  if (isSpinning || recipe === 'ボタンを押してルーレット開始！' || recipe === '回転中...') {
    showMessage("レシピが決定してからPNG画像を作成してください！");
    return;
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = 600;
  canvas.height = 300;
  ctx.fillStyle = '#FFFBEB';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#FCD34D';
  ctx.lineWidth = 8;
  ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);

  ctx.font = '30px Noto Sans JP';
  ctx.fillStyle = '#333';
  ctx.textAlign = 'center';
  ctx.fillText('今日の晩御飯はこれ！', canvas.width / 2, 80);

  ctx.font = '60px Noto Sans JP Black';
  ctx.fillStyle = '#DC2626';
  ctx.fillText(recipe, canvas.width / 2, 170);

  ctx.font = '20px Noto Sans JP';
  ctx.fillStyle = '#6B7280';
  ctx.fillText('#晩御飯ルーレット #献立決定', canvas.width / 2, 240);

  const dataURL = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = dataURL;
  a.download = `レシピルーレット_${recipe}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  showMessage(`「${recipe}」の画像をダウンロード開始しました。`);
}

/**
 * SNS シェア
 */
function shareRecipe(platform) {
  const recipe = recipeDisplay.textContent;
  if (isSpinning || recipe === 'ボタンを押してルーレット開始！' || recipe === '回転中...') {
    showMessage("レシピが決定してからシェアしてください！");
    return;
  }

  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(`今日の晩御飯は「${recipe}」に決定しました！レシピに迷ったらこれ！`);
  const hashTag = encodeURIComponent('晩御飯ルーレット,献立決定');
  let shareUrl = '';

  switch (platform) {
    case 'x':
      shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=${hashTag}`;
      break;
    case 'facebook':
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
      break;
    case 'line':
      shareUrl = `https://social-plugins.line.me/lineit/share?url=${url}&text=${text}`;
      break;
    case 'email':
      shareUrl = `mailto:?subject=${encodeURIComponent('晩御飯献立決定！')}&body=${text}%0A%0A${url}`;
      break;
  }

  window.open(shareUrl, '_blank');
}

/**
 * 初期化とイベントリスナー設定
 * 重要: ページ読み込み時に自動で startRoulette を呼ばない（自動回転を避ける）
 */
window.addEventListener('DOMContentLoaded', function () {
  // 初期表示は「定番レシピ」のリストを読み込むが、自動回転はしない
  updateRouletteList('teiban');

  // ボタン群のイベント（押したときだけ startRoulette が走るようにする）
  document.querySelectorAll('#recipeButtons button').forEach(button => {
    button.addEventListener('click', (e) => {
      const genre = e.currentTarget.dataset.genre;
      // 回転中でなければ開始
      if (!isSpinning) {
        startRoulette(genre);
      } else {
        // 回転中にジャンル変更をしたい場合は一旦現在の回転を安定させてから再開
        clearTimeout(animationTimeout);

        // 現在の見た目 transform を取得して currentTranslateY に反映
        const computedY = readCurrentTranslateYFromComputed();
        currentTranslateY = computedY;
        rouletteList.style.setProperty('--tmp-pos', `${currentTranslateY}px`);

        rouletteList.classList.remove('is-spinning');
        isSpinning = false;
        stopButton.disabled = true;

        setTimeout(() => startRoulette(genre), 100);
      }
    });
  });

  // ストップ、コピー、PNG、シェアのイベント
  stopButton.addEventListener('click', stopRoulette);
  document.getElementById('btnCopy').addEventListener('click', copyText);
  document.getElementById('btnSavePng').addEventListener('click', saveAsPng);
  document.getElementById('shareX').addEventListener('click', (e) => { e.preventDefault(); shareRecipe('x'); });
  document.getElementById('shareFacebook').addEventListener('click', (e) => { e.preventDefault(); shareRecipe('facebook'); });
  document.getElementById('shareLine').addEventListener('click', (e) => { e.preventDefault(); shareRecipe('line'); });
  document.getElementById('shareEmail').addEventListener('click', (e) => { e.preventDefault(); shareRecipe('email'); });

  // 初期ストップを無効化（ボタンは押せない状態）
  stopButton.disabled = true;
});
