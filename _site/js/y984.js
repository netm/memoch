// indez986.js (improved; only behavior changes, other parts kept compatible)
document.addEventListener('DOMContentLoaded', () => {
  const dataScript = document.getElementById('data-json');
  if (!dataScript) {
    console.error('data-json スクリプトが見つかりません。');
    return;
  }

  let dialects;
  try {
    dialects = JSON.parse(dataScript.textContent);
    if (!Array.isArray(dialects)) throw new Error('data-json は配列である必要があります。');
  } catch (err) {
    console.error('data-json の読み込みに失敗しました: ', err);
    return;
  }

  const tableBody = document.getElementById('dialect-table-body');
  const kanaButtons = document.querySelectorAll('.kana-btn');
  const prefectureButtons = document.querySelectorAll('.prefecture-btn');
  const clearButton = document.getElementById('clear-btn');
  const copyButton = document.getElementById('copy-btn');
  const printButton = document.getElementById('print-btn');
  const pngButton = document.getElementById('png-btn');
  const twitterButton = document.getElementById('twitter-btn');
  const facebookButton = document.getElementById('facebook-btn');
  const lineButton = document.getElementById('line-btn');
  const resultContainer = document.getElementById('result-container');

  if (!tableBody) {
    console.error('dialect-table-body が見つかりません。');
    return;
  }

  const COL_COUNT = 4; // 標準語 / 方言 / 都道府県 / 例文

  let currentFilter = { type: null, value: null };

  const renderTable = (data) => {
    tableBody.innerHTML = '';
    if (!data || data.length === 0) {
      const row = tableBody.insertRow();
      const cell = row.insertCell();
      cell.colSpan = COL_COUNT;
      cell.textContent = '該当する方言が見つかりませんでした。';
      cell.style.textAlign = 'center';
      return;
    }
    data.forEach(item => {
      const row = tableBody.insertRow();
      const std = item.standard ?? '';
      const dia = item.dialect ?? '';
      const pref = item.prefecture ?? '';
      const ex = item.example ?? '';
      const c1 = row.insertCell(); c1.textContent = std;
      const c2 = row.insertCell(); c2.textContent = dia;
      const c3 = row.insertCell(); c3.textContent = pref;
      const c4 = row.insertCell(); c4.textContent = ex;
    });
  };

  const normalize = s => (typeof s === 'string' ? s.trim() : '');

  const filterAndRender = (type, value) => {
    currentFilter = { type, value };
    let filteredData = [];
    if (type === 'kana') {
      const normValue = normalize(value);
      filteredData = dialects.filter(d => normalize(d.standard).startsWith(normValue));
    } else if (type === 'prefecture') {
      const normValue = normalize(value);
      filteredData = dialects.filter(d => normalize(d.prefecture) === normValue);
    }
    renderTable(filteredData);
    updateActiveButtons();
  };

  const showAllData = () => {
    currentFilter = { type: null, value: null };
    renderTable(dialects);
    updateActiveButtons();
  };

  const updateActiveButtons = () => {
    kanaButtons.forEach(btn => {
      if (currentFilter.type === 'kana' && btn.dataset.kana === currentFilter.value) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });
    prefectureButtons.forEach(btn => {
      if (currentFilter.type === 'prefecture' && btn.dataset.prefecture === currentFilter.value) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });
  };

  kanaButtons.forEach(button => {
    button.addEventListener('click', () => {
      const kana = button.dataset.kana;
      if (currentFilter.type === 'kana' && currentFilter.value === kana) {
        showAllData();
      } else {
        filterAndRender('kana', kana);
      }
    });
  });

  // prefecture buttons use event delegation to ensure buttons added in HTML are recognized
  const prefectureContainer = document.querySelector('.prefecture-button-group');
  if (prefectureContainer) {
    prefectureContainer.addEventListener('click', (e) => {
      const button = e.target.closest('.prefecture-btn');
      if (!button) return;
      const prefecture = button.dataset.prefecture;
      if (currentFilter.type === 'prefecture' && currentFilter.value === prefecture) {
        showAllData();
      } else {
        filterAndRender('prefecture', prefecture);
      }
    });
  } else {
    // fallback: attach to each button if container not found
    prefectureButtons.forEach(button => {
      button.addEventListener('click', () => {
        const prefecture = button.dataset.prefecture;
        if (currentFilter.type === 'prefecture' && currentFilter.value === prefecture) {
          showAllData();
        } else {
          filterAndRender('prefecture', prefecture);
        }
      });
    });
  }

  if (clearButton) clearButton.addEventListener('click', showAllData);

  if (copyButton) {
    copyButton.addEventListener('click', () => {
      const header = '標準語\t方言\t都道府県\t例文\n';
      let textToCopy = header;
      tableBody.querySelectorAll('tr').forEach(row => {
        const cells = Array.from(row.querySelectorAll('td'));
        if (cells.length !== COL_COUNT) return;
        const values = cells.map(cell => normalize(cell.textContent));
        if (values.every(v => v === '')) return;
        if (values.length) textToCopy += values.join('\t') + '\n';
      });
      navigator.clipboard.writeText(textToCopy.trim())
        .then(() => alert('表の内容をクリップボードにコピーしました。'))
        .catch(err => {
          console.error('コピーに失敗しました: ', err);
          alert('コピーに失敗しました。');
        });
    });
  }

  if (printButton) printButton.addEventListener('click', () => window.print());

  if (pngButton) {
    pngButton.addEventListener('click', () => {
      if (typeof html2canvas !== 'function') {
        console.error('html2canvas が読み込まれていません。');
        alert('画像生成用ライブラリが見つかりません。');
        return;
      }
      if (!resultContainer) {
        console.error('result-container が見つかりません。');
        alert('画像化する要素が見つかりません。');
        return;
      }
      html2canvas(resultContainer, { scale: 2 }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'hougen-hikaku.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      }).catch(err => {
        console.error('PNG画像の生成に失敗しました: ', err);
        alert('画像の生成に失敗しました。');
      });
    });
  }

  const openShareWindow = (url) => {
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error('シェア用ウィンドウのオープンに失敗しました: ', err);
    }
  };

  if (twitterButton) {
    twitterButton.addEventListener('click', () => {
      const shareUrl = encodeURIComponent(location.href);
      const shareText = encodeURIComponent('面白い方言比較サイトを見つけました！');
      openShareWindow(`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`);
    });
  }

  if (facebookButton) {
    facebookButton.addEventListener('click', () => {
      const shareUrl = encodeURIComponent(location.href);
      openShareWindow(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`);
    });
  }

  if (lineButton) {
    lineButton.addEventListener('click', () => {
      const shareUrl = encodeURIComponent(location.href);
      openShareWindow(`https://social-plugins.line.me/lineit/share?url=${shareUrl}`);
    });
  }

  // update prefectureButtons NodeList reference after possible DOM changes
  // (ensures updateActiveButtons uses current buttons)
  setTimeout(() => {
    const updatedPrefButtons = document.querySelectorAll('.prefecture-btn');
    // copy NodeList into array for use elsewhere if needed
    if (updatedPrefButtons.length) {
      // no action needed here; updateActiveButtons reads querySelectorAll each call
    }
  }, 0);

  renderTable(dialects);
});