/* ===== Works ===== */
const worksOverlay = document.getElementById('worksOverlay');

const worksBtn = document.querySelector('.menu li:nth-child(2)');
const mobileWorksBtn = document.getElementById('mobileWorksBtn');
const closeBtn = document.querySelector('.close-btn');

/* 桌機 Works */
if (worksBtn) {
    worksBtn.addEventListener('click', () => {
        worksOverlay.classList.add('show');
    });
}

/* 手機 Works */
if (mobileWorksBtn) {
    mobileWorksBtn.addEventListener('click', (e) => {
        e.preventDefault();

        worksOverlay.classList.add('show');

        // 關閉手機選單（加分體驗）
        document.getElementById('mobileMenu').classList.remove('show');
        document.getElementById('hamburger').classList.remove('active');
    });
}

/* 關閉 overlay */
if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        worksOverlay.classList.remove('show');
    });
}
/* ===== Carousel Logic ===== */
const cards = document.querySelectorAll('.work-card');
const btnLeft = document.querySelector('.nav-btn.left');
const btnRight = document.querySelector('.nav-btn.right');

let current = 0;

function getIndex(i) {
    return (i + cards.length) % cards.length;
}

function updateCarousel() {
    cards.forEach((card, i) => {
        card.classList.remove('active', 'left', 'right', 'hidden');

        const leftIndex = getIndex(current - 1);
        const rightIndex = getIndex(current + 1);

        if (i === current) {
            card.classList.add('active');
        } else if (i === leftIndex) {
            card.classList.add('left');
        } else if (i === rightIndex) {
            card.classList.add('right');
        } else {
            card.classList.add('hidden');
        }
    });

    updateDots();
}


btnLeft.addEventListener('click', () => {
    if (current > 0) {
        current--;
        updateCarousel();
    }
});

btnRight.addEventListener('click', () => {
    if (current < cards.length - 1) {
        current++;
        updateCarousel();
    }
});

const dotsContainer = document.querySelector('.carousel-dots');
let dots = [];

// 建立 dots
cards.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.classList.add('dot');

    dot.addEventListener('click', () => {
        current = i;
        updateCarousel();
        updateDots();
    });

    dotsContainer.appendChild(dot);
    dots.push(dot);
});

function updateDots() {
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === current);
    });
}
updateCarousel();
/* ===== 卡片的影片播放 ===== */
document.querySelectorAll('.work-card').forEach(card => {

    const video = card.querySelector('video');
    if (!video) return;

    card.addEventListener('mouseenter', () => {

        video.style.opacity = 0;

        setTimeout(() => {
            video.currentTime = 0;
            video.play();
            video.style.opacity = 1;
        }, 150);

    });

    card.addEventListener('mouseleave', () => {

        video.style.opacity = 0;

        setTimeout(() => {
            video.pause();
            video.currentTime = 0;
        }, 200);

    });

});

const heroBtn = document.querySelector('.hero-btn');

if (heroBtn) {
    heroBtn.addEventListener('click', () => {
        worksOverlay.classList.add('show');
    });
}

/* ===== 卡片的圖片切換 ===== */
document.querySelectorAll(".image-slider-card").forEach(card => {

    const track = card.querySelector(".track");
    const slides = card.querySelectorAll(".slide");

    let index = 0;
    let interval = null;

    function updateSlider() {
        track.style.transform = `translateX(-${index * 100}%)`;
    }

    function nextSlide() {
        index = (index + 1) % slides.length;
        updateSlider();
    }

    card.addEventListener("mouseenter", () => {
        interval = setInterval(nextSlide, 2000);
    });

    card.addEventListener("mouseleave", () => {
        clearInterval(interval);
        index = 0;
        updateSlider();
    });

});

const isMobile = window.matchMedia("(max-width: 768px)").matches;

if (!isMobile) {
    document.querySelectorAll('.work-card').forEach(card => {
        const video = card.querySelector('video');
        if (!video) return;

        card.addEventListener('mouseenter', () => {
            video.style.opacity = 0;

            setTimeout(() => {
                video.currentTime = 0;
                video.play();
                video.style.opacity = 1;
            }, 150);
        });

        card.addEventListener('mouseleave', () => {
            video.style.opacity = 0;

            setTimeout(() => {
                video.pause();
                video.currentTime = 0;
            }, 200);
        });
    });
}
