document.addEventListener('DOMContentLoaded', () => {
    // DOM要素の取得
    const addItemBtn = document.getElementById('add-item-btn');
    const copyTextBtn = document.getElementById('copy-text-btn');
    const sortByExpiryBtn = document.getElementById('sort-by-expiry-btn');
    const clearAllBtn = document.getElementById('clear-all-btn');
    const saveAsPngBtn = document.getElementById('save-as-png-btn');
    const shareTwitterBtn = document.getElementById('share-twitter-btn');
    const shareLineBtn = document.getElementById('share-line-btn');
    const autoTextArea = document.getElementById('auto-text-area');
    const foodList = document.getElementById('food-list');
    const listContainer = document.getElementById('list-container');

    // 食品データを格納する配列
    let foodItems = [];

    // --- データ管理 ---

    // ローカルストレージからデータを読み込む
    const loadData = () => {
        const storedItems = localStorage.getItem('foodStockManagerItems');
        if (storedItems) {
            foodItems = JSON.parse(storedItems);
        }
    };

    // ローカルストレージにデータを保存する
    const saveData = () => {
        localStorage.setItem('foodStockManagerItems', JSON.stringify(foodItems));
    };

    // --- UI描画 ---

    // 食品リストを再描画する
    const renderList = () => {
        foodList.innerHTML = ''; // リストをクリア
        if (foodItems.length === 0) {
            foodList.innerHTML = '<tr><td colspan="6" class="p-4 text-center text-gray-500">アイテムがありません。「項目追加」ボタンで食品を追加してください。</td></tr>';
        } else {
            foodItems.forEach(item => {
                const tr = document.createElement('tr');
                tr.classList.add('border-b', 'border-gray-200');
                tr.dataset.id = item.id;

                const amountValue = parseInt(item.amount, 10);
                const amountText = amountValue <= 33 ? '少' : amountValue <= 66 ? '中' : '多';

                tr.innerHTML = `
                    <td class="p-2 align-middle">
                        <input type="text" value="${item.name}" class="food-name-input w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" style="color: ${item.color};" placeholder="例: にんじん">
                    </td>
                    <td class="p-2 align-middle min-w-[150px]">
                        <div class="flex items-center gap-2">
                            <span>少</span>
                            <input type="range" min="0" max="100" value="${item.amount}" class="amount-slider w-full cursor-pointer">
                            <span>多</span>
                        </div>
                    </td>
                    <td class="p-2 align-middle">
                        <input type="date" value="${item.expiry}" class="expiry-date-input w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400">
                    </td>
                    <td class="p-2 align-middle">
                        <input type="date" value="${item.purchaseDate}" class="purchase-date-input w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400">
                    </td>
                    <td class="p-2 align-middle">
                        <div class="flex items-center gap-1 flex-wrap">
                            <button class="color-btn w-6 h-6 rounded-full bg-black" data-color="black"></button>
                            <button class="color-btn w-6 h-6 rounded-full bg-red-500" data-color="#ef4444"></button>
                            <button class="color-btn w-6 h-6 rounded-full bg-blue-500" data-color="#3b82f6"></button>
                            <button class="color-btn w-6 h-6 rounded-full bg-green-500" data-color="#22c55e"></button>
                            <button class="color-btn w-6 h-6 rounded-full bg-orange-500" data-color="#f97316"></button>
                            <input type="color" value="${item.color}" class="color-picker w-8 h-8 p-0 border-none rounded-full cursor-pointer">
                        </div>
                    </td>
                    <td class="p-2 align-middle text-center">
                        <button class="delete-btn bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors">消去</button>
                    </td>
                `;
                foodList.appendChild(tr);
            });
        }
        updateAutoText();
    };

    // 自動作成文章を更新する
    const updateAutoText = () => {
        let text = "【冷蔵庫・冷凍庫の中身リスト】\n";
        const sortedItems = [...foodItems].sort((a, b) => {
            if (a.expiry === b.expiry) return 0;
            if (!a.expiry) return 1;
            if (!b.expiry) return -1;
            return new Date(a.expiry) - new Date(b.expiry);
        });
        
        sortedItems.forEach(item => {
            if (item.name) {
                const amountValue = parseInt(item.amount, 10);
                const amountText = amountValue <= 33 ? '少' : amountValue <= 66 ? '中' : '多';
                const expiryText = item.expiry ? `${item.expiry.replace(/-/g, '/')}まで` : '期限未設定';
                const purchaseText = item.purchaseDate ? `${item.purchaseDate.replace(/-/g, '/')}購入` : '';
                text += `・${item.name} | ${amountText} | ${expiryText} | ${purchaseText}\n`;
            }
        });
        autoTextArea.value = text;
    };
    
    // --- イベントハンドラ ---

    // 項目追加ボタン
    addItemBtn.addEventListener('click', () => {
        const newItem = {
            id: Date.now(),
            name: '',
            amount: 50,
            expiry: '',
            purchaseDate: '',
            color: '#000000'
        };
        foodItems.unshift(newItem); // 先頭に追加
        renderList();
        saveData();
    });

    // 文章コピーボタン
    copyTextBtn.addEventListener('click', () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(autoTextArea.value).then(() => {
                alert('文章をコピーしました。');
            }).catch(err => {
                alert('コピーに失敗しました。');
            });
        } else {
            autoTextArea.select();
            document.execCommand('copy');
            alert('文章をコピーしました。');
        }
    });

    // 期限の短い順に並べるボタン
    sortByExpiryBtn.addEventListener('click', () => {
        foodItems.sort((a, b) => {
            if (a.expiry === b.expiry) return 0;
            if (!a.expiry) return 1;
            if (!b.expiry) return -1;
            return new Date(a.expiry) - new Date(b.expiry);
        });
        renderList();
        saveData();
    });

    // すべて消去ボタン
    clearAllBtn.addEventListener('click', () => {
        if (confirm('すべての項目を消去します。よろしいですか？')) {
            foodItems = [];
            renderList();
            saveData();
        }
    });

    // PNG画像で保存ボタン
    saveAsPngBtn.addEventListener('click', () => {
        // html2canvasライブラリを使用してリストを画像に変換
        html2canvas(listContainer, {
            backgroundColor: '#ffffff',
            scale: 2,
            useCORS: true
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = `food-stock-list-${new Date().toISOString().slice(0,10)}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        }).catch(err => {
            console.error('PNG保存に失敗しました:', err);
            alert('画像の保存に失敗しました。');
        });
    });

    // X(旧Twitter)で共有ボタン
    shareTwitterBtn.addEventListener('click', () => {
        const text = encodeURIComponent(autoTextArea.value + "\n#食品管理 #フードストック");
        window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
    });

    // LINEで共有ボタン
    shareLineBtn.addEventListener('click', () => {
        const text = encodeURIComponent(autoTextArea.value);
        window.open(`https://line.me/R/msg/text/?${text}`, '_blank');
    });

    // 今日の日付をYYYY-MM-DD形式で取得
    const getTodayDate = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    // リスト内の入力イベントを委譲で処理
    foodList.addEventListener('input', e => {
        const target = e.target;
        const tr = target.closest('tr');
        if (!tr) return;

        const id = Number(tr.dataset.id);
        const item = foodItems.find(i => i.id === id);
        if (!item) return;
        
        const className = target.className;

        if (className.includes('food-name-input')) {
            item.name = target.value;
            // 食品名が入力され、かつ購入日が空欄の場合に今日の日付を自動入力
            const purchaseInput = tr.querySelector('.purchase-date-input');
            if (item.name && !purchaseInput.value) {
                purchaseInput.value = getTodayDate();
                item.purchaseDate = purchaseInput.value;
            }
        } else if (className.includes('amount-slider')) {
            item.amount = target.value;
        } else if (className.includes('expiry-date-input')) {
            item.expiry = target.value;
        } else if (className.includes('purchase-date-input')) {
            item.purchaseDate = target.value;
        } else if (className.includes('color-picker')) {
            item.color = target.value;
            tr.querySelector('.food-name-input').style.color = item.color;
        }

        saveData();
        updateAutoText();
    });

    // リスト内のクリックイベントを委譲で処理
    foodList.addEventListener('click', e => {
        const target = e.target;
        const tr = target.closest('tr');
        if (!tr) return;

        const id = Number(tr.dataset.id);

        if (target.classList.contains('delete-btn')) {
            if (confirm('この項目を消去しますか？')) {
                foodItems = foodItems.filter(item => item.id !== id);
                renderList();
                saveData();
            }
        } else if (target.classList.contains('color-btn')) {
            const color = target.dataset.color;
            const item = foodItems.find(i => i.id === id);
            if (item) {
                item.color = color;
                tr.querySelector('.food-name-input').style.color = color;
                tr.querySelector('.color-picker').value = color;
                saveData();
                updateAutoText();
            }
        } else if (target.classList.contains('purchase-date-input') && !target.value) {
            // 購入日欄が空の時にクリックされたら今日の日付を入力
            const item = foodItems.find(i => i.id === id);
            target.value = getTodayDate();
            if (item) {
                item.purchaseDate = target.value;
                saveData();
                updateAutoText();
            }
        }
    });
    
    // --- 初期化処理 ---
    loadData();
    renderList();
});
