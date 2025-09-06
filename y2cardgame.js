document.addEventListener('DOMContentLoaded', () => {
    // DOM要素の取得
    const startScreen = document.getElementById('start-screen');
    const vsComputerBtn = document.getElementById('vs-computer-btn');
    const vsPlayerBtn = document.getElementById('vs-player-btn');
    const gameBoard = document.getElementById('game-board');
    const gameOverScreen = document.getElementById('game-over-screen');

    const player1HandEl = document.getElementById('player1-hand');
    const opponentHandEl = document.getElementById('opponent-hand');
    const centerFieldEl = document.getElementById('center-field');

    const player1ScoreEl = document.getElementById('player1-score');
    const opponentScoreEl = document.getElementById('opponent-score');
    const opponentNameEl = document.getElementById('opponent-name');
    const gameOverMessageEl = document.getElementById('game-over-message');

    // ゲーム状態の変数
    let player1Hand = [];
    let opponentHand = [];
    let player1Score = 0;
    let opponentScore = 0;
    let centerFieldCards = [];
    let currentPlayer = 1;
    let opponentType = 'computer'; // 'computer' or 'human'
    let isInputEnabled = true;
    let selectedIndex = 0; // キーボード操作用の選択インデックス

    const initialCards = [0, 1, 2, 3, 4, 5];

    // イベントリスナーの設定
    vsComputerBtn.addEventListener('click', () => startGame('computer'));
    vsPlayerBtn.addEventListener('click', () => startGame('human'));
    
    // ゲーム初期化
    function initGame() {
        // スコアとカードのリセット
        player1Score = 0;
        opponentScore = 0;
        centerFieldCards = [];
        currentPlayer = 1;
        isInputEnabled = true;
        selectedIndex = 0;

        // 手札をシャッフル
        player1Hand = shuffle([...initialCards]);
        opponentHand = shuffle([...initialCards]);

        // 表示の更新
        updateScores();
        renderHands();
        centerFieldEl.innerHTML = '';
        
        // 画面の切り替え
        startScreen.classList.add('hidden');
        gameOverScreen.classList.add('hidden');
        gameBoard.classList.remove('hidden');

        updateCursor();
        
        // 最初のプレイヤーが人間でなければAIを始動
        if (currentPlayer === 2 && opponentType === 'computer') {
            isInputEnabled = false;
            setTimeout(computerTurn, 2000);
        }
    }
    
    // ゲーム開始処理
    function startGame(type) {
        opponentType = type;
        opponentNameEl.textContent = (type === 'computer') ? 'コンピューター' : '2P';
        initGame();
    }

    // 手札の描画
    function renderHands() {
        player1HandEl.innerHTML = '';
        opponentHandEl.innerHTML = '';

        for (let i = 0; i < 6; i++) {
            // プレイヤー1の手札
            const p1CardEl = createCardElement(1, i, player1Hand[i]);
            player1HandEl.appendChild(p1CardEl);

            // 対戦相手の手札
            const opCardEl = createCardElement(2, i, opponentHand[i]);
            opponentHandEl.appendChild(opCardEl);
        }
    }

    // カード要素の作成
    function createCardElement(player, index, value) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.player = player;
        card.dataset.index = index;
        card.dataset.value = value;
        
        const cardFront = document.createElement('div');
        cardFront.classList.add('card-face', 'card-front');

        if (value === 0) {
            const img = document.createElement('img');
            img.src = 'z2card.png';
            img.alt = 'Z2 Card';
            cardFront.appendChild(img);
        } else {
            cardFront.textContent = value;
        }

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-face', 'card-back');

        card.appendChild(cardBack);
        card.appendChild(cardFront);

        // クリック/タッチイベント
        if (player === 1 || (player === 2 && opponentType === 'human')) {
             card.addEventListener('click', () => handleCardSelection(player, index));
        }
       
        return card;
    }

    // カード選択のハンドリング
    function handleCardSelection(player, index) {
        if (!isInputEnabled || player !== currentPlayer) return;
        
        const hand = (player === 1) ? player1Hand : opponentHand;
        const cardEl = document.querySelector(`.card[data-player='${player}'][data-index='${index}']`);

        if (hand[index] === null || (cardEl && cardEl.classList.contains('used'))) return;

        isInputEnabled = false;
        flipCard(player, index, hand[index]);
    }

    // カードをめくる処理
    function flipCard(player, index, value) {
        const cardEl = document.querySelector(`.card[data-player='${player}'][data-index='${index}']`);
        if(!cardEl) return;
        
        cardEl.classList.add('flipped');

        setTimeout(() => {
            cardEl.classList.add('used');

            const hand = (player === 1) ? player1Hand : opponentHand;
            hand[index] = null; // カードを使用済みにする

            evaluateCard(player, value);
        }, 1500); // 1.5秒表示
    }

    // めくったカードの評価と処理
    function evaluateCard(player, flippedValue) {
        let takenCards = [flippedValue];
        let pointsToAdd = 0;

        if (centerFieldCards.length === 0) {
            // 中央が空の場合
            centerFieldCards.push(flippedValue);
        } else {
            const centerValue = centerFieldCards[0];
            // 条件を満たすかチェック (めくったカード > 中央のカード または めくったカードが0)
            if (flippedValue > centerValue || flippedValue === 0) {
                takenCards.push(...centerFieldCards);
                centerFieldCards = []; // 中央のカードをすべて取得
            } else {
                centerFieldCards.push(flippedValue);
                takenCards = []; // カードは取得せず中央に残す
            }
        }
        
        // ポイント加算
        if (takenCards.length > 1) { // 取得したカードが複数ある場合のみ（自身が置いたカード＋α）
             pointsToAdd = takenCards.reduce((sum, val) => sum + val, 0);
             if (player === 1) {
                 player1Score += pointsToAdd;
             } else {
                 opponentScore += pointsToAdd;
             }
        }
        
        updateScores();
        renderCenterField();

        if (checkGameOver()) {
            endGame();
        } else {
            switchTurn();
        }
    }

    // ターンを切り替える
    function switchTurn() {
        currentPlayer = (currentPlayer === 1) ? 2 : 1;
        updateCursor(true); // カーソル位置をリセット

        if (currentPlayer === 2 && opponentType === 'computer') {
            isInputEnabled = false;
            setTimeout(computerTurn, 1500); // コンピューターの思考時間
        } else {
            isInputEnabled = true;
        }
    }
    
    // ▼▼▼▼▼ 修正箇所 ▼▼▼▼▼
    // コンピューターのターン
    function computerTurn() {
        // まだめくられていないカードのインデックスを探す
        const availableIndices = [];
        for(let i = 0; i < opponentHand.length; i++) {
            if(opponentHand[i] !== null) {
                availableIndices.push(i);
            }
        }

        if (availableIndices.length > 0) {
            // ランダムに一枚選ぶ
            const chosenIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
            const cardValue = opponentHand[chosenIndex];
            
            // プレイヤーの入力チェックを介さず、直接カードをめくる処理を呼び出す
            flipCard(2, chosenIndex, cardValue);
        }
    }
    // ▲▲▲▲▲ 修正箇所 ▲▲▲▲▲

    // ゲーム終了チェック
    function checkGameOver() {
        const p1Done = player1Hand.every(card => card === null);
        const opDone = opponentHand.every(card => card === null);
        return p1Done && opDone;
    }

    // ゲーム終了処理
    function endGame() {
        isInputEnabled = false;
        let message = '';
        if (player1Score > opponentScore) {
            message = '1Pの勝利☆<br>再対戦する';
        } else if (opponentScore > player1Score) {
            const winner = (opponentType === 'computer') ? 'コンピューター' : '2P';
            message = `${winner}の勝利☆<br>再対戦する`;
        } else {
            message = '引き分け<br>再対戦する';
        }

        gameOverMessageEl.innerHTML = message;
        
        setTimeout(() => {
             gameBoard.classList.add('hidden');
             gameOverScreen.classList.remove('hidden');
             // ゲームオーバー画面での入力受付を開始
             isInputEnabled = true;
        }, 1500);
    }
    
    // スコア表示の更新
    function updateScores() {
        player1ScoreEl.textContent = player1Score;
        opponentScoreEl.textContent = opponentScore;
    }

    // 中央の場を描画
    function renderCenterField() {
        centerFieldEl.innerHTML = '';
        centerFieldCards.forEach(value => {
            const card = document.createElement('div');
            card.classList.add('card', 'flipped');
            
            const cardFront = document.createElement('div');
            cardFront.classList.add('card-face', 'card-front');
            
            if (value === 0) {
                const img = document.createElement('img');
                img.src = 'z2card.png';
                img.alt = 'Z2 Card';
                cardFront.appendChild(img);
            } else {
                cardFront.textContent = value;
            }
            
            card.appendChild(cardFront);
            centerFieldEl.appendChild(card);
        });
    }

    // シャッフル関数
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // キーボード操作
    function handleKeyDown(e) {
        const key = e.key.toLowerCase();
        
        // ゲームオーバー時のリスタート
        if (!gameOverScreen.classList.contains('hidden')) {
            if (['enter', ' ', 'q', 'shift'].includes(key)) {
                e.preventDefault();
                initGame();
            }
            return;
        }

        // スタート画面での操作
        if (!startScreen.classList.contains('hidden')) {
             if (['enter', ' ', 'p'].includes(key)) {
                e.preventDefault();
                startGame('computer'); // デフォルトでコンピューター戦を開始
            }
            return;
        }
        
        if (!isInputEnabled) return;

        const isPlayer1Turn = currentPlayer === 1;
        const isPlayer2Turn = currentPlayer === 2 && opponentType === 'human';

        if (!isPlayer1Turn && !isPlayer2Turn) return;

        const currentHand = isPlayer1Turn ? player1Hand : opponentHand;
        
        let newIndex = selectedIndex;
        const maxIndex = 5;

        // カーソル移動
        switch(key) {
            case 'arrowleft': case 'a': case '4':
                do { newIndex = (newIndex - 1 + maxIndex + 1) % (maxIndex + 1); } while (currentHand[newIndex] === null);
                break;
            case 'arrowright': case 'd': case '6':
                do { newIndex = (newIndex + 1) % (maxIndex + 1); } while (currentHand[newIndex] === null);
                break;
            // 上下キーは、ターンによって操作対象を変える
            case 'arrowup': case 'w': case '2':
                 if(isPlayer2Turn) handleCardSelection(2, selectedIndex);
                 break;
            case 'arrowdown': case 's': case '5':
                 if(isPlayer1Turn) handleCardSelection(1, selectedIndex);
                 break;
            // カードをめくる
            case 'enter': case ' ': case 'p':
                 e.preventDefault();
                 handleCardSelection(currentPlayer, selectedIndex);
                 break;
            default:
                return; // 関係ないキーは無視
        }
        
        if (newIndex !== selectedIndex) {
            selectedIndex = newIndex;
            updateCursor();
        }
    }
    
    // キーボードカーソルの更新
    function updateCursor(reset = false) {
        if (reset) {
            selectedIndex = 0;
            // 次のプレイヤーの最初の有効なカードを探す
            const hand = (currentPlayer === 1) ? player1Hand : opponentHand;
            if (hand.every(c => c === null)) return; // 手札がなければ何もしない
            while(hand[selectedIndex] === null && selectedIndex < 5) {
                selectedIndex++;
            }
        }

        // 全カードからselectedクラスを削除
        document.querySelectorAll('.card.selected').forEach(c => c.classList.remove('selected'));
        
        const handOwner = (opponentType === 'human') ? currentPlayer : 1;
        const selector = `.card[data-player='${handOwner}'][data-index='${selectedIndex}']`;
        const selectedCard = document.querySelector(selector);
        
        if (selectedCard && !selectedCard.classList.contains('used')) {
            selectedCard.classList.add('selected');
        }
    }
    
    // 全画面でのイベントリスナー
    document.addEventListener('keydown', handleKeyDown);
    gameOverScreen.addEventListener('click', () => {
        if (isInputEnabled) initGame();
    });
});