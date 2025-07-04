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
            } else if (game === 'wcst') { // YENİ EKLENEN SATIR
                startWcst();
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

    // script.js'teki eski Adam Asmaca kodunu bununla değiştirin

// ---- ADAM ASMACA OYUNU (SEVİYELİ VERSİYON) ----

// 1. Kelime listelerini seviyelere göre hazırlıyoruz
const hangmanWordLists = {
    basit: ["KEDİ", "ELMA", "ARABA", "EV", "TOP", "GÜNEŞ", "AY", "SU", "KAPI", "MASA"],
    orta: ["BİLGİSAYAR", "TELEFON", "GÖZLÜK", "KALEM", "KİTAP", "SANDALYE", "PENCERE", "FOTOĞRAF", "HASTANE"],
    zor: ["NÖROTRANSMİTER", "FOTOSENTEZ", "MİTOKONDRİ", "PARADOKS", "ALGORİTMA", "FELSEFE", "ENTELLEKTÜEL", "PSİKOLOJİ"]
};

let hangmanSecretWord = '';
let hangmanCorrectLetters = [];
let hangmanWrongGuessCount = 0;
const hangmanMaxWrongGuesses = 6;

// Bu fonksiyon, oyunun ilk başlangıç noktamız olacak.
function startHangman() {
    // Önce seviye seçim ekranını göster
    showHangmanLevelSelection();
}

// Seviye seçim arayüzünü oluşturan fonksiyon
function showHangmanLevelSelection() {
    gameContent.innerHTML = `
        <h2>Adam Asmaca</h2>
        <h3>Lütfen bir zorluk seviyesi seçin:</h3>
        <div class="level-selection-container">
            <button class="level-choice" data-level="basit">Basit</button>
            <button class="level-choice" data-level="orta">Orta</button>
            <button class="level-choice" data-level="zor">Zor</button>
        </div>
    `;

    // Seviye butonlarına tıklama olaylarını ekle
    document.querySelectorAll('.level-choice').forEach(button => {
        button.addEventListener('click', (event) => {
            const selectedLevel = event.target.dataset.level;
            initializeHangmanGame(selectedLevel); // Seçilen seviye ile oyunu başlat
        });
    });
}

// Oyunu seçilen seviyeye göre başlatan ana fonksiyon
function initializeHangmanGame(level) {
    // Değişkenleri sıfırla
    hangmanCorrectLetters = [];
    hangmanWrongGuessCount = 0;
    
    // Seçilen seviyeye göre kelime listesinden rastgele bir kelime seç
    const wordList = hangmanWordLists[level];
    hangmanSecretWord = wordList[Math.floor(Math.random() * wordList.length)];

    // Oyunun ana arayüzünü HTML'e çiz
    gameContent.innerHTML = `
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
    
    // Oyunu başlat
    updateHangmanFigure();
    displayHangmanWord();
    createHangmanKeyboard();
}

// Geri kalan fonksiyonlar büyük ölçüde aynı kalıyor
function displayHangmanWord() {
    const wordDisplay = document.querySelector('.word-display');
    if (!wordDisplay) return; // Eğer eleman yoksa hata vermesini engelle
    wordDisplay.innerHTML = hangmanSecretWord.split('').map(letter => `<span class="letter-box">${hangmanCorrectLetters.includes(letter) ? letter : ''}</span>`).join('');
    if (wordDisplay.innerText.replace(/\n/g, '') === hangmanSecretWord) {
        showGameOverModal('hangman', true);
    }
}

function createHangmanKeyboard() {
    const keyboard = document.querySelector('.keyboard');
    if (!keyboard) return;
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
    const guessesText = document.querySelector('.guesses-text span');
    if (guessesText) {
        guessesText.innerText = hangmanMaxWrongGuesses - hangmanWrongGuessCount;
    }
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
    }// script.js dosyasının en altına, en sondaki }); satırından önce ekleyin
// ---- WISCONSIN KART EŞLEŞTİRME EGZERSİZİ (REFERANS ALINARAK YENİDEN YAZILMIŞ FİNAL SÜRÜM) ----

// 1. SABİTLER VE DEĞİŞKENLER
const WCST_SHAPES = {
    'üçgen': '<svg class="card-shape" width="50" height="50" viewBox="0 0 100 100"><polygon points="50,10 90,90 10,90"/></svg>',
    'yıldız': '<svg class="card-shape" width="50" height="50" viewBox="0 0 100 100"><polygon points="50,10 61,40 98,40 68,62 79,98 50,75 21,98 32,62 2,40 39,40"/></svg>',
    'daire': '<svg class="card-shape" width="50" height="50" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45"/></svg>',
    'artı': '<svg class="card-shape" width="50" height="50" viewBox="0 0 100 100"><polygon points="40,10 60,10 60,40 90,40 90,60 60,60 60,90 40,90 40,60 10,60 10,40 40,40"/></svg>'
};
const WCST_COLORS = ['red', 'green', 'blue', 'yellow'];
const WCST_NUMBERS = [1, 2, 3, 4];
const WCST_RULES_ORDER = ['renk', 'şekil', 'sayi', 'renk', 'şekil', 'sayi'];
const CORRECTS_TO_SWITCH = 10;
const TOTAL_DECK_SIZE = 128;

// Oyun durumu değişkenleri
let targetCards, responseDeck, currentResponseCard, educationLevel;
let currentRule, currentRuleIndex, score, cardsUsed, consecutiveCorrect;
let perseverativeResponses, perseverativeErrors, totalErrors, categoriesCompleted;

// 2. OYUN BAŞLANGIÇ SÜRECİ
function startWcst() { showEducationScreen(); }
function showEducationScreen() {
    gameContent.innerHTML = `<div class="wcst-start-screen"><div class="wcst-education-level"><h3>Lütfen Eğitim Seviyenizi Seçiniz:</h3><div class="education-options"><button class="education-btn" data-level="ilkokul">İlkokul</button><button class="education-btn" data-level="ortaokul">Ortaokul</button><button class="education-btn" data-level="lise">Lise</button><button class="education-btn" data-level="üniversite">Üniversite</button></div></div><button id="wcst-start-btn" disabled>Devam Et</button></div>`;
    document.querySelectorAll('.education-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            document.querySelectorAll('.education-btn').forEach(b => b.classList.remove('selected'));
            e.target.classList.add('selected');
            educationLevel = e.target.dataset.level;
            document.getElementById('wcst-start-btn').disabled = false;
        });
    });
    document.getElementById('wcst-start-btn').addEventListener('click', showInstructionScreen);
}
function showInstructionScreen() {
    gameContent.innerHTML = `<div class="wcst-start-screen"><div class="wcst-instructions"><h3>Talimatlar</h3><p>Bu biraz değişik bir egzersiz çünkü testi nasıl yapacağınız konusunda size verilen her bir kartı dört anahtar karttan biriyle eşleştirmeniz gerekiyor.</p><p>Kartı neye göre eşleştireceğinizi size söyleyemem ama yaptığınız eşleşmenin doğru mu yanlış mı olduğunu her seferinde size söyleyeceğim. Bu testte zaman sınırlaması olmadığından acele etmeniz gerekmemektedir.</p></div><button id="wcst-start-btn">Egzersize Başla</button></div>`;
    document.getElementById('wcst-start-btn').addEventListener('click', initializeWcstGame);
}
function initializeWcstGame() {
    setupWcstBoard();
    prepareWcstGame();
    drawCards();
}

// 3. OYUN MEKANİKLERİ VE GÖRSELLEŞTİRME
function setupWcstBoard() {
    gameContent.innerHTML = `<h2>Wisconsin Kart Eşleştirme Egzersizi</h2><div class="wcst-container"><div class="wcst-info"><div id="wcst-score">Doğru: 0</div><div id="wcst-deck-count">Kalan Kart: 0</div></div><div id="wcst-feedback">Doğru eşleştirmeyi bulun.</div><div id="target-cards-container" class="card-area"></div><p><strong>Cevap Kartınız:</strong></p><div id="response-card-area" class="card-area" style="background-color: transparent;"></div></div>`;
}
function prepareWcstGame() {
    currentRuleIndex = 0; score = 0; cardsUsed = 0; consecutiveCorrect = 0;
    perseverativeResponses = 0; perseverativeErrors = 0; totalErrors = 0; categoriesCompleted = 0;
    currentRule = WCST_RULES_ORDER[currentRuleIndex];
    targetCards = [{ sayi: 1, sekil: 'üçgen', renk: 'red' }, { sayi: 2, sekil: 'yıldız', renk: 'green' }, { sayi: 3, sekil: 'daire', renk: 'yellow' }, { sayi: 4, sekil: 'artı', renk: 'blue' }];
    const singleDeck = [];
    WCST_COLORS.forEach(renk => Object.keys(WCST_SHAPES).forEach(sekil => WCST_NUMBERS.forEach(sayi => { singleDeck.push({ sayi, sekil, renk }); })));
    responseDeck = [...singleDeck, ...singleDeck];
    shuffleArray(responseDeck);
    drawNextResponseCard();
}
function drawCards() {
    const targetContainer = document.getElementById('target-cards-container');
    targetContainer.innerHTML = '';
    targetCards.forEach((card, index) => {
        const cardEl = createCardElement(card);
        cardEl.addEventListener('click', () => handleTargetClick(index));
        targetContainer.appendChild(cardEl);
    });
    drawResponseCard();
}
function createCardElement(cardData) {
    const cardDiv = document.createElement('div');
    cardDiv.className = `card color-${cardData.renk}`;
    let shapesHTML = '';
    for (let i = 0; i < cardData.sayi; i++) { shapesHTML += WCST_SHAPES[cardData.sekil]; }
    cardDiv.innerHTML = shapesHTML;
    return cardDiv;
}
function drawResponseCard() {
    const responseContainer = document.getElementById('response-card-area');
    responseContainer.innerHTML = '';
    if (currentResponseCard) { responseContainer.appendChild(createCardElement(currentResponseCard)); }
}
function drawNextResponseCard() {
    if (responseDeck.length > 0) {
        currentResponseCard = responseDeck.pop();
        document.getElementById('wcst-deck-count').innerText = `Kalan Kart: ${responseDeck.length}`;
    } else { currentResponseCard = null; }
}

// 4. OYUNUN BEYNİ: TIKLAMA VE KURAL MANTIĞI (FİNAL VERSİYON)
function handleTargetClick(chosenTargetIndex) {
    if (!currentResponseCard) return;

    cardsUsed++;
    const chosenTarget = targetCards[chosenTargetIndex];
    const isCorrect = checkMatch(currentResponseCard, chosenTarget, currentRule);
    const feedbackEl = document.getElementById('wcst-feedback');

    // Kural değiştikten sonraki ilk hamle ise, bir önceki kuralı hafızada tut
    let previousRule = (currentRuleIndex > 0) ? WCST_RULES_ORDER[currentRuleIndex - 1] : null;

    if (isCorrect) {
        feedbackEl.innerText = "Doğru";
        feedbackEl.className = 'correct';
        score++;
        consecutiveCorrect++;
    } else { // Yanlış cevap durumu
        feedbackEl.innerText = "Yanlış";
        feedbackEl.className = 'wrong';
        totalErrors++;
        consecutiveCorrect = 0; // Yanlış cevapta sayaç her zaman sıfırlanır

        // Perseverasyon analizi: Bu yanlış cevap, bir önceki kurala göre doğru olur muydu?
        if (previousRule && checkMatch(currentResponseCard, chosenTarget, previousRule)) {
            // Evet, oyuncu eski kuralda ısrar ediyor. Bu bir "Perseveratif Tepki"dir.
            perseverativeResponses++;
            // Bu "Perseveratif Tepki" aynı zamanda bir hata olduğu için, bu bir "Perseveratif Hata"dır.
            perseverativeErrors++;
        }
    }
    
    // Kategori tamamlama kontrolünü, cevabı işledikten SONRA yap
    if (consecutiveCorrect >= CORRECTS_TO_SWITCH) {
        categoriesCompleted++;
        consecutiveCorrect = 0; // Kategori tamamlandı, sayaç sıfırlanır
        
        // Eğer hala tamamlanacak kategori varsa bir sonraki kurala geç
        if (categoriesCompleted < 6) {
            currentRuleIndex++;
            currentRule = WCST_RULES_ORDER[currentRuleIndex];
        }
    }

    // Arayüzü güncelle
    document.getElementById('wcst-score').innerText = `Doğru: ${score}`;

    // Testin bitiş koşullarını kontrol et
    if (responseDeck.length === 0 || categoriesCompleted >= 6) {
        gameOverWcst();
    } else {
        drawNextResponseCard();
        drawResponseCard();
    }
}

function checkMatch(card1, card2, rule) { return card1[rule] === card2[rule]; }

// 5. OYUN BİTİŞİ
function gameOverWcst() {
    gameContent.innerHTML = '';
    const nonPerseverativeErrors = totalErrors - perseverativeErrors;
    const modal = document.createElement('div');
    modal.classList.add('game-over-modal');
    modal.innerHTML = `<div class="modal-content" style="text-align: left; max-width: 450px;"><h3>Egzersiz Sonuçları</h3><div class="wcst-results"><p>Toplam Tepki Sayısı: <strong>${cardsUsed}</strong></p><p>Toplam Doğru Sayısı: <strong>${score}</strong></p><p>Toplam Hata Sayısı: <strong>${totalErrors}</strong></p><p>Tamamlanan Kategori Sayısı: <strong>${categoriesCompleted}</strong></p><hr><p>Perseveratif Tepki Sayısı: <strong>${perseverativeResponses}</strong></p><p>Perseveratif Hata Sayısı: <strong>${perseverativeErrors}</strong></p><p>Perseveratif Olmayan Hata Sayısı: <strong>${nonPerseverativeErrors}</strong></p></div><button id="play-again-button">Tekrar Oyna</button></div>`;
    document.body.appendChild(modal);
    document.getElementById('play-again-button').addEventListener('click', () => { modal.remove(); startWcst(); });
}

});
