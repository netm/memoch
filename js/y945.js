        /**
         * ゲームの状態管理クラス
         */
        class Game {
            constructor() {
                this.chairs = []; // {id: 1-12, active: true}
                this.p1 = { score: 0, shocks: 0 };
                this.p2 = { score: 0, shocks: 0, isCom: false };
                this.turn = 'p1_set'; // p1_set, p2_pick, p2_set, p1_pick
                this.currentTrap = null;
                this.mode = 'cpu'; // 'cpu' or 'pvp'
                this.elements = {
                    menu: document.getElementById('menuScreen'),
                    game: document.getElementById('gameScreen'),
                    grid: document.getElementById('chairGrid'),
                    msg: document.getElementById('messageText'),
                    p1Score: document.getElementById('p1Score'),
                    p2Score: document.getElementById('p2Score'),
                    p1Life: document.getElementById('p1Life'),
                    p2Life: document.getElementById('p2Life'),
                    turn: document.getElementById('turnIndicator'),
                    p2Name: document.getElementById('p2Name')
                };
            }

            init(mode) {
                this.mode = mode;
                this.p2.isCom = (mode === 'cpu');
                this.elements.p2Name.textContent = this.p2.isCom ? "COM" : "2P";
               
                // リセット
                this.chairs = Array.from({length: 12}, (_, i) => ({ id: i + 1, active: true }));
                this.p1 = { score: 0, shocks: 0 };
                this.p2 = { score: 0, shocks: 0, isCom: (mode === 'cpu') };
                this.turn = 'p1_set';
                this.currentTrap = null;

                this.updateUI();
                this.renderChairs();
               
                this.elements.menu.classList.add('hidden');
                this.elements.game.classList.remove('hidden');
               
                this.setMessage("1Pの番です。<br>電流を仕掛けるイスを選んでください。");
                this.elements.turn.textContent = "1P SET TRAP";
                this.elements.turn.className = "bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold";
            }

            renderChairs() {
                this.elements.grid.innerHTML = '';
                this.chairs.forEach(chair => {
                    const el = document.createElement('div');
                    el.className = `chair-card ${chair.active ? '' : 'removed'}`;
                    el.textContent = chair.id;
                    el.onclick = () => this.handleChairClick(chair.id);
                    this.elements.grid.appendChild(el);
                });
            }

            handleChairClick(id) {
                const chair = this.chairs.find(c => c.id === id);
                if (!chair || !chair.active) return;

                if (this.turn === 'p1_set') {
                    this.setTrap(id, '1P');
                } else if (this.turn === 'p2_pick') {
                    this.pickChair(id, '2P'); // 2P or COM
                } else if (this.turn === 'p2_set') {
                    this.setTrap(id, '2P');
                } else if (this.turn === 'p1_pick') {
                    this.pickChair(id, '1P');
                }
            }

            setTrap(id, player) {
                // 同じ場所での誤操作防止などの確認は省略しテンポ重視
                this.currentTrap = id;
               
                if (player === '1P') {
                    this.setMessage("電流を設置しました。<br>交代して 相手(2P/COM) が選びます。");
                    this.turn = 'p2_pick';
                    this.elements.turn.textContent = this.p2.isCom ? "COM PICK" : "2P PICK";
                    this.elements.turn.className = "bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold";
                   
                    if (this.p2.isCom) {
                        setTimeout(() => this.comPick(), 1000);
                    }
                } else {
                    // 2P (Human) sets trap
                    this.setMessage("電流を設置しました。<br>交代して 1P が選びます。");
                    this.turn = 'p1_pick';
                    this.elements.turn.textContent = "1P PICK";
                    this.elements.turn.className = "bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold";
                }
            }

            pickChair(id, player) {
                const isP1 = player === '1P';
                const currentScoreObj = isP1 ? this.p1 : this.p2;
                const scoreEl = isP1 ? this.elements.p1Score : this.elements.p2Score;
               
                // イスを消去
                const chairIndex = this.chairs.findIndex(c => c.id === id);
                this.chairs[chairIndex].active = false;
               
                // アニメーション用にDOM取得
                const chairDom = this.elements.grid.children[chairIndex];

                if (id === this.currentTrap) {
                    // 失敗
                    currentScoreObj.score = 0;
                    currentScoreObj.shocks++;
                    this.setMessage(`ビリビリ！ ${player}は感電しました...<br>0点 & ミス${currentScoreObj.shocks}回目`);
                    chairDom.style.backgroundColor = '#FEB2B2'; // 赤っぽく
                    chairDom.textContent = "⚡";
                    this.triggerFlash();
                } else {
                    // 成功
                    currentScoreObj.score += id;
                    this.setMessage(`${player}は ${id}点 GET！<br>（電流は ${this.currentTrap}番 でした）`);
                    chairDom.style.backgroundColor = '#9AE6B4'; // 緑っぽく
                }

                this.updateUI();
                this.renderChairs(); // 状態更新反映

                // 勝利判定
                if (this.checkWin()) return;

                // 次のターンへ準備
                this.currentTrap = null;
                if (isP1) {
                    // 1Pが選び終わった -> 1Pがセットする番へ
                    this.turn = 'p1_set';
                    setTimeout(() => {
                        this.setMessage("1Pの番です。<br>電流を仕掛けるイスを選んでください。");
                        this.elements.turn.textContent = "1P SET TRAP";
                        this.elements.turn.className = "bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold";
                    }, 1500);
                } else {
                    // 2Pが選び終わった -> 2Pがセットする番へ
                    this.turn = 'p2_set';
                    setTimeout(() => {
                         if (this.p2.isCom) {
                            this.comSet();
                        } else {
                            this.setMessage("2Pの番です。<br>電流を仕掛けるイスを選んでください。");
                            this.elements.turn.textContent = "2P SET TRAP";
                            this.elements.turn.className = "bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold";
                        }
                    }, 1500);
                }
            }

            comPick() {
                // COMの思考ルーチン：完全にランダム（心理戦なので）
                // ただし、既に選ばれたイスは選ばない
                const available = this.chairs.filter(c => c.active);
                if (available.length === 0) return;

                // 自分の置いたトラップは避ける（当然）
                // しかし pickChairで自分の置いたトラップIDを知る由もないが、
                // ゲームロジック上は COMがSetした後にCOMがPickすることはないので考慮不要。
                // 1PがセットしたTrapを避けるかどうかは運。
               
                const pick = available[Math.floor(Math.random() * available.length)];
                this.pickChair(pick.id, 'COM');
            }

            comSet() {
                const available = this.chairs.filter(c => c.active);
                if (available.length === 0) return;
               
                const trap = available[Math.floor(Math.random() * available.length)];
               
                this.setMessage("COMが電流を設置中...");
                setTimeout(() => {
                    this.setTrap(trap.id, 'COM'); // 内部処理ではCOM=2P扱いだが表示用ロジックは共有
                   
                    // 2P(COM)がセットした直後、画面遷移
                    this.setMessage("COMが電流を設置しました。<br>1Pの番です。選んでください。");
                    this.turn = 'p1_pick';
                    this.elements.turn.textContent = "1P PICK";
                    this.elements.turn.className = "bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold";
                }, 1000);
            }

            checkWin() {
                let winner = null;
                let reason = "";

                // 40点先取
                if (this.p1.score >= 40) { winner = "1P"; reason = "40点到達！"; }
                else if (this.p2.score >= 40) { winner = this.p2.isCom ? "COM" : "2P"; reason = "40点到達！"; }
               
                // 3回感電
                else if (this.p1.shocks >= 3) { winner = this.p2.isCom ? "COM" : "2P"; reason = "1Pが3回感電"; }
                else if (this.p2.shocks >= 3) { winner = "1P"; reason = (this.p2.isCom ? "COM" : "2P") + "が3回感電"; }

                // 残りイス1個
                else if (this.chairs.filter(c => c.active).length <= 1) {
                    if (this.p1.score > this.p2.score) { winner = "1P"; reason = "最終スコア判定"; }
                    else if (this.p2.score > this.p1.score) { winner = this.p2.isCom ? "COM" : "2P"; reason = "最終スコア判定"; }
                    else { winner = "DRAW"; reason = "引き分け"; }
                }

                if (winner) {
                    this.endGame(winner, reason);
                    return true;
                }
                return false;
            }

            endGame(winner, reason) {
                this.turn = 'gameover';
                const msg = winner === "DRAW"
                    ? `引き分け！ (${reason})<br>リトライ？`
                    : `${winner} の勝ち！！ (${reason})<br>リトライ？`;
               
                this.setMessage(msg);
               
                // メッセージエリアをクリックでリセットできるようにする
                this.elements.msg.parentElement.style.cursor = "pointer";
                this.elements.msg.parentElement.classList.add("bg-yellow-100", "animate-pulse");
                this.elements.msg.parentElement.onclick = () => {
                    location.reload();
                };
            }

            updateUI() {
                this.elements.p1Score.textContent = this.p1.score;
                this.elements.p2Score.textContent = this.p2.score;
               
                // ライフ表示（感電回数に応じて⚡をグレーアウト）
                const updateLife = (shocks, el) => {
                    const spans = el.children;
                    for(let i=0; i<3; i++) {
                        spans[i].style.opacity = i < (3 - shocks) ? '1' : '0.2';
                    }
                };
                updateLife(this.p1.shocks, this.elements.p1Life);
                updateLife(this.p2.shocks, this.elements.p2Life);
            }

            setMessage(html) {
                this.elements.msg.innerHTML = html;
            }

            triggerFlash() {
                document.body.classList.add('flash-error');
                setTimeout(() => document.body.classList.remove('flash-error'), 500);
            }
        }

        const game = new Game();

        function startGame(mode) {
            game.init(mode);
        }

        // シェア機能
        function share(platform) {
            const url = encodeURIComponent(window.location.href);
            const text = encodeURIComponent("心理戦頭脳バトル！「電気イスゲーム」で勝負しよう！ #電気イスゲーム");
            let shareUrl = "";

            switch(platform) {
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
                    break;
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                    break;
                case 'line':
                    shareUrl = `https://social-plugins.line.me/lineit/share?url=${url}`;
                    break;
                case 'email':
                    shareUrl = `mailto:?subject=電気イスゲーム&body=${text} ${url}`;
                    break;
                case 'native':
                    if (navigator.share) {
                        navigator.share({
                            title: '電気イスゲーム',
                            text: '心理戦頭脳バトル！',
                            url: window.location.href,
                        });
                        return;
                    } else {
                        alert('お使いのブラウザはネイティブシェアに対応していません。');
                        return;
                    }
            }
            if (shareUrl) window.open(shareUrl, '_blank');
        }