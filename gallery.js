const cursor = document.querySelector('.cursor');
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// Photo data with captions
const photos = [
    {
        src: 'photo1.jpg',
        caption: 'The day we met - you took my breath away 💕'
    },
    {
        src: 'photo2.jpg',
        caption: 'Our first date at Scene 92 - I was so nervous! 😊'
    },
    {
        src: 'photo3.jpg',
        caption: 'You look beautiful in everything you wear 💖'
    },
    {
        src: 'photo4.jpg',
        caption: 'Adventures with you are my favorite ✨'
    },
    {
        src: 'photo5.jpg',
        caption: 'Every moment with you feels like a dream 🌸'
    },
    {
        src: 'photo6.jpg',
        caption: 'Happy birthday to my everything! 💕🎉'
    }
];

let currentPhotoIndex = 0;
let photosViewed = new Set();

const photosGridEl = document.getElementById('photosGrid');
const photoModalEl = document.getElementById('photoModal');
const modalPhotoEl = document.getElementById('modalPhoto');
const photoCaptionEl = document.getElementById('photoCaption');
const completionMessageEl = document.getElementById('completionMessage');
const finishBtnEl = document.getElementById('finishBtn');
const finalMessageScreenEl = document.getElementById('finalMessageScreen');

// Initialize gallery
window.addEventListener('load', () => {
    renderPhotos();
});

function renderPhotos() {
    photosGridEl.innerHTML = '';

    photos.forEach((photo, index) => {
        const card = document.createElement('div');
        card.className = 'photo-card';
        card.innerHTML = `
            <img src="${photo.src}" alt="Photo ${index + 1}" onerror="this.src='https://via.placeholder.com/200?text=Photo+${index + 1}'">
            <div class="photo-overlay">
                <p>Click to view</p>
            </div>
        `;

        card.addEventListener('click', () => openModal(index));
        photosGridEl.appendChild(card);
    });
}

function openModal(index) {
    currentPhotoIndex = index;
    photosViewed.add(index);

    const photo = photos[index];
    modalPhotoEl.src = photo.src;
    modalPhotoEl.onerror = () => {
        modalPhotoEl.src = `https://via.placeholder.com/600?text=Photo+${index + 1}`;
    };
    photoCaptionEl.textContent = photo.caption;

    photoModalEl.classList.remove('hidden');

    // Check if all photos have been viewed
    checkAllPhotosViewed();
}

function closeModal() {
    photoModalEl.classList.add('hidden');
}

function nextPhoto() {
    currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
    openModal(currentPhotoIndex);
}

function previousPhoto() {
    currentPhotoIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
    openModal(currentPhotoIndex);
}

function checkAllPhotosViewed() {
    if (photosViewed.size === photos.length) {
        completionMessageEl.classList.remove('hidden');
        finishBtnEl.classList.remove('hidden');
    }
}

function showFinalMessage() {
    photoModalEl.classList.add('hidden');
    finalMessageScreenEl.classList.remove('hidden');

    // Trigger confetti
    triggerConfetti();
}

function triggerConfetti() {
    const colors = ['#4ade80', '#fbbf24', '#60a5fa', '#c084fc', '#f87171'];
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.borderRadius = '50%';
        confetti.style.zIndex = '1999';
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

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Arrow keys to navigate
document.addEventListener('keydown', (e) => {
    if (!photoModalEl.classList.contains('hidden')) {
        if (e.key === 'ArrowRight') {
            nextPhoto();
        } else if (e.key === 'ArrowLeft') {
            previousPhoto();
        }
    }
});
