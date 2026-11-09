// ==================================================================
// Bu sabitler, script dosyası yüklendiğinde sadece bir kez tanımlanmalıdır.
// Bu yüzden DOMContentLoaded olayının DIŞINA taşındılar.
// ==================================================================
// Sabitler, script dosyası yüklendiğinde sadece bir kez tanımlanmalıdır.
const WCST_COLORS = ['red', 'green', 'blue', 'yellow'];
const WCST_SHAPES = ['triangle', 'star', 'plus', 'circle'];
const WCST_COUNTS = [1, 2, 3, 4];
const WCST_RULE_ORDER = ['color', 'shape', 'number', 'color', 'shape', 'number'];

const SHAPE_SVGS = {
    triangle: '<svg viewbox="0 0 100 100"><polygon points="50,10 90,90 10,90"/></svg>',
    star: '<svg viewbox="0 0 100 100"><polygon points="50,10 61,40 95,40 67,60 78,90 50,70 22,90 33,60 5,40 39,40"/></svg>',
    plus: '<svg viewbox="0 0 100 100"><polygon points="40,10 60,10 60,40 90,40 90,60 60,60 60,90 40,90 40,60 10,60 10,40 40,40"/></svg>',
    circle: '<svg viewbox="0 0 100 100"><circle cx="50" cy="50" r="40"/></svg>'
};


