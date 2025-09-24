        document.addEventListener('DOMContentLoaded', () => {
            // --- DOM Elements ---
            const addItemBtn = document.getElementById('add-item-btn');
            const sortBtn = document.getElementById('sort-by-expiry-btn');
            const savePngBtn = document.getElementById('save-png-btn');
            const clearAllBtn = document.getElementById('clear-all-btn');
            const itemList = document.getElementById('item-list');
            const foodStockList = document.getElementById('food-stock-list');
            const emptyState = document.getElementById('empty-state');
            
            // Color Modal Elements
            const colorModal = document.getElementById('color-modal');
            const confirmColorBtn = document.getElementById('confirm-color-btn');
            const cancelColorBtn = document.getElementById('cancel-color-btn');
            const colorPicker = document.getElementById('color-picker');

            // Confirmation Modal Elements
            const confirmModal = document.getElementById('confirm-modal');
            const confirmTitle = document.getElementById('confirm-title');
            const confirmMessage = document.getElementById('confirm-message');
            const confirmActionBtn = document.getElementById('confirm-action-btn');
            const cancelConfirmBtn = document.getElementById('cancel-confirm-btn');

            // --- State Management ---
            let items = [];
            let currentEditingColorItemId = null;
            let confirmActionCallback = null;

            // --- Data Persistence (localStorage) ---
            const STORAGE_KEY = 'foodStockItems';

            const loadItems = () => {
                const storedItems = localStorage.getItem(STORAGE_KEY);
                if (storedItems) {
                    items = JSON.parse(storedItems);
                }
            };

            const saveItems = () => {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
            };

            // --- Rendering ---
            const renderItems = () => {
                itemList.innerHTML = '';
                if (items.length === 0) {
                    emptyState.style.display = 'block';
                } else {
                    emptyState.style.display = 'none';
                    items.forEach(item => {
                        const tr = document.createElement('tr');
                        
                        // Apply styling for near/expired items
                        const expiryInfo = getExpiryStatus(item.expiryDate || item.bestByDate);
                        if (expiryInfo.status === 'expired') {
                            tr.classList.add('expired');
                        } else if (expiryInfo.status === 'near') {
                            tr.classList.add('near-expired');
                        }

                        tr.innerHTML = `
                            <td class="px-4 py-3 whitespace-nowrap">
                                <input type="text" value="${item.name}" data-id="${item.id}" data-key="name" class="p-1 w-full bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500" style="color: ${item.color};">
                            </td>
                            <td class="px-4 py-3 whitespace-nowrap">
                                <input type="text" value="${item.count}" data-id="${item.id}" data-key="count" class="p-1 w-20 bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500">
                            </td>
                            <td class="px-4 py-3 whitespace-nowrap flex items-center gap-2">
                                <span class="text-xs text-gray-500">少</span>
                                <input type="range" min="0" max="100" value="${item.amount}" data-id="${item.id}" data-key="amount" class="w-24 cursor-pointer">
                                <span class="text-xs text-gray-500">多</span>
                            </td>
                            <td class="px-4 py-3 whitespace-nowrap">
                                <input type="date" value="${item.expiryDate}" data-id="${item.id}" data-key="expiryDate" class="p-1 bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500">
                            </td>
                            <td class="px-4 py-3 whitespace-nowrap">
                                <input type="date" value="${item.bestByDate}" data-id="${item.id}" data-key="bestByDate" class="p-1 bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500">
                            </td>
                            <td class="px-4 py-3 whitespace-nowrap">
                                <input type="date" value="${item.purchaseDate}" data-id="${item.id}" data-key="purchaseDate" class="p-1 bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500">
                            </td>
                            <td class="px-4 py-3 whitespace-nowrap">
                                <button data-id="${item.id}" class="open-color-picker w-8 h-8 rounded-full" style="background-color: ${item.color}; border: 2px solid #e5e7eb;"></button>
                            </td>
                            <td class="px-4 py-3 whitespace-nowrap">
                                <button data-id="${item.id}" class="delete-item text-red-500 hover:text-red-700 text-xl"><i class="fas fa-trash-alt"></i></button>
                            </td>
                        `;
                        itemList.appendChild(tr);
                    });
                }
            };
            
            const getExpiryStatus = (dateString) => {
                if (!dateString) return { status: 'ok', days: Infinity };

                const today = new Date();
                today.setHours(0, 0, 0, 0); // Normalize today to the start of the day

                const expiryDate = new Date(dateString);
                expiryDate.setHours(0, 0, 0, 0); // Normalize expiry date

                const diffTime = expiryDate - today;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays < 0) {
                    return { status: 'expired', days: diffDays };
                }
                if (diffDays <= 3) {
                    return { status: 'near', days: diffDays };
                }
                return { status: 'ok', days: diffDays };
            };


            // --- Event Handlers ---
            const handleAddItem = () => {
                const newItem = {
                    id: Date.now().toString(),
                    name: '',
                    count: '1',
                    amount: 50,
                    expiryDate: '',
                    bestByDate: '',
                    purchaseDate: new Date().toISOString().split('T')[0],
                    color: '#1f2937' // Default to dark gray
                };
                items.unshift(newItem); // Add to the top
                saveAndRender();
            };

            const handleSort = () => {
                items.sort((a, b) => {
                    const dateA = a.expiryDate || a.bestByDate;
                    const dateB = b.expiryDate || b.bestByDate;
                    
                    if (!dateA && !dateB) return 0;
                    if (!dateA) return 1;
                    if (!dateB) return -1;
                    
                    return new Date(dateA) - new Date(b.expiryDate);
                });
                saveAndRender();
            };

            const handleSavePng = () => {
                // Temporarily remove hover effects from buttons for cleaner screenshot
                const buttons = document.querySelectorAll('button');
                buttons.forEach(btn => btn.classList.add('no-hover'));

                html2canvas(foodStockList, {
                    scale: 2, // Higher resolution
                    backgroundColor: '#f8fafc',
                    onclone: (document) => {
                         // Ensure table is fully visible in clone
                        const tableContainer = document.querySelector('.table-container');
                        if (tableContainer) {
                             tableContainer.style.overflowX = 'visible';
                        }
                    }
                }).then(canvas => {
                    const link = document.createElement('a');
                    link.download = `reizouko-stock-${new Date().toISOString().split('T')[0]}.png`;
                    link.href = canvas.toDataURL('image/png');
                    link.click();

                    // Restore hover effects
                    buttons.forEach(btn => btn.classList.remove('no-hover'));
                });
            };

            const handleClearAll = () => {
                showConfirmation(
                    'すべての項目を消去',
                    '本当にすべての食品データを消去しますか？この操作は元に戻せません。',
                    () => {
                        items = [];
                        saveAndRender();
                    }
                );
            };

            const handleItemUpdate = (e) => {
                const { id, key } = e.target.dataset;
                const value = e.target.value;
                
                const itemIndex = items.findIndex(item => item.id === id);
                if (itemIndex > -1) {
                    items[itemIndex][key] = value;
                    saveItems();
                     // Re-render only if date changes to update color
                    if (key === 'expiryDate' || key === 'bestByDate') {
                        renderItems();
                    }
                }
            };
            
            const handleItemDelete = (id) => {
                showConfirmation(
                    '項目を消去',
                    'この項目を消去しますか？',
                    () => {
                        items = items.filter(item => item.id !== id);
                        saveAndRender();
                    }
                );
            };

            // --- Modal Logic ---
            
            // Color Modal
            const openColorModal = (itemId) => {
                currentEditingColorItemId = itemId;
                const item = items.find(i => i.id === itemId);
                if (item) {
                    colorPicker.value = item.color;
                }
                colorModal.style.display = 'flex';
            };

            const closeColorModal = () => {
                colorModal.style.display = 'none';
                currentEditingColorItemId = null;
            };

            const confirmColorSelection = () => {
                if (currentEditingColorItemId) {
                    const itemIndex = items.findIndex(item => item.id === currentEditingColorItemId);
                    if (itemIndex > -1) {
                        items[itemIndex].color = colorPicker.value;
                        saveAndRender();
                    }
                }
                closeColorModal();
            };

            document.querySelectorAll('.color-box').forEach(box => {
                box.addEventListener('click', () => {
                    colorPicker.value = box.dataset.color;
                });
            });

            // Confirmation Modal
            const showConfirmation = (title, message, callback) => {
                confirmTitle.textContent = title;
                confirmMessage.textContent = message;
                confirmActionCallback = callback;
                confirmModal.style.display = 'flex';
            };
            
            const closeConfirmation = () => {
                confirmModal.style.display = 'none';
                confirmActionCallback = null;
            };

            confirmActionBtn.addEventListener('click', () => {
                if (confirmActionCallback) {
                    confirmActionCallback();
                }
                closeConfirmation();
            });

            cancelConfirmBtn.addEventListener('click', closeConfirmation);


            // --- Event Listeners ---
            addItemBtn.addEventListener('click', handleAddItem);
            sortBtn.addEventListener('click', handleSort);
            savePngBtn.addEventListener('click', handleSavePng);
            clearAllBtn.addEventListener('click', handleClearAll);

            itemList.addEventListener('change', e => {
                if (e.target.matches('input[type="date"], input[type="range"]')) {
                    handleItemUpdate(e);
                }
            });
            itemList.addEventListener('input', e => {
                 if (e.target.matches('input[type="text"]')) {
                    handleItemUpdate(e);
                }
            });

            itemList.addEventListener('click', e => {
                const target = e.target.closest('button');
                if (!target) return;

                if (target.classList.contains('delete-item')) {
                    handleItemDelete(target.dataset.id);
                } else if (target.classList.contains('open-color-picker')) {
                    openColorModal(target.dataset.id);
                }
            });
            
            // Color modal listeners
            confirmColorBtn.addEventListener('click', confirmColorSelection);
            cancelColorBtn.addEventListener('click', closeColorModal);
            
            // Close modal on outside click
            window.addEventListener('click', (e) => {
                if (e.target === colorModal) {
                    closeColorModal();
                }
                if (e.target === confirmModal) {
                    closeConfirmation();
                }
            });


            // --- Initialization ---
            const saveAndRender = () => {
                saveItems();
                renderItems();
            };
            
            const init = () => {
                loadItems();
                renderItems();
            };

            init();

        });