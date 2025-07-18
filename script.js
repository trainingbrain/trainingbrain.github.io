document.addEventListener('DOMContentLoaded', () => {
    console.log("Script is running.");

    // ---- HTML ELEMANLARI (Bu elementler games.html ve tests.html sayfalarında bulunur) ----
    const gameContainer = document.getElementById('game-container');
    const gameContent = document.getElementById('game-content');
    const gameChoiceButtons = document.querySelectorAll('.game-choice');
    const backToMenuButton = document.getElementById('back-to-menu');
    
    // games.html ve tests.html'deki ana seçim ekranları
    const selectionScreenGames = document.getElementById('selection-screen'); 
    const selectionScreenTests = document.getElementById('cognitive-tests-screen'); 

    // ==================================================================
    // ---- GLOBAL TIMER DEĞİŞKENLERİ (Oyunlar arasında paylaşılan timer'lar) ----
    // ==================================================================
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
            wcstTitle: "Wisconsin Kart Eşleme Testi",
            wcstEducationLevel: "Lütfen eğitim düzeyinizi seçin:",
            wcstInstructions: "Yönergeler",
            wcstInstructionsText: "Bu biraz değişik bir oyun çünkü testi nasıl yapacağınız konusunda size verilen herbir kartı dört anahtar karttan biriyle eşleştirmeniz gerekiyor. Kartı neye göre eşleştireceğinizi size söyleyemem ama yaptığınız eşleşmenin doğru mu yanlış mı olduğunu her seferinde size söyleyeceğim. Bu testte zaman sınırlaması olmadığından acele etmeniz gerekmemektedir.",
            startTest: "Teste Başla",
            educationLevels: { ilkokul: "İlkokul", ortaokul: "Ortaokul", lise: "Lise", universite: "Üniversite" },
            trailMakingDev: "İz Sürme Testi şu anda geliştirme aşamasındadır. Lütfen daha sonra tekrar deneyin.",
            resultsTitle: "Test Sonuçları",
            totalResponses: "Toplam Tepki Sayısı",
            categoriesCompleted: "Tamamlanan Kategori",
            correctResponses: "Doğru Tepki Sayısı",
            totalErrors: "Toplam Hata Sayısı",
            perseverativeResponses: "Perseveratif Tepki Sayısı",
            perseverativeErrors: "Perseveratif Hata Sayısı",
            nonPerseverativeErrors: "Non-perseveratif Hata Sayısı",
            backToTests: "Testler Sayfasına Geri Dön"
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
            wcstTitle: "Wisconsin Card Sorting Test",
            wcstEducationLevel: "Please select your education level:",
            wcstInstructions: "Instructions",
            wcstInstructionsText: "This is a somewhat unusual test because you need to match each card given to you with one of the four key cards. I cannot tell you how to match the cards, but I will tell you each time whether your match is 'right' or 'wrong.' There is no time limit for this test, so you do not need to rush.",
            startTest: "Start Test",
            educationLevels: { ilkokul: "Primary School", ortaokul: "Middle School", lise: "High School", universite: "University" },
            trailMakingDev: "Trail Making Test is currently under development. Please check back later.",
            resultsTitle: "Test Results",
            totalResponses: "Total Responses",
            categoriesCompleted: "Categories Completed",
            correctResponses: "Correct Responses",
            totalErrors: "Total Errors",
            perseverativeResponses: "Perseverative Responses",
            perseverativeErrors: "Perseverative Errors",
            nonPerseverativeErrors: "Non-perseverative Errors",
            backToTests: "Back to Tests Page"
        }
    };
    const currentLang = window.location.pathname.startsWith('/en') ? 'en' : 'tr';
    
    function shuffleArray(array) { 
        for (let i = array.length - 1; i > 0; i--) { 
            const j = Math.floor(Math.random() * (i + 1)); 
            [array[i], array[j]] = [array[j], array[i]]; 
        } 
        return array; 
    }

    // Bu if bloğu sadece games.html ve tests.html'de bulunan elementleri hedefleyecek
    if (gameContainer && gameContent && (selectionScreenGames || selectionScreenTests)) { 
        gameChoiceButtons.forEach(button => {
            button.addEventListener('click', () => {
                const game = button.dataset.game;
                
                // Oyun başlangıcında ilgili ana seçim ekranlarını gizle (eğer varlarsa)
                if (selectionScreenGames) selectionScreenGames.classList.add('hidden');
                if (selectionScreenTests) selectionScreenTests.classList.add('hidden');
                
                // WCST başlangıç ekranını da gizle (tests.html içinde olabilir)
                const wcstStartScreen = document.getElementById('wcst-start-screen');
                if (wcstStartScreen) wcstStartScreen.classList.add('hidden');
                
                gameContainer.classList.remove('hidden'); // Oyun konteynerini göster

                // Timer'ları temizle ve modal'ı kaldır
                if (currentGameTimer) clearTimeout(currentGameTimer);
                if (stroopTimer !== null) clearInterval(stroopTimer);
                if (nbackGameLoop !== null) clearTimeout(nbackGameLoop);
                gameContent.innerHTML = ''; // Önceki oyun içeriğini temizle
                const modal = document.querySelector('.game-over-modal'); if (modal) modal.remove();
                
                // Oyunları başlat
                if (game === 'adam-asmaca') startHangman();
                else if (game === 'sirali-hatirlama') startSequenceMemory();
                else if (game === 'stroop-testi') startStroopTest();
                else if (game === 'n-back') startNBack();
                else if (game === 'wcst') startWCST();
                else if (game === 'trail-making') {
                    gameContent.innerHTML = `<h2>${langTexts[currentLang].trailMakingDev}</h2>`;
                }
            });
        });

        // "Geri Dön" butonu olay dinleyicisi
        if (backToMenuButton) {
            backToMenuButton.addEventListener('click', () => {
                gameContainer.classList.add('hidden'); // Oyun konteynerini gizle
                
                // Hangi sayfadan geldiğimize göre ilgili seçim ekranını tekrar göster
                if (selectionScreenGames) selectionScreenGames.classList.remove('hidden'); // games.html'deki seçim ekranını göster
                if (selectionScreenTests) selectionScreenTests.classList.remove('hidden'); // tests.html'deki seçim ekranını göster
                
                // Oyun içi timer'ları temizle
                if (currentGameTimer) clearTimeout(currentGameTimer);
                if (stroopTimer !== null) clearInterval(stroopTimer);
                if (nbackGameLoop !== null) clearTimeout(nbackGameLoop);
                gameContent.innerHTML = ''; // İçeriği temizle
                const modal = document.querySelector('.game-over-modal'); if (modal) modal.remove();
            });
        }
        
        // Sayfa yüklendiğinde oyun konteynerini gizle (sadece oyun çalışırken görünür olacak)
        gameContainer.classList.add('hidden');
    }

    // Navigasyon aktif sınıfını yöneten kod (tüm sayfalarda çalışacak)
    // Bu kısım games.html, tests.html, blog.html, hakkimda.html gibi her sayfada HTML'in main-nav a elementlerine
    // class="active" ekleyip kaldırmak için kullanılır.
    const mainNavLinks = document.querySelectorAll('.main-nav a'); 
    const currentPath = window.location.pathname;
    mainNavLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        // Kök dizin '/' ile index.html arasındaki uyumu kontrol et
        if (linkPath === currentPath || 
           (linkPath.endsWith('index.html') && currentPath === linkPath.replace('index.html', '')) || 
           (linkPath === `/${currentLang}/` && currentPath === `/${currentLang}/index.html`)) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // ==================================================================
    // ---- GENEL OYUN SONU MODAL FONKSİYONU (GLOBAL KAPSAMDA) ----
    // Bu fonksiyon tüm oyunlar tarafından çağrılır.
    // ==================================================================
    function showGameOverModal(game, isWin, data) {
        // Tüm aktif timer'ları temizle ve oyunu durdur
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
        // WCST için sonuç gösterimi showGameOverModal yerine kendi endWCST() fonksiyonunda yapıldığı için buraya eklemiyoruz
        
        if (content === '') return; 
        
        modal.innerHTML = `<div class="modal-content">${content}<button id="play-again-button">${langTexts[currentLang].playAgain}</button></div>`;
        document.body.appendChild(modal);
        
        document.getElementById('play-again-button').addEventListener('click', () => {
            modal.remove();
            // Oyunu tekrar başlat (aynı sayfada kalıyoruz)
            if (game === 'hangman') startHangman();
            else if (game === 'sequence') startSequenceMemory();
            else if (game === 'stroop') startStroopTest();
            else if (game === 'n-back') startNBack();
        });
    }

    // ==================================================================
    // ---- WISCONSIN KART EŞLEME TESTİ FONKSİYONLARI ----
    // ==================================================================
    
    // WCST Kart Özellikleri ve Kuralları (Const olarak globalde kalır)
    const WCST_COLORS = ['red', 'green', 'blue', 'yellow'];
    const WCST_SHAPES = ['triangle', 'star', 'plus', 'circle'];
    const WCST_COUNTS = [1, 2, 3, 4];
    const WCST_RULE_ORDER = ['color', 'shape', 'number', 'color', 'shape', 'number']; 

    const SHAPE_SVGS = { // SVG ikonları (Const olarak globalde kalır)
        triangle: '<svg viewbox="0 0 100 100"><polygon points="50,10 90,90 10,90"/></svg>',
        star: '<svg viewbox="0 0 100 100"><polygon points="50,10 61,40 95,40 67,60 78,90 50,70 22,90 33,60 5,40 39,40"/></svg>',
        plus: '<svg viewbox="0 0 100 100"><polygon points="40,10 60,10 60,40 90,40 90,60 60,60 60,90 40,90 40,60 10,60 10,40 40,40"/></svg>',
        circle: '<svg viewbox="0 0 100 100"><circle cx="50" cy="50" r="40"/></svg>'
    };

    // WCST oyun değişkenleri (Her WCST başlatıldığında sıfırlanmalı, globalde tanımlı)
    let wcstResponseDeck = [];
    let wcstStimulusCards = [];
    let wcstCurrentResponseCard = null;
    let wcstState = {};

    function startWCST() {
        const T = langTexts[currentLang];
        gameContent.innerHTML = `
            <div id="wcst-start-screen">
                <h2>${T.wcstTitle}</h2>
                <div class="wcst-education-level">
                    <h3>${T.wcstEducationLevel}</h3>
                    <div class="education-options">
                        <button class="education-btn" data-level="ilkokul">${T.educationLevels.ilkokul}</button>
                        <button class="education-btn" data-level="ortaokul">${T.educationLevels.ortaokul}</button>
                        <button class="education-btn" data-level="lise">${T.educationLevels.lise}</button>
                        <button class="education-btn" data-level="universite">${T.educationLevels.universite}</button>
                    </div>
                </div>
                <div class="wcst-instructions">
                    <h3>${T.wcstInstructions}</h3>
                    <p>${T.wcstInstructionsText}</p>
                </div>
                <button id="wcst-start-btn" disabled>${T.startTest}</button>
            </div>
            <div id="wcst-game-screen" class="hidden">
                <div class="wcst-info-panel">
                    <div>${T.categoriesCompleted}: <span id="wcst-categories">0</span></div>
                    <div>${T.totalErrors}: <span id="wcst-total-errors">0</span></div>
                    <div>${T.perseverativeErrors}: <span id="wcst-perse-errors">0</span></div>
                    <div>Kalan Kart: <span id="wcst-cards-left">128</span></div>
                </div>
                <div id="stimulus-cards-container" class="card-area"></div>
                <div id="wcst-feedback"></div>
                <div id="response-card-container" class="card-area">
                    <div id="current-response-card"></div>
                </div>
            </div>`;
        
        const educationButtons = gameContent.querySelectorAll('.education-btn');
        const startTestButton = gameContent.querySelector('#wcst-start-btn');
        
        educationButtons.forEach(button => {
            button.addEventListener('click', () => {
                educationButtons.forEach(btn => btn.classList.remove('selected'));
                button.classList.add('selected');
                startTestButton.disabled = false;
            });
        });
        startTestButton.addEventListener('click', initializeWCSTGame);
    }

    function initializeWCSTGame() {
        gameContent.querySelector('#wcst-start-screen').classList.add('hidden');
        gameContent.querySelector('#wcst-game-screen').classList.remove('hidden');

        wcstStimulusCards = [
            { color: 'red', shape: 'triangle', count: 1 },
            { color: 'green', shape: 'star', count: 2 },
            { color: 'yellow', shape: 'plus', count: 3 },
            { color: 'blue', shape: 'circle', count: 4 }
        ];

        wcstResponseDeck = [];
        for (const color of WCST_COLORS) {
            for (const shape of WCST_SHAPES) {
                for (const count of WCST_COUNTS) {
                    wcstResponseDeck.push({ color, shape, count });
                }
            }
        }
        wcstResponseDeck = shuffleArray([...wcstResponseDeck, ...wcstResponseDeck]); // 128 kart için 2 deste

        wcstState = {
            rule: WCST_RULE_ORDER[0],
            previousRule: null,
            consecutiveCorrect: 0,
            categoriesCompleted: 0,
            totalErrors: 0,
            perseverativeResponses: 0, 
            perseverativeErrors: 0, 
            nonPerseverativeErrors: 0,
            cardsUsed: 0,
            isTestOver: false
        };

        drawWCSTStimulusCards();
        drawNextWCSTResponseCard();
        updateWCSTUi();
    }

    function createWCSTCardElement(cardData) {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('wcst-card', `color-${cardData.color}`);
        let shapesHTML = '';
        for (let i = 0; i < cardData.count; i++) {
            shapesHTML += `<div class="card-shape">${SHAPE_SVGS[cardData.shape]}</div>`;
        }
        cardDiv.innerHTML = shapesHTML;
        return cardDiv;
    }

    function drawWCSTStimulusCards() {
        const container = gameContent.querySelector('#stimulus-cards-container');
        container.innerHTML = '';
        wcstStimulusCards.forEach((card, index) => {
            const cardElement = createWCSTCardElement(card);
            cardElement.dataset.index = index; 
            cardElement.addEventListener('click', handleWCSTStimulusClick);
            container.appendChild(cardElement);
        });
    }

    function drawNextWCSTResponseCard() {
        const container = gameContent.querySelector('#current-response-card');
        container.innerHTML = '';
        if (wcstResponseDeck.length > 0 && !wcstState.isTestOver) {
            wcstCurrentResponseCard = wcstResponseDeck.pop();
            const cardElement = createWCSTCardElement(wcstCurrentResponseCard);
            container.appendChild(cardElement);
        } else {
            endWCST();
        }
    }

    function handleWCSTStimulusClick(event) {
        if (!wcstCurrentResponseCard || wcstState.isTestOver) return; 

        const chosenStimulusIndex = parseInt(event.currentTarget.dataset.index);
        const chosenStimulusCard = wcstStimulusCards[chosenStimulusIndex];
        
        let ruleProperty = wcstState.rule;
        if (ruleProperty === 'number') { 
            ruleProperty = 'count';
        }
        
        const isMatch = chosenStimulusCard[ruleProperty] === wcstCurrentResponseCard[ruleProperty];

        const feedbackEl = gameContent.querySelector('#wcst-feedback');
        feedbackEl.classList.remove('correct', 'wrong'); 
        wcstState.cardsUsed++; 

        if (isMatch) {
            feedbackEl.innerText = langTexts[currentLang].correct;
            feedbackEl.classList.add('correct');
            wcstState.consecutiveCorrect++; 
        } else {
            feedbackEl.innerText = langTexts[currentLang].wrong;
            feedbackEl.classList.add('wrong');
            wcstState.totalErrors++; 
            
            if (wcstState.previousRule) {
                let prevRuleProperty = wcstState.previousRule;
                if (prevRuleProperty === 'number') {
                    prevRuleProperty = 'count';
                }
                const isPerseverative = chosenStimulusCard[prevRuleProperty] === wcstCurrentResponseCard[prevRuleProperty];
                if (isPerseverative) {
                    wcstState.perseverativeErrors++;
                    wcstState.perseverativeResponses++; 
                } else {
                    wcstState.nonPerseverativeErrors++; 
                }
            } else { 
                wcstState.nonPerseverativeErrors++;
            }
            wcstState.consecutiveCorrect = 0; 
        }

        if (wcstState.consecutiveCorrect >= 10) {
            wcstState.categoriesCompleted++;
            wcstState.consecutiveCorrect = 0; 
            
            wcstState.previousRule = wcstState.rule; 
            const nextRuleIndex = wcstState.categoriesCompleted; 
            
            if (nextRuleIndex < WCST_RULE_ORDER.length) { 
                wcstState.rule = WCST_RULE_ORDER[nextRuleIndex]; 
                console.log("KURAL DEĞİŞTİ! Yeni kural:", wcstState.rule); 
            } else {
                endWCST(); 
            }
        }
        
        updateWCSTUi(); 
        
        setTimeout(() => {
            if (!wcstState.isTestOver) {
                feedbackEl.innerText = ''; 
                feedbackEl.classList.remove('correct', 'wrong'); 
                drawNextWCSTResponseCard(); 
            }
        }, 1000); 
    }

    function updateWCSTUi() {
        gameContent.querySelector('#wcst-categories').innerText = wcstState.categoriesCompleted;
        gameContent.querySelector('#wcst-total-errors').innerText = wcstState.totalErrors;
        gameContent.querySelector('#wcst-perse-errors').innerText = wcstState.perseverativeErrors;
        gameContent.querySelector('#wcst-cards-left').innerText = wcstResponseDeck.length; 
    }

    function endWCST() {
        if (wcstState.isTestOver) return; 
        wcstState.isTestOver = true;
        console.log("WCST TESTİ BİTTİ!", wcstState);

        wcstState.correctResponses = wcstState.cardsUsed - wcstState.totalErrors;
        
        const T = langTexts[currentLang];
        
        gameContent.innerHTML = `
            <div class="wcst-results page-container">
                <h3>${T.resultsTitle}</h3>
                <p><span>${T.totalResponses}:</span> <strong>${wcstState.cardsUsed}</strong></p>
                <p><span>${T.categoriesCompleted}:</span> <strong>${wcstState.categoriesCompleted}</strong></p>
                <p><span>${T.correctResponses}:</span> <strong>${wcstState.correctResponses}</strong></p>
                <p><span>${T.totalErrors}:</span> <strong>${wcstState.totalErrors}</strong></p>
                <p><span>${T.perseverativeErrors}:</span> <strong>${wcstState.perseverativeErrors}</strong></p>
                <p><span>${T.nonPerseverativeErrors}:</span> <strong>${wcstState.nonPerseverativeErrors}</strong></p>
                <button onclick="window.location.href = '/${currentLang}/tests.html'" class="cta-button" style="margin-top: 20px;">${T.backToTests}</button>
            </div>
        `;
    }
    
    // ==================================================================
    // ---- DİĞER OYUN FONKSİYONLARI ----
    // Adam Asmaca, Sıralı Hatırlama, Stroop Testi, N-Back Testi
    // ==================================================================
    
    // ---- ADAM ASMACA OYUNU ----
    function startHangman() { 
        // Global değişkenler burada sıfırlanıyor/başlatılıyor
        hangmanCorrectLetters = []; 
        hangmanWrongGuessCount = 0; 
        
        function showHangmanLevelSelection() { 
            gameContent.innerHTML = `<h2>${langTexts[currentLang].hangmanTitle}</h2><h3>${langTexts[currentLang].levelSelect}</h3><p class="game-description">${langTexts[currentLang].hangmanDesc}</p><div class="level-selection-container"><button class="level-choice" data-level="basit">${langTexts[currentLang].levelEasy}</button><button class="level-choice" data-level="orta">${langTexts[currentLang].levelMedium}</button><button class="level-choice" data-level="zor">${langTexts[currentLang].levelHard}</button></div>`; 
            document.querySelectorAll('.level-choice').forEach(button => { 
                button.addEventListener('click', (event) => { 
                    initializeHangmanGame(event.target.dataset.level); 
                }); 
            }); 
        }
        function initializeHangmanGame(level) { 
            hangmanCorrectLetters = []; 
            hangmanWrongGuessCount = 0; 
            const wordList = langTexts[currentLang].hangmanWords[level]; 
            hangmanSecretWord = wordList[Math.floor(Math.random() * wordList.length)]; 
            hangmanDisplayedWord = Array(hangmanSecretWord.length).fill("_"); 
            let hangmanRemainingGuesses = hangmanMaxWrongGuesses; // Bu yerel tanımlı olmalı, aksi takdirde her oyun başında sıfırlanamaz

            gameContent.innerHTML = `<p class="guesses-text">${langTexts[currentLang].remainingGuess} <span>${hangmanRemainingGuesses}</span></p><div class="hangman-figure"><svg viewBox="0 0 200 250" class="figure-container"><line x1="20" y1="230" x2="120" y2="230" /><line x1="70" y1="230" x2="70" y2="20" /><line x1="70" y1="20" x2="150" y2="20" /><line x1="150" y1="20" x2="150" y2="50" /><circle cx="150" cy="70" r="20" class="figure-part" /><line x1="150" y1="90" x2="150" y2="150" class="figure-part" /><line x1="150" y1="110" x2="120" y2="130" class="figure-part" /><line x1="150" y1="110" x2="180" y2="130" class="figure-part" /><line x1="150" y1="150" x2="125" y2="190" class="figure-part" /><line x1="150" y1="150" x2="175" y2="190" class="figure-part" /></svg></div><div class="word-display"></div><div class="keyboard"></div>`; 
            updateHangmanFigure(); 
            displayHangmanWord(); 
            createHangmanKeyboard(); 
        }
        function displayHangmanWord() { 
            const wordDisplay = document.querySelector('.word-display'); 
            if (!wordDisplay) return; 
            wordDisplay.innerHTML = hangmanDisplayedWord.join(" "); 
            if (!hangmanDisplayedWord.includes("_")) { 
                showGameOverModal('hangman', true, { secretWord: hangmanSecretWord }); 
            } 
        }
        function createHangmanKeyboard() { 
            const keyboard = document.querySelector('.keyboard'); 
            if (!keyboard) return; 
            keyboard.innerHTML = ''; 
            (currentLang === 'tr' ? "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ" : "ABCDEFGHIJKLMNOPQRSTUVWXYZ").split('').forEach(letter => { 
                const keyButton = document.createElement('button'); 
                keyButton.innerText = letter; 
                keyButton.classList.add('key'); 
                keyButton.addEventListener('click', () => handleHangmanGuess(letter, keyButton)); 
                keyboard.appendChild(keyButton); 
            }); 
        }
        function handleHangmanGuess(letter, button) { 
            button.disabled = true; 
            if (!hangmanSecretWord.includes(letter.toLowerCase()) && !hangmanSecretWord.includes(letter.toUpperCase())) { 
                hangmanWrongGuessCount++; 
                let hangmanRemainingGuesses = parseInt(document.querySelector('.guesses-text span').innerText) - 1; // UI'dan al
                document.querySelector('.guesses-text span').innerText = hangmanRemainingGuesses; // UI'ı güncelle
                updateHangmanFigure(); 
                button.classList.add('wrong');
                if (hangmanRemainingGuesses === 0) {
                    showGameOverModal('hangman', false, { secretWord: hangmanSecretWord }); 
                }
            } else { 
                for (let i = 0; i < hangmanSecretWord.length; i++) {
                    if (hangmanSecretWord[i].toLowerCase() === letter.toLowerCase()) {
                        hangmanDisplayedWord[i] = hangmanSecretWord[i]; 
                    }
                }
                button.classList.add('correct'); 
                displayHangmanWord(); 
            } 
        }
        function updateHangmanFigure() { 
            // Burada hangmanRemainingGuesses'a gerek yok, zaten UI'dan alınıyor veya globalde güncelleniyor
            const wrongGuessesMade = hangmanMaxWrongGuesses - parseInt(document.querySelector('.guesses-text span').innerText);
            document.querySelectorAll('.figure-part').forEach((part, index) => { 
                part.style.display = index < wrongGuessesMade ? 'block' : 'none'; 
            }); 
        }
    }

    // ---- SIRALI HATIRLAMA OYUNU ----
    function startSequenceMemory() { 
        sequence = []; 
        playerSequence = []; 
        sequenceLevel = 0; 
        canPlayerClick = false; 

        if (currentGameTimer) clearTimeout(currentGameTimer); 
        gameContent.innerHTML = `<h2>${langTexts[currentLang].sequenceTitle}</h2><p class="game-description">${langTexts[currentLang].sequenceDesc}</p><div id="sequence-status"></div><div id="sequence-game-board"></div><p>${langTexts[currentLang].sequenceInstruction}</p>`; 
        const board = document.getElementById('sequence-game-board'); 
        board.innerHTML = ''; 
        for (let i = 0; i < 9; i++) { 
            const tile = document.createElement('div'); 
            tile.classList.add('sequence-tile'); 
            tile.dataset.tileId = i; 
            tile.addEventListener('click', () => handleTileClick(i)); 
            board.appendChild(tile); 
        } 
        
        currentGameTimer = setTimeout(nextSequenceLevel, 1000); 
    
        // İç fonksiyonlar, dış kapsamdaki global değişkenlere erişir
        async function nextSequenceLevel() { 
            sequenceLevel++; 
            playerSequence = []; 
            canPlayerClick = false; 
            const status = document.getElementById('sequence-status'); 
            status.innerText = `${langTexts[currentLang].level} ${sequenceLevel}`; 
            await new Promise(resolve => { currentGameTimer = setTimeout(resolve, 1000); }); 
            sequence.push(Math.floor(Math.random() * 9)); 
            await showSequence(); 
        }
        async function showSequence() { 
            const tiles = document.querySelectorAll('.sequence-tile'); 
            document.getElementById('sequence-status').innerText = langTexts[currentLang].watchSequence; 
            for (const tileIndex of sequence) { 
                await new Promise(resolve => { currentGameTimer = setTimeout(resolve, 300); }); 
                if (tiles[tileIndex]) tiles[tileIndex].classList.add('active'); 
                await new Promise(resolve => { currentGameTimer = setTimeout(resolve, 600); }); 
                if (tiles[tileIndex]) tiles[tileIndex].classList.remove('active'); 
            } 
            canPlayerClick = true; 
            document.getElementById('sequence-status').innerText = langTexts[currentLang].yourTurn; 
        }
        function handleTileClick(tileId) { 
            if (!canPlayerClick) return; 
            playerSequence.push(tileId); 
            const tile = document.querySelector(`[data-tile-id='${tileId}']`); 
            tile.classList.add('active'); 
            setTimeout(() => tile.classList.remove('active'), 200); 
            const lastIndex = playerSequence.length - 1; 
            if (playerSequence[lastIndex] !== sequence[lastIndex]) { 
                showGameOverModal('sequence', false, { level: sequenceLevel }); 
                return; 
            } 
            if (playerSequence.length === sequence.length) { 
                canPlayerClick = false; 
                currentGameTimer = setTimeout(nextSequenceLevel, 1000); 
            } 
        }
    }
    
    // ==================================================================
    // ---- STROOP TESTİ OYUNU (DÜZELTİLMİŞ) ----
    // ==================================================================
    function startStroopTest() {
        if (stroopTimer) clearInterval(stroopTimer); 
        
        gameContent.innerHTML = `<div id="stroop-start-screen"><h2>${langTexts[currentLang].stroopTitle}</h2><h3>${langTexts[currentLang].ready}</h3><p class="game-description">${langTexts[currentLang].stroopDesc}</p><p>${langTexts[currentLang].stroopInstruction}</p><button id="stroop-start-button">${langTexts[currentLang].start}</button></div><div id="stroop-game-area" class="hidden"><div id="stroop-stats"><div>Time: <span>60</span></div><div id="stroop-score">Score: <span>0</span></div></div><div id="stroop-word"></div><div id="stroop-choices"></div></div>`;
        document.getElementById('stroop-start-button').addEventListener('click', runStroopGame);
    }
    
    function runStroopGame() {
        document.getElementById('stroop-start-screen').classList.add('hidden');
        stroopScore = 0; // Global değişkeni sıfırla
        stroopTimeLeft = 60; // Global değişkeni ayarla
        currentCorrectColorName = null; // Global değişkeni sıfırla

        gameContent.innerHTML = `<h2>${langTexts[currentLang].stroopTitle}</h2><div id="stroop-stats"><div>Time: <span id="stroop-timer-val">60</span></div><div>Score: <span id="stroop-score-val">0</span></div></div><div id="stroop-word"></div><div id="stroop-choices"></div>`;
        stroopTimer = setInterval(updateStroopTimer, 1000); 
        nextStroopRound();

        // İç fonksiyonlar, dış kapsamdaki global değişkenlere erişir
        function nextStroopRound() {
            const colorNames = Object.keys(langTexts[currentLang].stroopColors); 
            const colorValues = Object.values(langTexts[currentLang].stroopColors);
            let randomWordName = colorNames[Math.floor(Math.random() * colorNames.length)];
            let randomColorValue = colorValues[Math.floor(Math.random() * colorNames.length)];
            let randomColorName = Object.keys(langTexts[currentLang].stroopColors).find(key => langTexts[currentLang].stroopColors[key] === randomColorValue);
            
            // Kelime ve renk aynı olmasın (Stroop etkisi için önemlidir)
            while (randomWordName === randomColorName) {
                randomColorValue = colorValues[Math.floor(Math.random() * colorNames.length)];
                randomColorName = Object.keys(langTexts[currentLang].stroopColors).find(key => langTexts[currentLang].stroopColors[key] === randomColorValue);
            }
            
            currentCorrectColorName = randomColorName;
            const wordElement = document.getElementById('stroop-word');
            if (wordElement) {
                wordElement.innerText = randomWordName;
                wordElement.style.color = randomColorValue;
            }
            
            const choicesContainer = document.getElementById('stroop-choices');
            if (choicesContainer) {
                choicesContainer.innerHTML = '';
                shuffleArray(colorNames).forEach(name => {
                    const button = document.createElement('button');
                    button.classList.add('stroop-button');
                    button.innerText = name;
                    button.addEventListener('click', () => checkStroopAnswer(name));
                    choicesContainer.appendChild(button);
                });
            }
        }
        
        function checkStroopAnswer(chosenColorName) {
            stroopScore += (chosenColorName === currentCorrectColorName) ? 1 : -1;
            stroopScore = Math.max(0, stroopScore);
            const scoreVal = document.getElementById('stroop-score-val');
            if (scoreVal) scoreVal.innerText = stroopScore;
            nextStroopRound();
        }
        
        function updateStroopTimer() {
            stroopTimeLeft--;
            const timerVal = document.getElementById('stroop-timer-val');
            if (timerVal) timerVal.innerText = stroopTimeLeft;
            if (stroopTimeLeft <= 0) {
                clearInterval(stroopTimer);
                showGameOverModal('stroop', false, { score: stroopScore });
            }
        }
    }
    
    // ==================================================================
    // ---- N-BACK TESTİ (DÜZELTİLMİŞ) ----
    // ==================================================================
    // NBACK_ALPHABET, NBACK_TRIAL_COUNT vb. sabitler globalde tanımlı
    
    function startNBack() {
        if (nbackGameLoop) clearTimeout(nbackGameLoop); 
        showNBackLevelSelection();
    }
    
    function showNBackLevelSelection() {
        gameContent.innerHTML = `
            <h2>${langTexts[currentLang].nbackTitle}</h2>
            <h3>${langTexts[currentLang].levelSelect}</h3>
            <p class="game-description">${langTexts[currentLang].nbackDesc}</p>
            <p>${langTexts[currentLang].nbackInstruction}</p>
            <div class="level-selection-container">
                <button class="level-choice" data-level="1">${langTexts[currentLang].nbackLevels["1"]}</button>
                <button class="level-choice" data-level="2">${langTexts[currentLang].nbackLevels["2"]}</button>
                <button class="level-choice" data-level="3">${langTexts[currentLang].nbackLevels["3"]}</button>
            </div>
        `;
        document.querySelectorAll('.level-choice').forEach(button => {
            button.addEventListener('click', (event) => {
                nbackLevel = parseInt(event.target.dataset.level); // nbackLevel globalde tanımlı
                initializeNBackGame();
            });
        });
    }
    
    function initializeNBackGame() {
        nbackSequence = []; // Global değişkeni sıfırla
        nbackCurrentStep = 0; // Global değişkeni sıfırla
        nbackScore = 0; // Global değişkeni sıfırla
        nbackErrors = 0; // Global değişkeni sıfırla
        canPressButton = false; // Global değişkeni ayarla

        gameContent.innerHTML = `
            <h2>${nbackLevel}-Back Test</h2>
            <div class="nback-container">
                <div id="nback-stats">
                    <div>${langTexts[currentLang].correctDetection} <span id="nback-correct">0</span></div>
                    <div>${langTexts[currentLang].error}: <span id="nback-errors">0</span></div>
                </div>
                <div id="nback-stimulus-box">...</div>
                <p>${currentLang === 'tr' ? 'Eşleşme gördüğünüzde butona basın.' : 'Press the button when you see a match.'}</p>
                <div id="nback-controls">
                    <button id="nback-match-button">${langTexts[currentLang].matchButton}</button>
                </div>
                <div id="nback-feedback"></div>
            </div>
        `;
        generateNBackSequence();
        document.getElementById('nback-match-button').addEventListener('click', handleNBackMatchPress);
        nbackGameLoop = setTimeout(runNBackStep, 1000); 

        // İç fonksiyonlar, dış kapsamdaki global değişkenlere erişir
        function generateNBackSequence() { for (let i = 0; i < NBACK_TRIAL_COUNT; i++) { if (i >= nbackLevel && Math.random() < 0.3) { nbackSequence.push(nbackSequence[i - nbackLevel]); } else { const randomChar = NBACK_ALPHABET.charAt(Math.floor(Math.random() * NBACK_ALPHABET.length)); nbackSequence.push(randomChar); } } }
        function runNBackStep() { 
            if (nbackCurrentStep > 0) { checkMissedMatch(); } 
            if (nbackCurrentStep >= NBACK_TRIAL_COUNT) { 
                showGameOverModal('n-back', false, { level: nbackLevel, score: nbackScore, errors: nbackErrors }); 
                return; 
            } 
            const stimulusBox = document.getElementById('nback-stimulus-box'); 
            const feedbackEl = document.getElementById('nback-feedback'); 
            if (!stimulusBox) return; 
            stimulusBox.style.fontSize = '2.5em'; stimulusBox.style.color = '#2ecc71'; stimulusBox.innerHTML = `${langTexts[currentLang].next} →`; 
            if (feedbackEl) feedbackEl.innerText = ''; 
            nbackGameLoop = setTimeout(() => { 
                const currentStimulusBox = document.getElementById('nback-stimulus-box'); 
                if (currentStimulusBox) { 
                    currentStimulusBox.style.fontSize = '8em'; 
                    currentStimulusBox.style.color = '#2c3e50'; 
                    currentStimulusBox.innerText = nbackSequence[nbackCurrentStep]; 
                    canPressButton = true; 
                    nbackCurrentStep++; 
                    nbackGameLoop = setTimeout(runNBackStep, NBACK_STIMULUS_TIME); 
                } 
            }, NBACK_PREPARE_TIME); 
        }
        function handleNBackMatchPress() { 
            if (!canPressButton) return; 
            const feedbackEl = document.getElementById('nback-feedback'); 
            const currentIndex = nbackCurrentStep - 1; 
            const isMatch = (currentIndex >= nbackLevel) && (nbackSequence[currentIndex] === nbackSequence[currentIndex - nbackLevel]); 
            if (isMatch) { 
                nbackScore++; 
                feedbackEl.innerText = langTexts[currentLang].correct; 
                feedbackEl.className = 'correct'; 
            } else { 
                nbackErrors++; 
                feedbackEl.innerText = langTexts[currentLang].falseAlarm; 
                feedbackEl.className = 'wrong'; 
            } 
            updateNBackStats(); 
            canPressButton = false; 
        }
        function checkMissedMatch() { 
            const prevStepIndex = nbackCurrentStep - 1; 
            if (prevStepIndex >= nbackLevel) { 
                const wasMatch = nbackSequence[prevStepIndex] === nbackSequence[prevStepIndex - nbackLevel]; 
                if (wasMatch && canPressButton) { 
                    nbackErrors++; 
                    updateNBackStats(); 
                    const feedbackEl = document.getElementById('nback-feedback'); 
                    if(feedbackEl) { feedbackEl.innerText = langTexts[currentLang].missed; feedbackEl.className = 'wrong'; } 
                } 
            } 
        }
        function updateNBackStats() { 
            const correctEl = document.getElementById('nback-correct'); 
            const errorsEl = document.getElementById('nback-errors'); 
            if (correctEl) correctEl.innerText = nbackScore; 
            if (errorsEl) errorsEl.innerText = nbackErrors; 
        }
    }
});
