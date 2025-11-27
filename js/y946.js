        // 1. メンバーの生年月日データ
        const memberBirthdays = {
            'fukazawa-age': '1992-05-05',
            'sakuma-age': '1992-07-05',
            'watanabe-age': '1992-11-05',
            'miyodate-age': '1993-03-25',
            'iwamoto-age': '1993-05-17',
            'abe-age': '1993-11-27',
            'mukai-age': '1994-06-21',
            'meguro-age': '1997-02-16',
            'rauru-age': '2003-06-27',
        };

        // 2. 年齢を計算する関数
        /**
         * 誕生日から現在の年齢を計算します。
         * @param {string} dateString - 'YYYY-MM-DD'形式の生年月日
         * @returns {number} 現在の年齢
         */
        function calculateAge(dateString) {
            const today = new Date();
            const birthDate = new Date(dateString);

            // 生年月日が不正な場合は0を返す
            if (isNaN(birthDate)) return 0;

            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDifference = today.getMonth() - birthDate.getMonth();

            // 誕生日がまだ来ていない場合、1歳減らす
            if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
        }

        // 3. 年齢をHTMLに表示する関数
        function updateMemberAges() {
            // memberBirthdaysの各エントリをループ
            for (const [id, birthday] of Object.entries(memberBirthdays)) {
                const age = calculateAge(birthday);
                const element = document.querySelector(`[data-member-id="${id}"]`);
               
                // 要素が見つかれば年齢を更新
                if (element) {
                    element.textContent = `${age}歳`;
                }
            }
        }

        // 4. URLコピーボタンの処理
        const copyShareBtn = document.getElementById('copy-share-btn');
        if (copyShareBtn) {
            copyShareBtn.addEventListener('click', () => {
                const urlToCopy = location.href;
                const messageElement = document.createElement('div');
                messageElement.textContent = 'URLをコピーしました！';
                messageElement.className = 'fixed bottom-5 left-1/2 transform -translate-x-1/2 p-3 bg-green-500 text-white rounded-lg shadow-xl transition-opacity duration-300 z-50';
                document.body.appendChild(messageElement);

                // navigator.clipboard.writeTextがiframe内で動作しない可能性があるため、execCommandを使用
                const tempInput = document.createElement('textarea');
                tempInput.value = urlToCopy;
                document.body.appendChild(tempInput);
                tempInput.select();
                try {
                    document.execCommand('copy');
                } catch (err) {
                    console.error('Copy failed:', err);
                }
                document.body.removeChild(tempInput);

                // メッセージを1.5秒後に消す
                setTimeout(() => {
                    messageElement.classList.add('opacity-0');
                    setTimeout(() => messageElement.remove(), 300);
                }, 1500);
            });
        }


        // 5. DOMロード後に年齢を更新し、毎日0時に再更新するためのロジック
        window.addEventListener('load', () => {
            updateMemberAges(); // 初回ロード時に更新

            // 次の0時までの時間を計算する関数
            function getTimeUntilMidnight() {
                const now = new Date();
                const midnight = new Date(now);
                midnight.setHours(24, 0, 0, 0); // 次の日の0時に設定
                return midnight.getTime() - now.getTime();
            }

            // 毎日0時に年齢を再計算するためのタイマーを設定
            function setDailyUpdateTimer() {
                const delay = getTimeUntilMidnight();
                setTimeout(() => {
                    updateMemberAges(); // 0時に更新
                    setDailyUpdateTimer(); // 再度タイマーを設定
                }, delay);
                // console.log(`Next age update scheduled in ${Math.ceil(delay / 1000 / 60)} minutes.`);
            }

            setDailyUpdateTimer();
        });