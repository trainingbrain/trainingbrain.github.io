document.addEventListener('DOMContentLoaded', () => {
    // ---- HTML ELEMANLARI ----
    const homepageMainContent = document.getElementById('homepage-main-content');
    const selectionScreen = document.getElementById('selection-screen'); // Zihinsel Egzersizler & Oyunlar ekranı
    const cognitiveTestsScreen = document.getElementById('cognitive-tests-screen'); // Bilişsel Testler ekranı
    const gameContainer = document.getElementById('game-container'); // Oyunların çalıştığı konteyner
    const gameContent = document.getElementById('game-content'); // Oyunların iç içeriği
    const gameChoiceButtons = document.querySelectorAll('.game-choice'); // Tüm oyun/test seçim butonları
    const backToMenuButton = document.getElementById('back-to-menu'); // Oyun içindeki "Ana Menüye Dön" butonu
    const mainNavLinks = document.querySelectorAll('.main-nav a'); // Üst navigasyon menüsü linkleri
    const ctaButtons = document.querySelectorAll('.homepage-content .cta-button'); // Ana sayfadaki büyük CTA butonları

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
            backToMenu: "Ana Menüye Dön", next: "Sonraki",
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
            backToMenu: "Back to Menu", next: "Next",
            wcstDev: "This exercise is currently under development. Please check back later.",
            trailMakingDev: "Trail Making Test is currently under development. Please check back later."
        }
    };
    const currentLang = window.location.pathname.startsWith('/en') ? 'en' : 'tr';
    
    function shuffleArray(array) { for (let i = array.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [array[i], array[j]] = [array[j], array[i]]; } return array; }

    let currentGameTimer = null;

    // Yeni: Tek bir fonksiyonla hangi ekranın aktif olacağını kontrol edelim
    function showScreen(screenToShow) {
        // Tüm ana içerik ekranlarını gizle
        homepageMainContent.classList.add('hidden');
        selectionScreen.classList.add('hidden');
        cognitiveTestsScreen.classList.add('hidden');
        gameContainer.classList.add('hidden');
        
        // Oyun içi timer'ları temizle ve içeriği sıfırla
        if (currentGameTimer) clearTimeout(currentGameTimer);
        if (typeof stroopTimer !== 'undefined') clearInterval(stroopTimer); 
        if (typeof nbackGameLoop !== 'undefined') clearTimeout(nbackGameLoop); 
        gameContent.innerHTML = ''; 
        const modal = document.querySelector('.game-over-modal'); if (modal) modal.remove(); 

        // İstenen ekranı göster
        screenToShow.classList.remove('hidden');

        // Navigasyon linklerinin aktifliğini yönet
        mainNavLinks.forEach(navLink => navLink.classList.remove('active'));
        // Eğer gösterilen ekran homepageMainContent ise "Ana Sayfa" linkini aktif yap
        if (screenToShow === homepageMainContent) {
            document.querySelector('.main-nav a[data-nav="home"]').classList.add('active');
        } else if (screenToShow === selectionScreen) {
            document.querySelector('.main-nav a[data-nav="games"]').classList.add('active');
        } else if (screenToShow === cognitiveTestsScreen) {
            document.querySelector('.main-nav a[data-nav="tests"]').classList.add('active');
        }
        // Blog ve Hakkımda linkleri kendi href'leriyle zaten aktif yönetimi yapıyor
    }

    // --- Navigasyon Link Olayları ---
    mainNavLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            // Blog veya Hakkımda gibi doğrudan linke sahip olanlar için HTML'in varsayılan davranışına izin ver
            if (link.dataset.nav === 'blog' || link.dataset.nav === 'about') {
                showScreen(homepageMainContent); // Geçişten önce ana sayfaya dön ve diğer ekranları gizle
                // Sadece aktif sınıfını yönet
                mainNavLinks.forEach(navLink => navLink.classList.remove('active'));
                link.classList.add('active');
                return; // HTML linkini takip et (sayfa yenilenecek)
            }
            
            event.preventDefault(); // Diğer durumlarda varsayılan link davranışını engelle (sayfa yenilenmesin)

            const navType = link.dataset.nav;
            if (navType === 'home') {
                showScreen(homepageMainContent);
            } else if (navType === 'games') {
                showScreen(selectionScreen);
            } else if (navType === 'tests') {
                showScreen(cognitiveTestsScreen);
            }
        });
    });

    // --- Ana Sayfa CTA Buton Olayları ---
    ctaButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // Blog CTA'sı için doğrudan linke izin ver
            if (button.dataset.nav === 'blog-cta') {
                showScreen(homepageMainContent); // Geçişten önce ana sayfaya dön ve diğer ekranları gizle
                return; // HTML linkini takip et
            }

            event.preventDefault(); // Diğer CTA'lar için varsayılan link davranışını engelle

            const ctaType = button.dataset.nav;
            if (ctaType === 'games-cta') {
                showScreen(selectionScreen);
            } else if (ctaType === 'tests-cta') {
                showScreen(cognitiveTestsScreen);
            }
        });
    });

    // --- Oyun Seçim Butonları (Hem Zihinsel Egzersizler hem de Bilişsel Testler için) ---
    gameChoiceButtons.forEach(button => {
        button.addEventListener('click', () => {
            const game = button.dataset.game;
            showScreen(gameContainer); // Oyun konteynerini göster (diğer her şey gizlenmiş olacak)

            // Navigasyon linklerini pasif yap, oyun içindeyken özel bir aktiflik olmasın
            mainNavLinks.forEach(navLink => navLink.classList.remove('active'));

            if (backToMenuButton) backToMenuButton.innerText = langTexts[currentLang].backToMenu;
            
            // Oyunları başlat
            if (game === 'adam-asmaca') startHangman();
            else if (game === 'sirali-hatirlama') startSequenceMemory();
            else if (game === 'stroop-testi') startStroopTest();
            else if (game === 'wcst') { gameContent.innerHTML = `<h2>Wisconsin Card Sorting Exercise</h2><p>${langTexts[currentLang].wcstDev}</p>`; } 
            else if (game === 'trail-making') { gameContent.innerHTML = `<h2>İz Sürme Testi</h2><p>${langTexts[currentLang].trailMakingDev}</p>`; }
            else if (game === 'n-back') startNBack();
        });
    });

    // --- Ana Menüye Dön Butonu ---
    backToMenuButton.addEventListener('click', () => { 
        showScreen(homepageMainContent); // Ana sayfayı tekrar göster
    });

    // --- Sayfa Yüklendiğinde Başlangıç Durumu ---
    // Bu, sitenin ilk yüklendiğinde Ana Sayfa içeriğini göstermesini sağlar.
    showScreen(homepageMainContent); // Sadece Ana Sayfayı göster ve "Ana Sayfa" linkini aktif yap


    function showGameOverModal(game, isWin, data) { 
        // Tüm aktif timer'ları temizle ve oyunu durdur
        if (currentGameTimer) clearTimeout(currentGameTimer); 
        if (typeof stroopTimer !== 'undefined') clearInterval(stroopTimer); 
        if (typeof nbackGameLoop !== 'undefined') clearTimeout(nbackGameLoop); 
        
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
            // Oyunu tekrar başlat
            if (game === 'hangman') startHangman(); 
            else if (game === 'sequence') startSequenceMemory(); 
            else if (game === 'stroop') startStroopTest(); 
            else if (game === 'n-back') startNBack(); 
        });
    }

    // ---- ADAM ASMACA OYUNU ----
    let hangmanSecretWord, hangmanCorrectLetters, hangmanWrongGuessCount; const hangmanMaxWrongGuesses = 6;
    function startHangman() { showHangmanLevelSelection(); }
    function showHangmanLevelSelection() { gameContent.innerHTML = `<h2>${langTexts[currentLang].hangmanTitle}</h2><h3>${langTexts[currentLang].levelSelect}</h3><p class="game-description">${langTexts[currentLang].hangmanDesc}</p><div class="level-selection-container"><button class="level-choice" data-level="basit">${langTexts[currentLang].levelEasy}</button><button class="level-choice" data-level="orta">${langTexts[currentLang].levelMedium}</button><button class="level-choice" data-level="zor">${langTexts[currentLang].levelHard}</button></div>`; document.querySelectorAll('.level-choice').forEach(button => { button.addEventListener('click', (event) => { initializeHangmanGame(event.target.dataset.level); }); }); }
    function initializeHangmanGame(level) { hangmanCorrectLetters = []; hangmanWrongGuessCount = 0; const wordList = langTexts[currentLang].hangmanWords[level]; hangmanSecretWord = wordList[Math.floor(Math.random() * wordList.length)]; gameContent.innerHTML = `<p class="guesses-text">${langTexts[currentLang].remainingGuess} <span>${hangmanMaxWrongGuesses}</span></p><div class="hangman-figure"><svg viewBox="0 0 200 250" class="figure-container"><line x1="20" y1="230" x2="120" y2="230" /><line x1="70" y1="230" x2="70" y2="20" /><line x1="70" y1="20" x2="150" y2="20" /><line x1="150" y1="20" x2="150" y2="50" /><circle cx="150" cy="70" r="20" class="figure-part" /><line x1="150" y1="90" x2="150" y2="150" class="figure-part" /><line x1="150" y1="110" x2="120" y2="130" class="figure-part" /><line x1="150" y1="110" x2="180" y2="130" class="figure-part" /><line x1="150" y1="150" x2="125" y2="190" class="figure-part" /><line x1="150" y1="150" x2="175" y2="190" class="figure-part" /></svg></div><div class="word-display"></div><div class="keyboard"></div>`; updateHangmanFigure(); displayHangmanWord(); createHangmanKeyboard(); }
    function displayHangmanWord() { const wordDisplay = document.querySelector('.word-display'); if (!wordDisplay) return; wordDisplay.innerHTML = hangmanSecretWord.split('').map(letter => `<span class="letter-box">${hangmanCorrectLetters.includes(letter) ? letter : ''}</span>`).join(''); if (wordDisplay.innerText.replace(/\n/g, '') === hangmanSecretWord) { showGameOverModal('hangman', true, { secretWord: hangmanSecretWord }); } }
    function createHangmanKeyboard() { const keyboard = document.querySelector('.keyboard'); if (!keyboard) return; keyboard.innerHTML = ''; (currentLang === 'tr' ? "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ" : "ABCDEFGHIJKLMNOPQRSTUVWXYZ").split('').forEach(letter => { const keyButton = document.createElement('button'); keyButton.innerText = letter; keyButton.classList.add('key'); keyButton.addEventListener('click', () => handleHangmanGuess(letter, keyButton)); keyboard.appendChild(keyButton); }); }
    function handleHangmanGuess(letter, button) { button.disabled = true; if (hangmanSecretWord.includes(letter)) { hangmanCorrectLetters.push(letter); button.classList.add('correct'); } else { hangmanWrongGuessCount++; updateHangmanFigure(); button.classList.add('wrong');} displayHangmanWord(); if (hangmanWrongGuessCount === hangmanMaxWrongGuesses) { showGameOverModal('hangman', false, { secretWord: hangmanSecretWord }); } }
    function updateHangmanFigure() { const guessesText = document.querySelector('.guesses-text span'); if (guessesText) { guessesText.innerText = hangmanMaxWrongGuesses - hangmanWrongGuessCount; } document.querySelectorAll('.figure-part').forEach((part, index) => { part.style.display = index < hangmanWrongGuessCount ? 'block' : 'none'; }); }

    // ---- SIRALI HATIRLAMA OYUNU ----
    let sequence, playerSequence, sequenceLevel, canPlayerClick;
    function startSequenceMemory() { if (currentGameTimer) clearTimeout(currentGameTimer); gameContent.innerHTML = `<h2>${langTexts[currentLang].sequenceTitle}</h2><p class="game-description">${langTexts[currentLang].sequenceDesc}</p><div id="sequence-status"></div><div id="sequence-game-board"></div><p>${langTexts[currentLang].sequenceInstruction}</p>`; const board = document.getElementById('sequence-game-board'); board.innerHTML = ''; for (let i = 0; i < 9; i++) { const tile = document.createElement('div'); tile.classList.add('sequence-tile'); tile.dataset.tileId = i; tile.addEventListener('click', () => handleTileClick(i)); board.appendChild(tile); } sequence = []; sequenceLevel = 0; currentGameTimer = setTimeout(nextSequenceLevel, 1000); }
    async function nextSequenceLevel() { sequenceLevel++; playerSequence = []; canPlayerClick = false; const status = document.getElementById('sequence-status'); status.innerText = `${langTexts[currentLang].level} ${sequenceLevel}`; await new Promise(resolve => { currentGameTimer = setTimeout(resolve, 1000); }); sequence.push(Math.floor(Math.random() * 9)); await showSequence(); }
    async function showSequence() { const tiles = document.querySelectorAll('.sequence-tile'); document.getElementById('sequence-status').innerText = langTexts[currentLang].watchSequence; for (const tileIndex of sequence) { await new Promise(resolve => { currentGameTimer = setTimeout(resolve, 300); }); if (tiles[tileIndex]) tiles[tileIndex].classList.add('active'); await new Promise(resolve => { currentGameTimer = setTimeout(resolve, 600); }); if (tiles[tileIndex]) tiles[tileIndex].classList.remove('active'); } canPlayerClick = true; document.getElementById('sequence-status').innerText = langTexts[currentLang].yourTurn; }
    function handleTileClick(tileId) { if (!canPlayerClick) return; playerSequence.push(tileId); const tile = document.querySelector(`[data-tile-id='${tileId}']`); tile.classList.add('active'); setTimeout(() => tile.classList.remove('active'), 200); const lastIndex = playerSequence.length - 1; if (playerSequence[lastIndex] !== sequence[lastIndex]) { showGameOverModal('sequence', false, { level: sequenceLevel }); return; } if (playerSequence.length === sequence.length) { canPlayerClick = false; currentGameTimer = setTimeout(nextSequenceLevel, 1000); } }
    
    // ==================================================================
    // ---- STROOP TESTİ OYUNU (DÜZELTİLMİŞ) ----
    // ==================================================================
    let stroopScore, stroopTimer, stroopTimeLeft, currentCorrectColorName, stroopColors; // stroopColors'ı global yaptık
    
    function startStroopTest() {
        clearInterval(stroopTimer);
        stroopColors = langTexts[currentLang].stroopColors; // Doğru dilin renklerini burada alıyoruz
        gameContent.innerHTML = `<div id="stroop-start-screen"><h2>${langTexts[currentLang].stroopTitle}</h2><h3>${langTexts[currentLang].ready}</h3><p class="game-description">${langTexts[currentLang].stroopDesc}</p><p>${langTexts[currentLang].stroopInstruction}</p><button id="stroop-start-button">${langTexts[currentLang].start}</button></div><div id="stroop-game-area" class="hidden"><div id="stroop-stats"><div>Time: <span>60</span></div><div id="stroop-score">Score: <span>0</span></div></div><div id="stroop-word"></div><div id="stroop-choices"></div></div>`;
        document.getElementById('stroop-start-button').addEventListener('click', runStroopGame);
    }
    
    function runStroopGame() {
        document.getElementById('stroop-start-screen').classList.add('hidden');
        stroopScore = 0;
        stroopTimeLeft = 60;
        gameContent.innerHTML = `<h2>${langTexts[currentLang].stroopTitle}</h2><div id="stroop-stats"><div>Time: <span id="stroop-timer-val">60</span></div><div>Score: <span id="stroop-score-val">0</span></div></div><div id="stroop-word"></div><div id="stroop-choices"></div>`;
        stroopTimer = setInterval(updateStroopTimer, 1000);
        nextStroopRound();
    }
    
    function nextStroopRound() {
        const colorNames = Object.keys(stroopColors);
        const colorValues = Object.values(stroopColors);
        let randomWordName = colorNames[Math.floor(Math.random() * colorNames.length)];
        let randomColorValue = colorValues[Math.floor(Math.random() * colorNames.length)];
        let randomColorName = Object.keys(stroopColors).find(key => stroopColors[key] === randomColorValue);
        
        while (randomWordName === randomColorName) {
            randomColorValue = colorValues[Math.floor(Math.random() * colorNames.length)];
            randomColorName = Object.keys(stroopColors).find(key => stroopColors[key] === randomColorValue);
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
    // ==================================================================
    // ---- N-BACK TESTİ (DÜZELTİLMİŞ) ----
    // ==================================================================
    let nbackLevel, nbackSequence, nbackCurrentStep, nbackScore, nbackErrors, canPressButton, nbackGameLoop;
    const NBACK_ALPHABET = 'BCDFGHKLMNPQRSTVWXYZ'; const NBACK_TRIAL_COUNT = 25; const NBACK_PREPARE_TIME = 1000; const NBACK_STIMULUS_TIME = 2000;
    
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
                nbackLevel = parseInt(event.target.dataset.level);
                initializeNBackGame();
            });
        });
    }
    
    function initializeNBackGame() {
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
                    <button id="nback-match-button">${currentLang === 'tr' ? 'Eşleşme' : 'Match'}</button>
                </div>
                <div id="nback-feedback"></div>
            </div>
        `;
        nbackSequence = []; nbackCurrentStep = 0; nbackScore = 0; nbackErrors = 0; canPressButton = false;
        generateNBackSequence();
        document.getElementById('nback-match-button').addEventListener('click', handleNBackMatchPress);
        nbackGameLoop = setTimeout(runNBackStep, 1000);
    }
    
    function generateNBackSequence() { for (let i = 0; i < NBACK_TRIAL_COUNT; i++) { if (i >= nbackLevel && Math.random() < 0.3) { nbackSequence.push(nbackSequence[i - nbackLevel]); } else { const randomChar = NBACK_ALPHABET.charAt(Math.floor(Math.random() * NBACK_ALPHABET.length)); nbackSequence.push(randomChar); } } }
    function runNBackStep() { if (nbackCurrentStep > 0) { checkMissedMatch(); } if (nbackCurrentStep >= NBACK_TRIAL_COUNT) { showGameOverModal('n-back', false, { level: nbackLevel, score: nbackScore, errors: nbackErrors }); return; } const stimulusBox = document.getElementById('nback-stimulus-box'); const feedbackEl = document.getElementById('nback-feedback'); if (!stimulusBox) return; stimulusBox.style.fontSize = '2.5em'; stimulusBox.style.color = '#2ecc71'; stimulusBox.innerHTML = `${langTexts[currentLang].next} →`; if (feedbackEl) feedbackEl.innerText = ''; nbackGameLoop = setTimeout(() => { const currentStimulusBox = document.getElementById('nback-stimulus-box'); if (currentStimulusBox) { currentStimulusBox.style.fontSize = '8em'; currentStimulusBox.style.color = '#2c3e50'; currentStimulusBox.innerText = nbackSequence[nbackCurrentStep]; canPressButton = true; nbackCurrentStep++; nbackGameLoop = setTimeout(runNBackStep, NBACK_STIMULUS_TIME); } }, NBACK_PREPARE_TIME); }
    function handleNBackMatchPress() { if (!canPressButton) return; const feedbackEl = document.getElementById('nback-feedback'); const currentIndex = nbackCurrentStep - 1; const isMatch = (currentIndex >= nbackLevel) && (nbackSequence[currentIndex] === nbackSequence[currentIndex - nbackLevel]); if (isMatch) { nbackScore++; feedbackEl.innerText = langTexts[currentLang].correct; feedbackEl.className = 'correct'; } else { nbackErrors++; feedbackEl.innerText = langTexts[currentLang].falseAlarm; feedbackEl.className = 'wrong'; } updateNBackStats(); canPressButton = false; }
    function checkMissedMatch() { const prevStepIndex = nbackCurrentStep - 1; if (prevStepIndex >= nbackLevel) { const wasMatch = nbackSequence[prevStepIndex] === nbackSequence[prevStepIndex - nbackLevel]; if (wasMatch && canPressButton) { nbackErrors++; updateNBackStats(); const feedbackEl = document.getElementById('nback-feedback'); if(feedbackEl) { feedbackEl.innerText = langTexts[currentLang].missed; feedbackEl.className = 'wrong'; } } } }
    function updateNBackStats() { const correctEl = document.getElementById('nback-correct'); const errorsEl = document.getElementById('nback-errors'); if (correctEl) correctEl.innerText = nbackScore; if (errorsEl) errorsEl.innerText = nbackErrors; }
        
});
