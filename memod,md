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

<div class="container">
    <div class="calculator-container">
        <div class="settings">
            <select id="modeSelector">
                <option value="calculator">電卓</option>
                <option value="currency">通貨</option>
                <option value="length">長さ</option>
                <option value="weight">重さ</option>
                <option value="fraction">分数</option>
                <option value="time">時間</option>
                <option value="sqrt">ルート(√)</option>
            </select>
            <div>
                <label for="taxRate">税率(%):</label>
                <input type="number" id="taxRate" value="10">
            </div>
        </div>
        <div id="display">0</div>

        <div id="currencyMode" class="mode-specific">
            <div class="controls">
                <span>入力した数値を変換します</span>
                <select id="fromUnit">
                    <option value="JPY">円 (JPY)</option>
                    <option value="USD">ドル (USD)</option>
                    <option value="EUR">ユーロ (EUR)</option>
                </select>
                <span>↓</span>
                <select id="toUnit">
                    <option value="USD">ドル (USD)</option>
                    <option value="JPY">円 (JPY)</option>
                    <option value="EUR">ユーロ (EUR)</option>
                </select>
                <button id="convertBtn">変換</button>
            </div>
        </div>

        <div id="lengthMode" class="mode-specific">
             <div class="controls">
                <span>入力した数値を変換します</span>
                <select id="fromUnit">
                    <option value="m">メートル (m)</option>
                    <option value="cm">センチメートル (cm)</option>
                    <option value="km">キロメートル (km)</option>
                    <option value="in">インチ (in)</option>
                    <option value="ft">フィート (ft)</option>
                </select>
                <span>↓</span>
                <select id="toUnit">
                    <option value="cm">センチメートル (cm)</option>
                    <option value="m">メートル (m)</option>
                    <option value="km">キロメートル (km)</option>
                    <option value="in">インチ (in)</option>
                    <option value="ft">フィート (ft)</option>
                </select>
                <button id="convertLengthBtn">変換</button>
            </div>
        </div>
        
        <div id="weightMode" class="mode-specific">
             <div class="controls">
                <span>入力した数値を変換します</span>
                <select id="fromUnit">
                    <option value="kg">キログラム (kg)</option>
                    <option value="g">グラム (g)</option>
                    <option value="lb">ポンド (lb)</option>
                    <option value="oz">オンス (oz)</option>
                </select>
                <span>↓</span>
                <select id="toUnit">
                    <option value="g">グラム (g)</option>
                    <option value="kg">キログラム (kg)</option>
                    <option value="lb">ポンド (lb)</option>
                    <option value="oz">オンス (oz)</option>
                </select>
                <button id="convertWeightBtn">変換</button>
            </div>
        </div>

        <div id="timeMode" class="mode-specific">
             <div class="controls">
                <span>入力した数値を変換します</span>
                <select id="fromUnit">
                    <option value="hr">時間</option>
                    <option value="min">分</option>
                    <option value="s">秒</option>
                    <option value="day">日</option>
                </select>
                <span>↓</span>
                <select id="toUnit">
                    <option value="min">分</option>
                    <option value="hr">時間</option>
                    <option value="s">秒</option>
                    <option value="day">日</option>
                </select>
                <button id="convertTimeBtn">変換</button>
            </div>
        </div>

        <div id="fractionMode" class="mode-specific">
            <div class="controls">
                <div class="fraction-inputs">
                    <input type="text" id="fraction1" placeholder="例: 1/2">
                    <select id="fractionOp">
                        <option value="+">+</option>
                        <option value="-">-</option>
                        <option value="×">×</option>
                        <option value="÷">÷</option>
                    </select>
                    <input type="text" id="fraction2" placeholder="例: 3/4">
                </div>
                <button id="calculateFractionBtn">分数計算</button>
            </div>
        </div>
        
        <div class="calculator-buttons">
            <button data-action="clear-all" class="wide-button">すべて消去</button>
            <button data-action="undo">⌫</button>
            <button data-action="operator" data-value="÷">÷</button>

            <button data-action="special" data-value="%">%</button>
            <button data-action="operator" data-value="^">xʸ</button>
            <button data-action="special" data-value="√">√</button>
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
            <button data-action="calculate" data-value="=" rowspan="2" style="grid-row: span 2;">=</button>

            <button data-action="special" data-value="tax">税込</button>
            <button data-action="number" data-value="0">0</button>
            <button data-action="number" data-value=".">.</button>
        </div>

        <div class="footer-link">
            
    <a href="https://memoc.pages.dev/" target="_blank">メモ帳代わりwebブラウザ便利サイト</a>
        </div>
    </div>

    <div class="history-container">
        <h2>計算履歴</h2>
        <ul id="historyList"></ul>
        <div class="history-buttons">
            <button id="savePngBtn">PNGで保存</button>
            <button id="clearHistoryBtn">履歴を消去</button>
        </div>
    </div>
</div>

<script src="/js/z999.js"></script>

</body>
</html>