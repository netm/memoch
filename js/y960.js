// script.js - 全機能JS全文
document.addEventListener('DOMContentLoaded', function () {
  // シェアボタン挙動（簡易）
  document.querySelectorAll('.share-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      const url = location.href;
      const text = document.title;
      if (navigator.share) {
        navigator.share({ title: text, url: url }).catch(()=>{ alert('共有に失敗しました'); });
      } else {
        // コピー代替
        navigator.clipboard?.writeText(url).then(()=> {
          const t = btn.getAttribute('data-copied-text') || 'リンクをコピーしました';
          alert(t);
        }).catch(()=> { alert('クリップボードにコピーできませんでした'); });
      }
    });
  });

  // トップへボタンスムーズスクロール
  const topBtn = document.getElementById('to-top');
  if (topBtn) {
    topBtn.addEventListener('click', function(e){
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // サイトマップ表示トグル（アクセシブル）
  const sitemapToggle = document.getElementById('sitemap-toggle');
  const sitemap = document.getElementById('sitemap');
  if (sitemapToggle && sitemap) {
    sitemapToggle.addEventListener('click', function(e){
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      sitemap.hidden = expanded;
    });
  }

  // 外部リンクに target + rel を付与（既に付与されているが保険）
  document.querySelectorAll('a[href^="http"]').forEach(function(a){
    a.setAttribute('target','_blank');
    a.setAttribute('rel','noopener noreferrer');
  });
});