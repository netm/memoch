function updateDateTime() {
  const now = new Date();
  const dateEl = document.getElementById('date');
  const timeEl = document.getElementById('time');

  // 今日の日付を YYYY-MM-DD 形式で表示
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  dateEl.textContent = `${year}-${month}-${day}`;

  // 現在時刻を HH:MM:SS 形式で表示
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  timeEl.textContent = `${hours}:${minutes}:${seconds}`;
}

// DOM構築後に初回表示＆1秒ごとに更新
document.addEventListener('DOMContentLoaded', () => {
  updateDateTime();
  setInterval(updateDateTime, 1000);
});