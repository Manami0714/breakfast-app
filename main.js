// 🍙 朝ごはん組合せアプリ - メインJavaScript

// デフォルトデータ
const DEFAULT_DATA = {
    onigiri: [
        { id: 'onigiri_1', name: '鮭', count: 5, emoji: '🐟' },
        { id: 'onigiri_2', name: '梅', count: 3, emoji: '🍃' },
        { id: 'onigiri_3', name: 'ツナマヨ', count: 4, emoji: '🐟' },
        { id: 'onigiri_4', name: '昆布', count: 2, emoji: '🌊' },
        { id: 'onigiri_5', name: 'おかか', count: 3, emoji: '🐟' },
        { id: 'onigiri_6', name: '明太子', count: 2, emoji: '🌶️' }
    ],
    misosoup: [
        { id: 'misosoup_1', name: '豆腐とわかめ', count: 5, emoji: '🥄' },
        { id: 'misosoup_2', name: 'ねぎと油揚げ', count: 4, emoji: '🧅' },
        { id: 'misosoup_3', name: 'しじみ', count: 3, emoji: '🐚' },
        { id: 'misosoup_4', name: 'なめこ', count: 3, emoji: '🍄' },
        { id: 'misosoup_5', name: 'キャベツとソーセージ', count: 2, emoji: '🥬' },
        { id: 'misosoup_6', name: 'もやしとニラ', count: 4, emoji: '🌱' }
    ],
    egg: [
        { id: 'egg_1', name: '卵焼き', count: 6, emoji: '🍳' },
        { id: 'egg_2', name: '目玉焼き', count: 5, emoji: '🍳' },
        { id: 'egg_3', name: 'スクランブルエッグ', count: 4, emoji: '🍳' },
        { id: 'egg_4', name: 'ゆで卵', count: 3, emoji: '🥚' },
        { id: 'egg_5', name: 'オムレツ', count: 2, emoji: '🍳' },
        { id: 'egg_6', name: '茶碗蒸し', count: 1, emoji: '🥄' }
    ]
};

// グローバル変数
let currentData = {};
let currentCombination = null;
let currentAddingCategory = null;

// アプリケーション初期化
document.addEventListener('DOMContentLoaded', function() {
    console.log('🍙 朝ごはん組合せアプリを初期化中...');
    
    // データの読み込み
    loadData();
    
    // イベントリスナーの設定
    setupEventListeners();
    
    // UI の初期化
    renderAllInventory();
    
    console.log('✅ 初期化完了');
});

// LocalStorage からデータを読み込み
function loadData() {
    try {
        const savedData = localStorage.getItem('breakfastComboApp');
        if (savedData) {
            currentData = JSON.parse(savedData);
            console.log('📄 保存されたデータを読み込みました');
        } else {
            currentData = JSON.parse(JSON.stringify(DEFAULT_DATA));
            saveData();
            console.log('🆕 デフォルトデータを設定しました');
        }
    } catch (error) {
        console.error('❌ データ読み込みエラー:', error);
        currentData = JSON.parse(JSON.stringify(DEFAULT_DATA));
        saveData();
    }
}

// LocalStorage にデータを保存
function saveData() {
    try {
        localStorage.setItem('breakfastComboApp', JSON.stringify(currentData));
        console.log('💾 データを保存しました');
    } catch (error) {
        console.error('❌ データ保存エラー:', error);
    }
}

// イベントリスナーの設定
function setupEventListeners() {
    // 抽選ボタン
    document.getElementById('drawButton').addEventListener('click', drawCombination);
    
    // もう一回ボタン
    document.getElementById('redrawButton').addEventListener('click', drawCombination);
    
    // 決定ボタン
    document.getElementById('confirmButton').addEventListener('click', confirmCombination);
    
    // タブボタン
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => switchTab(e.target.dataset.tab));
    });
    
    // モーダル関連
    document.getElementById('addItemModal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeModal();
    });
    
    // Enterキーでアイテム追加
    document.getElementById('itemName').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') confirmAddItem();
    });
}

