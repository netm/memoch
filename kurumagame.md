<!DOCTYPE html>
<html lang="ja" dir="ltr">
  <head>
    <meta charset="UTF-8">
    <meta name="description" content="車ブラウザゲーム無料スマホタブレット対応の縦画面です。">
    <meta name="keywords" content="車,ブラウザ,ゲーム,無料,タブレット">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <link rel="stylesheet" href="css/style.css">
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
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      #game-overlay {
        width: 100%;
        height: 40vh;
        max-height: 300px;
        overflow: hidden;
        position: relative;
        background: #000;
        z-index: 100;
      }
      canvas {
        border: 2px solid #333;
        background-color: #000;
        touch-action: manipulation;
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
        -webkit-tap-highlight-color: transparent;
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
        <h1>
          <a href="https://memoc.pages.dev/kurumagame/">
            車ブラウザゲーム無料スマホタブレット対応
          </a>
        </h1>
      </div>

      <canvas id="gameCanvas" width="380" height="450"></canvas>

      <div id="gameStatus">
        <p>燃料: <span id="fuel">100</span></p>
        <p>耐久度: <span id="durability">100</span></p>
        <p>距離: <span id="distance">0</span> m</p>
      </div>

      <div id="controls">
        <button id="downButton" class="control-button">▼</button>
        <button id="upButton"   class="control-button">▲</button>
        <button id="leftButton" class="control-button left-right">◀</button>
        <button id="rightButton" class="control-button left-right">▶</button>
      </div>

      <button id="startButton">開始</button>

      <script src="js/game.js"></script>
    </div>
  </body>
</html>