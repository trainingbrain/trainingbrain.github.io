document.addEventListener('DOMContentLoaded', () => {
    // ---- HTML ELEMANLARI ----
    const selectionScreen = document.getElementById('selection-screen');
    const gameContainer = document.getElementById('game-container');
    const gameContent = document.getElementById('game-content');
    const gameChoiceButtons = document.querySelectorAll('.game-choice');
    const backToMenuButton = document.getElementById('back-to-menu');

    // ---- OYUN GEÇİŞLERİ ----
    gameChoiceButtons.forEach(button => {
        button.addEventListener('click', () => {
            const game = button.dataset.game;
            selectionScreen.classList.add('hidden');
            gameContainer.classList.remove('hidden');
            
            if (game === 'adam-asmaca') {
                startHangman();
            } else if (game === 'sirali-hatirlama') {
                startSequenceMemory();
            } else if (game === 'stroop-testi') {
                startStroopTest();
            }
        });
    });

    backToMenuButton.addEventListener('click', () => {
        gameContainer.classList.add('hidden');
        selectionScreen.classList.remove('hidden');
        gameContent.innerHTML = '';
        const modal = document.querySelector('.game-over-modal');
        if (modal) {
            modal.remove();
        }
        // Stroop Testi'ne özel timer'ı temizle
        clearInterval(stroopTimer);
    });

    // ---- ADAM ASMACA OYUNU ----
    let hangmanSecretWord = '';
    let hangmanCorrectLetters = [];
    let hangmanWrongGuessCount = 0;
    const hangmanMaxWrongGuesses = 6;
    const hangmanWordList = ["NÖRON", "SİNAPS", "LOB", "BEYİN", "HAFIZA", "KORTEKS", "AMİGDALA", "AKSON", "DENDRİT", "BİLİNÇ"];

    function startHangman() {
        hangmanCorrectLetters = [];
        hangmanWrongGuessCount = 0;
        hangmanSecretWord = hangmanWordList[Math.floor(Math.random() * hangmanWordList.length)];

        gameContent.innerHTML = `
            <h2>Adam Asmaca</h2>
            <p class="guesses-text">Kalan Hak: <span>${hangmanMaxWrongGuesses - hangmanWrongGuessCount}</span></p>
            <div class="hangman-figure">
                <svg viewBox="0 0 200 250" class="figure-container">
                    <line x1="20" y1="230" x2="120" y2="230" /><line x1="70" y1="230" x2="70" y2="20" /><line x1="70" y1="20" x2="150" y2="20" /><line x1="150" y1="20" x2="150" y2="50" />
                    <circle cx="150" cy="70" r="20" class="figure-part" /><line x1="150" y1="90" x2="150" y2="150" class="figure-part" /><line x1="150" y1="110" x2="120" y2="130" class="figure-part" /><line x1="150" y1="110" x2="180" y2="130" class="figure-part" /><line x1="150" y1="150" x2="125" y2="190" class="figure-part" /><line x1="150" y1="150" x2="175" y2="190" class="figure-part" />
                </svg>
            </div>
            <div class="word-display"></div>
            <div class="keyboard"></div>
        `;
        
        updateHangmanFigure();
        displayHangmanWord();
        createHangmanKeyboard();
    }

    function displayHangmanWord() {
        const wordDisplay = document.querySelector('.word-display');
        wordDisplay.innerHTML = hangmanSecretWord.split('').map(letter => `<span class="letter-box">${hangmanCorrectLetters.includes(letter) ? letter : ''}</span>`).join('');
        if (wordDisplay.innerText.replace(/\n/g, '') === hangmanSecretWord) {
            showGameOverModal('hangman', true);
        }
    }

    function createHangmanKeyboard() {
        const keyboard = document.querySelector('.keyboard');
        "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ".split('').forEach(letter => {
            const keyButton = document.createElement('button');
            keyButton.innerText = letter;
            keyButton.classList.add('key');
            keyButton.addEventListener('click', () => handleHangmanGuess(letter, keyButton));
            keyboard.appendChild(keyButton);
        });
    }

    function handleHangmanGuess(letter, button) {
        button.disabled = true;
        if (hangmanSecretWord.includes(letter)) {
            hangmanCorrectLetters.push(letter);
            button.classList.add('correct');
        } else {
            hangmanWrongGuessCount++;
            button.classList.add('wrong');
            updateHangmanFigure();
        }
        displayHangmanWord();
        if (hangmanWrongGuessCount === hangmanMaxWrongGuesses) {
            showGameOverModal('hangman', false);
        }
    }

    function updateHangmanFigure() {
        document.querySelector('.guesses-text span').innerText = hangmanMaxWrongGuesses - hangmanWrongGuessCount;
        document.querySelectorAll('.figure-part').forEach((part, index) => {
            part.style.display = index < hangmanWrongGuessCount ? 'block' : 'none';
        });
    }

    // ---- SIRALI HATIRLAMA OYUNU ----
    let sequence = [];
    let playerSequence = [];
    let sequenceLevel = 0;
    let canPlayerClick = false;

    async function startSequenceMemory() {
        gameContent.innerHTML = `
            <h2>Sıralı Hatırlama</h2>
            <div id="sequence-status">Seviye 1</div>
            <div id="sequence-game-board"></div>
            <p>Bilgisayarın gösterdiği sırayı aklında tut ve tekrarla.</p>
        `;
        const board = document.getElementById('sequence-game-board');
        for (let i = 0; i < 9; i++) {
            const tile = document.createElement('div');
            tile.classList.add('sequence-tile');
            tile.dataset.tileId = i;
            tile.addEventListener('click', () => handleTileClick(i));
            board.appendChild(tile);
        }
        sequence = [];
        sequenceLevel = 0;
        await new Promise(resolve => setTimeout(resolve, 1000));
        nextSequenceLevel();
    }

    async function nextSequenceLevel() {
        sequenceLevel++;
        playerSequence = [];
        canPlayerClick = false;
        const status = document.getElementById('sequence-status');
        status.innerText = `Seviye ${sequenceLevel}`;
        await new Promise(resolve => setTimeout(resolve, 1000));
        sequence.push(Math.floor(Math.random() * 9));
        await showSequence();
    }

    async function showSequence() {
        const tiles = document.querySelectorAll('.sequence-tile');
        document.getElementById('sequence-status').innerText = "Sırayı İzle...";
        for (const tileIndex of sequence) {
            await new Promise(resolve => setTimeout(resolve, 300));
            tiles[tileIndex].classList.add('active');
            await new Promise(resolve => setTimeout(resolve, 600));
            tiles[tileIndex].classList.remove('active');
        }
        canPlayerClick = true;
        document.getElementById('sequence-status').innerText = "Sıra Sende!";
    }

    function handleTileClick(tileId) {
        if (!canPlayerClick) return;
        playerSequence.push(tileId);
        const tile = document.querySelector(`[data-tile-id='${tileId}']`);
        tile.classList.add('active');
        setTimeout(() => tile.classList.remove('active'), 200);
        const lastIndex = playerSequence.length - 1;
        if (playerSequence[lastIndex] !== sequence[lastIndex]) {
            showGameOverModal('sequence', false);
            return;
        }
        if (playerSequence.length === sequence.length) {
            setTimeout(nextSequenceLevel, 1000);
        }
    }
    
    // ---- STROOP TESTİ OYUNU ----
    const stroopColors = {"KIRMIZI": "#e74c3c", "YEŞİL": "#2ecc71", "MAVİ": "#3498db", "SARI": "#f1c40f", "MOR": "#9b59b6", "TURUNCU": "#e67e22"};
    let stroopScore = 0;
    let stroopTimer;
    let stroopTimeLeft = 60;
    let currentCorrectColorName;

    function startStroopTest() {
        clearInterval(stroopTimer);
        gameContent.innerHTML = `
            <div id="stroop-start-screen">
                <h2>Stroop Testi</h2><h3>Hazır mısın?</h3>
                <p>Ekranda beliren kelimenin anlamına değil, <strong>yazıldığı renge</strong> odaklan. 60 saniye içinde en yüksek skoru yapmaya çalış!</p>
                <button id="stroop-start-button">Başla!</button>
            </div>
            <div id="stroop-game-area" class="hidden">
                <div id="stroop-stats"><div id="stroop-timer">Zaman: <span>${stroopTimeLeft}</span></div><div id="stroop-score">Skor: <span>0</span></div></div>
                <div id="stroop-word"></div><div id="stroop-choices"></div>
            </div>`;
        document.getElementById('stroop-start-button').addEventListener('click', runStroopGame);
    }

    function runStroopGame() {
        document.getElementById('stroop-start-screen').classList.add('hidden');
        document.getElementById('stroop-game-area').classList.remove('hidden');
        stroopScore = 0;
        stroopTimeLeft = 60;
        document.querySelector('#stroop-score span').innerText = stroopScore;
        document.querySelector('#stroop-timer span').innerText = stroopTimeLeft;
        stroopTimer = setInterval(updateStroopTimer, 1000);
        nextStroopRound();
    }

    function nextStroopRound() {
        const colorNames = Object.keys(stroopColors);
        const colorValues = Object.values(stroopColors);
        let randomWordName = colorNames[Math.floor(Math.random() * colorNames.length)];
        let randomColorValue = colorValues[Math.floor(Math.random() * colorValues.length)];
        let randomColorName = Object.keys(stroopColors).find(key => stroopColors[key] === randomColorValue);
        while (randomWordName === randomColorName) {
            randomColorValue = colorValues[Math.floor(Math.random() * colorValues.length)];
            randomColorName = Object.keys(stroopColors).find(key => stroopColors[key] === randomColorValue);
        }
        currentCorrectColorName = randomColorName;
        const wordElement = document.getElementById('stroop-word');
        wordElement.innerText = randomWordName;
        wordElement.style.color = randomColorValue;
        const choicesContainer = document.getElementById('stroop-choices');
        choicesContainer.innerHTML = '';
        shuffleArray(colorNames).forEach(name => {
            const button = document.createElement('button');
            button.classList.add('stroop-button');
            button.innerText = name;
            button.addEventListener('click', () => checkStroopAnswer(name));
            choicesContainer.appendChild(button);
        });
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function checkStroopAnswer(chosenColorName) {
        stroopScore += (chosenColorName === currentCorrectColorName) ? 1 : -1;
        stroopScore = Math.max(0, stroopScore);
        document.querySelector('#stroop-score span').innerText = stroopScore;
        nextStroopRound();
    }

    function updateStroopTimer() {
        stroopTimeLeft--;
        document.querySelector('#stroop-timer span').innerText = stroopTimeLeft;
        if (stroopTimeLeft <= 0) {
            clearInterval(stroopTimer);
            showGameOverModal('stroop', false);
        }
    }

    // ---- GENEL OYUN SONU FONKSİYONU ----
    function showGameOverModal(game, isWin) {
        const modal = document.createElement('div');
        modal.classList.add('game-over-modal');
        let content = '';

        if (game === 'hangman') {
            const message = isWin ? 'Tebrikler, Kazandınız!' : 'Maalesef, Kaybettiniz!';
            content = `<h3>${message}</h3><p>Doğru Kelime: <strong>${hangmanSecretWord}</strong></p>`;
        } else if (game === 'sequence') {
            content = `<h3>Oyun Bitti!</h3><p>Ulaştığınız en yüksek seviye: <strong>${sequenceLevel}</strong></p>`;
        } else if (game === 'stroop') {
            content = `<h3>Süre Doldu!</h3><p>Skorunuz: <strong>${stroopScore}</strong></p>`;
        }

        modal.innerHTML = `<div class="modal-content">${content}<button id="play-again-button">Tekrar Oyna</button></div>`;
        document.body.appendChild(modal);

        document.getElementById('play-again-button').addEventListener('click', () => {
            modal.remove();
            if (game === 'hangman') startHangman();
            else if (game === 'sequence') startSequenceMemory();
            else if (game === 'stroop') startStroopTest();
        });
    }
});