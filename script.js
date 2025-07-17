document.addEventListener('DOMContentLoaded', () => {
    console.log("Script is running.");

    // ==================================================================
    // ---- GLOBAL ELEMENTLER ve DEĞİŞKENLER ----
    // ==================================================================
    const gameContainer = document.getElementById('game-container');
    const gameContent = document.getElementById('game-content');
    // DİKKAT: .game-choice'ı burada genel olarak seçmiyoruz, çünkü farklı sayfalarda farklı davranıyor.
    
    // ---- HATA DÜZELTMESİ: mainNavLinks burada tanımlanmalı ----
    const mainNavLinks = document.querySelectorAll('.main-nav a');

    // Global oyun timer değişkenleri
    let currentGameTimer = null;
    let stroopTimer = null;
    let nbackGameLoop = null;

    // ==================================================================
    // ---- ÇOK DİLLİ YAPI (MULTILANGUAGE) ----
    // ==================================================================
    const langTexts = {
        tr: {
            levelSelect: "Lütfen bir zorluk seviyesi seçin:", correct: "Doğru!", wrong: "Yanlış!", playAgain: "Tekrar Oyna",
            levelEasy: "Basit", levelMedium: "Orta", levelHard: "Zor",
            hangmanTitle: "Adam Asmaca", hangmanDesc: "Bu egzersiz, kelime dağarcığınızı, harf tanıma hızınızı ve sözel akıcılığınızı test eder. Doğru kelimeyi bulmak için stratejik düşünme becerilerinizi kullanın.",
            remainingGuess: "Kalan Hak:", winMessage: "Tebrikler, Kazandınız!", loseMessage: "Maalesef, Kaybettiniz!", secretWord: "Doğru Kelime:",
            hangmanWords: { basit: ["KEDİ", "ELMA", "ARABA", "EV", "TOP", "GÜNEŞ", "AY", "SU", "KAPI", "MASA"], orta: ["BİLGİSAYAR", "TELEFON", "GÖZLÜK", "KALEM", "KİTAP", "SANDALYE", "PENCERE", "FOTOĞRAF", "HASTANE"], zor: ["NÖROTRANSMİTER", "FOTOSENTEZ", "MİTOKONDRİ", "PARADOKS", "ALGORİTMA", "FELSEFE", "ENTELLEKTÜEL", "PSİKOLOJİ"] },
            sequenceTitle: "Sıralı Hatırlama", sequenceDesc: "Bu egzersiz, beyninizin sıralı görsel bilgiyi kısa süreli bellekte tutma ve geri çağırma kapasitesini (ardışık çalışma belleği) hedefler. Dikkat ve konsantrasyon için temel bir beceridir.",
            sequenceInstruction: "Bilgisayarın gösterdiği sırayı aklında tut ve tekrarla.", level: "Seviye", watchSequence: "Sırayı İzle...", yourTurn: "Sıra Sende!", gameover: "Oyun Bitti!", highestLevel: "Ulaştığınız en yüksek seviye:",
            stroopTitle: "Stroop Testi", stroopDesc: `Bu klasik nöropsikolojik test, beyninizin "ketleme" (inhibition) ve "seçici dikkat" yeteneklerini ölçer. Otomatik bir tepki olan okumayı bastırıp, daha fazla çaba gerektiren renk isimlendirme görevine odaklanmanız gerekir.`,
            stroopInstruction: "Ekranda beliren kelimenin anlamına değil, <strong>yazıldığı renge</strong> odaklan. 60 saniye içinde en yüksek skoru yapmaya çalış!",
            stroopColors: {"KIRMIZI": "#e74c3c", "YEŞİL": "#2ecc71", "MAVİ": "#3498db", "SARI": "#f1c40f", "MOR": "#9b59b6", "TURUNCU": "#e67e22"},
            ready: "Hazır mısın?", start: "Başla!", timeUp: "Süre Doldu!", yourScore: "Skorunuz:", falseAlarm: "Yanlış Alarm!",
            nbackTitle: "N-Back Testi", nbackDesc: `Bu egzersiz, "çalışma belleği" (working memory) adı verilen kritik bir bilişsel işlevi hedefler. Bilgiyi zihninizde aktif olarak tutma, güncelleme ve manipüle etme yeteneğinizi geliştirir.`,
            nbackInstruction: "Ekranda beliren harfin, seçtiğiniz seviye kadar (N) önceki harfle aynı olup olmadığını takip edin. Eğer harf aynı ise eşleme butonuna basın.",
            nbackLevels: {"1": "1-Back (Kolay)", "2": "2-Back (Orta)", "3": "3-Back (Zor)"},
            missed: "Kaçırdın!", exerciseOver: "Egzersiz Bitti!", correctDetection: "Doğru Tespit:", error: "Hata:",
            backToMenu: "Geri Dön", next: "Sonraki",
            wcstDev: "Bu egzersiz şu anda geliştirme aşamasındadır. Lütfen daha sonra tekrar deneyin.",
            trailMakingDev: "İz Sürme Testi şu anda geliştirme aşamasındadır. Lütfen daha sonra tekrar deneyin."
        },
        en: {
            levelSelect: "Please select a difficulty level:", correct: "Correct!", wrong: "Wrong!", playAgain: "Play Again",
            levelEasy: "Easy", levelMedium: "Medium", levelHard: "Hard",
            hangmanTitle: "Hangman", hangmanDesc: "This exercise tests your vocabulary, letter recognition speed, and verbal fluency. Use your strategic thinking skills to find the correct word.",
            remainingGuess: "Guesses Left:", winMessage: "Congratulations, You Won!", loseMessage: "Sorry, You Lost!", secretWord: "The Correct Word:",
            hangmanWords: { basit: ["CAT", "APPLE", "CAR", "HOUSE", "BALL", "SUN", "MOON", "WATER", "DOOR", "TABLE"], orta: ["COMPUTER", "PHONE", "GLASSES", "PENCIL", "BOOK", "CHAIR", "WINDOW", "PHOTO", "HOSPITAL"], zor: ["NEUROTRANSMITTER", "PHOTOSYNTHESIS", "MITOCHONDRIA", "PARADOX", "ALGORITHM", "PHILOSOPHY", "INTELLECTUAL", "PSYCHOLOGY"] },
            sequenceTitle: "Sequence Memory", sequenceDesc: "This exercise targets your brain's capacity to hold and recall sequential visual information in short-term memory (sequential working memory). It is a fundamental skill for attention and concentration.",
            sequenceInstruction: "Remember the sequence shown by the computer and repeat it.", level: "Level", watchSequence: "Watch the sequence...", yourTurn: "Your Turn!", gameover: "Game Over!", highestLevel: "Highest level reached:",
            stroopTitle: "Stroop Test", stroopDesc: `This classic neuropsychological test measures your brain's "inhibition" and "selective attention" abilities. You need to suppress the automatic response of reading and focus on the more demanding task of naming the color.`,
            stroopInstruction: "Focus on the <strong>color</strong> of the word, not its meaning. Try to get the highest score in 60 seconds!",
            stroopColors: {"RED": "#e74c3c", "GREEN": "#2ecc71", "BLUE": "#3498db", "YELLOW": "#f1c40f", "PURPLE": "#9b59b6", "ORANGE": "#e67e22"},
            ready: "Are you ready?", start: "Start!", timeUp: "Time's Up!", yourScore: "Your Score:", falseAlarm: "False Alarm!",
            nbackTitle: "N-Back Test", nbackDesc: `This exercise targets a critical cognitive function called "working memory." It improves your ability to actively hold, update, and manipulate information in your mind.`,
            nbackInstruction: "Track if the letter on the screen is the same as the one that appeared N steps before. If the letter is the same, press the match button.",
            nbackLevels: {"1": "1-Back (Easy)", "2": "2-Back (Medium)", "3": "3-Back (Hard)"},
            missed: "Missed!", exerciseOver: "Exercise Over!", correctDetection: "Correct Detections:", error: "Errors:",
            backToMenu: "Back", next: "Next",
            wcstDev: "This exercise is currently under development. Please check back later.",
            trailMakingDev: "Trail Making Test is currently under development. Please check back later."
        }
    };
    const currentLang = window.location.pathname.startsWith('/en') ? 'en' : 'tr';

    function shuffleArray(array) { for (let i = array.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[array[i], array[j]] = [array[j], array[i]]; } return array; }

    // ==================================================================
    // ---- NAVİGASYON MENÜSÜ KONTROLÜ ----
    // ==================================================================
    const currentPath = window.location.pathname;
    mainNavLinks.forEach(link => {
        // Tam eşleşme veya index.html ile biten ana sayfa linki için kontrol
        if (link.getAttribute('href') === currentPath || (link.getAttribute('href').endsWith('index.html') && currentPath.endsWith('/'))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // ==================================================================
    // ---- ESKİ OYUNLARIN KONTROL MANTIĞI (games.html için) ----
    // ==================================================================
    if (gameContainer) {
        const gameChoiceButtons = document.querySelectorAll('#homepage-main-content .game-choice, #zihinsel-egzersizler-screen .game-choice');
        const backToMenuButton = document.getElementById('back-to-menu');
        
        gameChoiceButtons.forEach(button => {
            button.addEventListener('click', () => {
                const game = button.dataset.game;
                gameContainer.classList.remove('hidden');
                
                // Geri dön butonunu ayarla
                if (backToMenuButton) {
                    backToMenuButton.innerText = langTexts[currentLang].backToMenu;
                    backToMenuButton.onclick = () => {
                        gameContainer.classList.add('hidden');
                        // Ana içeriği tekrar göstermek için (opsiyonel)
                        // document.getElementById('zihinsel-egzersizler-screen').classList.remove('hidden');
                    };
                }
                
                // Timer ve içerik temizliği
                if (currentGameTimer) clearTimeout(currentGameTimer);
                if (stroopTimer !== null) clearInterval(stroopTimer);
                if (nbackGameLoop !== null) clearTimeout(nbackGameLoop);
                if (gameContent) gameContent.innerHTML = '';
                const modal = document.querySelector('.game-over-modal'); if (modal) modal.remove();

                // Oyunları başlat
                if (game === 'adam-asmaca') startHangman();
                else if (game === 'sirali-hatirlama') startSequenceMemory();
                else if (game === 'stroop-testi') startStroopTest();
                else if (game === 'n-back') startNBack();
            });
        });
    }

    // ==================================================================
    // ---- YENİ BİLİŞSEL TESTLER KONTROL MANTIĞI (tests.html için) ----
    // ==================================================================
    const testsScreen = document.getElementById('cognitive-tests-screen');
    const wcstMainContainer = document.getElementById('wcst-main-container');

    if (testsScreen && wcstMainContainer) {
        const wcstButton = testsScreen.querySelector('.game-choice[data-game="wcst"]');
        const backToMenuButton = wcstMainContainer.querySelector('#back-to-menu');
        const wcstStartScreen = document.getElementById('wcst-start-screen');
        const educationButtons = document.querySelectorAll('.education-btn');
        const startTestButton = document.getElementById('wcst-start-btn');
        const wcstGameScreen = document.getElementById('wcst-game-screen');

        // "Wisconsin Kart Eşleştirme Testi" butonuna tıklanınca
        wcstButton.addEventListener('click', () => {
            testsScreen.classList.add('hidden');
            wcstMainContainer.classList.remove('hidden');
        });

        // Test içindeki "Geri Dön" butonuna tıklanınca
        backToMenuButton.addEventListener('click', () => {
            wcstMainContainer.classList.add('hidden');
            testsScreen.classList.remove('hidden');
            // İleride buraya testi sıfırlama kodu eklenecek
        });

        // Eğitim seviyesi seçilince
        educationButtons.forEach(button => {
            button.addEventListener('click', () => {
                educationButtons.forEach(btn => btn.classList.remove('selected'));
                button.classList.add('selected');
                startTestButton.disabled = false;
            });
        });

        // "Teste Başla" butonuna tıklanınca
        startTestButton.addEventListener('click', () => {
            wcstStartScreen.classList.add('hidden');
            wcstGameScreen.classList.remove('hidden');
            console.log("WCST Oyunu Başlatılıyor!");
            // initializeWCSTGame(); // <-- BİR SONRAKİ ADIMIMIZ BU FONKSİYONU YAZMAK!
        });
    }

    // ==================================================================
    // ---- TÜM OYUN ve TEST FONKSİYONLARI ----
    // ==================================================================
    // (showGameOverModal, startHangman, startSequenceMemory, vb. tüm fonksiyonlarınız buraya gelecek)
    // Not: Mevcut fonksiyonlarınızı buraya olduğu gibi kopyalayabilirsiniz, şimdilik onlara dokunmuyoruz.
    // Örnek:
    function showGameOverModal(game, isWin, data) {
         if (currentGameTimer) clearTimeout(currentGameTimer);
         if (stroopTimer !== null) clearInterval(stroopTimer);
         if (nbackGameLoop !== null) clearTimeout(nbackGameLoop);
        
         const modal = document.createElement('div');
         modal.classList.add('game-over-modal');
         let content = '';

         if (game === 'hangman') {
             content = `<h3>${isWin ? langTexts[currentLang].winMessage : langTexts[currentLang].loseMessage}</h3><p>${langTexts[currentLang].secretWord} <strong>${data.secretWord}</strong></p>`;
         } else if (game === 'sequence') {
             content = `<h3>${langTexts[currentLang].gameover}</h3><p>${langTexts[currentLang].highestLevel} <strong>${data.level}</strong></p>`;
         } else if (game === 'stroop') {
             content = `<h3>${langTexts[currentLang].timeUp}</h3><p>${langTexts[currentLang].yourScore} <strong>${data.score}</strong></p>`;
         } else if (game === 'n-back') {
             content = `<h3>${langTexts[currentLang].exerciseOver}</h3><p>${langTexts[currentLang].level}: <strong>${data.level}-Back</strong></p><p>${langTexts[currentLang].correctDetection} <strong>${data.score}</strong></p><p>${langTexts[currentLang].error}: <strong>${data.errors}</strong></p>`;
         }
        
         if (content === '') return;
        
         modal.innerHTML = `<div class="modal-content">${content}<button id="play-again-button">${langTexts[currentLang].playAgain}</button></div>`;
         document.body.appendChild(modal);
        
         document.getElementById('play-again-button').addEventListener('click', () => {
             modal.remove();
             if (game === 'hangman') startHangman();
             else if (game === 'sequence') startSequenceMemory();
             else if (game === 'stroop') startStroopTest();
             else if (game === 'n-back') startNBack();
         });
     }
    // Diğer tüm oyun fonksiyonlarınız buraya...

});
