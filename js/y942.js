/* javascript.js */
document.addEventListener('DOMContentLoaded', () => {
    // Audio Context Setup
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx = new AudioContext();
    const volumeSlider = document.getElementById('volume-slider');

    // DOM Elements
    const buttons = {
        red: document.getElementById('btn-red'),
        blue: document.getElementById('btn-blue'),
        green: document.getElementById('btn-green'),
        yellow: document.getElementById('btn-yellow')
    };
   
    const countButtons = {
        2: document.getElementById('mode-2'),
        3: document.getElementById('mode-3'),
        4: document.getElementById('mode-4')
    };

    let isLocked = false;
    let currentMode = 4; // Default 4 players

    // Sound Synthesis (Ping-Pong Chime)
    function playChime() {
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const vol = parseFloat(volumeSlider.value);
        const oscillator1 = audioCtx.createOscillator();
        const gainNode1 = audioCtx.createGain();
       
        oscillator1.type = 'sine';
        oscillator1.frequency.setValueAtTime(660, audioCtx.currentTime); // High
        oscillator1.frequency.setValueAtTime(550, audioCtx.currentTime + 0.2); // Low (Ping-Pong)
       
        gainNode1.gain.setValueAtTime(vol, audioCtx.currentTime);
        gainNode1.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.5);

        oscillator1.connect(gainNode1);
        gainNode1.connect(audioCtx.destination);

        oscillator1.start();
        oscillator1.stop(audioCtx.currentTime + 1.5);
    }

    // Buzzer Logic
    function activateBuzzer(color) {
        if (isLocked) return;

        // Check if button is visible in current mode
        const btn = buttons[color];
        if (btn.style.display === 'none') return;

        isLocked = true;
        playChime();
       
        // Add active class
        btn.classList.add('active-buzzer');
       
        // 5 Seconds Lockout/Highlight
        setTimeout(() => {
            btn.classList.remove('active-buzzer');
            isLocked = false;
        }, 5000);
    }

    // Player Count Logic
    function setPlayerCount(count) {
        currentMode = count;
       
        // Reset styles
        Object.values(countButtons).forEach(b => b.classList.remove('active-mode'));
        countButtons[count].classList.add('active-mode');

        // Show/Hide buttons
        buttons.red.style.display = 'flex'; // Always show
        buttons.blue.style.display = 'flex'; // Always show
       
        buttons.green.style.display = (count >= 3) ? 'flex' : 'none';
        buttons.yellow.style.display = (count >= 4) ? 'flex' : 'none';
    }

    // Event Listeners for Player Modes
    countButtons[2].addEventListener('click', () => setPlayerCount(2));
    countButtons[3].addEventListener('click', () => setPlayerCount(3));
    countButtons[4].addEventListener('click', () => setPlayerCount(4));

    // Event Listeners for Buzzers (Click/Touch)
    Object.keys(buttons).forEach(color => {
        buttons[color].addEventListener('mousedown', (e) => {
            e.preventDefault();
            activateBuzzer(color);
        });
        buttons[color].addEventListener('touchstart', (e) => {
            e.preventDefault(); // Prevent double firing
            activateBuzzer(color);
        }, {passive: false});
    });

    // Keyboard Support
    document.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        if (key === 'q') activateBuzzer('red');
        if (key === '9') activateBuzzer('blue');
        if (key === 'p') activateBuzzer('green');
        if (key === 't') activateBuzzer('yellow');
    });

    // Native Share
    const shareBtn = document.getElementById('btn-share-native');
    shareBtn.addEventListener('click', async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: document.title,
                    text: '早押しボタンアプリで遊ぼう！',
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Share canceled');
            }
        } else {
            alert('お使いのブラウザはシェア機能に対応していません。URLをコピーしてください。');
        }
    });

    // Initialize
    setPlayerCount(4);
});