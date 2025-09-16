function updateDateTime() {
  const now = new Date();
  const dateEl = document.getElementById('date');
  const timeEl = document.getElementById('time');

  const weekdays = ['日','月','火','水','木','金','土'];
  const weekday = weekdays[now.getDay()];

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  dateEl.textContent = `${year}年${month}月${day}日(${weekday})`;

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  timeEl.textContent = `${hours}:${minutes}`;
}

document.addEventListener('DOMContentLoaded', () => {
  updateDateTime();
  setInterval(updateDateTime, 1000);
});