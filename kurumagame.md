<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html dir="ltr" lang="ja">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="description" content="車ブラウザゲーム無料スマホタブレット対応の縦画面です。">
        <meta name="keywords" content="車,ブラウザ,ゲーム,無料,タブレット">
        <meta http-equiv="Content-Style-Type" content="text/css">
        <meta http-equiv="Content-Script-Type" content="text/javascript">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <link rel="stylesheet" href="/css/style.css">
        <title>車ブラウザゲーム無料スマホタブレット対応</title>
    <style>
        body {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background-color: #888;
            font-family: sans-serif;
            -webkit-user-select: none; /* iOS Safari */
            -moz-user-select: none; /* Firefox */
            -ms-user-select: none; /* IE/Edge */
            user-select: none; /* Standard */
        }
#game-overlay {
  width: 100%;
  height: 40vh;          /* ビューポートの40%高さに設定 */
  max-height: 300px;     /* 任意で上限px指定 */
  overflow: hidden;      /* はみ出た部分は隠す */
  position: relative;    /* 内部で絶対配置する場合の基準 */
  background: #000;      /* 任意で背景色 */
  z-index: 100;          /* 他コンテンツより手前に表示 */
}


        canvas {
            border: 2px solid #333;
            background-color: #000000; /* 道路の色 */
            touch-action: manipulation; /* タップの遅延を防ぐ */
        }
        #controls {
            display: flex;
            gap: 10px;
            margin-top: 10px;
        }
        .control-button {
            width: 80px;
            height: 80px;
            font-size: 1.5em;
            font-weight: bold;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 10px;
            box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
            cursor: pointer;
            -webkit-tap-highlight-color: transparent; /* タップ時のハイライトを無効化 */
        }
        .control-button.left-right {
            background-color: #008CBA;
        }
        .control-button:active {
            transform: translateY(2px);
            box-shadow: 0 0 3px rgba(0,0,0,0.3);
        }
        #gameStatus {
            margin-top: 10px;
            font-size: 1.2em;
            display: flex;
            gap: 20px;
        }
        #startButton {
            padding: 15px 30px;
            font-size: 1.5em;
            background-color: #f44336;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            margin-top: 20px;
            box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
        }
        #startButton:active {
            transform: translateY(2px);
        }
    </style>
  </head>
    <body>
        <div id="container">
        <div id="banner">
        <h1><a href="https://memoc.pages.dev/kurumagame/">車ブラウザゲーム無料スマホタブレット対応</a></h1>

        </div>

    <canvas id="gameCanvas" width="380" height="450"></canvas> <div id="gameStatus">
        <p>燃料: <span id="fuel">100</span></p>
        <p>耐久度: <span id="durability">100</span></p>
        <p>距離: <span id="distance">0</span> m</p>
    </div>

    <div id="controls">
    <button id="downButton" class="control-button">▼</button>
        <button id="upButton" class="control-button">▲</button>
        <button id="leftButton" class="control-button left-right">◀</button>
        <button id="rightButton" class="control-button left-right">▶</button>
    </div>

        <button id="startButton">開始</button>　　

    <script src="/js/game.js"></script>

</div>
    </body>
</html>