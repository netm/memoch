<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
<meta name="description" content="カードゲーム二人はペンギン ブラウザゲーム友達と対戦可です。PCスマホタブレット対応、無料で完全無課金">
        <meta name="keywords" content="カードゲーム,二人,ブラウザゲーム">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <title>カードゲーム二人はペンギン ブラウザゲーム</title>
  <link rel="stylesheet" href="y2card.css">
</head>
<body>

    <div id="game-container">
        <div id="start-screen" class="screen">
            <div class="message-box">
                <h1>カードゲーム二人はペンギン ブラウザゲーム</h1>
                <p>「一番最初」より強いともらえる☆</p><p>友達と対戦可、PCスマホタブレット対応、無料で完全無課金</p>
                <button id="vs-computer-btn">コンピューターと対戦</button>
                <button id="vs-player-btn">2プレイヤーと二人対戦</button>
            </div>
        </div>

        <div id="game-board" class="hidden">
            <div class="score-area" id="opponent-score-area">
                <span id="opponent-name">コンピューター</span>: <span id="opponent-score">0</span>
            </div>
            <div class="hand-area" id="opponent-hand"></div>

            <div class="center-field" id="center-field"></div>

            <div class="score-area" id="player1-score-area">
                1P: <span id="player1-score">0</span>
            </div>
            <div class="hand-area" id="player1-hand"></div>
        </div>

        <div id="game-over-screen" class="screen hidden">
             <div class="message-box">
                <p id="game-over-message"></p>
            </div>
        </div>
    </div>
  
  <script src="/js/y2cardgame.js"></script>
</body>
</html>
