// 特定のパターンを確実に隠す（例: fc2 のカウンター）
function hideProblematicImagesDuringCapture(captureArea) {
  const imgs = Array.from(captureArea.querySelectorAll('img'));
  const changed = [];
  imgs.forEach(img => {
    try {
      const src = (img.src || '').toLowerCase();
      // 隠す条件を任意に追加してください（ここでは fc2 の counter を例示）
      if (!src) return;
      if (src.includes('counter_img.php') || src.includes('media.fc2.com') || src.includes('counter.fc2')) {
        changed.push({ img, prevVisibility: img.style.visibility, prevDisplay: img.style.display });
        img.style.visibility = 'hidden';
      }
    } catch (e) {
      changed.push({ img, prevVisibility: img.style.visibility, prevDisplay: img.style.display });
      img.style.visibility = 'hidden';
    }
  });
  return changed;
}
// 修正版タイムテーブル JS
// このファイルを indez990.js の代わりに丸ごと置き換えてください

// --- ヘルパー: 外部画像を一時非表示にする（CORS 回避用） ---
function hideExternalImagesDuringCapture(captureArea) {
  const imgs = Array.from(captureArea.querySelectorAll('img'));
  const changed = [];
  imgs.forEach(img => {
    try {
      const src = img.src || '';
      if (src.startsWith('data:')) return; // data: はそのまま
      const imgUrl = new URL(src, location.href);
      const sameOrigin = imgUrl.origin === location.origin;
      if (!sameOrigin) {
        changed.push({ img, prevVisibility: img.style.visibility, prevDisplay: img.style.display });
        img.style.visibility = 'hidden'; // レイアウトを保ちつつ非表示
      }
    } catch (e) {
      // URL 解析に失敗したら安全のため非表示にする
      changed.push({ img, prevVisibility: img.style.visibility, prevDisplay: img.style.display });
      img.style.visibility = 'hidden';
    }
  });
  return changed;
}

function restoreHiddenImages(changed) {
  if (!changed || !changed.length) return;
  changed.forEach(({ img, prevVisibility, prevDisplay }) => {
    img.style.visibility = prevVisibility || '';
    img.style.display = prevDisplay || '';
  });
}

// --- 他のユーティリティ ---
// 画像の読み込み待ち
async function waitImages(container) {
  const imgs = Array.from(container.querySelectorAll('img'));
  await Promise.all(imgs.map(img => img.complete ? Promise.resolve() : new Promise(res => { img.onload = img.onerror = res; })));
}

