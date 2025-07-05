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
    let currentGameTimer = null; // Aktif olan timer'ı tutmak için
    gameChoiceButtons.forEach(button => {
        button.addEventListener('click', () => {
            const game = button.dataset.game;
            selectionScreen.classList.add('hidden');
            gameContainer.classList.remove('hidden');
            
            if (game === 'adam-asmaca') startHangman();
            else if (game === 'sirali-hatirlama') startSequenceMemory();
            else if (game === 'stroop-testi') startStroopTest();
            else if (game === 'wcst') {
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
        // Tüm olası timer'ları temizle
        if (currentGameTimer) clearTimeout(currentGameTimer);
        if (typeof stroopTimer !== 'undefined') clearInterval(stroopTimer);
    });

    // ---- GENEL OYUN SONU FONKSİYONU ----
    function showGameOverModal(game, isWin, data) {
        if (currentGameTimer) clearTimeout(currentGameTimer);
        
        const modal = document.createElement('div');
        modal.classList.add('game-over-modal');
        let content = '';

        if (game === 'hangman') { content = `<h3>${isWin ? 'Tebrikler, Kazandınız!' : 'Maalesef, Kaybettiniz!'}</h3><p>Doğru Kelime: <strong>${data.secretWord}</strong></p>`; }
        else if (game === 'sequence') { content = `<h3>Oyun Bitti!</h3><p>Ulaştığınız en yüksek seviye: <strong>${data.level}</strong></p>`; }
        else if (game === 'stroop') { content = `<h3>Süre Doldu!</h3><p>Skorunuz: <strong>${data.score}</strong></p>`; }
        else if (game === 'n-back') { content = `<h3>Egzersiz Bitti!</h3><p>Seviye: <strong>${data.level}-Back</strong></p><p>Doğru Tespit: <strong>${data.score}</strong></p><p>Hata: <strong>${data.errors}</strong></p>`; }
        
        if (content === '') return;

        modal.innerHTML = `<div class="modal-content">${content}<button id="play-again-button">Tekrar Oyna</button></div>`;
        document.body.appendChild(modal);

        document.getElementById('play-again-button').addEventListener('click', () => {
            modal.remove();
            if (game === 'hangman') startHangman();
            else if (game === 'sequence') startSequenceMemory();
            else if (game === 'stroop') startStroopTest();
            else if (game === 'n-back') startNBack();
        });
    }

    // ==================================================================
    // ---- ADAM ASMACA OYUNU ----
    // ==================================================================
    const hangmanWordLists = { basit: ["KEDİ", "ELMA", "ARABA", "EV", "TOP", "GÜNEŞ", "AY", "SU", "KAPI", "MASA"], orta: ["BİLGİSAYAR", "TELEFON", "GÖZLÜK", "KALEM", "KİTAP", "SANDALYE", "PENCERE", "FOTOĞRAF", "HASTANE"], zor: ["NÖROTRANSMİTER", "FOTOSENTEZ", "MİTOKONDRİ", "PARADOKS", "ALGORİTMA", "FELSEFE", "ENTELLEKTÜEL", "PSİKOLOJİ"] };
    let hangmanSecretWord, hangmanCorrectLetters, hangmanWrongGuessCount; const hangmanMaxWrongGuesses = 6;
    function startHangman() { showHangmanLevelSelection(); }
    function showHangmanLevelSelection() { gameContent.innerHTML = `<h2>Adam Asmaca</h2><h3>Lütfen bir zorluk seviyesi seçin:</h3><div class="level-selection-container"><button class="level-choice" data-level="basit">Basit</button><button class="level-choice" data-level="orta">Orta</button><button class="level-choice" data-level="zor">Zor</button></div>`; document.querySelectorAll('.level-choice').forEach(button => { button.addEventListener('click', (event) => { initializeHangmanGame(event.target.dataset.level); }); }); }
    function initializeHangmanGame(level) { hangmanCorrectLetters = []; hangmanWrongGuessCount = 0; const wordList = hangmanWordLists[level]; hangmanSecretWord = wordList[Math.floor(Math.random() * wordList.length)]; gameContent.innerHTML = `<p class="guesses-text">Kalan Hak: <span>${hangmanMaxWrongGuesses}</span></p><div class="hangman-figure"><svg viewBox="0 0 200 250" class="figure-container"><line x1="20" y1="230" x2="120" y2="230" /><line x1="70" y1="230" x2="70" y2="20" /><line x1="70" y1="20" x2="150" y2="20" /><line x1="150" y1="20" x2="150" y2="50" /><circle cx="150" cy="70" r="20" class="figure-part" /><line x1="150" y1="90" x2="150" y2="150" class="figure-part" /><line x1="150" y1="110" x2="120" y2="130" class="figure-part" /><line x1="150" y1="110" x2="180" y2="130" class="figure-part" /><line x1="150" y1="150" x2="125" y2="190" class="figure-part" /><line x1="150" y1="150" x2="175" y2="190" class="figure-part" /></svg></div><div class="word-display"></div><div class="keyboard"></div>`; updateHangmanFigure(); displayHangmanWord(); createHangmanKeyboard(); }
    function displayHangmanWord() { const wordDisplay = document.querySelector('.word-display'); if (!wordDisplay) return; wordDisplay.innerHTML = hangmanSecretWord.split('').map(letter => `<span class="letter-box">${hangmanCorrectLetters.includes(letter) ? letter : ''}</span>`).join(''); if (wordDisplay.innerText.replace(/\n/g, '') === hangmanSecretWord) { showGameOverModal('hangman', true, { secretWord: hangmanSecretWord }); } }
    function createHangmanKeyboard() { const keyboard = document.querySelector('.keyboard'); if (!keyboard) return; keyboard.innerHTML = ''; "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ".split('').forEach(letter => { const keyButton = document.createElement('button'); keyButton.innerText = letter; keyButton.classList.add('key'); keyButton.addEventListener('click', () => handleHangmanGuess(letter, keyButton)); keyboard.appendChild(keyButton); }); }
    function handleHangmanGuess(letter, button) { button.disabled = true; if (hangmanSecretWord.includes(letter)) { hangmanCorrectLetters.push(letter); button.classList.add('correct'); } else { hangmanWrongGuessCount++; updateHangmanFigure(); button.classList.add('wrong');} displayHangmanWord(); if (hangmanWrongGuessCount === hangmanMaxWrongGuesses) { showGameOverModal('hangman', false, { secretWord: hangmanSecretWord }); } }
    function updateHangmanFigure() { const guessesText = document.querySelector('.guesses-text span'); if (guessesText) { guessesText.innerText = hangmanMaxWrongGuesses - hangmanWrongGuessCount; } document.querySelectorAll('.figure-part').forEach((part, index) => { part.style.display = index < hangmanWrongGuessCount ? 'block' : 'none'; }); }

    // ==================================================================
    // ---- SIRALI HATIRLAMA OYUNU ----
    // ==================================================================
    let sequence, playerSequence, sequenceLevel, canPlayerClick;
    async function startSequenceMemory() { if (currentGameTimer) clearTimeout(currentGameTimer); gameContent.innerHTML = `<h2>Sıralı Hatırlama</h2><div id="sequence-status"></div><div id="sequence-game-board"></div><p>Bilgisayarın gösterdiği sırayı aklında tut ve tekrarla.</p>`; const board = document.getElementById('sequence-game-board'); board.innerHTML = ''; for (let i = 0; i < 9; i++) { const tile = document.createElement('div'); tile.classList.add('sequence-tile'); tile.dataset.tileId = i; tile.addEventListener('click', () => handleTileClick(i)); board.appendChild(tile); } sequence = []; sequenceLevel = 0; currentGameTimer = setTimeout(nextSequenceLevel, 1000); }
    async function nextSequenceLevel() { sequenceLevel++; playerSequence = []; canPlayerClick = false; const status = document.getElementById('sequence-status'); status.innerText = `Seviye ${sequenceLevel}`; await new Promise(resolve => { currentGameTimer = setTimeout(resolve, 1000); }); sequence.push(Math.floor(Math.random() * 9)); await showSequence(); }
    async function showSequence() { const tiles = document.querySelectorAll('.sequence-tile'); document.getElementById('sequence-status').innerText = "Sırayı İzle..."; for (const tileIndex of sequence) { await new Promise(resolve => { currentGameTimer = setTimeout(resolve, 300); }); if (tiles[tileIndex]) tiles[tileIndex].classList.add('active'); await new Promise(resolve => { currentGameTimer = setTimeout(resolve, 600); }); if (tiles[tileIndex]) tiles[tileIndex].classList.remove('active'); } canPlayerClick = true; document.getElementById('sequence-status').innerText = "Sıra Sende!"; }
    function handleTileClick(tileId) { if (!canPlayerClick) return; playerSequence.push(tileId); const tile = document.querySelector(`[data-tile-id='${tileId}']`); tile.classList.add('active'); setTimeout(() => tile.classList.remove('active'), 200); const lastIndex = playerSequence.length - 1; if (playerSequence[lastIndex] !== sequence[lastIndex]) { showGameOverModal('sequence', false, { level: sequenceLevel }); return; } if (playerSequence.length === sequence.length) { canPlayerClick = false; currentGameTimer = setTimeout(nextSequenceLevel, 1000); } }
    
    // ==================================================================
    // ---- STROOP TESTİ OYUNU ----
    // ==================================================================
    const stroopColors = {"KIRMIZI": "#e74c3c", "YEŞİL": "#2ecc71", "MAVİ": "#3498db", "SARI": "#f1c40f", "MOR": "#9b59b6", "TURUNCU": "#e67e22"};
    let stroopScore, stroopTimer, stroopTimeLeft, currentCorrectColorName;
    function startStroopTest() { clearInterval(stroopTimer); gameContent.innerHTML = `<div id="stroop-start-screen"><h2>Stroop Testi</h2><h3>Hazır mısın?</h3><p>Ekranda beliren kelimenin anlamına değil, <strong>yazıldığı renge</strong> odaklan. 60 saniye içinde en yüksek skoru yapmaya çalış!</p><button id="stroop-start-button">Başla!</button></div><div id="stroop-game-area" class="hidden"><div id="stroop-stats"><div id="stroop-timer">Zaman: <span>60</span></div><div id="stroop-score">Skor: <span>0</span></div></div><div id="stroop-word"></div><div id="stroop-choices"></div></div>`; document.getElementById('stroop-start-button').addEventListener('click', runStroopGame); }
    function runStroopGame() { document.getElementById('stroop-start-screen').classList.add('hidden'); document.getElementById('stroop-game-area').classList.remove('hidden'); stroopScore = 0; stroopTimeLeft = 60; document.querySelector('#stroop-score span').innerText = stroopScore; document.querySelector('#stroop-timer span').innerText = stroopTimeLeft; stroopTimer = setInterval(updateStroopTimer, 1000); nextStroopRound(); }
    function nextStroopRound() { const colorNames = Object.keys(stroopColors); const colorValues = Object.values(stroopColors); let randomWordName = colorNames[Math.floor(Math.random() * colorNames.length)]; let randomColorValue = colorValues[Math.floor(Math.random() * colorValues.length)]; let randomColorName = Object.keys(stroopColors).find(key => stroopColors[key] === randomColorValue); while (randomWordName === randomColorName) { randomColorValue = colorValues[Math.floor(Math.random() * colorValues.length)]; randomColorName = Object.keys(stroopColors).find(key => stroopColors[key] === randomColorValue); } currentCorrectColorName = randomColorName; const wordElement = document.getElementById('stroop-word'); if(wordElement) { wordElement.innerText = randomWordName; wordElement.style.color = randomColorValue; } const choicesContainer = document.getElementById('stroop-choices'); if(choicesContainer) { choicesContainer.innerHTML = ''; shuffleArray(colorNames).forEach(name => { const button = document.createElement('button'); button.classList.add('stroop-button'); button.innerText = name; button.addEventListener('click', () => checkStroopAnswer(name)); choicesContainer.appendChild(button); }); } }
    function checkStroopAnswer(chosenColorName) { stroopScore += (chosenColorName === currentCorrectColorName) ? 1 : -1; stroopScore = Math.max(0, stroopScore); if(document.querySelector('#stroop-score span')) document.querySelector('#stroop-score span').innerText = stroopScore; nextStroopRound(); }
    function updateStroopTimer() { stroopTimeLeft--; if(document.querySelector('#stroop-timer span')) document.querySelector('#stroop-timer span').innerText = stroopTimeLeft; if (stroopTimeLeft <= 0) { clearInterval(stroopTimer); showGameOverModal('stroop', false, { score: stroopScore }); } }

    // ==================================================================
// ---- N-BACK TESTİ (GELİŞTİRİLMİŞ RİTİM VE ARAYÜZ) ----
// ==================================================================

// --- Sabitleri Güncelliyoruz ---
let nbackLevel, nbackSequence, nbackCurrentStep, nbackScore, nbackErrors, canPressButton, nbackGameLoop;
const NBACK_ALPHABET = 'BCDFGHKLMNPQRSTVWXYZ';
const NBACK_TRIAL_COUNT = 25;
const NBACK_PREPARE_TIME = 1000; // "Sonraki..." ekranının kalma süresi (1 saniye)
const NBACK_STIMULUS_TIME = 2000; // Harfin kalma süresi (2 saniye)

function startNBack() {
    if (currentGameTimer) clearTimeout(currentGameTimer); // Sıralı Hatırlama'dan kalma bir timer varsa temizle
    if (nbackGameLoop) clearTimeout(nbackGameLoop);
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
    nbackSequence = []; nbackCurrentStep = 0; nbackScore = 0; nbackErrors = 0; canPressButton = false;
    generateNBackSequence();
    document.getElementById('nback-match-button').addEventListener('click', handleNBackMatchPress);
    nbackGameLoop = setTimeout(runNBackStep, 1000);
}

function generateNBackSequence() {
    for (let i = 0; i < NBACK_TRIAL_COUNT; i++) {
        if (i >= nbackLevel && Math.random() < 0.3) {
            nbackSequence.push(nbackSequence[i - nbackLevel]);
        } else {
            const randomChar = NBACK_ALPHABET.charAt(Math.floor(Math.random() * NBACK_ALPHABET.length));
            nbackSequence.push(randomChar);
        }
    }
}

// --- Bu fonksiyonu güncelliyoruz ---
function runNBackStep() {
    // 1. Önceki adımdaki "kaçırma" hatasını kontrol et
    if (nbackCurrentStep > 0) {
        checkMissedMatch();
    }

    // 2. Testin bitip bitmediğini kontrol et
    if (nbackCurrentStep >= NBACK_TRIAL_COUNT) {
        showGameOverModal('n-back', false, { level: nbackLevel, score: nbackScore, errors: nbackErrors });
        return;
    }

    const stimulusBox = document.getElementById('nback-stimulus-box');
    const feedbackEl = document.getElementById('nback-feedback');
    if (!stimulusBox) return; // Eğer kullanıcı menüye döndüyse döngüyü durdur

    // 3. Hazırlık Ekranını Göster ("Sonraki...")
    if (feedbackEl) feedbackEl.innerText = ''; // Eski geri bildirimi temizle
    stimulusBox.style.fontSize = '2.5em'; // Yazı boyutunu küçült
    stimulusBox.style.color = '#2ecc71';  // Yeşil renk
    stimulusBox.innerHTML = 'Sonraki →'; // Ok işareti ile birlikte

    // 4. Kısa bir beklemeden sonra yeni harfi göster
    nbackGameLoop = setTimeout(() => {
        const currentStimulusBox = document.getElementById('nback-stimulus-box');
        if (currentStimulusBox) { // Eleman hala ekrandaysa devam et
            currentStimulusBox.style.fontSize = '8em'; // Yazı boyutunu eski haline getir
            currentStimulusBox.style.color = '#2c3e50'; // Rengi eski haline getir
            currentStimulusBox.innerText = nbackSequence[nbackCurrentStep];
            canPressButton = true; // Oyuncu artık bu harf için butona basabilir

            // Bir sonraki adıma geç
            nbackCurrentStep++;
            
            // Bir sonraki döngüyü ayarla (Harfin ekranda kalma süresi)
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
        feedbackEl.innerText = "Doğru!";
        feedbackEl.className = 'correct';
    } else {
        nbackErrors++;
        feedbackEl.innerText = "Yanlış Alarm!";
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
            if(feedbackEl) {
                feedbackEl.innerText = "Kaçırdın!";
                feedbackEl.className = 'wrong';
            }
        }
    }
}

function updateNBackStats() {
    const correctEl = document.getElementById('nback-correct');
    const errorsEl = document.getElementById('nback-errors');
    if (correctEl) correctEl.innerText = nbackScore;
    if (errorsEl) errorsEl.innerText = nbackErrors;
}
});
