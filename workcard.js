/* ===== Works ===== */
const worksOverlay = document.getElementById('worksOverlay');

const worksBtn = document.querySelector('.menu li:nth-child(2)');
const mobileWorksBtn = document.getElementById('mobileWorksBtn');
const closeBtn = document.querySelector('.close-btn');
const isMobile = window.innerWidth <= 768;


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

function updateCarousel() {
    cards.forEach((card, i) => {
        card.classList.remove('active', 'left', 'right', 'hidden');

        if (i === current) {
            card.classList.add('active');
        } else if (i === current - 1) {
            card.classList.add('left');
        } else if (i === current + 1) {
            card.classList.add('right');
        } else {
            card.classList.add('hidden');
        }
    });

    updateDots(); // ⭐ 加這行
}

if (btnLeft) {
    btnLeft.addEventListener('click', () => {
        if (current > 0) {
            current--;
            updateCarousel();
        }
    });
}


if (btnRight) {
    btnRight.addEventListener('click', () => {
        if (current < cards.length - 1) {
            current++;
            updateCarousel();
        }
    });
}

/* ===== 手機滑動切換 ===== */
let startX = 0;
let endX = 0;

const cardsContainer = document.querySelector('.cards');

if (cardsContainer) {

    cardsContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    cardsContainer.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;

        const diff = endX - startX;

        if (Math.abs(diff) > 50) {

            if (diff > 0 && current > 0) {
                current--;
                updateCarousel();
            } else if (diff < 0 && current < cards.length - 1) {
                current++;
                updateCarousel();
            }

        }
    });

}

const dotsContainer = document.querySelector('.carousel-dots');
let dots = [];

// 建立 dots
if (dotsContainer) {

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

}

function updateDots() {
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === current);
    });
}
updateCarousel();
/* ===== 卡片的影片播放 ===== */
document.querySelectorAll('.work-card').forEach(card => {
if (isMobile) return; // ⭐ 手機直接跳過
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
