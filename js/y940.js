document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const timeDisplay = document.getElementById('time-display');
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const resultText = document.getElementById('result-text');
    const mode1pBtn = document.getElementById('mode-1p');
    const mode2pBtn = document.getElementById('mode-2p');
    const statusText = document.getElementById('game-status');

    // Share Buttons
    document.getElementById('share-x').addEventListener('click', () => shareSocial('x'));
    document.getElementById('share-fb').addEventListener('click', () => shareSocial('fb'));
    document.getElementById('share-line').addEventListener('click', () => shareSocial('line'));
    document.getElementById('share-email').addEventListener('click', () => shareSocial('email'));
    document.getElementById('share-native').addEventListener('click', shareNative);

    // Game Variables
    let timerInterval;
    let startTime;
    let isRunning = false;
    let gameMode = 1; // 1 or 2
    let currentPlayer = 1;
    let p1Score = null;
    let p2Score = null;

    const TARGET_TIME = 7.77;

    // Mode Selection
    mode1pBtn.addEventListener('click', () => setMode(1));
    mode2pBtn.addEventListener('click', () => setMode(2));

    function setMode(mode) {
        gameMode = mode;
        mode1pBtn.classList.toggle('active', mode === 1);
        mode2pBtn.classList.toggle('active', mode === 2);
        resetGame();
        statusText.textContent = mode === 2 ? "プレイヤー1の番です" : "スタートボタンを押してね";
    }

    // Game Controls
    startBtn.addEventListener('click', () => {
        if (isRunning) return;
        isRunning = true;
        startTime = Date.now();
        timeDisplay.textContent = "?秒??";
        resultText.textContent = "";
        resultText.className = "result-area";
       
        startBtn.disabled = true;
        stopBtn.disabled = false;
       
        // Internal timer just for logic if needed, but display is hidden
        timerInterval = setInterval(() => {
            // Background tick
        }, 10);
    });

    stopBtn.addEventListener('click', () => {
        if (!isRunning) return;
        isRunning = false;
        clearInterval(timerInterval);
       
        const endTime = Date.now();
        const elapsed = (endTime - startTime) / 1000;
        const formattedTime = elapsed.toFixed(2);
       
        timeDisplay.textContent = `${formattedTime}秒`; // e.g. 7.56秒
       
        startBtn.disabled = false;
        stopBtn.disabled = true;

        handleResult(parseFloat(formattedTime));
    });

    function handleResult(time) {
        if (gameMode === 1) {
            displaySingleResult(time);
        } else {
            handleMultiplayer(time);
        }
    }

    function displaySingleResult(time) {
        let message = "";
        let msgClass = "";

        if (time === 7.77) {
            message = "おめでとう!! 幸運をよぶエンジェルナンバー☆☆☆";
            msgClass = "result-perfect";
        } else if ((time >= 7.67 && time <= 7.76) || (time >= 7.78 && time <= 7.87)) {
            message = `幸運はすぐ近くに☆ (タイム: ${time}秒)`;
            msgClass = "result-near";
        } else {
            message = `もう一度挑戦する? (タイム: ${time}秒)`;
            msgClass = "result-normal";
        }
       
        resultText.innerHTML = message;
        resultText.className = `result-area ${msgClass}`;
    }

    function handleMultiplayer(time) {
        if (currentPlayer === 1) {
            p1Score = time;
            resultText.textContent = `1P記録: ${time}秒。次は2Pの番です！`;
            currentPlayer = 2;
            statusText.textContent = "プレイヤー2の番です";
            // Clean up UI for next player
            setTimeout(() => {
                 if(currentPlayer === 2) timeDisplay.textContent = "0秒00";
            }, 1500);
        } else {
            p2Score = time;
            determineWinner(p1Score, p2Score);
            currentPlayer = 1; // Reset for next game
            statusText.textContent = "対戦終了！モードボタンでリセット";
        }
    }

    function determineWinner(score1, score2) {
        const diff1 = Math.abs(score1 - TARGET_TIME);
        const diff2 = Math.abs(score2 - TARGET_TIME);
       
        let winMsg = "";
        let detailMsg = `<br><small>1P: ${score1}秒 vs 2P: ${score2}秒</small>`;

        if (score1 === 7.77 && score2 === 7.77) {
            winMsg = "奇跡の引き分け!! ダブルエンジェルナンバー☆☆☆";
        } else if (diff1 < diff2) {
            winMsg = "1Pの勝ち☆";
        } else if (diff2 < diff1) {
            winMsg = "2Pの勝ち☆";
        } else {
            winMsg = "引き分け";
        }

        // Logic for specific lucky messages in 2P
        if (score1 === 7.77 || score2 === 7.77) {
            winMsg = "おめでとう!! 幸運をよぶエンジェルナンバー☆☆☆<br>" + winMsg;
            resultText.className = "result-area result-perfect";
        } else {
             resultText.className = "result-area result-near";
        }

        resultText.innerHTML = winMsg + detailMsg;
    }

    function resetGame() {
        clearInterval(timerInterval);
        isRunning = false;
        currentPlayer = 1;
        p1Score = null;
        p2Score = null;
        timeDisplay.textContent = "0秒00";
        resultText.textContent = "";
        startBtn.disabled = false;
        stopBtn.disabled = true;
    }

    // Sharing Logic
    function shareSocial(platform) {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent("777エンジェルナンバーゲームで運試し！7.77秒を目指そう！ #777ゲーム");
        let shareUrl = "";

        switch(platform) {
            case 'x':
                shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
                break;
            case 'fb':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
            case 'line':
                shareUrl = `https://social-plugins.line.me/lineit/share?url=${url}`;
                break;
            case 'email':
                shareUrl = `mailto:?subject=面白いゲーム見つけたよ&body=${text} ${url}`;
                break;
        }
        if(shareUrl) window.open(shareUrl, '_blank');
    }

    async function shareNative() {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: '777エンジェルナンバーゲーム',
                    text: '7.77秒を目指すシンプルゲーム！',
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Share canceled');
            }
        } else {
            alert('お使いのブラウザはシェア機能に対応していません。');
        }
    }

    // Initial State
    stopBtn.disabled = true;
});