// ランダム組合せ抽選
function drawCombination() {
    console.log('🎲 組合せを抽選中...');
    
    // 利用可能なアイテムをフィルタリング
    const availableOnigiri = currentData.onigiri.filter(item => item.count > 0);
    const availableMisosoup = currentData.misosoup.filter(item => item.count > 0);
    const availableEgg = currentData.egg.filter(item => item.count > 0);
    
    // アイテムが不足している場合の警告
    if (availableOnigiri.length === 0 || availableMisosoup.length === 0 || availableEgg.length === 0) {
        alert('⚠️ 在庫が不足しているカテゴリがあります。在庫を追加してください。');
        return;
    }
    
    // ランダム選択
    const selectedOnigiri = availableOnigiri[Math.floor(Math.random() * availableOnigiri.length)];
    const selectedMisosoup = availableMisosoup[Math.floor(Math.random() * availableMisosoup.length)];
    const selectedEgg = availableEgg[Math.floor(Math.random() * availableEgg.length)];
    
    currentCombination = {
        onigiri: selectedOnigiri,
        misosoup: selectedMisosoup,
        egg: selectedEgg
    };
    
    // UI に表示
    displayCombination();
    
    // ボタンの表示切り替え
    document.getElementById('drawButton').style.display = 'none';
    document.getElementById('redrawButton').style.display = 'inline-block';
    document.getElementById('confirmButton').style.display = 'inline-block';
    
    console.log('✅ 組合せ抽選完了:', currentCombination);
}

