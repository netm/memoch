<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html dir="ltr" lang="ja">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="description" content="車ブラウザゲーム無料PCパソコン用です。PCはパソコンの矢印ボタンで操作可能です。">
        <meta name="keywords" content="車,ブラウザ,ゲーム,無料,PC">
        <meta http-equiv="Content-Style-Type" content="text/css">
        <meta http-equiv="Content-Script-Type" content="text/javascript">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <link rel="stylesheet" href="/css/style.css">
        <title>車ブラウザゲーム無料PCパソコン用</title>
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
            font-size: 1em;
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
            margin-top: 4px;
            font-size: 1.2em;
            display: flex;
            gap: 20px;
        }
        #startButton {
            padding: 15px 30px;
            font-size: 1em;
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
        <h1><a href="https://memoc.pages.dev/kurumagamepc/">車ブラウザゲーム無料PCパソコン用</a></h1>

        </div>


    <canvas id="gameCanvas" width="1000" height="350"></canvas> <div id="gameStatus">
        <p>燃料: <span id="fuel">100</span></p>
        <p>耐久度: <span id="durability">100</span></p>
        <p>距離: <span id="distance">0</span> m</p>　<p><a href="https://memoc.pages.dev/game1/" target="_blank">無料ブラウザゲームPCスマホタブレット対応</a></p>　<p><a href="https://memoc.pages.dev/">メモ帳代わりwebブラウザ便利サイト</a></p>
    </div>

    <div id="controls">
        <button id="upButton" class="control-button">▲</button>
    <button id="downButton" class="control-button">▼</button>
        <button id="startButton">開始</button>
        <button id="leftButton" class="control-button left-right">◀</button>
        <button id="rightButton" class="control-button left-right">▶</button>　　<p>PCはパソコンキーボードの矢印ボタンで操作可能</p>
    </div>


         <p>無料ゲーム集</p>
<p class="left"><a href="https://memoc.pages.dev/game1/" target="_blank">無料ブラウザゲームPCスマホタブレット対応</a></p>
    <script src="/js/game.js"></script>
</div>
    </body>
</html>