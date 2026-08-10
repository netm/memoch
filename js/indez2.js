// app.js
const sayings = {
  "丁巳": "高値の天井か底かはおとといの乙卯、昨日の丙辰で分かる。\nこの辺りから動意づいて安値になっていれば、この日から明日にかけて猛烈な買いが起きる。下げの場合は反対となる。波乱あるも下押し強い",
  "丁未": "前日の動きに従え。上へ向けば押し目買いに力を入れるべし。突飛高。意外な高値をみせる",
  "丁丑": "弱相。上げは騙しの可能性大。7日前の庚午の日安ければ、この日高し。庚午の日高ければ、この日安し。前日安ければ今日も下がる",
  "丁卯": "この日安ければ買うべし。底になること多し。6/24己巳に上げの力が潜んでいる。安ければ底",
  "丁酉": "人気に逆行して動く日だから初め高くても後場安し。前場安ければ後場跳ねる。保ち合い弱含みも後半の跳ね足に注意",
  "丁亥": "高値にいるか、安値にいるか、天底になる日なり。一方に片寄っているから動く方に味方すべし。保合相場は放れの動きあり",
  "乙巳": "前日安い時は大下り底になる。上に向いてる時は買うべし。天井転換日は4～5日先である。寄付き後の相場を見て考え、高ければ上昇。安ければ下落",
  "乙丑": "この日寄り付きより下なきは買いなり。先々上げ相場に向く気配あり。一方に偏する日だから下向けばこの反対とせよ",
  "乙未": "寄付き天井、底になる事あり。高い位置では吹き値売り、安い位置では押し目買い。また最初高くても後半下がる。後半の値動きは一方的。寄付き天底となりやすい",
  "乙酉": "昨日天井打ちて下へ向けば寄り付き高くても売るべし。逆に底の場合は下りても買うべし。明日より転換日に入る。",
  "乙亥": "前日下へ向いていれば、前場戻し後場安い。しかし大引けには注意。突っ込みあれば買うべし",
  "乙卯": "6～7日も保ち合うときは安値では買いに主力を、高値では売り。上下ともに波乱あり",
  "己卯": "前日変なくばこの日動くものなり。高値、安値ともに大相場になるものなり。高下荒く落ちつかない相場",
  "己巳": "前日大きく上がらねば、この日天井打ちなり。段々高くなった時は上にて売ってみるべし。この日より下り口になるものなり。また明日は己（ひらく）の日なので急に下がる事もあり",
  "己丑": "昨日、今日、明日と重要な転換期に入る日。高値の吹き値売り、安値の突っ込みは買い。",
  "己未": "天井・底とも別れを演ずる事多し。本日にかけて天井打ちした相場なれば下げ足は強力となる",
  "己亥": "変化日であるから人気重くても安き日は買うべし。天底では後場にかけて動く事多し。保ち合いもしくは上昇",
  "己酉": "突飛高の暗示。意外な高値を見せる日であり不時の動きを見せる。強い転換日であるから、前日が上げなければこの日の吹き値売りは良し。安い位置なれば買え",
  "壬子": "一方に片寄る日であるが、2～3日は保ち合いとなる。ここが底になる時は日数かかりて天井を打つ事になる。30～40日ぐらい高い事多し。下げそうで下げない日。安値買い向かい",
  "壬午": "乱高下。前後で相反する。逆張り対処の日。高値にあれば売り、安値にあれば買い。この日の高値を上へ回るか、安値を下へ回るかは大事なり。動きに従うこと",
  "壬申": "極めて安し。前日の安値より下へ回らば大下りとなる。",
  "壬戌": "この日より大下放れは底入れとなる。寄付きより上がるとも売るべし。寄付き上なきとも売り。この売りは早目に利入れすべし",
  "壬辰": "寄り付きよりすぐに高値出ざる時は大下りなることあり。この急落は利入れるべし。安い位置の大下げは買い。弱相。安値を取りに行く事が多い",
  "壬寅": "前日に反して動くから底転換したれば気配悪くても押し目は買い。上がり詰めの詰まった相場は売り込むべし。底入れなら気配悪くとも上がるが、天井打ちなら急落も・・・",
  "丙子": "この日高ければ売り、安ければ買う。天井か底になる日なり",
  "丙午": "強い日柄なれど、前日が下へ向いていればこの日安値底となる。段々下げ来たる時は瞬間的に底うち急変する事あり。底転換、天井転換となりやすい。後半一方的に動きやすい",
  "丙申": "一か月前の丙寅あたりから段々下がる時はこの日大下りある日なり。当分持ち合いとなる。また寄り付の動きを手本とせよ。下放れの動きあれば大暴落も・・・",
  "丙辰": "下寄りすると跳ね返す。寄り付きより下へ叩き込んでも寄り付きに戻すような強い日。とにもかくにも突っ込み買いの日。後半は突飛高をみせやすい",
  "丙戌": "高値で寄り付き上なき時は売るべし。安値では買いと心得るべし。前半保合だが後半は下がる",
  "丙寅": "戻り売りの日であり、寄り付き前日より高く出る時は押しても上がる故買いに回るべし",
  "戊子": "段々下りたる時は買い、逆に段々高くなる時は向かい打つ。前日の動きに反して動く日。段々下りて、安値底なれば買いを心掛けるべし。",
  "戊午": "安値にある時は急伸する。高ければ天井。この高値止まりになる時は１０日余り安い。高下荒く前半と後半で変化する",
  "戊申": "後場にかけて変化激しき日。上放れは大上がりを意味する。寄付きより下なきも買いなり。乱高下。後半の変化激しい",
  "戊戌": "この日は変ある日なり。安値では強い力と変わるから買い方針とすべし。一方に片寄って動く。下放れて寄付いても次第に上昇。",
  "戊辰": "段々高くなるとも買いなり。6/25庚午に気をつけるべし。中盤において天底分岐。後半には意外な動きあり",
  "戊寅": "段々安くて突っ込む時は底になる。",
  "甲子": "よく変化する。2から4日前が安い時はこの日から買い入るべし。あさって丙寅辺りから上げに向くなり",
  "甲午": "変化を起こす日。高値では寄り付きより上なき時は売り、安値では押し目買い。前後場で所を変えるのでその位置で逆のポジションをとるとすべし",
  "甲申": "この日は別れの日なりおとといの壬午、昨日の癸未の寄付きを見て今日の寄付きが中値を上へ越せば買い、下へ回れば売り出動十方暮れに入る為この日高値天井出せば14～15日安し安値底止まりとなれば一ヶ月ぐらい高し",
  "甲戌": "相場の分かれ目で、人気と反対の相場になり大きく突っ込めば底になることもあり。6/26辛未の日下がればこの日も下がる。",
  "甲辰": "前場安いと後場高い。前場上がりても大引け安し。相場位置によって駆け引き必要",
  "甲寅": "底の位置の下放れは底と見て買い。高い位置で上寄りすると天井と見て売り。前日あたりが保ち合い相場なればこの日から動く",
  "辛巳": "高値にあれば動かぬ日。動けばそれに従うこと。安値にあれば急伸する事有り。終盤の急変に注意のこと",
  "辛未": "弱相場であり、おとといの己巳、昨日の庚午高ければ大下げ、下がらぬ時はあさって癸酉から下げ始める",
  "辛丑": "天底になる日であるため、高い時は売り、安い位置にあれば買うべし。伸び足の短い相場",
  "辛卯": "高値で保ち合う時は気をつくべし。上寄り、寄り付きより上なき時でも売るべし。安値で昨日、一昨日より上にあれば買い方に味方すべし。弱相。多少の波乱あり",
  "辛酉": "昨日、今日と安値で止まる時は買い建てすべし。また下げ途中にあればこの日の高値を売りて２日のうちに利あれば利食い　よく変化する。昨日の庚申、今日、明日の壬戌この三日安いときはこの日から買い入るべし。5日後の丙寅辺りから上げに向くなり",
  "辛亥": "相場の分岐点を暗示。後半に確かな値動き見せる。段々下りて昨日今日と保ち合う時は底止まりなり。段々上がりて保ち合う時は下るなり。天井か底を作る日",
  "庚子": "保ち合い底なれば買うべし。中段保ち合いでも買うべし。天井圏にあれば売るべし。前々日と前日と本日の三日は天底転換日にあたる日である。本日、庚「やぶる」の日であり大事なり",
  "庚午": "この日は高き日なり、安ければ翌日高し。保ち合う時は2/28癸酉か3/3丙子ごろまでに大下りなり。波乱ありて下り坂に向かう",
  "庚申": "これから３日間は弱含みの日。今日の寄付き値段が３日前の寄付き値段を上回れば買い、下回れば売り",
  "庚戌": "人気に逆行する展開。逆行性の強い日であるから、突っ込むと起き上がるなり。あさっての壬子の日の高値を脱すれば底になる。高い位置なれば売り向かいすべし",
  "庚寅": "転換日であるから逆行して動く。高値なれば吹き値売り、安値なれば突っ込み買い。相場急変。後半の変化に注意。",
  "庚辰": "前場高いと後場にかけて下押すこと多し。高い位置にあれば天井となる。本日は不時の起こる日である　寄付きより上無き時は急落あり売るべし　寄付きより上がるとも大引けは安し売るべし",
  "癸巳": "底入れ。天一天上に入る。安値にある時は小底入り買うべし。前場安く後場高い",
  "癸丑": "買って利あらば早く手仕舞い退くべし。この日上がるとも明日下がってまた上がるという保ち合いとなりやすい",
  "癸未": "明日あたりが転換となる日であるから、突っ込んでも寄り付きに戻る。高値の時は売り、安値の時は買いとなる。",
  "癸酉": "案外高き日なり、逆に安きは翌日高し。この日高くても翌日は安い日　この日より続けて高い時は4～５日で天井打ちと知るべし。2019年6月5日は6/4が底でいったん上昇。",
  "癸卯": "前後相反する。往来相場だが値幅は大。上がるとも寄り付きへ戻るなり、また下がるとも寄り付きへ戻るなり。人気に逆行して動くから押し目は買い戻りは売りとなる",
  "癸亥": "陰の極入り。後半の動きは強烈で一方に片寄って動く。弱い日でも陰の極入りだから安心売りは禁物。押し目を買うを良しとす"
};

