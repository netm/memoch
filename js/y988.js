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
    const loadData = () => {
        const storedItems = localStorage.getItem('foodStockManagerItems');
        if (storedItems) {
            try {
                foodItems = JSON.parse(storedItems);
            } catch (e) {
                console.error('ローカルストレージのデータが壊れています。初期化します。', e);
                foodItems = [];
                saveData();
            }
        }
    };

    const saveData = () => {
        localStorage.setItem('foodStockManagerItems', JSON.stringify(foodItems));
    };

    const generateId = () => 'id-' + Date.now() + '-' + Math.floor(Math.random() * 1000);

    const daysUntil = (dateStr) => {
        if (!dateStr) return Infinity;
        const today = new Date();
        const d = new Date(dateStr + 'T00:00:00');
        const diff = Math.ceil((d - new Date(today.getFullYear(), today.getMonth(), today.getDate())) / (1000 * 60 * 60 * 24));
        return diff;
    };

    // --- UI描画 ---
    const updateAutoText = () => {
        if (!autoTextArea) return;
        let text = "【冷蔵庫・冷凍庫の中身】\n";
        const sortedItems = [...foodItems].sort((a, b) => {
            if (a.expiry === b.expiry) return 0;
            if (!a.expiry) return 1;
            if (!b.expiry) return -1;
            return new Date(a.expiry) - new Date(b.expiry);
        });

        sortedItems.forEach(item => {
            if (item && item.name !== undefined && String(item.name).trim() !== '') {
                const amountValue = Number.isFinite(Number(item.amount)) ? parseInt(item.amount, 10) : 50;
                const amountText = amountValue <= 33 ? '少' : amountValue <= 66 ? '中' : '多';
                const expiryText = item.expiry ? `${item.expiry.replace(/-/g, '/')}まで` : '期限未設定';
                const purchaseText = item.purchaseDate ? `${item.purchaseDate.replace(/-/g, '/')}購入` : '';
                text += `・${item.name} | ${amountText} | ${expiryText}${purchaseText ? ' | ' + purchaseText : ''}\n`;
            }
        });

        autoTextArea.value = text;
    };

    const escapeHtml = (str) => {
        if (typeof str !== 'string') return '';
        return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    };

    const renderList = () => {
        foodList.innerHTML = '';
        if (foodItems.length === 0) {
            foodList.innerHTML = '<tr><td colspan="6" class="p-4 text-center text-gray-500">アイテムがありません。「項目追加」ボタンで食品を追加してください。</td></tr>';
        } else {
            foodItems.forEach(item => {
                const tr = document.createElement('tr');
                tr.classList.add('border-b', 'border-gray-200');
                tr.dataset.id = String(item.id);

                tr.innerHTML = `
                    <td class="p-2 align-middle">
                        <input type="text" value="${escapeHtml(item.name || '')}" class="food-name-input w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" style="color: ${item.color || '#000000'};" placeholder="例: にんじん">
                    </td>
                    <td class="p-2 align-middle min-w-[150px]">
                        <div class="flex items-center gap-2">
                            <span>少</span>
                            <input type="range" min="0" max="100" value="${item.amount || 50}" class="amount-slider w-full cursor-pointer" />
                            <span>多</span>
                        </div>
                    </td>
                    <td class="p-2 align-middle">
                        <input type="date" value="${item.expiry || ''}" class="expiry-date-input w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400">
                    </td>
                    <td class="p-2 align-middle">
                        <input type="date" value="${item.purchaseDate || ''}" class="purchase-date-input w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400">
                    </td>
                    <td class="p-2 align-middle">
                        <div class="flex items-center gap-1 flex-wrap">
                            <button class="color-btn w-6 h-6 rounded-full bg-black" data-color="#000000" title="黒"></button>
                            <button class="color-btn w-6 h-6 rounded-full bg-red-500" data-color="#ef4444" title="赤"></button>
                            <button class="color-btn w-6 h-6 rounded-full bg-blue-500" data-color="#3b82f6" title="青"></button>
                            <button class="color-btn w-6 h-6 rounded-full bg-green-500" data-color="#22c55e" title="緑"></button>
                            <button class="color-btn w-6 h-6 rounded-full bg-orange-500" data-color="#f97316" title="オレンジ"></button>
                            <input type="color" value="${item.color || '#000000'}" class="color-picker w-8 h-8 p-0 border-none rounded-full cursor-pointer" title="色を選択">
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

    // 今日の日付をYYYY-MM-DD形式で取得
    const getTodayDate = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    // イベント委譲：input
    foodList.addEventListener('input', e => {
        const target = e.target;
        const tr = target.closest('tr');
        if (!tr) return;

        const id = tr.dataset.id;
        const item = foodItems.find(i => String(i.id) === id);
        if (!item) return;

        if (target.classList && target.classList.contains('food-name-input')) {
            item.name = target.value;
            const purchaseInput = tr.querySelector('.purchase-date-input');
            if (item.name && purchaseInput && !purchaseInput.value) {
                purchaseInput.value = getTodayDate();
                item.purchaseDate = purchaseInput.value;
            }
        } else if (target.classList && target.classList.contains('amount-slider')) {
            item.amount = target.value;
        } else if (target.classList && target.classList.contains('expiry-date-input')) {
            item.expiry = target.value;
        } else if (target.classList && target.classList.contains('purchase-date-input')) {
            item.purchaseDate = target.value;
        } else if (target.classList && target.classList.contains('color-picker')) {
            item.color = target.value;
            const nameInput = tr.querySelector('.food-name-input');
            if (nameInput) nameInput.style.color = item.color;
        }

        saveData();
        updateAutoText();
    });

    // イベント委譲：click
    foodList.addEventListener('click', e => {
        const target = e.target;
        const tr = target.closest('tr');
        if (!tr) return;

        const id = tr.dataset.id;
        const itemIndex = foodItems.findIndex(i => String(i.id) === id);

        if (target.classList && target.classList.contains('delete-btn')) {
            if (confirm('この項目を消去しますか？')) {
                if (itemIndex > -1) {
                    foodItems.splice(itemIndex, 1);
                    saveData();
                    renderList();
                }
            }
            return;
        }

        if (target.classList && target.classList.contains('color-btn')) {
            const color = target.dataset.color;
            if (itemIndex > -1) {
                foodItems[itemIndex].color = color;
                const nameInput = tr.querySelector('.food-name-input');
                const picker = tr.querySelector('.color-picker');
                if (nameInput) nameInput.style.color = color;
                if (picker) picker.value = color;
                saveData();
                updateAutoText();
            }
            return;
        }

        if (target.classList && target.classList.contains('purchase-date-input') && !target.value) {
            const idx = foodItems.findIndex(i => String(i.id) === id);
            const today = getTodayDate();
            target.value = today;
            if (idx > -1) {
                foodItems[idx].purchaseDate = today;
                saveData();
                updateAutoText();
            }
        }
    });

    // --- 操作ボタン機能 ---
    addItemBtn.addEventListener('click', () => {
        const newItem = {
            id: generateId(),
            name: '',
            amount: 50,
            expiry: '',
            purchaseDate: '',
            color: '#000000'
        };
        foodItems.unshift(newItem);
        saveData();
        renderList();
    });

    copyTextBtn.addEventListener('click', async () => {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(autoTextArea.value);
            } else {
                autoTextArea.select();
                document.execCommand('copy');
                window.getSelection().removeAllRanges();
            }
            alert('文章をコピーしました。');
        } catch (err) {
            console.error('コピー失敗:', err);
            alert('コピーに失敗しました。クリップボード権限を確認してください。');
        }
    });

    sortByExpiryBtn.addEventListener('click', () => {
        foodItems.sort((a, b) => {
            if (a.expiry === b.expiry) return 0;
            if (!a.expiry) return 1;
            if (!b.expiry) return -1;
            return new Date(a.expiry) - new Date(b.expiry);
        });
        saveData();
        renderList();
    });

    clearAllBtn.addEventListener('click', () => {
        if (!confirm('すべての項目を消去します。よろしいですか？')) return;
        foodItems = [];
        saveData();
        renderList();
    });

    // PNG保存の修正: input要素がそのままキャプチャされる問題を回避するため、
    // キャプチャ用の複製要素を作り、inputをテキスト要素に置換してからキャプチャする
    saveAsPngBtn.addEventListener('click', async () => {
        if (typeof html2canvas === 'undefined') {
            alert('html2canvasが読み込まれていません。画像保存は利用できません。');
            return;
        }
        try {
            // キャプチャ用ラッパーを作る（画面に表示しない）
            const cloneWrapper = listContainer.cloneNode(true);

            // 1) テキストエリアの内容を画面上ではなくキャプチャ対象に反映（autoTextAreaの文字列を表示用要素に置換）
            const textAreaInClone = cloneWrapper.querySelector('#auto-text-generation textarea') || cloneWrapper.querySelector('textarea#auto-text-area');
            if (textAreaInClone) {
                const pre = document.createElement('pre');
                pre.textContent = autoTextArea.value;
                pre.style.whiteSpace = 'pre-wrap';
                pre.style.fontFamily = getComputedStyle(document.body).fontFamily;
                pre.style.fontSize = '14px';
                pre.style.margin = '0';
                pre.style.color = '#2d3748';
                // 見た目調整: 背景とパディングを合わせる
                pre.style.padding = '0.5rem';
                pre.style.background = 'transparent';
                pre.id = 'auto-text-capture';
                textAreaInClone.replaceWith(pre);
            }

            // 2) input, textarea, range, color, button をテキスト要素に置換
            const inputs = cloneWrapper.querySelectorAll('input, textarea, button');
            inputs.forEach(node => {
                if (node.tagName.toLowerCase() === 'input') {
                    const type = node.getAttribute('type') || '';
                    let text = '';
                    if (type === 'date') {
                        text = node.value || '';
                    } else if (type === 'range') {
                        text = node.value || '';
                    } else if (type === 'color') {
                        text = node.value || '';
                    } else {
                        text = node.value || node.getAttribute('value') || '';
                    }
                    const span = document.createElement('span');
                    span.textContent = text;
                    span.style.display = 'inline-block';
                    span.style.fontFamily = getComputedStyle(document.body).fontFamily;
                    span.style.fontSize = '14px';
                    span.style.color = node.type === 'color' ? node.value : '#2d3748';
                    // preserve layout a bit
                    span.style.minWidth = '2rem';
                    span.style.padding = '0.25rem';
                    node.replaceWith(span);
                } else if (node.tagName.toLowerCase() === 'textarea') {
                    const span = document.createElement('pre');
                    span.textContent = node.value || node.textContent || '';
                    span.style.whiteSpace = 'pre-wrap';
                    span.style.fontFamily = getComputedStyle(document.body).fontFamily;
                    span.style.fontSize = '14px';
                    span.style.color = '#2d3748';
                    node.replaceWith(span);
                } else if (node.tagName.toLowerCase() === 'button') {
                    // ボタンは非表示にしてキャプチャに影響させない
                    const span = document.createElement('span');
                    span.textContent = node.textContent || '';
                    span.style.color = '#ffffff';
                    span.style.background = '#999';
                    span.style.padding = '0.25rem 0.5rem';
                    span.style.borderRadius = '6px';
                    node.replaceWith(span);
                }
            });

            // 3) クローンをオフスクリーンに一時追加してキャプチャ
            const offscreen = document.createElement('div');
            offscreen.style.position = 'fixed';
            offscreen.style.left = '-9999px';
            offscreen.style.top = '0';
            offscreen.style.pointerEvents = 'none';
            offscreen.appendChild(cloneWrapper);
            document.body.appendChild(offscreen);

            // キャプチャ実行
            const canvas = await html2canvas(cloneWrapper, {backgroundColor: '#ffffff', scale: Math.min(3, window.devicePixelRatio || 2), useCORS: true});
            const url = canvas.toDataURL('image/png');

            // ダウンロード
            const a = document.createElement('a');
            a.href = url;
            a.download = `refrigerator_stocker_${new Date().toISOString().slice(0,10)}.png`;
            document.body.appendChild(a);
            a.click();
            a.remove();

            // 後片付け
            document.body.removeChild(offscreen);
        } catch (e) {
            console.error('PNG保存に失敗しました', e);
            alert('画像保存に失敗しました。ブラウザの設定をご確認ください。');
        }
    });

    // X（旧Twitter）共有
    shareTwitterBtn.addEventListener('click', () => {
        const raw = autoTextArea.value || '';
        const suffix = "\n#食品管理 #フードストック";
        const max = 280 - suffix.length;
        const textPart = raw.length > max ? raw.slice(0, max - 1) + '…' : raw;
        const text = encodeURIComponent(textPart + suffix);
        window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank', 'noopener');
    });

    // LINE共有
    shareLineBtn.addEventListener('click', () => {
        const raw = autoTextArea.value || '';
        const text = encodeURIComponent(raw);
        window.open(`https://line.me/R/msg/text/?${text}`, '_blank', 'noopener');
    });

    // 初期化
    loadData();
    renderList();
});