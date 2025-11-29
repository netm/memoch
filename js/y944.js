    // 年齢計算ロジック
    function calculateAge(birthDateString) {
        const today = new Date();
        const birthDate = new Date(birthDateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    // ページ読み込み時に年齢を更新
    window.onload = function() {
        const members = [
            { id: 'age-jesse', dob: '1996-06-11' },
            { id: 'age-taiga', dob: '1994-12-03' },
            { id: 'age-hokuto', dob: '1995-06-18' },
            { id: 'age-yugo', dob: '1994-03-08' },
            { id: 'age-shintaro', dob: '1997-07-15' },
            { id: 'age-juri', dob: '1995-06-15' }
        ];

        members.forEach(member => {
            const element = document.getElementById(member.id);
            if (element) {
                element.textContent = calculateAge(member.dob) + '歳';
            }
        });
    };

    // ネイティブシェア機能
    function nativeShare() {
        if (navigator.share) {
            navigator.share({
                title: 'SixTONESファンサイト',
                text: 'ストーンズメンバーの年齢・身長・セトリ情報まとめ',
                url: window.location.href,
            })
            .then(() => console.log('シェアしました'))
            .catch((error) => console.log('シェア失敗', error));
        } else {
            alert('お使いのブラウザはネイティブシェアに対応していません。');
        }
    }
    
    // 現在のURLを取得（シェアボタン用）
    const currentUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent("SixTONESメンバー情報まとめ");