// 組合せを画面に表示
function displayCombination() {
    if (!currentCombination) return;
    
    // おにぎり
    const onigiriElement = document.getElementById('onigiriResult');
    onigiriElement.querySelector('.item-name').textContent = currentCombination.onigiri.name;
    
    // 味噌汁
    const misosoupElement = document.getElementById('misosoupResult');
    misosoupElement.querySelector('.item-name').textContent = currentCombination.misosoup.name;
    
    // 卵料理
    const eggElement = document.getElementById('eggResult');
    eggElement.querySelector('.item-name').textContent = currentCombination.egg.name;
    
    // アニメーション効果
    const resultItems = document.querySelectorAll('.result-item');
    resultItems.forEach((item, index) => {
        item.style.animation = 'none';
        setTimeout(() => {
            item.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s both`;
        }, 50);
    });
}

// 組合せを確定（在庫を減算）
function confirmCombination() {
    if (!currentCombination) return;
    
    console.log('✅ 組合せを確定します:', currentCombination);
    
    // 各アイテムの在庫を減算
    const onigiriItem = currentData.onigiri.find(item => item.id === currentCombination.onigiri.id);
    const misosoupItem = currentData.misosoup.find(item => item.id === currentCombination.misosoup.id);
    const eggItem = currentData.egg.find(item => item.id === currentCombination.egg.id);
    
    if (onigiriItem) onigiriItem.count = Math.max(0, onigiriItem.count - 1);
    if (misosoupItem) misosoupItem.count = Math.max(0, misosoupItem.count - 1);
    if (eggItem) eggItem.count = Math.max(0, eggItem.count - 1);
    
    // データ保存
    saveData();
    
    // UI更新
    renderAllInventory();
    
    // ボタンを初期状態に戻す
    resetCombinationUI();
    
    // 確認メッセージ
    alert('🎉 本日の朝ごはんが決定しました！美味しく召し上がれ！');
    
    console.log('✅ 在庫更新完了');
}

// 組合せUIをリセット
function resetCombinationUI() {
    currentCombination = null;
    
    // アイテム名をリセット
    document.querySelectorAll('.result-item .item-name').forEach(element => {
        element.textContent = '—';
    });
    
    // ボタンの表示を初期状態に
    document.getElementById('drawButton').style.display = 'inline-block';
    document.getElementById('redrawButton').style.display = 'none';
    document.getElementById('confirmButton').style.display = 'none';
}

// タブ切り替え
function switchTab(tabName) {
    // すべてのタブを非アクティブに
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.inventory-tab').forEach(tab => tab.classList.remove('active'));
    
    // 選択されたタブをアクティブに
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

// 全在庫をレンダリング
function renderAllInventory() {
    renderInventory('onigiri');
    renderInventory('misosoup');
    renderInventory('egg');
}

// 指定カテゴリの在庫をレンダリング
function renderInventory(category) {
    const container = document.getElementById(`${category}Inventory`);
    container.innerHTML = '';
    
    currentData[category].forEach(item => {
        const itemElement = createInventoryItemElement(item, category);
        container.appendChild(itemElement);
    });
}

// 在庫アイテム要素を作成
function createInventoryItemElement(item, category) {
    const div = document.createElement('div');
    div.className = `inventory-item ${item.count === 0 ? 'out-of-stock' : ''}`;
    div.innerHTML = `
        <div class="item-info">
            <span class="item-emoji">${item.emoji}</span>
            <div class="item-details">
                <div class="item-name">${item.name}</div>
                <div class="item-count">残り: ${item.count}個</div>
            </div>
        </div>
        <div class="item-controls">
            <button class="count-btn minus" onclick="changeItemCount('${item.id}', '${category}', -1)" ${item.count === 0 ? 'disabled' : ''}>-</button>
            <span class="count-display">${item.count}</span>
            <button class="count-btn plus" onclick="changeItemCount('${item.id}', '${category}', 1)">+</button>
            <button class="delete-btn" onclick="deleteItem('${item.id}', '${category}')">削除</button>
        </div>
    `;
    return div;
}

// アイテムの個数を変更
function changeItemCount(itemId, category, delta) {
    const item = currentData[category].find(item => item.id === itemId);
    if (item) {
        item.count = Math.max(0, item.count + delta);
        saveData();
        renderInventory(category);
        console.log(`📊 ${item.name}の個数を${delta > 0 ? '増加' : '減少'}: ${item.count}`);
    }
}

// アイテムを削除
function deleteItem(itemId, category) {
    const item = currentData[category].find(item => item.id === itemId);
    if (item && confirm(`「${item.name}」を削除してもよろしいですか？`)) {
        currentData[category] = currentData[category].filter(item => item.id !== itemId);
        saveData();
        renderInventory(category);
        console.log(`🗑️ ${item.name}を削除しました`);
    }
}

// 新しいアイテム追加モーダルを開く
function addNewItem(category) {
    currentAddingCategory = category;
    const modal = document.getElementById('addItemModal');
    modal.classList.add('show');
    document.getElementById('itemName').focus();
    document.getElementById('itemName').value = '';
    document.getElementById('itemCount').value = '5';
}

// モーダルを閉じる
function closeModal() {
    const modal = document.getElementById('addItemModal');
    modal.classList.remove('show');
    currentAddingCategory = null;
}

// 新しいアイテムを追加
function confirmAddItem() {
    const name = document.getElementById('itemName').value.trim();
    const count = parseInt(document.getElementById('itemCount').value) || 0;
    
    if (!name) {
        alert('⚠️ アイテム名を入力してください。');
        return;
    }
    
    if (!currentAddingCategory) {
        alert('⚠️ カテゴリが選択されていません。');
        return;
    }
    
    // 重複チェック
    const exists = currentData[currentAddingCategory].some(item => item.name === name);
    if (exists) {
        alert('⚠️ 同じ名前のアイテムが既に存在します。');
        return;
    }
    
    // 新しいIDを生成
    const newId = `${currentAddingCategory}_${Date.now()}`;
    
    // 適切な絵文字を設定
    const emojis = {
        onigiri: ['🍙', '🐟', '🍃', '🌶️', '🧅'],
        misosoup: ['🥄', '🧅', '🐚', '🍄', '🥬', '🌱'],
        egg: ['🍳', '🥚', '🥄']
    };
    
    const randomEmoji = emojis[currentAddingCategory][Math.floor(Math.random() * emojis[currentAddingCategory].length)];
    
    // アイテムを追加
    const newItem = {
        id: newId,
        name: name,
        count: count,
        emoji: randomEmoji
    };
    
    currentData[currentAddingCategory].push(newItem);
    saveData();
    renderInventory(currentAddingCategory);
    closeModal();
    
    console.log(`✅ 新しいアイテムを追加: ${name} (${count}個)`);
}

// 全データをリセット
function resetAllData() {
    if (confirm('⚠️ 全てのデータがリセットされます。本当によろしいですか？')) {
        localStorage.removeItem('breakfastComboApp');
        currentData = JSON.parse(JSON.stringify(DEFAULT_DATA));
        saveData();
        renderAllInventory();
        resetCombinationUI();
        alert('🔄 データをリセットしました。');
        console.log('🔄 全データをリセットしました');
    }
}

// CSS アニメーション用のキーフレームを動的に追加
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

console.log('🚀 main.js 読み込み完了');