// rgb -> hex
function rgbToHex(color) {
  if (!color) return '#000000';
  if (color.startsWith('#')) return color;
  const m = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (!m) return '#000000';
  const r = parseInt(m[1], 10), g = parseInt(m[2], 10), b = parseInt(m[3], 10);
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

// --- メイン ---
document.addEventListener('DOMContentLoaded', () => {
  const timetable = document.getElementById('timetable');
  const subjectPalette = document.getElementById('subject-palette');
  const colorBtns = document.querySelectorAll('.color-btn');
  const colorPicker = document.getElementById('color-picker');
  const fontWeightSlider = document.getElementById('font-weight-slider');
  const fontSizeSlider = document.getElementById('font-size-slider');
  const savePngBtn = document.getElementById('save-png-btn');
  const clearAllBtn = document.getElementById('clear-all-btn');
  const printBtn = document.getElementById('print-btn');

  let selectedSubject = null;

  // --- 保存 / ロード ---
  const saveData = () => {
    const data = {
      header: {
        year: document.getElementById('year-input')?.value || '',
        class: document.getElementById('class-input')?.value || '',
      },
      table: [],
      palette: [],
      paletteFontSize: fontSizeSlider?.value || null
    };

    if (timetable) {
      timetable.querySelectorAll('tr').forEach((tr) => {
        const rowData = [];
        tr.querySelectorAll('th, td').forEach((cell) => {
          const input = cell.querySelector('input[type="text"]');

          if (input && !cell.classList.contains('drop-target') && !cell.classList.contains('time-cell')) {
            rowData.push({ type: 'input', value: input.value });
          } else if (cell.classList.contains('time-cell')) {
            const topEl = cell.querySelector('.time-top');
            const bottomEl = cell.querySelector('.time-bottom');
            const top = topEl ? topEl.textContent : '';
            const bottom = bottomEl ? bottomEl.textContent : '';
            rowData.push({ type: 'time', top, bottom });
          } else if (cell.classList.contains('drop-target')) {
            const subject = cell.querySelector('.subject-item');
            if (subject) {
              rowData.push({
                type: 'subject',
                html: subject.outerHTML,
                color: subject.style.color,
                fontWeight: subject.style.fontWeight,
                fontSize: subject.style.fontSize
              });
            } else {
              rowData.push({ type: 'empty' });
            }
          } else {
            rowData.push({ type: 'empty' });
          }
        });
        data.table.push(rowData);
      });
    }

    if (subjectPalette) {
      subjectPalette.querySelectorAll('.subject-item').forEach(item => {
        data.palette.push({
          text: item.textContent,
          color: item.style.color,
          fontWeight: item.style.fontWeight,
          fontSize: item.style.fontSize
        });
      });
    }

    try {
      localStorage.setItem('timetableData', JSON.stringify(data));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  };

  const loadData = () => {
    const raw = localStorage.getItem('timetableData');
    if (!raw) return;
    let data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      return;
    }
    const y = document.getElementById('year-input');
    const c = document.getElementById('class-input');
    if (y) y.value = data.header?.year || '';
    if (c) c.value = data.header?.class || '';

    if (!timetable) return;
    timetable.querySelectorAll('tr').forEach((tr, rowIndex) => {
      const rowData = data.table[rowIndex];
      if (!rowData) return;

      tr.querySelectorAll('th, td').forEach((cell, cellIndex) => {
        const cellData = rowData[cellIndex];
        if (!cellData) return;

        if (cellData.type === 'input') {
          const input = cell.querySelector('input[type="text"]');
          if (input) input.value = cellData.value;
        } else if (cellData.type === 'time') {
          const top = cell.querySelector('.time-top');
          const bottom = cell.querySelector('.time-bottom');
          if (top) top.textContent = cellData.top || '';
          if (bottom) bottom.textContent = cellData.bottom || '';
        } else if (cellData.type === 'subject') {
          cell.innerHTML = cellData.html;
          const subject = cell.querySelector('.subject-item');
          if (subject) {
            subject.style.color = cellData.color || '';
            subject.style.fontWeight = cellData.fontWeight || '';
            subject.style.fontSize = cellData.fontSize || '';
          }
        }
      });
    });

    if (data.palette?.length > 0 && subjectPalette) {
      subjectPalette.innerHTML = '';
      data.palette.forEach(itemData => {
        const span = document.createElement('span');
        span.className = 'subject-item';
        span.textContent = itemData.text;
        span.style.color = itemData.color || 'black';
        span.style.fontWeight = itemData.fontWeight || '400';
        span.style.fontSize = itemData.fontSize || (data.paletteFontSize ? data.paletteFontSize + 'px' : '16px');
        span.setAttribute('contenteditable', 'true');
        subjectPalette.appendChild(span);
      });
      if (data.paletteFontSize && fontSizeSlider) fontSizeSlider.value = data.paletteFontSize;
    }
  };

  // --- UI 操作 ---
  const selectSubject = (target) => {
    if (selectedSubject) selectedSubject.classList.remove('selected');
    selectedSubject = target;
    selectedSubject.classList.add('selected');

    const color = selectedSubject.style.color || '#000000';
    const weight = selectedSubject.style.fontWeight || '400';
    const size = parseInt(window.getComputedStyle(selectedSubject).fontSize, 10) || 16;

    if (colorPicker) colorPicker.value = rgbToHex(color);
    if (fontWeightSlider) fontWeightSlider.value = weight;
    if (fontSizeSlider) fontSizeSlider.value = size;
  };

  if (subjectPalette) {
    subjectPalette.addEventListener('click', (e) => {
      if (e.target.classList.contains('subject-item')) selectSubject(e.target);
    });
  }

  if (timetable) {
    timetable.addEventListener('click', (e) => {
      const targetCell = e.target.closest('.drop-target');
      if (targetCell && selectedSubject) {
        targetCell.innerHTML = '';
        const newSubject = selectedSubject.cloneNode(true);
        newSubject.classList.remove('selected');
        if (fontSizeSlider) newSubject.style.fontSize = fontSizeSlider.value + 'px';
        targetCell.appendChild(newSubject);
        saveData();
      }
    });

    timetable.addEventListener('dblclick', (e) => {
      const targetCell = e.target.closest('.drop-target');
      if (targetCell && targetCell.hasChildNodes()) {
        targetCell.innerHTML = '';
        saveData();
      }
    });

    timetable.addEventListener('input', (e) => {
      if (e.target.classList.contains('time-top') || e.target.classList.contains('time-bottom')) {
        saveData();
      }
    });
  }

  colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (selectedSubject) {
        selectedSubject.style.color = btn.style.backgroundColor;
        if (colorPicker) colorPicker.value = rgbToHex(btn.style.backgroundColor);
        saveData();
      }
    });
  });

  colorPicker?.addEventListener('input', (e) => {
    if (selectedSubject) {
      selectedSubject.style.color = e.target.value;
      saveData();
    }
  });

  fontWeightSlider?.addEventListener('input', (e) => {
    if (selectedSubject) {
      selectedSubject.style.fontWeight = e.target.value;
      saveData();
    }
  });

  fontSizeSlider?.addEventListener('input', (e) => {
    const sizePx = e.target.value + 'px';
    if (selectedSubject) selectedSubject.style.fontSize = sizePx;
    subjectPalette?.querySelectorAll('.subject-item').forEach(item => item.style.fontSize = sizePx);
    saveData();
  });

  // --- PNG 保存ハンドラ（外部画像を一時非表示する処理を組み込んだ堅牢版） ---
  if (savePngBtn) {
    savePngBtn.addEventListener('click', async () => {
      if (selectedSubject) selectedSubject.classList.remove('selected');

      const captureArea = document.getElementById('timetable-capture');
      if (!captureArea) {
        alert('キャプチャ領域が見つかりません');
        return;
      }

      // 元のスタイルを保存
      const prevStyles = {
        outline: captureArea.style.outline || '',
        boxShadow: captureArea.style.boxShadow || '',
        transform: captureArea.style.transform || '',
        overflow: captureArea.style.overflow || '',
        background: captureArea.style.background || ''
      };

      // 一時スタイルで安定化
      captureArea.style.outline = 'none';
      captureArea.style.boxShadow = 'none';
      captureArea.style.transform = 'none';
      captureArea.style.overflow = 'visible';
      captureArea.style.background = '#ffffff';
      document.body.classList.add('body-capture-only');

      // 外部画像を一時非表示にする
      const hidden = hideExternalImagesDuringCapture(captureArea);

      try {
        if (typeof html2canvas !== 'function') throw new Error('html2canvas not loaded');

        // フォント待ち
        if (document.fonts && document.fonts.ready) await document.fonts.ready;

        // レイアウト安定の余裕
        await new Promise(r => setTimeout(r, 250));

        // capture 内の画像の読み込みを待つ（hidden にした外部画像は無視される）
        await waitImages(captureArea);

        // 位置とサイズを正確に取得
        const rect = captureArea.getBoundingClientRect();
        const x = Math.floor(rect.left + window.scrollX);
        const y = Math.floor(rect.top + window.scrollY);
        const width = Math.ceil(rect.width);
        const height = Math.ceil(rect.height);

        // html2canvas オプション
        const options = {
          scale: Math.min(window.devicePixelRatio || 1, 2),
          backgroundColor: '#ffffff',
          useCORS: true,
          allowTaint: false,
          imageTimeout: 30000,
          x,
          y,
          width,
          height,
          windowWidth: Math.max(document.documentElement.clientWidth, width),
          windowHeight: Math.max(document.documentElement.clientHeight, height),
          scrollX: 0,
          scrollY: -window.scrollY
        };

        // document.body をベースに描画し、x/y/width/height で切り出す（トリミング対策）
        const canvas = await html2canvas(document.body, options);

        // ダウンロード（toBlob 優先）
        if (canvas.toBlob) {
          canvas.toBlob((blob) => {
            if (!blob) {
              try {
                const dataUrl = canvas.toDataURL('image/png');
                const a = document.createElement('a');
                a.href = dataUrl; a.download = 'timetable.png'; document.body.appendChild(a); a.click(); a.remove();
              } catch (e) { console.error(e); alert('画像の生成に失敗しました'); }
              return;
            }
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'timetable.png';
            document.body.appendChild(a);
            a.click();
            setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 300);
          }, 'image/png');
        } else {
          try {
            const dataUrl = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = dataUrl;
            a.download = 'timetable.png';
            document.body.appendChild(a);
            a.click();
            setTimeout(() => { a.remove(); }, 300);
          } catch (err) {
            console.error('toDataURL failed', err);
            alert('画像の生成に失敗しました');
          }
        }
      } catch (err) {
        console.error('PNG 保存に失敗しました', err);
        alert('画像の保存に失敗しました。コンソールを確認してください。');
      } finally {
        // 非表示にした画像を元に戻す
        restoreHiddenImages(hidden);

        // 元のスタイルに戻す
        captureArea.style.outline = prevStyles.outline;
        captureArea.style.boxShadow = prevStyles.boxShadow;
        captureArea.style.transform = prevStyles.transform;
        captureArea.style.overflow = prevStyles.overflow;
        captureArea.style.background = prevStyles.background;

        document.body.classList.remove('body-capture-only');
        if (selectedSubject) selectedSubject.classList.add('selected');
      }
    });
  } // end if savePngBtn

  // --- クリア / 印刷 ---
  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', () => {
      if (confirm('すべてのデータを消去してリセットします。よろしいですか？')) {
        localStorage.removeItem('timetableData');
        window.location.reload();
      }
    });
  }

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      if (selectedSubject) selectedSubject.classList.remove('selected');
      setTimeout(() => window.print(), 100);
    });
  }

  // --- パレット編集の保存トリガ ---
  subjectPalette?.addEventListener('input', () => saveData());
  subjectPalette?.addEventListener('focusout', () => saveData(), true);

  // --- 初期ロード ---
  loadData();
}); // DOMContentLoaded end