const listEl = document.getElementById ? document.getElementById('list') : null; // graceful if loaded separately

function eraFromDate(d) {
  // era boundaries (inclusive start)
  const eras = [
    { name: "令和", start: new Date(2019, 4, 1) },   // 2019-05-01
    { name: "平成", start: new Date(1989, 0, 8) },   // 1989-01-08
    { name: "昭和", start: new Date(1926, 11, 25) }, // 1926-12-25
    { name: "大正", start: new Date(1912, 6, 30) },  // 1912-07-30
    { name: "明治", start: new Date(1868, 0, 25) }   // 1868-01-25
  ];
  for (let i = 0; i < eras.length; i++) {
    if (d >= eras[i].start) {
      const eraYear = d.getFullYear() - eras[i].start.getFullYear() + 1;
      return { name: eras[i].name, year: eraYear === 1 ? "元" : String(eraYear) };
    }
  }
  // before Meiji
  return { name: "西暦", year: String(d.getFullYear()) };
}

function formatJapaneseDate(d) {
  const era = eraFromDate(d);
  const y = era.year;
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return `${era.name}${y}年${m}月${day}日`;
}

function formatGregorian(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function renderList(filterText = '') {
  const container = document.getElementById('list');
  container.innerHTML = '';
  const keys = Object.keys(sayings).filter(k => k.includes(filterText) || sayings[k].includes(filterText));
  keys.sort();
  if (keys.length === 0) {
    const no = document.createElement('div');
    no.className = 'empty';
    no.textContent = '該当する項目がありません';
    container.appendChild(no);
    return;
  }
  keys.forEach(key => {
    const btn = document.createElement('button');
    btn.className = 'card';
    btn.type = 'button';
    btn.textContent = key;
    btn.addEventListener('click', () => show(key));
    btn.addEventListener('keydown', (e) => { if (e.key === 'Enter') show(key); });
    container.appendChild(btn);
  });
}

function show(key) {
  const panelTitle = document.getElementById('panelTitle');
  const panelBody = document.getElementById('panelBody');
  const panelDate = document.getElementById('panelDate');
  panelTitle.textContent = key;
  panelBody.textContent = sayings[key];
  const now = new Date();
  panelDate.textContent = `${formatGregorian(now)} ／ ${formatJapaneseDate(now)}`;
  document.getElementById('close').style.display = 'inline-block';
}

function closePanel() {
  document.getElementById('panelTitle').textContent = '選択してください';
  document.getElementById('panelBody').textContent = '格言がここに表示されます。';
  document.getElementById('panelDate').textContent = '';
  document.getElementById('close').style.display = 'none';
}

function init() {
  renderList();
  document.getElementById('filter').addEventListener('input', (e) => renderList(e.target.value.trim()));
  document.getElementById('close').addEventListener('click', closePanel);
  // date picker for checking arbitrary date's era
  const dateInput = document.getElementById('eraDate');
  const eraOut = document.getElementById('eraOutput');
  dateInput.addEventListener('change', () => {
    const v = dateInput.value;
    if (!v) { eraOut.textContent = ''; return; }
    const d = new Date(v + 'T00:00:00');
    eraOut.textContent = `${formatGregorian(d)} ／ ${formatJapaneseDate(d)}`;
  });
  // focus first card
  setTimeout(() => {
    const first = document.querySelector('.card');
    if (first) first.focus();
  }, 200);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
