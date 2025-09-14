<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="description" content="メモ付き電卓と分数計算 ルート累乗 長さ重さ単位換算 消費税計算機能付きです。">
    <meta name="keywords" content="メモ付き,電卓">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="google-adsense-account" content="ca-pub-3701488620779249">
    <title>メモ付き電卓</title>
    <link rel="stylesheet" href="/css/z999.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
</head>
<body>

    <div id="capture-area">
        <div class="app-container">
            <div id="memo-display"></div>
            <div id="display">0</div>
            <div class="calculator">
                <div class="calculator-keys">
                    <button class="control-btn" data-action="clear-all">AC</button>
                    <button class="control-btn" data-action="undo">⌫</button>
                    
                    <button data-action="operator" data-value="÷">÷</button>
                    <button data-action="operator" data-value="×">×</button>

                    <button data-action="number" data-value="7">7</button>
                    <button data-action="number" data-value="8">8</button>
                    <button data-action="number" data-value="9">9</button>
                    <button data-action="operator" data-value="-">-</button>

                    <button data-action="number" data-value="4">4</button>
                    <button data-action="number" data-value="5">5</button>
                    <button data-action="number" data-value="6">6</button>
                    <button data-action="operator" data-value="+">+</button>

                    <button data-action="number" data-value="1">1</button>
                    <button data-action="number" data-value="2">2</button>
                    <button data-action="number" data-value="3">3</button>
                    
                    <button data-action="number" data-value="0" style="grid-column: span 2;">0</button>
                    <button data-action="decimal" data-value=".">.</button>
                    
                    <button data-action="equals" data-value="=" style="grid-row: span 2;">=</button>
                </div>
            </div>
             <textarea id="notes" placeholder="ここにメモを追加できます..."></textarea>
             <button id="save-png" class="control-btn">PNG画像で保存</button>
        </div>
    </div>

    <div class="footer-link">
    <p><a href="https://memoc.pages.dev/" target="_blank">メモ帳代わりwebブラウザ便利サイト</a></p><br>
    <p><a href="https://memoc.pages.dev/muden/" target="_blank">電卓無料サイト 生活に役立つ便利なリンク集</a></p>
    <p><a href="https://memoc.pages.dev/y997/" target="_blank">家計簿項目表のブラウザアプリ おすすめ無料フォーマット付</a></p><br>
    <p><a href="https://memoc.pages.dev/interestcalculation/" target="_blank">複利電卓・積立NISAの金額再投資計算機</a></p>
    <p><a href="https://memoc.pages.dev/toushi/" target="_blank">投資メモ電卓webブラウザ無料サイト</a></p>
    <p><a href="https://memoc.pages.dev/y998s/" target="_blank">書き込みカレンダー無料で手作り感覚子どもも簡単作成</a></p><br>
    <p><a href="https://memoc.pages.dev/yzpa1/" target="_blank">タイマーおしゃれサイトの解説 3分で音が鳴る設定も簡単3タッチ</a></p><br>
    <p><a href="https://memoc.pages.dev/yzp1/" target="_blank">勉強タイマーおすすめwebサイトの説明 PCスマホ対応</a></p><br>
    <p><a href="https://memoc.pages.dev/tokei/" target="_blank">現在時刻リアルタイム秒時計Web表示</a></p><br>
    <p><a href="https://memoc.pages.dev/tver/" target="_blank">TVerティーバーの検索用リンク集 ジャンル タレント名 俳優別</a></p><br>
    <p><a href="https://memoc.pages.dev/game1/" target="_blank">無料ブラウザゲームPCスマホタブレット対応</a></p><br>
    <p><a href="https://memoc.pages.dev/y8h2/" target="_blank">英語中学からやり直すサイト高校生も大人も</a></p>
    </div>

<script src="/js/z999.js"></script>

</body>
</html>