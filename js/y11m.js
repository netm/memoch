// game.js
(() => {
  // ─── グローバル宣言 ───────────────────────────────────────────────
  let canvas, ctx, dpi;
  let state        = 'start';   // 'start' | 'running' | 'feedback' | 'complete'
  let players      = 1;         // 1 or 2
  let words        = [];
  let targets      = [];
  let solvedCount  = 0;
  let roundTotal   = 0;         // 今ラウンドの問題数
  let feedbackText = '';
  let feedbackTime = 0;
  let currentCard  = null;
  let score        = 0;

  const cardFiles = ['/images/zjump1.png','/images/zjump2.png','/images/zjump3.png','/images/zjump4.png'];
  const cards     = [];

  const bank = [
    { en: 'A bad workman blames his tools.',  ja: '下手な職人は道具のせいにする。' },
    { en: 'A bird in the hand is worth two in the bush.',  ja: '手中の一羽は藪の二羽に勝る。' },
    { en: 'A chain is only as strong as its weakest link.',  ja: '鎖は最も弱い環の強さしかない。' },
    { en: 'A picture is worth a thousand words.',  ja: '一枚の絵は千の言葉に値する。' },
    { en: 'A rolling stone gathers no moss.',  ja: '転がる石には苔が生えない。' },
    { en: 'A stitch in time saves nine.',  ja: '適時の一針は九針を省く。' },
    { en: 'Actions speak louder than words.',  ja: '行動は言葉より雄弁だ。' },
    { en: 'All that glitters is not gold.',  ja: '輝くものすべてが金とは限らない。' },
    { en: 'All’s well that ends well.',  ja: '終わりよければすべてよし。' },
    { en: 'An apple a day keeps the doctor away.',  ja: '一日一個のリンゴは医者を遠ざける。' },
    { en: 'April showers bring May flowers.',  ja: '4月の雨は5月の花をもたらす。' },
    { en: 'Beggars can’t be choosers.',  ja: '乞食は選り好みできない。' },
    { en: 'Beauty is in the eye of the beholder.',  ja: '美は見る人の目に宿る。' },
    { en: 'Better late than never.',  ja: '遅くてもやらないよりはまし。' },
    { en: 'Birds of a feather flock together.',  ja: '類は友を呼ぶ。' },
    { en: 'Blood is thicker than water.',  ja: '血は水よりも濃い。' },
    { en: 'Brevity is the soul of wit.',  ja: '簡潔さは機知の本質である。' },
    { en: 'Charity begins at home.',  ja: '慈善は家から始まる。' },
    { en: 'Cleanliness is next to godliness.',  ja: '清潔は敬虔に次ぐ美徳である。' },
    { en: 'Curiosity killed the cat.',  ja: '好奇心は猫をも殺す。' },
    { en: 'Cut your coat according to your cloth.',  ja: '布に合わせて服を裁つ。' },
    { en: 'Don’t bite the hand that feeds you.',  ja: '恩を与えてくれる手を噛むな。' },
    { en: 'Don’t count your chickens before they hatch.',  ja: '卵が孵る前にひよこを数えるな。' },
    { en: 'Don’t cry over spilt milk.',  ja: 'こぼれたミルクを嘆くな。' },
    { en: 'Don’t judge a book by its cover.',  ja: '本は表紙で判断するな。' },
    { en: 'Don’t make a mountain out of a molehill.',  ja: 'もぐら塚を山にするな。' },
    { en: 'Don’t put all your eggs in one basket.',  ja: '卵をすべて一つのかごに入れるな。' },
    { en: 'Easy come, easy go.',  ja: '得やすいものは失いやすい。' },
    { en: 'Every cloud has a silver lining.',  ja: 'どんな雲にも一縷の光がある。' },
    { en: 'Every dog has its day.',  ja: 'どんな犬にも自分の日がある。' },
    { en: 'Familiarity breeds contempt.',  ja: '馴れ合いは軽蔑を生む。' },
    { en: 'Fools rush in where angels fear to tread.',  ja: '愚か者は天使が恐れて踏み入れぬ所へ走り込む。' },
    { en: 'First come, first served.',  ja: '先着順。' },
    { en: 'Fortune favors the bold.',  ja: '運は大胆な者に味方する。' },
    { en: 'God helps those who help themselves.',  ja: '神は自助努力する者を助ける。' },
    { en: 'Good things come to those who wait.',  ja: '良いものは待つ者に訪れる。' },
    { en: 'Haste makes waste.',  ja: '急いては事を仕損じる。' },
    { en: 'If it ain’t broke, don’t fix it.',  ja: '壊れていないものは直すな。' },
    { en: 'If you can’t beat them, join them.',  ja: '相手に勝てないなら加われ。' },
    { en: 'If you play with fire, you’ll get burned.',  ja: '火遊びをすれば火傷を負う。' },
    { en: 'It’s always darkest before the dawn.',  ja: '夜明け前が一番暗い。' },
    { en: 'It’s better to have loved and lost than never to have loved at all.',  ja: '愛して失う方が、愛さずにいるよりましだ。' },
    { en: 'Jack of all trades, master of none.',  ja: '何でも屋は結局どれも極められない。' },
    { en: 'Keep your friends close and your enemies closer.',  ja: '友は近くに、敵はさらに近くに置け。' },
    { en: 'Knowledge is power.',  ja: '知識は力なり。' },
    { en: 'Laughter is the best medicine.',  ja: '笑いは最高の薬。' },
    { en: 'Let sleeping dogs lie.',  ja: '眠る犬を起こすな。' },
    { en: 'Look before you leap.',  ja: '飛ぶ前に十分確認せよ。' },
    { en: 'Make hay while the sun shines.',  ja: '日の照るうちに干し草を作れ。' },
    { en: 'Money doesn’t grow on trees.',  ja: '金は木にならない。' },
    { en: 'Necessity is the mother of invention.',  ja: '必要は発明の母である。' },
    { en: 'No man is an island.',  ja: '人は一人では生きられない。' },
    { en: 'Practice makes perfect.',  ja: '練習は完璧をもたらす。' },
    { en: 'Rome wasn’t built in a day.',  ja: 'ローマは一日にして成らず。' },
    { en: 'Slow and steady wins the race.',  ja: 'ゆっくりでも着実に進む者が競争に勝つ。' },
    { en: 'The early bird catches the worm.',  ja: '早起きの鳥が虫を捕る。' },
    { en: 'The pen is mightier than the sword.',  ja: 'ペンは剣より強し。' },
    { en: 'There’s no place like home.',  ja: '家ほど良い場所はない。' },
    { en: 'Time and tide wait for no man.',  ja: '時と潮は人を待たない。' },
    { en: 'Two heads are better than one.',  ja: '二人の頭脳は一人よりも優れている。' },
    { en: 'When in Rome, do as the Romans do.',  ja: '郷に入れば郷に従え。' },
    { en: 'Where there’s smoke, there’s fire.',  ja: '煙のある所に火あり。' },
    { en: 'You can’t have your cake and eat it too.',  ja: 'ケーキを食べながら手元にも残すことはできない。' },
    { en: 'You can’t teach an old dog new tricks.',  ja: '老犬に新しい芸は教えられない。' },
    { en: 'You reap what you sow.',  ja: '蒔いた種は自分で刈り取る。' },
    { en: 'Your guess is as good as mine.',  ja: '私の見当もあなたの見当と大差ない。' },
    { en: 'A watched pot never boils.',  ja: '注視している鍋は決して沸騰しない。' },
    { en: 'A penny saved is a penny earned.',  ja: '小銭を節約することは、そのまま稼ぐことだ。' },
    { en: 'Bite off more than you can chew.',  ja: '噛み切れる以上のものをかじろうとする。' },
    { en: 'Clothes make the man.',  ja: '服装が人を作る。' },
    { en: 'Devil is in the details.',  ja: '悪魔は細部に宿る。' },
    { en: 'Every rose has its thorn.',  ja: 'すべてのバラには棘がある。' },
    { en: 'Faint heart never won fair lady.',  ja: '臆病者に美女は勝ち取れない。' },
    { en: 'Good fences make good neighbors.',  ja: '良い垣根が良い隣人をつくる。' },
    { en: 'Honesty is the best policy.',  ja: '正直は最善の策だ。' },
    { en: 'It takes two to tango.',  ja: 'タンゴを踊るには二人が必要だ。' },
    { en: 'Judge not, that ye be not judged.',  ja: '人を裁くな、そうすればあなたも裁かれない。' },
    { en: 'Keep your chin up.',  ja: '顔を上げて。' },
    { en: 'Lightning never strikes twice in the same place.',  ja: '同じ場所に雷が二度落ちることはない。' },
    { en: 'Men of few words are the best men.',  ja: '口数の少ない人こそ最良の人である。' },
    { en: 'Nothing ventured, nothing gained.',  ja: '挑戦せざれば何も得られない。' },
    { en: 'One man’s trash is another man’s treasure.',  ja: '人のゴミは別の人の宝。' },
    { en: 'Practice what you preach.',  ja: '説いたことを実践しなさい。' },
    { en: 'Quick and dirty.',  ja: '速くて粗い。' },
    { en: 'Still waters run deep.',  ja: '静かな水は深い。' },
    { en: 'Too many cooks spoil the broth.',  ja: '料理人が多すぎるとスープは台無しになる。' },
    { en: 'Uniqueness sells.',  ja: '独自性は売れる。' },
    { en: 'Variety is the spice of life.',  ja: '多様性こそ人生のスパイスだ。' },
    { en: 'When the cat’s away, the mice will play.',  ja: '猫がいないとネズミが遊び回る。' },
    { en: 'You can lead a horse to water, but you can’t make it drink.',  ja: '馬を水辺まで連れて行っても、水を飲ませることはできない。' },
    { en: 'Zeal without knowledge is fire without light.',  ja: '知識なき熱意は光なき火のようだ。' },
    { en: 'Absence makes the heart grow fonder.',  ja: '離れていると、心はより深く慕うようになる。' },
    { en: 'Better the devil you know than the devil you don’t know.',  ja: '知っている悪魔のほうが、知らない悪魔よりましだ。' },
    { en: 'Don’t look a gift horse in the mouth.',  ja: 'もらい物に文句をつけるな。' },
    { en: 'Give credit where credit is due.',  ja: '功績を挙げた者には相応の評価を与えよ。' },
    { en: 'Hope for the best, prepare for the worst.',  ja: '最善を望み、最悪に備えよ。' },
    { en: 'Idle hands are the devil’s workshop.',  ja: '手持ち無沙汰は悪魔の仕事場だ。' },
    { en: 'Jump on the bandwagon.',  ja: '流れに乗れ。' },
    { en: 'Keep your nose to the grindstone.',  ja: '一心不乱に働け。' },
    { en: 'Lend your money and lose your friend.',  ja: '金を貸せば友を失う。' }
  ];

  // 出題済みを除外するためのプール
  let remainingBank = bank.slice();

  // ─── 環境チェック ─────────────────────────────────────────────────
  const hasSpeech = typeof window.speechSynthesis !== 'undefined';
  let loadedVoices = [];
  if (hasSpeech) {
    speechSynthesis.addEventListener('voiceschanged', () => {
      loadedVoices = speechSynthesis.getVoices();
    });
  }

  // ─── ヘルパー ─────────────────────────────────────────────────────
  const randInt = n => Math.floor(Math.random() * n);
  const shuffle = arr => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = randInt(i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  };

  function resize() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    dpi = window.devicePixelRatio || 1;
    canvas.style.width  = `${vw}px`;
    canvas.style.height = `${vh}px`;
    canvas.width  = vw * dpi;
    canvas.height = vh * dpi;
    ctx.setTransform(dpi, 0, 0, dpi, 0, 0);
  }

  function isPortrait() {
    return window.innerWidth < window.innerHeight;
  }

  // ─── 音声合成 ─────────────────────────────────────────────────────
  function speakGirl(text) {
    if (!hasSpeech) return;
    speechSynthesis.cancel();
    const vs = speechSynthesis.getVoices().length
              ? speechSynthesis.getVoices()
              : loadedVoices;
    let voice = vs.find(v => v.lang.startsWith('en') && /female/i.test(v.name));
    if (!voice) {
      const names = ['Zira','Samantha','Victoria','Tessa','Amelie','Alice'];
      voice = vs.find(v => v.lang.startsWith('en') &&
                           names.some(n => v.name.includes(n)));
    }
    if (!voice) voice = vs.find(v => v.lang === 'en-US');
    if (!voice) voice = vs.find(v => v.lang.startsWith('en'));
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang  = 'en-US';
    if (voice) utt.voice = voice;
    utt.pitch = 1.4;
    speechSynthesis.speak(utt);
  }

  // ─── Draggable クラス ─────────────────────────────────────────────
  class Draggable {
    constructor(text, x, y) {
      this.text      = text;
      this.homeX     = x; this.homeY = y;
      this.x         = x; this.y    = y;
      this.dragging  = false;
      this.offsetX   = 0; this.offsetY = 0;
      this.returning = false;
      this.RETURN_DURATION = 300;
      this.returnStart = 0;
      this.startX      = x; this.startY = y;

      ctx.font = '20px sans-serif';
      const tw  = ctx.measureText(text).width;
      this.w = tw + 30;
      this.h = 36;

      this.badgeW = 0; this.badgeH = this.h;
      this.badgeX = 0; this.badgeY = 0;
    }

    draw() {
      ctx.font         = '20px sans-serif';
      ctx.textBaseline = 'middle';
      ctx.textAlign    = 'center';
      ctx.fillStyle    = '#fff';
      ctx.fillRect(this.x, this.y, this.w, this.h);
      ctx.strokeStyle  = '#000';
      ctx.strokeRect(this.x, this.y, this.w, this.h);
      ctx.fillStyle    = '#000';
      ctx.fillText(this.text, this.x + this.w / 2, this.y + this.h / 2);

      const badge = '(^o^)';
      ctx.font      = '18px sans-serif';
      ctx.textAlign = 'start';
      const bw      = ctx.measureText(badge).width;
      this.badgeX   = this.x + this.w + 10;
      this.badgeY   = this.y;
      this.badgeW   = bw;
      ctx.fillStyle = '#800080';
      ctx.fillText(badge, this.badgeX, this.badgeY + this.h / 2);
    }

    update() {
      if (!this.returning) return;
      const t = (performance.now() - this.returnStart) / this.RETURN_DURATION;
      const ease = 1 - Math.pow(1 - t, 2);
      if (t >= 1) {
        this.x = this.homeX;
        this.y = this.homeY;
        this.returning = false;
      } else {
        this.x = this.startX + (this.homeX - this.startX) * ease;
        this.y = this.startY + (this.homeY - this.startY) * ease;
      }
    }

    startReturn() {
      this.returning   = true;
      this.returnStart = performance.now();
      this.startX      = this.x;
      this.startY      = this.y;
    }
  }

  // ─── Target クラス ─────────────────────────────────────────────────
  class Target {
    constructor(text, x, y) {
      this.text = text;
      this.x    = x;
      this.y    = y;
      ctx.font = '20px sans-serif';
      const w  = ctx.measureText(text).width;
      this.w = w + 30;
      this.h = 36;
      this.highlight = false;
    }

    draw() {
      ctx.font         = '18px sans-serif';
      ctx.textBaseline = 'middle';
      ctx.textAlign    = 'center';
      ctx.strokeStyle  = this.highlight ? '#f00' : '#000';
      ctx.lineWidth    = this.highlight ? 3 : 1;
      ctx.strokeRect(this.x, this.y, this.w, this.h);
      ctx.fillStyle    = '#000';
      ctx.fillText(this.text, this.x + this.w / 2, this.y + this.h / 2);
      ctx.lineWidth    = 1;
      this.highlight = false;
    }

    isHover(px, py) {
      return px >= this.x && px <= this.x + this.w &&
             py >= this.y && py <= this.y + this.h;
    }
  }

  // ─── 新ラウンド準備 ───────────────────────────────────────────────
  function setupRound() {
    solvedCount = 0;
    words   = [];
    targets = [];
    state   = 'running';

    shuffle(remainingBank);
    const pickCount = Math.min(remainingBank.length, 5);
    const picks = remainingBank.slice(0, pickCount);
    roundTotal = picks.length;
    remainingBank = remainingBank.filter(o => !picks.includes(o));

    const gapY  = window.innerHeight / (pickCount + 1);
    picks.forEach((o, i) => {
      const y = gapY * (i + 1) - 18;
      words.push(new Draggable(o.en, 20, y));
    });

    const answers = picks.map(o => o.ja);
    shuffle(answers);
    answers.forEach((txt, i) => {
      const y = gapY * (i + 1) - 18;
      ctx.font = '16px sans-serif';
      const tw = ctx.measureText(txt).width + 30;
      const x  = window.innerWidth - tw - 20;
      targets.push(new Target(txt, x, y));
    });
  }

  // ─── ゲーム開始 ───────────────────────────────────────────────────
  function tryStart(x) {
    players = x < window.innerWidth / 2 ? 1 : 2;
    if (state === 'start') {
      score = 0;
      remainingBank = bank.slice();
    }
    setupRound();
  }

  // ─── 入力ハンドラ ─────────────────────────────────────────────────
  let activePointer = null;

  function onPointerDown(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (state === 'start' || state === 'complete') {
      tryStart(x);
      return;
    }
    if (state !== 'running' || isPortrait()) return;

    // 発音バッジ
    for (const d of words) {
      if (
        x >= d.badgeX && x <= d.badgeX + d.badgeW &&
        y >= d.badgeY && y <= d.badgeY + d.h
      ) {
        speakGirl(d.text);
        return;
      }
    }

    // ドラッグ開始
    for (const d of words) {
      if (
        x >= d.x && x <= d.x + d.w &&
        y >= d.y && y <= d.y + d.h
      ) {
        canvas.setPointerCapture(e.pointerId);
        activePointer = e.pointerId;
        d.dragging    = true;
        d.offsetX     = x - d.x;
        d.offsetY     = y - d.y;
        break;
      }
    }
  }

  function onPointerMove(e) {
    if (e.pointerId !== activePointer || state !== 'running') return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    words.forEach(d => {
      if (d.dragging) {
        d.x = x - d.offsetX;
        d.y = y - d.offsetY;
        targets.forEach(t => {
          if (t.isHover(x, y)) t.highlight = true;
        });
      }
    });
  }

  function onPointerUp(e) {
    if (e.pointerId !== activePointer || state !== 'running') return;
    canvas.releasePointerCapture(e.pointerId);

    for (const d of words) {
      if (!d.dragging) continue;
      d.dragging = false;

      let hit = null;
      for (const t of targets) {
        if (
          d.x + d.w / 2 >= t.x &&
          d.x + d.w / 2 <= t.x + t.w &&
          d.y + d.h / 2 >= t.y &&
          d.y + d.h / 2 <= t.y + t.h
        ) {
          hit = t;
          break;
        }
      }

      if (hit) {
        const correct = bank.find(o => o.en === d.text).ja;
        if (hit.text === correct) {
          score += 10;
          feedbackText = players === 1 ? '正解' : '正解　交代';
          currentCard  = cards[randInt(cards.length)];
          feedbackTime = performance.now();
          state        = 'feedback';

          words   = words.filter(w => w !== d);
          targets = targets.filter(t => t !== hit);
          solvedCount++;
          activePointer = null;
          return;
        }
      }

      d.startReturn();
      activePointer = null;
    }
  }

  function onPointerCancel(e) {
    if (e.pointerId !== activePointer) return;
    for (const d of words) {
      if (d.dragging) {
        d.dragging = false;
        d.startReturn();
      }
    }
    activePointer = null;
  }

  // ─── 描画ループ ────────────────────────────────────────────────────
  function loop(now = 0) {
    if (isPortrait()) {
      ctx.fillStyle    = '#ccf';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.fillStyle    = '#000';
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      ctx.font         = '28px sans-serif';
      ctx.fillText('よこ向きにしてください',
                   window.innerWidth / 2,
                   window.innerHeight / 2);
      requestAnimationFrame(loop);
      return;
    }

    ctx.fillStyle    = '#ccf';
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.fillStyle    = '#000';
    ctx.textAlign    = 'left';
    ctx.textBaseline = 'top';
    ctx.font         = '20px sans-serif';
    ctx.fillText(`Score: ${score}`, 20, 20);

    if (state === 'start') {
      ctx.fillStyle    = '#000';
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      ctx.font         = '28px sans-serif';
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      [
        '英語クイズ中学3年生向けゲーム',
        '正解にかさねてね',
        '左タップ：1人用　右タップ：2人協力'
      ].forEach((txt, i) => {
        ctx.fillText(txt, cx, cy + i * 36 - 36);
      });
    } else if (state === 'running') {
      words.forEach(d => { d.update(); d.draw(); });
      targets.forEach(t => t.draw());
      if (solvedCount === roundTotal) {
        state        = 'complete';
        feedbackText = 'おめでとう☆　タップで次へ';
        currentCard  = cards[randInt(cards.length)];
      }
    } else { // 'feedback' or 'complete'
      words.forEach(d => { d.update(); d.draw(); });
      targets.forEach(t => t.draw());

      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      const cw = 180, ch = 180;
      if (currentCard) {
        ctx.drawImage(
          currentCard,
          (window.innerWidth  - cw) / 2,
          (window.innerHeight - ch) / 2,
          cw, ch
        );
      }

      ctx.fillStyle    = '#fff';
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'top';
      ctx.font         = state === 'feedback' ? '36px sans-serif'
                                              : '28px sans-serif';
      ctx.fillText(
        feedbackText,
        window.innerWidth  / 2,
        window.innerHeight / 2 + ch / 2 + 20
      );

      if (state === 'feedback' && now - feedbackTime > 1000) {
        state = 'running';
      }
    }

    requestAnimationFrame(loop);
  }

  // ─── 初期化 ────────────────────────────────────────────────────────
  function init() {
    canvas = document.createElement('canvas');
    ctx    = canvas.getContext('2d');
    document.documentElement.style.margin  = '0';
    document.documentElement.style.padding = '0';
    document.body.style.margin   = '0';
    document.body.style.padding  = '0';
    canvas.style.display     = 'block';
    canvas.style.touchAction = 'none';
    document.body.appendChild(canvas);

    // カード画像プリロード
    cardFiles.forEach(src => {
      const img = new Image();
      img.src   = src;
      img.onload  = () => cards.push(img);
      img.onerror = () => console.error('画像読み込み失敗:', src);
    });

    // リサイズ＆リスナー
    resize();
    window.addEventListener('resize', resize);
    requestAnimationFrame(loop);

    canvas.addEventListener('pointerdown',   onPointerDown);
    canvas.addEventListener('pointermove',   onPointerMove);
    canvas.addEventListener('pointerup',     onPointerUp);
    canvas.addEventListener('pointercancel', onPointerCancel);

    // タッチ → ポインター フォールバック
    if (typeof PointerEvent === 'function') {
      ['start','move','end'].forEach(type => {
        canvas.addEventListener(
          'touch' + type,
          e => {
            const t = e.changedTouches[0];
            let pe;
            try {
              pe = new PointerEvent('pointer' + type, {
                pointerId:   t.identifier,
                clientX:     t.clientX,
                clientY:     t.clientY,
                pointerType: 'touch',
                isPrimary:   true
              });
            } catch {
              return;
            }
            canvas.dispatchEvent(pe);
            e.preventDefault();
          },
          { passive: false }
        );
      });
    }

    window.addEventListener('keydown', e => {
      if ((state === 'start' || state === 'complete') &&
          (e.key === ' ' || e.key === 'Enter')) {
        tryStart(window.innerWidth / 2);
      }
    });
  }

  window.addEventListener('load', init);
})();
