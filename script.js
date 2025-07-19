document.addEventListener('DOMContentLoaded', () => {
    console.log("Script is running.");

    // ---- HTML ELEMANLARI ----
    const gameContainer = document.getElementById('game-container');
    const gameContent = document.getElementById('game-content');
    const gameChoiceButtons = document.querySelectorAll('.game-choice');
    const backToMenuButton = document.getElementById('back-to-menu');
    const selectionScreenGames = document.getElementById('selection-screen');
    const selectionScreenTests = document.getElementById('cognitive-tests-screen');
    
    // YENİ: Akıllı Header için elementler
    const header = document.querySelector('header');
    let lastScrollTop = 0;

    // Global oyun timer değişkenleri
    let currentGameTimer = null;
    let stroopTimer = null;
    let nbackGameLoop = null;

    // ==================================================================
    // ---- ÇOK DİLLİ YAPI (MULTILANGUAGE) ----
    // ==================================================================
    const langTexts = {
        tr: {
            // ... (Tüm Türkçe metinleriniz burada, değişiklik yok)
        },
        en: {
            // ... (Tüm İngilizce metinleriniz burada, değişiklik yok)
        }
    };
    const currentLang = window.location.pathname.startsWith('/en') ? 'en' : 'tr';
    
    function shuffleArray(array) { for (let i = array.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [array[i], array[j]] = [array[j], array[i]]; } return array; }

    // ==================================================================
    // ---- YENİ: AKILLI HEADER MANTIĞI (TÜM SAYFALARDA ÇALIŞIR) ----
    // ==================================================================
    if (header) {
        window.addEventListener('scroll', () => {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > lastScrollTop && scrollTop > header.offsetHeight) {
                // Aşağı kaydırma
                header.classList.add('header-hidden');
            } else {
                // Yukarı kaydırma
                header.classList.remove('header-hidden');
            }
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // En üste gelince sıfırla
        });
    }

    // ==================================================================
    // ---- OYUN/TEST BAŞLATMA MANTIĞI ----
    // ==================================================================
    if (gameContainer && gameContent && gameChoiceButtons.length > 0) {
        gameChoiceButtons.forEach(button => {
            button.addEventListener('click', () => {
                const game = button.dataset.game;
                if (selectionScreenGames) selectionScreenGames.classList.add('hidden');
                if (selectionScreenTests) selectionScreenTests.classList.add('hidden');
                gameContainer.classList.remove('hidden');
                if (currentGameTimer) clearTimeout(currentGameTimer);
                if (stroopTimer !== null) clearInterval(stroopTimer);
                if (nbackGameLoop !== null) clearTimeout(nbackGameLoop);
                gameContent.innerHTML = '';
                const modal = document.querySelector('.game-over-modal'); if (modal) modal.remove();
                if (game === 'adam-asmaca') startHangman();
                else if (game === 'sirali-hatirlama') startSequenceMemory();
                else if (game === 'stroop-testi') startStroopTest();
                else if (game === 'n-back') startNBack();
                else if (game === 'wcst') startWCST();
                else if (game === 'trail-making') { 
                    gameContent.innerHTML = `<h2>İz Sürme Testi</h2><p>${langTexts[currentLang].trailMakingDev}</p>`; 
                }
            });
        });
        if (backToMenuButton) {
            backToMenuButton.addEventListener('click', () => {
                gameContainer.classList.add('hidden');
                if (selectionScreenGames) selectionScreenGames.classList.remove('hidden');
                if (selectionScreenTests) selectionScreenTests.classList.remove('hidden');
            });
        }
    }

    // Navigasyon aktif sınıfını yöneten kod
    const navLinks = document.querySelectorAll('.main-nav a');
    const currentPath = window.location.pathname;
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath || (linkPath.endsWith('index.html') && currentPath.endsWith(linkPath.replace('index.html', '')))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // ==================================================================
    // ---- TÜM OYUN ve TEST FONKSİYONLARI ----
    // ==================================================================
    
    // showGameOverModal, startHangman, startSequenceMemory, startStroopTest, startNBack, startWCST ve diğer tüm fonksiyonlarınız buraya gelecek...
    // (Bu fonksiyonlar bir önceki cevaptaki ile aynı, değişiklik yok)

});
