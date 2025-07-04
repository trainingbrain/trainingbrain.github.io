document.addEventListener('DOMContentLoaded', () => {
    // ---- HTML ELEMANLARI ----
    const selectionScreen = document.getElementById('selection-screen');
    const gameContainer = document.getElementById('game-container');
    const gameContent = document.getElementById('game-content');
    const gameChoiceButtons = document.querySelectorAll('.game-choice');
    const backToMenuButton = document.getElementById('back-to-menu');

    // ---- YARDIMCI FONKSİYON ----
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // ---- OYUN GEÇİŞLERİ ----
    gameChoiceButtons.forEach(button => {
        button.addEventListener('click', () => {
            const game = button.dataset.game;
            selectionScreen.classList.add('hidden');
            gameContainer.classList.remove('hidden');
            
            if (game === 'adam-asmaca') startHangman();
            else if (game === 'sirali-hatirlama') startSequenceMemory();
            else if (game === 'stroop-testi') startStroopTest();
            else if (game === 'wcst') {
                // WCST şimdilik devre dışı, sadece bir mesaj göster
                gameContent.innerHTML = `<h2>Wisconsin Kart Eşleştirme Egzersizi</h2><p>Bu egzersiz şu anda geliştirme aşamasındadır. Lütfen daha sonra tekrar deneyin.</p>`;
            } 
            else if (game === 'n-back') startNBack();
        });
    });

    backToMenuButton.addEventListener('click', () => {
        gameContainer.classList.add('hidden');
        selectionScreen.classList.remove('hidden');
        gameContent.innerHTML = '';
        const modal = document.querySelector('.game-over-modal');
        if (modal) modal.remove();
        if (typeof stroopTimer !== 'undefined') clearInterval(stroopTimer);
    });

    // ---- GENEL OYUN SONU FONKSİYONU ----
    function showGameOverModal(game, isWin, data) {
        const modal = document.createElement('div');
        modal.classList.add('game-over-modal');
        let content = '';

        if (game === 'hangman') {
            const message = isWin ? 'Tebrikler, Kazandınız!' : 'Maalesef, Kaybettiniz!';
            content = `<h3>${message}</h3><p>Doğru Kelime: <strong>${data.secretWord}</strong></p>`;
        } else if (game === 'sequence') {
            content = `<h3>Oyun Bitti!</h3><p>Ulaştığınız en yüksek seviye: <strong>${data.level}</strong></p>`;
        } else if (game === 'stroop') {
            content = `<h3>Süre Doldu!</h3><p>Skorunuz: <strong>${data.score}</strong></p>`;
        }
        
        if (content === '') return;

        modal.innerHTML = `<div class="modal-content">${content}<button id="play-again-button">Tekrar Oyna</button></div>`;
        document.body.appendChild(modal);

        document.getElementById('play-again-button').addEventListener('click', () => {
            modal.remove();
            if (game === 'hangman') startHangman();
            else if (game === 'sequence') startSequenceMemory();
            else if (game === 'stroop') startStroopTest();
        });
    }

    // ==================================================================
    // ---- ADAM ASMACA OYUNU ----
    // ==================================================================
    const hangmanWordLists = { basit: ["KEDİ", "ELMA", "ARABA", "EV", "TOP", "GÜNEŞ", "AY", "SU", "KAPI", "MASA"], orta: ["BİLGİSAYAR", "TELEFON", "GÖZLÜK", "KALEM", "KİTAP", "SANDALYE", "PENCERE", "FOTOĞRAF", "HASTANE"], zor: ["NÖROTRANSMİTER", "FOTOSENTEZ", "MİTOKONDRİ", "PARADOKS", "ALGORİTMA", "FELSEFE", "ENTELLEKTÜEL", "PSİKOLOJİ"] };
    let hangmanSecretWord = ''; let hangmanCorrectLetters = []; let hangmanWrongGuessCount = 0; const hangmanMaxWrongGuesses = 6;
    function startHangman() { showHangmanLevelSelection(); }
    function showHangmanLevelSelection() { gameContent.innerHTML = `<h2>Adam Asmaca</h2><h3>Lütfen bir zorluk seviyesi seçin:</h3><div class="level-selection-container"><button class="level-choice" data-level="basit">Basit</button><button class="level-choice" data-level="orta">Orta</button><button class="level-choice" data-level="zor">Zor</button></div>`; document.querySelectorAll('.level-choice').forEach(button => { button.addEventListener('click', (event) => { const selectedLevel = event.target.dataset.level; initializeHangmanGame(selectedLevel); }); }); }
    function initializeHangmanGame(level) { hangmanCorrectLetters = []; hangmanWrongGuessCount = 0; const wordList = hangmanWordLists[level]; hangmanSecretWord = wordList[Math.floor(Math.random() * wordList.length)]; gameContent.innerHTML = `<p class="guesses-text">Kalan Hak: <span>${hangmanMaxWrongGuesses - hangmanWrongGuessCount}</span></p><div class="hangman-figure"><svg viewBox="0 0 200 250" class="figure-container"><line x1="20" y1="230" x2="120" y2="230" /><line x1="70" y1="230" x2="70" y2="20" /><line x1="70" y1="20" x2="150" y2="20" /><line x1="150" y1="20" x2="150" y2="50" /><circle cx="150" cy="70" r="20" class="figure-part" /><line x1="150" y1="90" x2="150" y2="150" class="figure-part" /><line x1="150" y1="110" x2="120" y2="130" class="figure-part" /><line x1="150" y1="110" x2="180" y2="130" class="figure-part" /><line x1="150" y1="150" x2="125" y2="190" class="figure-part" /><line x1="150" y1="150" x2="175" y2="190" class="figure-part" /></svg></div><div class="word-display"></div><div class="keyboard"></div>`; updateHangmanFigure(); displayHangmanWord(); createHangmanKeyboard(); }
    function displayHangmanWord() { const wordDisplay = document.querySelector('.word-display'); if (!wordDisplay) return; wordDisplay.innerHTML = hangmanSecretWord.split('').map(letter => `<span class="letter-box">${hangmanCorrectLetters.includes(letter) ? letter : ''}</span>`).join(''); if (wordDisplay.innerText.replace(/\n/g, '') === hangmanSecretWord) { showGameOverModal('hangman', true, { secretWord: hangmanSecretWord }); } }
    function createHangmanKeyboard() { const keyboard = document.querySelector('.keyboard'); if (!keyboard) return; keyboard.innerHTML = ''; "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ".split('').forEach(letter => { const keyButton = document.createElement('button'); keyButton.innerText = letter; keyButton.classList.add('key'); keyButton.addEventListener('click', () => handleHangmanGuess(letter, keyButton)); keyboard.appendChild(keyButton); }); }
    function handleHangmanGuess(letter, button) { button.disabled = true; if (hangmanSecretWord.includes(letter)) { hangmanCorrectLetters.push(letter); button.classList.add('correct'); } else { hangmanWrongGuessCount++; button.classList.add('wrong'); updateHangmanFigure(); } displayHangmanWord(); if (hangmanWrongGuessCount === hangmanMaxWrongGuesses) { showGameOverModal('hangman', false, { secretWord: hangmanSecretWord }); } }
    function updateHangmanFigure() { const guessesText = document.querySelector('.guesses-text span'); if (guessesText) { guessesText.innerText = hangmanMaxWrongGuesses - hangmanWrongGuessCount; } document.querySelectorAll('.figure-part').forEach((part, index) => { part.style.display = index < hangmanWrongGuessCount ? 'block' : 'none'; }); }

    // ==================================================================
    // ---- SIRALI HATIRLAMA OYUNU ----
    // ==================================================================
    let sequence = []; let playerSequence = []; let sequenceLevel = 0; let canPlayerClick = false;
    async function startSequenceMemory() { gameContent.innerHTML = `<h2>Sıralı Hatırlama</h2><div id="sequence-status">Seviye 1</div><div id="sequence-game-board"></div><p>Bilgisayarın gösterdiği sırayı aklında tut ve tekrarla.</p>`; const board = document.getElementById('sequence-game-board'); board.innerHTML = ''; for (let i = 0; i < 9; i++) { const tile = document.createElement('div'); tile.classList.add('sequence-tile'); tile.dataset.tileId = i; tile.addEventListener('click', () => handleTileClick(i)); board.appendChild(tile); } sequence = []; sequenceLevel = 0; await new Promise(resolve => setTimeout(resolve, 1000)); nextSequenceLevel(); }
    async function nextSequenceLevel() { sequenceLevel++; playerSequence = []; canPlayerClick = false; const status = document.getElementById('sequence-status'); status.innerText = `Seviye ${sequenceLevel}`; await new Promise(resolve => setTimeout(resolve, 1000)); sequence.push(Math.floor(Math.random() * 9)); await showSequence(); }
    async function showSequence() { const tiles = document.querySelectorAll('.sequence-tile'); document.getElementById('sequence-status').innerText = "Sırayı İzle..."; for (const tileIndex of sequence) { await new Promise(resolve => setTimeout(resolve, 300)); tiles[tileIndex].classList.add('active'); await new Promise(resolve => setTimeout(resolve, 600)); tiles[tileIndex].classList.remove('active'); } canPlayerClick = true; document.getElementById('sequence-status').innerText = "Sıra Sende!"; }
    function handleTileClick(tileId) { if (!canPlayerClick) return; playerSequence.push(tileId); const tile = document.querySelector(`[data-tile-id='${tileId}']`); tile.classList.add('active'); setTimeout(() => tile.classList.remove('active'), 200); const lastIndex = playerSequence.length - 1; if (playerSequence[lastIndex] !== sequence[lastIndex]) { showGameOverModal('sequence', false, { level: sequenceLevel }); return; } if (playerSequence.length === sequence.length) { setTimeout(nextSequenceLevel, 1000); } }
    
    // ==================================================================
    // ---- STROOP TESTİ OYUNU ----
    // ==================================================================
    const stroopColors = {"KIRMIZI": "#e74c3c", "YEŞİL": "#2ecc71", "MAVİ": "#3498db", "SARI": "#f1c40f", "MOR": "#9b59b6", "TURUNCU": "#e67e22"};
    let stroopScore = 0; let stroopTimer; let stroopTimeLeft = 60; let currentCorrectColorName;
    function startStroopTest() { clearInterval(stroopTimer); gameContent.innerHTML = `<div id="stroop-start-screen"><h2>Stroop Testi</h2><h3>Hazır mısın?</h3><p>Ekranda beliren kelimenin anlamına değil, <strong>yazıldığı renge</strong> odaklan. 60 saniye içinde en yüksek skoru yapmaya çalış!</p><button id="stroop-start-button">Başla!</button></div><div id="stroop-game-area" class="hidden"><div id="stroop-stats"><div id="stroop-timer">Zaman: <span>${stroopTimeLeft}</span></div><div id="stroop-score">Skor: <span>0</span></div></div><div id="stroop-word"></div><div id="stroop-choices"></div></div>`; document.getElementById('stroop-start-button').addEventListener('click', runStroopGame); }
    function runStroopGame() { document.getElementById('stroop-start-screen').classList.add('hidden'); document.getElementById('stroop-game-area').classList.remove('hidden'); stroopScore = 0; stroopTimeLeft = 60; document.querySelector('#stroop-score span').innerText = stroopScore; document.querySelector('#stroop-timer span').innerText = stroopTimeLeft; stroopTimer = setInterval(updateStroopTimer, 1000); nextStroopRound(); }
    function nextStroopRound() { const colorNames = Object.keys(stroopColors); const colorValues = Object.values(stroopColors); let randomWordName = colorNames[Math.floor(Math.random() * colorNames.length)]; let randomColorValue = colorValues[Math.floor(Math.random() * colorValues.length)]; let randomColorName = Object.keys(stroopColors).find(key => stroopColors[key] === randomColorValue); while (randomWordName === randomColorName) { randomColorValue = colorValues[Math.floor(Math.random() * colorValues.length)]; randomColorName = Object.keys(stroopColors).find(key => stroopColors[key] === randomColorValue); } currentCorrectColorName = randomColorName; const wordElement = document.getElementById('stroop-word'); wordElement.innerText = randomWordName; wordElement.style.color = randomColorValue; const choicesContainer = document.getElementById('stroop-choices'); choicesContainer.innerHTML = ''; shuffleArray(colorNames).forEach(name => { const button = document.createElement('button'); button.classList.add('stroop-button'); button.innerText = name; button.addEventListener('click', () => checkStroopAnswer(name)); choicesContainer.appendChild(button); }); }
    function checkStroopAnswer(chosenColorName) { stroopScore += (chosenColorName === currentCorrectColorName) ? 1 : -1; stroopScore = Math.max(0, stroopScore); document.querySelector('#stroop-score span').innerText = stroopScore; nextStroopRound(); }
    function updateStroopTimer() { stroopTimeLeft--; document.querySelector('#stroop-timer span').innerText = stroopTimeLeft; if (stroopTimeLeft <= 0) { clearInterval(stroopTimer); showGameOverModal('stroop', false, { score: stroopScore }); } }

    // ==================================================================
    // script.js'teki eski N-Back kodunu bununla değiştirin

// ==================================================================
// ---- N-BACK TESTİ ----
// ==================================================================

let nbackLevel = 0;              // 1, 2, or 3
let nbackSequence = [];          // Gösterilen harflerin dizisi
let nbackInterval;               // Zamanlayıcı
let nbackCurrentStep = 0;        // Dizinin hangi adımında olduğumuz
let nbackScore = 0;              // Doğru sayısı
let nbackErrors = 0;             // Hata sayısı
let canPressButton = true;       // Butona tekrar basılmasını önlemek için

const NBACK_ALPHABET = 'ABCDEFGHJKLMNPQRSTVWXYZ'; // O ve I gibi karışabilecek harfler çıkarıldı
const NBACK_TRIAL_COUNT = 25; // Her oyunda gösterilecek toplam harf sayısı
const NBACK_INTERVAL_MS = 3000; // Her harfin ekranda kalma süresi (3 saniye)

function startNBack() {
    // Önce seviye seçim ekranını göster
    showNBackLevelSelection();
}

function showNBackLevelSelection() {
    gameContent.innerHTML = `
        <h2>N-Back Testi</h2>
        <h3>Lütfen bir zorluk seviyesi seçin:</h3>
        <p>Ekranda beliren harfin, seçtiğiniz seviye kadar (N) önceki harfle aynı olup olmadığını takip edin.</p>
        <div class="level-selection-container">
            <button class="level-choice" data-level="1">1-Back (Kolay)</button>
            <button class="level-choice" data-level="2">2-Back (Orta)</button>
            <button class="level-choice" data-level="3">3-Back (Zor)</button>
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
    // Oyun arayüzünü çiz
    gameContent.innerHTML = `
        <h2>${nbackLevel}-Back Testi</h2>
        <div class="nback-container">
            <div id="nback-stats">
                <div>Doğru: <span id="nback-correct">0</span></div>
                <div>Hata: <span id="nback-errors">0</span></div>
            </div>
            <div id="nback-stimulus-box">...</div>
            <p>Eşleşme gördüğünüzde butona basın.</p>
            <div id="nback-controls">
                <button id="nback-match-button">Eşleşme</button>
            </div>
            <div id="nback-feedback"></div>
        </div>
    `;

    // Değişkenleri sıfırla
    nbackSequence = [];
    nbackCurrentStep = 0;
    nbackScore = 0;
    nbackErrors = 0;

    // Harf dizisini oluştur
    generateNBackSequence();

    // Buton olayını ekle
    document.getElementById('nback-match-button').addEventListener('click', handleNBackMatchPress);

    // Oyun döngüsünü başlat
    nbackInterval = setInterval(runNBackStep, NBACK_INTERVAL_MS);
}

function generateNBackSequence() {
    // Yaklaşık %30 eşleşme olacak şekilde bir dizi oluştur
    for (let i = 0; i < NBACK_TRIAL_COUNT; i++) {
        // %30 ihtimalle bir eşleşme oluştur
        if (i >= nbackLevel && Math.random() < 0.3) {
            nbackSequence.push(nbackSequence[i - nbackLevel]);
        } else {
            const randomChar = NBACK_ALPHABET.charAt(Math.floor(Math.random() * NBACK_ALPHABET.length));
            nbackSequence.push(randomChar);
        }
    }
}

// Oyunun her adımını (her harf gösterimini) yöneten fonksiyon
function runNBackStep() {
    // Bir önceki adımda butona basılmadıysa, durumu değerlendir
    checkMissedMatch();
    canPressButton = true; // Yeni harf için butona basılabilir

    // Eğer test bittiyse, döngüyü durdur
    if (nbackCurrentStep >= NBACK_TRIAL_COUNT) {
        endNBackGame();
        return;
    }

    // Yeni harfi ekrana yaz
    const stimulusBox = document.getElementById('nback-stimulus-box');
    stimulusBox.innerText = nbackSequence[nbackCurrentStep];
    
    // Geri bildirimi temizle
    document.getElementById('nback-feedback').innerText = '';

    nbackCurrentStep++;
}

// Oyuncu "Eşleşme" butonuna bastığında çalışacak fonksiyon
function handleNBackMatchPress() {
    if (!canPressButton) return; // Aynı harf için tekrar basmayı engelle
    
    const isMatch = (nbackCurrentStep > nbackLevel) && (nbackSequence[nbackCurrentStep - 1] === nbackSequence[nbackCurrentStep - 1 - nbackLevel]);
    
    if (isMatch) {
        // Doğru zamanda bastı (Hit)
        nbackScore++;
        document.getElementById('nback-feedback').innerText = "Doğru!";
        document.getElementById('nback-feedback').className = 'correct';
    } else {
        // Yanlış zamanda bastı (False Alarm)
        nbackErrors++;
        document.getElementById('nback-feedback').innerText = "Yanlış Alarm!";
        document.getElementById('nback-feedback').className = 'wrong';
    }
    updateNBackStats();
    canPressButton = false; // Bu harf için karar verildi, tekrar basılamaz
}

// Oyuncu eşleşme varken butona basmadıysa (Miss) bunu kontrol et
function checkMissedMatch() {
    // Bu kontrol bir önceki adım için yapılır
    const previousStep = nbackCurrentStep - 1;
    if (previousStep >= nbackLevel) {
        const wasMatch = nbackSequence[previousStep] === nbackSequence[previousStep - nbackLevel];
        // Eğer bir eşleşme vardı AMA butona basılmadıysa (canPressButton hala true ise) bu bir hatadır.
        if (wasMatch && canPressButton) {
            nbackErrors++;
            document.getElementById('nback-feedback').innerText = "Kaçırdın!";
            document.getElementById('nback-feedback').className = 'wrong';
            updateNBackStats();
        }
    }
}

function updateNBackStats() {
    document.getElementById('nback-correct').innerText = nbackScore;
    document.getElementById('nback-errors').innerText = nbackErrors;
}

function endNBackGame() {
    clearInterval(nbackInterval); // Zamanlayıcıyı durdur
    gameContent.innerHTML = ''; // Oyun alanını temizle

    const modal = document.createElement('div');
    modal.classList.add('game-over-modal');
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Egzersiz Bitti!</h3>
            <p>Seviye: <strong>${nbackLevel}-Back</strong></p>
            <p>Doğru Tespit: <strong>${nbackScore}</strong></p>
            <p>Hata (Yanlış Alarm / Kaçırma): <strong>${nbackErrors}</strong></p>
            <button id="play-again-button">Tekrar Oyna</button>
        </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('play-again-button').addEventListener('click', () => {
        modal.remove();
        startNBack(); // Oyunu seviye seçiminden tekrar başlat
    });
}
});