document.addEventListener('DOMContentLoaded', () => {
    console.log("Script is running.");

    // ==================================================================
    // ---- YENİ: HEADER KAYDIRMA DAVRANIŞI ----
    // ==================================================================
    const header = document.querySelector('header');
    if (header) {
        let lastScrollY = window.scrollY; // Son kaydırma pozisyonunu sakla

        window.addEventListener('scroll', () => {
            // Eğer aşağı kaydırılıyorsa ve sayfanın biraz aşağısındaysak
            if (lastScrollY < window.scrollY && window.scrollY > 150) {
                header.classList.add('header--hidden');
            } 
            // Eğer yukarı kaydırılıyorsa
            else {
                header.classList.remove('header--hidden');
            }
            // Son kaydırma pozisyonunu güncelle
            lastScrollY = window.scrollY;
        });
    }

    // ---- HTML ELEMANLARI ----
    const gameContainer = document.getElementById('game-container');
    const gameContent = document.getElementById('game-content');
    const gameChoiceButtons = document.querySelectorAll('.game-choice');
    const backToMenuButton = document.getElementById('back-to-menu');
    
    const selectionScreenGames = document.getElementById('selection-screen');
    const selectionScreenTests = document.getElementById('cognitive-tests-screen');

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
            missed: "Missed!", exerciseOver: "Exercise Over!", correctDetection: "Correct Detections:", errors: "Errors:",
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
    const currentLang = (window.location.pathname.startsWith('/tr') || document.documentElement.lang === 'tr') ? 'tr' : 'en';
    
    function shuffleArray(array) { for (let i = array.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [array[i], array[j]] = [array[j], array[i]]; } return array; }

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
                    startTrailMaking(); 
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

    function showGameOverModal(game, isWin, data) {
        if (currentGameTimer) clearTimeout(currentGameTimer);
        if (stroopTimer !== null) clearInterval(stroopTimer);
        if (nbackGameLoop !== null) clearTimeout(nbackGameLoop);

        const existingModal = document.querySelector('.game-over-modal');
        if (existingModal) existingModal.remove();

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

        
        let shareText = '';
        if (game === 'sequence') {
            shareText = `🧠 DeepBrain Sequence Memory\nMax Level: ${data.level}\nCan you beat my spatial working memory? https://trainingbrain.github.io/sequence-memory-test.html`;
        } else if (game === 'stroop') {
            shareText = `🧠 DeepBrain Stroop Effect Test\n60s Score: ${data.score} points\nCan you beat my selective attention speed? https://trainingbrain.github.io/stroop-test.html`;
        } else if (game === 'n-back') {
            shareText = `🧠 DeepBrain ${data.level}-Back Working Memory Test\nCorrect Matches: ${data.score} | Errors: ${data.errors}\nTest your working memory: https://trainingbrain.github.io/n-back-test.html`;
        }
        const shareBtnHtml = shareText ? `<div style="margin: 12px 0;"><button class="share-result-btn" onclick="copyScoreToClipboard('${shareText.replace(/'/g, "\\'")}');">📋 ${currentLang === 'tr' ? 'Skoru Kopyala & Paylaş' : 'Copy Score / Share Result'}</button></div>` : '';

        modal.innerHTML = `<div class="modal-content">${content}${shareBtnHtml}<button id="play-again-button">${langTexts[currentLang].playAgain}</button></div>`;

        document.body.appendChild(modal);

        setTimeout(() => modal.classList.add('visible'), 10);

        document.getElementById('play-again-button').addEventListener('click', () => {
            modal.remove();
            if (game === 'hangman') startHangman();
            else if (game === 'sequence') startSequenceMemory();
            else if (game === 'stroop') startStroopTest();
            else if (game === 'n-back') startNBack();
        });
    }
    
    // ==================================================================
    // ---- WISCONSIN KART EŞLEME TESTİ FONKSİYONLARI ----
    // ==================================================================
    
    let responseDeck = [];
    let stimulusCards = [];
    let currentResponseCard = null;
    let wcstState = {};

    function startWCST() {
        const T = langTexts[currentLang];
        // DÜZENLEME: Kullanıcının görmemesi için .wcst-info-panel div'i kaldırıldı.
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

        stimulusCards = [
            { color: 'red', shape: 'triangle', count: 1 },
            { color: 'green', shape: 'star', count: 2 },
            { color: 'yellow', shape: 'plus', count: 3 },
            { color: 'blue', shape: 'circle', count: 4 }
        ];

        responseDeck = [];
        for (const color of WCST_COLORS) {
            for (const shape of WCST_SHAPES) {
                for (const count of WCST_COUNTS) {
                    responseDeck.push({ color, shape, count });
                }
            }
        }
        responseDeck = shuffleArray([...responseDeck, ...responseDeck]);

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

        drawStimulusCards();
        drawNextResponseCard();
    }

    function createCardElement(cardData) {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('wcst-card', `color-${cardData.color}`);
        let shapesHTML = '';
        for (let i = 0; i < cardData.count; i++) {
            shapesHTML += `<div class="card-shape">${SHAPE_SVGS[cardData.shape]}</div>`;
        }
        cardDiv.innerHTML = shapesHTML;
        return cardDiv;
    }

    function drawStimulusCards() {
        const container = gameContent.querySelector('#stimulus-cards-container');
        container.innerHTML = '';
        stimulusCards.forEach((card, index) => {
            const cardElement = createCardElement(card);
            cardElement.dataset.index = index;
            cardElement.addEventListener('click', handleStimulusClick);
            container.appendChild(cardElement);
        });
    }

    function drawNextResponseCard() {
        const container = gameContent.querySelector('#current-response-card');
        container.innerHTML = '';
        if (responseDeck.length > 0 && !wcstState.isTestOver) {
            currentResponseCard = responseDeck.pop();
            const cardElement = createCardElement(currentResponseCard);
            container.appendChild(cardElement);
        } else {
            endWCST();
        }
    }

    function handleStimulusClick(event) {
        if (!currentResponseCard || wcstState.isTestOver) return;

        const chosenStimulusIndex = parseInt(event.currentTarget.dataset.index);
        const chosenStimulusCard = stimulusCards[chosenStimulusIndex];
        
        let ruleProperty = wcstState.rule;
        if (ruleProperty === 'number') {
            ruleProperty = 'count';
        }
        
        const isMatch = chosenStimulusCard[ruleProperty] === currentResponseCard[ruleProperty];

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
                const isPerseverative = chosenStimulusCard[prevRuleProperty] === currentResponseCard[prevRuleProperty];
                if (isPerseverative) {
                    wcstState.perseverativeErrors++;
                }
            }
            wcstState.consecutiveCorrect = 0;
        }

        if (wcstState.consecutiveCorrect >= 10) {
            wcstState.categoriesCompleted++;
            wcstState.consecutiveCorrect = 0;
            const nextRuleIndex = wcstState.categoriesCompleted;
            
            wcstState.previousRule = wcstState.rule;

            if (nextRuleIndex < WCST_RULE_ORDER.length) {
                wcstState.rule = WCST_RULE_ORDER[nextRuleIndex];
                console.log("KURAL DEĞİŞTİ! Yeni kural:", wcstState.rule);
            } else {
                endWCST();
            }
        }
        
        setTimeout(() => {
            if (!wcstState.isTestOver) {
                feedbackEl.innerText = '';
                drawNextResponseCard();
            }
        }, 1000);
    }

    // DÜZENLEME: Bilgi paneli kaldırıldığı için bu fonksiyon artık UI güncellemesi yapmıyor
    // ve çağrılmasına gerek kalmadı. Çağrıldığı yerlerden de kaldırıldı.
    // function updateWcstUi() { ... }

    function endWCST() {
        if (wcstState.isTestOver) return;
        wcstState.isTestOver = true;
        console.log("TEST BİTTİ!", wcstState);

        wcstState.correctResponses = wcstState.cardsUsed - wcstState.totalErrors;
        wcstState.nonPerseverativeErrors = wcstState.totalErrors - wcstState.perseverativeErrors;
        wcstState.perseverativeResponses = wcstState.perseverativeErrors;

        const T = langTexts[currentLang];
        
        const wcstShare = `🧠 DeepBrain WCST Assessment\nCategories Completed: ${wcstState.categoriesCompleted}/6\nCards Used: ${wcstState.cardsUsed} | Errors: ${wcstState.totalErrors}\nPerseverative Errors: ${wcstState.perseverativeErrors}\nTest your prefrontal flexibility: https://trainingbrain.github.io/wisconsin-card-sorting-test.html`;

        gameContent.innerHTML = `
            <div class="wcst-results page-container">
                <h3>${T.resultsTitle}</h3>
                <p><span>${T.totalResponses}:</span> <strong>${wcstState.cardsUsed}</strong></p>
                <p><span>${T.categoriesCompleted}:</span> <strong>${wcstState.categoriesCompleted}</strong></p>
                <p><span>${T.correctResponses}:</span> <strong>${wcstState.correctResponses}</strong></p>
                <p><span>${T.totalErrors}:</span> <strong>${wcstState.totalErrors}</strong></p>
                <p><span>${T.perseverativeErrors}:</span> <strong>${wcstState.perseverativeErrors}</strong></p>
                <p><span>${T.nonPerseverativeErrors}:</span> <strong>${wcstState.nonPerseverativeErrors}</strong></p>
                <div style="margin-top: 25px; display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                    <button class="share-result-btn" onclick="copyScoreToClipboard('${wcstShare.replace(/'/g, "\\'")}');">
                        📋 ${currentLang === 'tr' ? 'Skoru Kopyala & Paylaş' : 'Copy Score / Share Result'}
                    </button>
                    <button id="play-again-button" onclick="startWCST();" style="margin-top: 15px;">
                        🔄 ${T.playAgain}
                    </button>
                </div>
            </div>
        `;
    }

    // ==================================================================
    // ---- ESKİ OYUN FONKSİYONLARINIZ (EKSİKSİZ) ----
    // ==================================================================
    
    // ---- ADAM ASMACA OYUNU ----
    let hangmanSecretWord, hangmanCorrectLetters, hangmanWrongGuessCount; const hangmanMaxWrongGuesses = 6;
    function startHangman() { showHangmanLevelSelection(); }
    function showHangmanLevelSelection() { 
        gameContent.innerHTML = `<h2>${langTexts[currentLang].hangmanTitle}</h2><h3>${langTexts[currentLang].levelSelect}</h3><p class="game-description">${langTexts[currentLang].hangmanDesc}</p><div class="level-selection-container"><button class="level-choice" data-level="basit">${langTexts[currentLang].levelEasy}</button><button class="level-choice" data-level="orta">${langTexts[currentLang].levelMedium}</button><button class="level-choice" data-level="zor">${langTexts[currentLang].levelHard}</button></div>`; 
        document.querySelectorAll('.level-choice').forEach(button => { button.addEventListener('click', (event) => { initializeHangmanGame(event.target.dataset.level); }); }); 
    }
    function initializeHangmanGame(level) { 
        hangmanCorrectLetters = []; hangmanWrongGuessCount = 0; const wordList = langTexts[currentLang].hangmanWords[level]; hangmanSecretWord = wordList[Math.floor(Math.random() * wordList.length)]; 
        gameContent.innerHTML = `<p class="guesses-text">${langTexts[currentLang].remainingGuess} <span>${hangmanMaxWrongGuesses}</span></p><div class="hangman-figure"><svg viewBox="0 0 200 250" class="figure-container"><line x1="20" y1="230" x2="120" y2="230" /><line x1="70" y1="230" x2="70" y2="20" /><line x1="70" y1="20" x2="150" y2="20" /><line x1="150" y1="20" x2="150" y2="50" /><circle cx="150" cy="70" r="20" class="figure-part" /><line x1="150" y1="90" x2="150" y2="150" class="figure-part" /><line x1="150" y1="110" x2="120" y2="130" class="figure-part" /><line x1="150" y1="110" x2="180" y2="130" class="figure-part" /><line x1="150" y1="150" x2="125" y2="190" class="figure-part" /><line x1="150" y1="150" x2="175" y2="190" class="figure-part" /></svg></div><div class="word-display"></div><div class="keyboard"></div>`; 
        updateHangmanFigure(); displayHangmanWord(); createHangmanKeyboard(); 
    }
    function displayHangmanWord() { 
        const wordDisplay = document.querySelector('.word-display'); if (!wordDisplay) return; 
        wordDisplay.innerHTML = hangmanSecretWord.split('').map(letter => `<span class="letter-box">${hangmanCorrectLetters.includes(letter) ? letter : ''}</span>`).join(''); 
        if (wordDisplay.innerText.replace(/\n/g, '') === hangmanSecretWord) { showGameOverModal('hangman', true, { secretWord: hangmanSecretWord }); } 
    }
    function createHangmanKeyboard() { 
        const keyboard = document.querySelector('.keyboard'); if (!keyboard) return; 
        keyboard.innerHTML = ''; (currentLang === 'tr' ? "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ" : "ABCDEFGHIJKLMNOPQRSTUVWXYZ").split('').forEach(letter => { 
            const keyButton = document.createElement('button'); keyButton.innerText = letter; keyButton.classList.add('key'); 
            keyButton.addEventListener('click', () => handleHangmanGuess(letter, keyButton)); keyboard.appendChild(keyButton); 
        }); 
    }
    function handleHangmanGuess(letter, button) { 
        button.disabled = true; if (hangmanSecretWord.includes(letter)) { 
            hangmanCorrectLetters.push(letter); button.classList.add('correct'); 
        } else { 
            hangmanWrongGuessCount++; updateHangmanFigure(); button.classList.add('wrong');
        } 
        displayHangmanWord(); if (hangmanWrongGuessCount === hangmanMaxWrongGuesses) { 
            showGameOverModal('hangman', false, { secretWord: hangmanSecretWord }); 
        } 
    }
    function updateHangmanFigure() { 
        const guessesText = document.querySelector('.guesses-text span'); 
        if (guessesText) { guessesText.innerText = hangmanMaxWrongGuesses - hangmanWrongGuessCount; } 
        document.querySelectorAll('.figure-part').forEach((part, index) => { part.style.display = index < hangmanWrongGuessCount ? 'block' : 'none'; }); 
    }

    // ---- SIRALI HATIRLAMA OYUNU ----
    let sequence, playerSequence, sequenceLevel, canPlayerClick;
    function startSequenceMemory() { 
        if (currentGameTimer) clearTimeout(currentGameTimer); 
        gameContent.innerHTML = `<h2>${langTexts[currentLang].sequenceTitle}</h2><p class="game-description">${langTexts[currentLang].sequenceDesc}</p><div id="sequence-status"></div><div id="sequence-game-board"></div><p>${langTexts[currentLang].sequenceInstruction}</p>`; 
        const board = document.getElementById('sequence-game-board'); 
        board.innerHTML = ''; for (let i = 0; i < 9; i++) { 
            const tile = document.createElement('div'); tile.classList.add('sequence-tile'); 
            tile.dataset.tileId = i; tile.addEventListener('click', () => handleTileClick(i)); board.appendChild(tile); 
        } 
        sequence = []; sequenceLevel = 0; 
        currentGameTimer = setTimeout(nextSequenceLevel, 1000); 
    }
    async function nextSequenceLevel() { 
        sequenceLevel++; playerSequence = []; canPlayerClick = false; 
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
            showGameOverModal('sequence', false, { level: sequenceLevel }); return; 
        } 
        if (playerSequence.length === sequence.length) { 
            canPlayerClick = false; 
            currentGameTimer = setTimeout(nextSequenceLevel, 1000); 
        } 
    }
    
    // ---- STROOP TESTİ OYUNU ----
    function startStroopTest() {
        if (stroopTimer) clearInterval(stroopTimer);
        gameContent.innerHTML = `<div id="stroop-start-screen"><h2>${langTexts[currentLang].stroopTitle}</h2><h3>${langTexts[currentLang].ready}</h3><p class="game-description">${langTexts[currentLang].stroopDesc}</p><p>${langTexts[currentLang].stroopInstruction}</p><button id="stroop-start-button">${langTexts[currentLang].start}</button></div>`;
        document.getElementById('stroop-start-button').addEventListener('click', runStroopGame);
    }
    function runStroopGame() {
        let stroopScore = 0;
        let stroopTimeLeft = 60;
        let currentCorrectColorName;
        gameContent.innerHTML = `<h2>${langTexts[currentLang].stroopTitle}</h2><div id="stroop-stats"><div>Time: <span id="stroop-timer-val">60</span></div><div>Score: <span id="stroop-score-val">0</span></div></div><div id="stroop-word"></div><div id="stroop-choices"></div>`;
        stroopTimer = setInterval(updateStroopTimer, 1000);
        nextStroopRound();
        function nextStroopRound() {
            const colorNames = Object.keys(langTexts[currentLang].stroopColors);
            const colorValues = Object.values(langTexts[currentLang].stroopColors);
            let randomWordName = colorNames[Math.floor(Math.random() * colorNames.length)];
            let randomColorValue = colorValues[Math.floor(Math.random() * colorNames.length)];
            let randomColorName = Object.keys(langTexts[currentLang].stroopColors).find(key => langTexts[currentLang].stroopColors[key] === randomColorValue);
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

    // ---- N-BACK TESTİ ----
    const NBACK_ALPHABET = 'BCDFGHKLMNPQRSTVWXYZ'; const NBACK_TRIAL_COUNT = 25; const NBACK_PREPARE_TIME = 1000; const NBACK_STIMULUS_TIME = 2000;
    function startNBack() {
        if (nbackGameLoop) clearTimeout(nbackGameLoop);
        showNBackLevelSelection();
    }
    function showNBackLevelSelection() {
        gameContent.innerHTML = `<h2>${langTexts[currentLang].nbackTitle}</h2><h3>${langTexts[currentLang].levelSelect}</h3><p class="game-description">${langTexts[currentLang].nbackDesc}</p><p>${langTexts[currentLang].nbackInstruction}</p><div class="level-selection-container"><button class="level-choice" data-level="1">${langTexts[currentLang].nbackLevels["1"]}</button><button class="level-choice" data-level="2">${langTexts[currentLang].nbackLevels["2"]}</button><button class="level-choice" data-level="3">${langTexts[currentLang].nbackLevels["3"]}</button></div>`;
        document.querySelectorAll('.level-choice').forEach(button => {
            button.addEventListener('click', (event) => {
                let nbackLevel = parseInt(event.target.dataset.level);
                initializeNBackGame(nbackLevel);
            });
        });
    }
    function initializeNBackGame(nbackLevel) {
        let nbackSequence = []; let nbackCurrentStep = 0; let nbackScore = 0; let nbackErrors = 0; let canPressButton = false;
        gameContent.innerHTML = `<h2>${nbackLevel}-Back Test</h2><div class="nback-container"><div id="nback-stats"><div>${langTexts[currentLang].correctDetection} <span id="nback-correct">0</span></div><div>${langTexts[currentLang].error}: <span id="nback-errors">0</span></div></div><div id="nback-stimulus-box">...</div><p>${currentLang === 'tr' ? 'Eşleşme gördüğünüzde butona basın.' : 'Press the button when you see a match.'}</p><div id="nback-controls"><button id="nback-match-button">${currentLang === 'tr' ? 'Eşleşme' : 'Match'}</button></div><div id="nback-feedback"></div></div>`;
        generateNBackSequence();
        document.getElementById('nback-match-button').addEventListener('click', handleNBackMatchPress);
        nbackGameLoop = setTimeout(runNBackStep, 1000);
        function generateNBackSequence() { for (let i = 0; i < NBACK_TRIAL_COUNT; i++) { if (i >= nbackLevel && Math.random() < 0.3) { nbackSequence.push(nbackSequence[i - nbackLevel]); } else { const randomChar = NBACK_ALPHABET.charAt(Math.floor(Math.random() * NBACK_ALPHABET.length)); nbackSequence.push(randomChar); } } }
        function runNBackStep() {
            if (nbackCurrentStep > 0) { checkMissedMatch(); }
            if (nbackCurrentStep >= NBACK_TRIAL_COUNT) {
                showGameOverModal('n-back', false, { level: nbackLevel, score: nbackScore, errors: nbackErrors });
                return;
            }
            const stimulusBox = document.getElementById('nback-stimulus-box'); const feedbackEl = document.getElementById('nback-feedback');
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
            const feedbackEl = document.getElementById('nback-feedback'); const currentIndex = nbackCurrentStep - 1;
            const isMatch = (currentIndex >= nbackLevel) && (nbackSequence[currentIndex] === nbackSequence[currentIndex - nbackLevel]);
            if (isMatch) {
                nbackScore++;
                if (feedbackEl) { feedbackEl.innerText = langTexts[currentLang].correct; feedbackEl.className = 'correct'; }
            } else {
                nbackErrors++;
                if (feedbackEl) { feedbackEl.innerText = langTexts[currentLang].falseAlarm; feedbackEl.className = 'wrong'; }
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
                    if (feedbackEl) { feedbackEl.innerText = langTexts[currentLang].missed; feedbackEl.className = 'wrong'; }
                }
            }
        }
        function updateNBackStats() {
            const correctEl = document.getElementById('nback-correct'); const errorsEl = document.getElementById('nback-errors');
            if (correctEl) correctEl.innerText = nbackScore;
            if (errorsEl) errorsEl.innerText = nbackErrors;
        }
    }

    // ==================================================================
    // ---- VIRAL SHARING & TOAST HELPER ----
    // ==================================================================
    window.copyScoreToClipboard = function(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                showToast(currentLang === 'tr' ? '📋 Skor kopyalandı! WhatsApp / X / Reddit üzerinde paylaşabilirsiniz.' : '📋 Score copied to clipboard! Ready to share on X, Reddit, or WhatsApp.');
            }).catch(() => {
                prompt(currentLang === 'tr' ? 'Skorunuzu kopyalayın:' : 'Copy your score:', text);
            });
        } else {
            prompt(currentLang === 'tr' ? 'Skorunuzu kopyalayın:' : 'Copy your score:', text);
        }
    };

    function showToast(msg) {
        const existing = document.querySelector('.toast-notification');
        if (existing) existing.remove();
        const toast = document.createElement('div');
        toast.className = 'toast-notification show';
        toast.innerText = msg;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 3200);
    }

    // ==================================================================
    // ---- TRAIL MAKING TEST (TMT Part A & Part B) ----
    // ==================================================================
    let tmtTimerInterval = null;
    let tmtStartTime = 0;
    let tmtCurrentIndex = 0;
    let tmtTargets = [];
    let tmtErrors = 0;
    let tmtPrevCenter = null;
    let tmtMode = 'A';

    function startTrailMaking() {
        showTmtLevelSelection();
    }

    function showTmtLevelSelection() {
        if (currentGameTimer) clearTimeout(currentGameTimer);
        if (stroopTimer !== null) clearInterval(stroopTimer);
        if (nbackGameLoop !== null) clearTimeout(nbackGameLoop);
        if (tmtTimerInterval) clearInterval(tmtTimerInterval);

        const isTr = currentLang === 'tr';
        gameContent.innerHTML = `
            <div class="tmt-start-screen" style="max-width: 600px; margin: 0 auto;">
                <h2>${isTr ? 'İz Sürme Testi (Trail Making Test)' : 'Trail Making Test (TMT)'}</h2>
                <p class="game-description" style="line-height: 1.7; margin: 15px 0 25px 0;">
                    ${isTr 
                      ? 'Görsel arama hızı, mental esneklik ve görev değiştirme (task-switching) yeteneğini ölçen standart nöropsikolojik değerlendirme.' 
                      : 'The gold-standard neuropsychological assessment measuring visual processing speed, mental flexibility, and executive task switching.'}
                </p>
                <div class="level-selection-container" style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                    <button class="level-choice" data-mode="A" style="min-width: 220px; padding: 18px 24px; text-align: center;">
                        <strong style="font-size: 1.15em; display: block; margin-bottom: 5px;">${isTr ? 'Bölüm A (Sayılar 1-15)' : 'Part A (Numbers 1-15)'}</strong>
                        <span style="font-size: 0.85em; opacity: 0.9;">${isTr ? 'Görsel Tarama & Hız' : 'Visual Search & Speed'}</span>
                    </button>
                    <button class="level-choice" data-mode="B" style="min-width: 220px; padding: 18px 24px; text-align: center;">
                        <strong style="font-size: 1.15em; display: block; margin-bottom: 5px;">${isTr ? 'Bölüm B (1-A-2-B...)' : 'Part B (1-A-2-B...)'}</strong>
                        <span style="font-size: 0.85em; opacity: 0.9;">${isTr ? 'Zihinsel Esneklik & Bilişsel Geçiş' : 'Executive Task Shifting'}</span>
                    </button>
                </div>
            </div>
        `;

        document.querySelectorAll('.tmt-start-screen .level-choice').forEach(btn => {
            btn.addEventListener('click', () => {
                initTmtGame(btn.dataset.mode);
            });
        });
    }

    function initTmtGame(mode) {
        tmtMode = mode;
        tmtCurrentIndex = 0;
        tmtErrors = 0;
        tmtPrevCenter = null;
        if (tmtTimerInterval) clearInterval(tmtTimerInterval);

        if (mode === 'A') {
            tmtTargets = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'];
        } else {
            tmtTargets = ['1', 'A', '2', 'B', '3', 'C', '4', 'D', '5', 'E', '6', 'F', '7', 'G', '8'];
        }

        const isTr = currentLang === 'tr';
        gameContent.innerHTML = `
            <div class="tmt-container">
                <div class="tmt-status-bar">
                    <div>${isTr ? 'Hedef:' : 'Target:'} <span id="tmt-next-target" style="color: var(--primary-color); font-size: 1.25em;">${tmtTargets[0]}</span></div>
                    <div>${isTr ? 'Süre:' : 'Time:'} <span id="tmt-timer-val">0.0</span>s</div>
                    <div>${isTr ? 'Hatalar:' : 'Errors:'} <span id="tmt-error-val" style="color: var(--accent-red);">0</span></div>
                </div>
                <div class="tmt-board" id="tmt-board">
                    <svg class="tmt-svg-layer" id="tmt-svg"></svg>
                </div>
            </div>
        `;

        const board = document.getElementById('tmt-board');
        const boardW = board.clientWidth || 640;
        const boardH = board.clientHeight || 440;

        // Pre-calculated collision-free positions in percentage
        const positions = [
            { x: 18, y: 22 }, { x: 38, y: 15 }, { x: 62, y: 20 }, { x: 82, y: 16 },
            { x: 12, y: 48 }, { x: 32, y: 42 }, { x: 52, y: 48 }, { x: 74, y: 42 }, { x: 88, y: 55 },
            { x: 18, y: 78 }, { x: 36, y: 84 }, { x: 55, y: 78 }, { x: 72, y: 82 }, { x: 86, y: 85 },
            { x: 50, y: 28 }
        ];

        // Shuffle positions so every game has fresh node layout
        const shuffledPos = shuffleArray([...positions]);

        tmtTargets.forEach((targetLabel, i) => {
            const circle = document.createElement('div');
            circle.className = 'tmt-circle' + (i === 0 ? ' current' : '');
            circle.innerText = targetLabel;
            circle.style.left = shuffledPos[i].x + '%';
            circle.style.top = shuffledPos[i].y + '%';
            circle.dataset.label = targetLabel;
            circle.dataset.index = i;

            circle.addEventListener('click', (e) => {
                handleTmtCircleClick(targetLabel, circle, board);
            });

            board.appendChild(circle);
        });

        tmtStartTime = performance.now();
        tmtTimerInterval = setInterval(() => {
            const elapsed = ((performance.now() - tmtStartTime) / 1000).toFixed(1);
            const timerEl = document.getElementById('tmt-timer-val');
            if (timerEl) timerEl.innerText = elapsed;
        }, 100);
    }

    function handleTmtCircleClick(label, circleEl, board) {
        const expected = tmtTargets[tmtCurrentIndex];
        const isTr = currentLang === 'tr';

        if (label === expected) {
            // Correct click!
            circleEl.classList.remove('current');
            circleEl.classList.add('completed');

            // Draw line from previous circle
            const rect = circleEl.getBoundingClientRect();
            const boardRect = board.getBoundingClientRect();
            const curCenter = {
                x: rect.left - boardRect.left + rect.width / 2,
                y: rect.top - boardRect.top + rect.height / 2
            };

            if (tmtPrevCenter) {
                const svg = document.getElementById('tmt-svg');
                if (svg) {
                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', tmtPrevCenter.x);
                    line.setAttribute('y1', tmtPrevCenter.y);
                    line.setAttribute('x2', curCenter.x);
                    line.setAttribute('y2', curCenter.y);
                    line.setAttribute('stroke', '#2ecc71');
                    line.setAttribute('stroke-width', '3');
                    line.setAttribute('stroke-linecap', 'round');
                    svg.appendChild(line);
                }
            }
            tmtPrevCenter = curCenter;

            tmtCurrentIndex++;

            if (tmtCurrentIndex >= tmtTargets.length) {
                // Completed test!
                clearInterval(tmtTimerInterval);
                const finalSeconds = ((performance.now() - tmtStartTime) / 1000).toFixed(1);
                finishTmtTest(finalSeconds);
            } else {
                // Highlight next target
                const nextExpected = tmtTargets[tmtCurrentIndex];
                const targetEl = document.getElementById('tmt-next-target');
                if (targetEl) targetEl.innerText = nextExpected;

                document.querySelectorAll('.tmt-circle').forEach(c => {
                    if (c.dataset.label === nextExpected) c.classList.add('current');
                    else c.classList.remove('current');
                });
            }
        } else {
            // Error
            tmtErrors++;
            const errEl = document.getElementById('tmt-error-val');
            if (errEl) errEl.innerText = tmtErrors;

            circleEl.classList.add('error');
            setTimeout(() => circleEl.classList.remove('error'), 400);
        }
    }

    function finishTmtTest(seconds) {
        const isTr = currentLang === 'tr';
        const secNum = parseFloat(seconds);

        // Normative evaluation
        let percentile = '50th Percentile (Average)';
        let tier = 'Normal Cognitive Speed';
        if (tmtMode === 'A') {
            if (secNum < 18) { percentile = '95th Percentile (Superior)'; tier = 'Exceptional Visual Scanning'; }
            else if (secNum < 25) { percentile = '80th Percentile (Above Average)'; tier = 'High Processing Speed'; }
            else if (secNum < 38) { percentile = '55th Percentile (Average)'; tier = 'Normal Adult Baseline'; }
            else { percentile = '30th Percentile (Below Average)'; tier = 'Mild Processing Delay'; }
        } else {
            if (secNum < 32) { percentile = '95th Percentile (Superior)'; tier = 'Exceptional Task-Switching'; }
            else if (secNum < 48) { percentile = '80th Percentile (Above Average)'; tier = 'High Cognitive Flexibility'; }
            else if (secNum < 70) { percentile = '55th Percentile (Average)'; tier = 'Normal Adult Baseline'; }
            else { percentile = '30th Percentile (Below Average)'; tier = 'Executive Shifting Lag'; }
        }

        const shareText = `🧠 DeepBrain Neuro-Benchmark\nTest: Trail Making Test Part ${tmtMode}\nCompletion Time: ${seconds}s (Errors: ${tmtErrors})\nPercentile: ${percentile}\nCan you beat my speed? Test here: https://trainingbrain.github.io/trail-making-test.html`;

        gameContent.innerHTML = `
            <div class="wcst-results page-container" style="max-width: 600px; margin: 20px auto; text-align: center;">
                <h3 style="color: var(--secondary-color); font-size: 1.8em; margin-bottom: 5px;">
                    🎉 ${isTr ? 'Test Tamamlandı!' : 'Test Completed!'}
                </h3>
                <p style="font-size: 1.1em; color: #4a5568; margin-bottom: 20px;">
                    ${isTr ? 'TMT Bölüm' : 'Trail Making Test Part'} <strong>${tmtMode}</strong>
                </p>
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 20px; text-align: left;">
                    <p style="margin: 8px 0;">⏱️ <strong>${isTr ? 'Toplam Süre:' : 'Total Time:'}</strong> <span style="font-size: 1.3em; color: var(--primary-color); font-weight: 800;">${seconds}s</span></p>
                    <p style="margin: 8px 0;">⚠️ <strong>${isTr ? 'Hata Sayısı:' : 'Errors:'}</strong> ${tmtErrors}</p>
                    <p style="margin: 8px 0;">📊 <strong>${isTr ? 'Yaş Normu Persentili:' : 'Normative Percentile:'}</strong> <span style="color: #27ae60; font-weight: 700;">${percentile}</span></p>
                    <p style="margin: 8px 0;">🧠 <strong>${isTr ? 'Bilişsel Değerlendirme:' : 'Clinical Profile:'}</strong> ${tier}</p>
                </div>
                <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                    <button class="share-result-btn" onclick="copyScoreToClipboard('${shareText.replace(/'/g, "\'")}')">
                        📋 ${isTr ? 'Skoru Kopyala & Paylaş' : 'Copy Score / Share Result'}
                    </button>
                    <button id="play-again-button" onclick="showTmtLevelSelection()" style="margin-top: 15px;">
                        🔄 ${isTr ? 'Tekrar Dene' : 'Play Again'}
                    </button>
                </div>
            </div>
        `;
    }

    // ==================================================================
    // ---- AUTO-START LOGIC FOR DEDICATED TEST LANDING PAGES ----
    // ==================================================================
    const autoTest = document.body.dataset.test;
    if (autoTest) {
        if (selectionScreenGames) selectionScreenGames.classList.add('hidden');
        if (selectionScreenTests) selectionScreenTests.classList.add('hidden');
        if (gameContainer) gameContainer.classList.remove('hidden');
        if (autoTest === 'wcst') startWCST();
        else if (autoTest === 'stroop') startStroopTest();
        else if (autoTest === 'n-back') startNBack();
        else if (autoTest === 'sequence') startSequenceMemory();
        else if (autoTest === 'hangman') startHangman();
        else if (autoTest === 'trail-making') startTrailMaking();
    }

});
