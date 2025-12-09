  /**
   * ageCalc.js
   * - テーブル内の <tr data-birth="YYYY-MM-DD"> を走査して年齢を計算し、.age-cell に反映します。
   * - ページ読み込み時と日付が変わった際に更新（簡易的な自動更新）。
   * - 生年月日は <time datetime="YYYY-MM-DD"> にも反映されている前提。
   */

  (function () {
    'use strict';

    /**
     * 指定された生年月日文字列から年齢を計算する
     * @param {string} birthStr - "YYYY-MM-DD"
     * @param {Date} [refDate] - 参照日（省略時は現在日）
     * @returns {number} 年齢（整数）
     */
    function calcAge(birthStr, refDate) {
      if (!birthStr) return NaN;
      var parts = birthStr.split('-');
      if (parts.length < 3) return NaN;
      var y = parseInt(parts[0], 10);
      var m = parseInt(parts[1], 10) - 1;
      var d = parseInt(parts[2], 10);
      var birth = new Date(y, m, d);
      var today = refDate ? new Date(refDate) : new Date();
      var age = today.getFullYear() - birth.getFullYear();
      var mDiff = today.getMonth() - birth.getMonth();
      if (mDiff < 0 || (mDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      return age;
    }

    /**
     * テーブル行を更新する
     */
    function updateAges() {
      var rows = document.querySelectorAll('table.member-table tbody tr[data-birth]');
      var now = new Date();
      rows.forEach(function (tr) {
        var birth = tr.getAttribute('data-birth') || (tr.querySelector('time') && tr.querySelector('time').getAttribute('datetime'));
        var ageCell = tr.querySelector('.age-cell');
        if (!ageCell) return;
        var age = calcAge(birth, now);
        if (isNaN(age)) {
          ageCell.textContent = '—';
        } else {
          ageCell.textContent = age + '歳';
          // 追加情報（誕生日が今日ならバッジを付ける）
          var birthDate = new Date(birth);
          if (birthDate.getMonth() === now.getMonth() && birthDate.getDate() === now.getDate()) {
            // 誕生日バッジ（スクリーンリーダー向けにaria-live）
            var badge = document.createElement('span');
            badge.setAttribute('aria-hidden','true');
            badge.style.marginLeft = '8px';
            badge.style.padding = '4px 8px';
            badge.style.background = 'linear-gradient(90deg,#FFD1F0,#FFB6E6)';
            badge.style.color = '#4b2b6b';
            badge.style.borderRadius = '999px';
            badge.style.fontWeight = '700';
            badge.style.fontSize = '0.85rem';
            badge.textContent = 'HAPPY BIRTHDAY 🎉';
            // 既にバッジがあれば追加しない
            if (!ageCell.querySelector('span')) {
              ageCell.appendChild(badge);
            }
          }
        }
      });
    }

    /**
     * 日付が変わったら年齢を再計算するためのタイマーをセット
     * - 現在時刻から翌日の00:00までのミリ秒を計算して setTimeout で再実行
     */
    function scheduleMidnightUpdate() {
      var now = new Date();
      var tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      var ms = tomorrow - now + 1000; // 1秒余裕を持たせる
      setTimeout(function () {
        updateAges();
        scheduleMidnightUpdate();
      }, ms);
    }

    // DOMContentLoaded で初回実行
    document.addEventListener('DOMContentLoaded', function () {
      updateAges();
      scheduleMidnightUpdate();
    });

    // もし JS が遅れて読み込まれた場合に備えて window.onload でも更新
    window.addEventListener('load', function () {
      updateAges();
    });

    // 公開API: デバッグや手動更新用（必要ならコンソールから呼べる）
    window.naniwa = window.naniwa || {};
    window.naniwa.updateAges = updateAges;

  })();