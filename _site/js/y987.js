// /js/y987.js
document.addEventListener('DOMContentLoaded', function(){
  const entries = Array.from(document.querySelectorAll('section.entry')).map(sec => {
    const name = sec.querySelector('h2[itemprop="name"]').textContent.trim();
    const meaning = sec.querySelector('div[itemprop="description"] p').textContent.trim();
    const english = sec.querySelectorAll('div p')[2].textContent.trim();
    return {sec, name, meaning, english};
  });

  const displayFrame = document.getElementById('displayFrame');
  const searchInput = document.getElementById('searchInput');
  const indexLinks = document.querySelectorAll('#index a');
  const randomBtn = document.getElementById('randomBtn');
  const speakBtn = document.getElementById('speakBtn');
  const copyBtn = document.getElementById('copyBtn');
  const printBtn = document.getElementById('printBtn');
  const twitterBtn = document.getElementById('twitterBtn');
  const facebookBtn = document.getElementById('facebookBtn');
  const lineBtn = document.getElementById('lineBtn');

  function showEntries(list) {
    displayFrame.innerHTML = '';
    list.forEach(e => {
      displayFrame.appendChild(e.sec.cloneNode(true));
    });
  }

  searchInput.addEventListener('input', function(){
    const term = this.value.trim();
    if (!term) {
      displayFrame.innerHTML = '';
    } else {
      const filtered = entries.filter(e => e.name.includes(term));
      showEntries(filtered);
    }
  });

  indexLinks.forEach(link => {
    link.addEventListener('click', function(e){
      e.preventDefault();
      const char = this.textContent;
      const filtered = entries.filter(e => e.name.startsWith(char));
      showEntries(filtered);
    });
  });

  randomBtn.addEventListener('click', function(){
    const rand = entries[Math.floor(Math.random() * entries.length)];
    showEntries([rand]);
  });

  speakBtn.addEventListener('click', function(){
    const p = displayFrame.querySelector('div[itemprop="description"] + div + div p');
    const text = p ? p.textContent.trim() : '';
    if (text) {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'en-US';
      speechSynthesis.speak(utter);
    }
  });

  copyBtn.addEventListener('click', function(){
    const text = displayFrame.textContent.trim();
    navigator.clipboard.writeText(text);
  });

  printBtn.addEventListener('click', function(){
    window.print();
  });

  twitterBtn.addEventListener('click', function(){
    const nameEl = displayFrame.querySelector('h2[itemprop="name"]');
    const text = nameEl ? nameEl.textContent + ' ' + location.href : location.href;
    window.open(
      'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text),
      '_blank','width=550,height=420'
    );
  });

  facebookBtn.addEventListener('click', function(){
    window.open(
      'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(location.href),
      '_blank','width=550,height=420'
    );
  });

  lineBtn.addEventListener('click', function(){
    const nameEl = displayFrame.querySelector('h2[itemprop="name"]');
    const text = nameEl ? nameEl.textContent + ' ' + location.href : location.href;
    window.open(
      'https://social-plugins.line.me/lineit/share?url=' + encodeURIComponent(location.href) +
      '&text=' + encodeURIComponent(text),
      '_blank','width=550,height=420'
    );
  });
});