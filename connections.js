const cursor = document.querySelector('.cursor');
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// Game data
const groups = [
    {
        name: "BRAINROT",
        color: "yellow",
        items: ["Tung Tung Tung Sahur", "Ballerina Cappucina", "Bombardino Crocodilo", "Tralalero Tralala"]
    },
    {
        name: "PLACES WE'VE BEEN TO ON A DATE",
        color: "green",
        items: ["Scene 92", "Nueplex", "Xanders", "Mcdonalds"]
    },
    {
        name: "PET NAMES",
        color: "blue",
        items: ["Sleepyhead", "Bubs", "Darling", "Sly Bunny"]
    },
    {
        name: "DEROGATORY RACIAL SLURS",
        color: "purple",
        items: ["Coon", "Jigaboo", "Boy", "Nigger"]
    }
];

let selectedItems = [];
let solvedGroups = [];
let mistakes = 4;
let maxMistakes = 4;
let gameOver = false;

const itemsGridEl = document.getElementById('itemsGrid');
const categoriesEl = document.getElementById('categories');
const mistakesLeftEl = document.getElementById('mistakesLeft');
const successScreen = document.getElementById('successScreen');
const failScreen = document.getElementById('failScreen');
const categoriesListEl = document.getElementById('categoriesList');

// Initialize game
window.addEventListener('load', () => {
    initializeGame();
});

function initializeGame() {
    const allItems = [];
    groups.forEach((group, index) => {
        group.items.forEach(item => {
            allItems.push({
                text: item,
                groupIndex: index
            });
        });
    });

    // Shuffle items
    allItems.sort(() => Math.random() - 0.5);

    // Render items
    renderItems(allItems);
}

function renderItems(items) {
    itemsGridEl.innerHTML = '';

    items.forEach((item, index) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'item';
        itemEl.textContent = item.text;
        itemEl.dataset.groupIndex = item.groupIndex;
        itemEl.dataset.index = index;

        // Check if item is already solved
        if (solvedGroups.includes(item.groupIndex)) {
            itemEl.classList.add('correct');
            itemEl.style.pointerEvents = 'none';
        }

        itemEl.addEventListener('click', () => selectItem(itemEl, item.groupIndex));
        itemsGridEl.appendChild(itemEl);
    });
}

function selectItem(element, groupIndex) {
    if (gameOver || solvedGroups.includes(groupIndex)) return;

    if (element.classList.contains('selected')) {
        element.classList.remove('selected');
        selectedItems = selectedItems.filter(item => item.element !== element);
    } else {
        if (selectedItems.length < 4) {
            element.classList.add('selected');
            selectedItems.push({ element, groupIndex });
        }
    }
}

function deselectAll() {
    selectedItems.forEach(item => {
        item.element.classList.remove('selected');
    });
    selectedItems = [];
}

function submitGuess() {
    if (selectedItems.length !== 4) {
        alert('Please select 4 items');
        return;
    }

    const groupIndices = selectedItems.map(item => item.groupIndex);
    const uniqueGroups = new Set(groupIndices);

    if (uniqueGroups.size === 1) {
        // Correct! All 4 items from same group
        const correctGroupIndex = groupIndices[0];
        
        if (!solvedGroups.includes(correctGroupIndex)) {
            solvedGroups.push(correctGroupIndex);
            
            // Mark as correct
            selectedItems.forEach(item => {
                item.element.classList.remove('selected');
                item.element.classList.add('correct');
                item.element.style.pointerEvents = 'none';
            });

            // Display solved category
            displaySolvedCategory(correctGroupIndex);
            selectedItems = [];

            // Check if won
            if (solvedGroups.length === 4) {
                gameOver = true;
                triggerConfetti();
                setTimeout(() => {
                    successScreen.classList.remove('hidden');
                }, 500);
            }
        }
    } else if (uniqueGroups.size === 4) {
        // One item from each group - wrong
        mistakes--;
        handleIncorrectGuess();
    } else {
        // Partially correct but not all same - wrong
        mistakes--;
        handleIncorrectGuess();
    }
}

function handleIncorrectGuess() {
    mistakesLeftEl.textContent = mistakes;

    selectedItems.forEach(item => {
        item.element.classList.add('incorrect');
    });

    setTimeout(() => {
        selectedItems.forEach(item => {
            item.element.classList.remove('incorrect', 'selected');
        });
        selectedItems = [];
    }, 500);

    if (mistakes === 0) {
        gameOver = true;
        displayFailScreen();
    }
}

function displaySolvedCategory(groupIndex) {
    const group = groups[groupIndex];
    const categoryEl = document.createElement('div');
    categoryEl.className = `category ${group.color}`;
    categoryEl.textContent = group.name;

    categoriesEl.appendChild(categoryEl);
}

function displayFailScreen() {
    categoriesListEl.innerHTML = '';
    groups.forEach(group => {
        const categoryItem = document.createElement('div');
        categoryItem.className = 'category-item';
        categoryItem.innerHTML = `<strong style="color: #${getColorCode(group.color)}">${group.name}</strong>${group.items.join(', ')}`;
        categoriesListEl.appendChild(categoryItem);
    });

    setTimeout(() => {
        failScreen.classList.remove('hidden');
    }, 500);
}

function getColorCode(color) {
    const colorMap = {
        yellow: 'fbbf24',
        green: '4ade80',
        blue: '60a5fa',
        purple: 'c084fc'
    };
    return colorMap[color];
}

function goToGallery() {
    window.location.href = 'gallery.html';
}

function triggerConfetti() {
    const colors = ['#4ade80', '#fbbf24', '#60a5fa', '#c084fc'];
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.borderRadius = '50%';
        confetti.style.zIndex = '999';
        confetti.style.pointerEvents = 'none';

        document.body.appendChild(confetti);

        const duration = Math.random() * 3 + 2;
        confetti.animate([
            {
                transform: 'translateY(0) translateX(0) rotate(0deg)',
                opacity: 1
            },
            {
                transform: `translateY(${window.innerHeight}px) translateX(${Math.random() * 200 - 100}px) rotate(${Math.random() * 360}deg)`,
                opacity: 0
            }
        ], {
            duration: duration * 1000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => confetti.remove();
    }
}
