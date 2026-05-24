/* ===== 基礎 UI 元件宣告 ===== */
const worksOverlay = document.getElementById('worksOverlay');
const openWorksBtn = document.getElementById('openWorksBtn'); // 測試啟動按鈕
const worksBtn = document.querySelector('.menu li:nth-child(2)'); // 主頁面選單 WORKS 按鈕
const mobileWorksBtn = document.getElementById('mobileWorksBtn'); // 手機主頁面選單 WORKS 按鈕
const closeBtn = document.querySelector('.close-btn');
const heroBtn = document.querySelector('.hero-btn');

const cardsContainer = document.querySelector('.cards');
const allCards = document.querySelectorAll('.work-card');
const btnLeft = document.querySelector('.nav-btn.left');
const btnRight = document.querySelector('.nav-btn.right');
const dotsContainer = document.querySelector('.carousel-dots');

const pageMap = {
    "ocean.html": 0,
    "image.html": 1,
    "coffee.html": 2,
    "mask.html": 3,
    "family.html": 4,
    "draw.html": 5
};

const currentPage = window.location.pathname.split("/").pop();
let currentIdx = pageMap[currentPage] ?? 0;
let visibleCards = Array.from(allCards); // 當前分類過濾後的可見卡片
let activeFilter = 'all';

/* ===== RWD 雙模態排版與 Stagger 依次淡入動畫設計 ===== */
function checkLayoutMode() {
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
        cardsContainer.classList.remove('grid-mode');
        cardsContainer.classList.add('carousel-mode');
        // 關鍵修改：不重置索引 (false)
        filterCarouselCards(false);
    } else {
        cardsContainer.classList.remove('carousel-mode');
        cardsContainer.classList.add('grid-mode');

        // 桌機模式：清除手機輪播專用 class，並套用 Staggered 延遲入場動畫
        let delay = 0;
        allCards.forEach(card => {
            card.classList.remove('active', 'left', 'right', 'hidden');

            if (activeFilter === 'all' || card.dataset.category === activeFilter) {
                card.classList.remove('filtered-out');

                // 動態重啟 CSS 進場 fadeInUp 動畫並套用 staggered 延遲
                card.style.animation = 'none';
                card.offsetHeight; // 強制瀏覽器重繪
                card.style.animation = `fadeInUp 0.6s cubic-bezier(0.25, 1, 0.5, 1) both`;
                card.style.animationDelay = `${delay}s`;
                delay += 0.08; // 每個相鄰卡片依序延遲 80 毫秒淡入
            } else {
                card.classList.add('filtered-out');
                card.style.animation = 'none';
            }
        });
    }
}

/* ===== 手機 Carousel 輪播核心渲染 (2D 平面拉開平移) ===== */
function updateCarousel() {
    if (!cardsContainer.classList.contains('carousel-mode')) return;

    // 清空所有卡片定位，隱藏過濾以外的卡片，防止切換重疊
    allCards.forEach(card => {
        card.classList.remove('active', 'left', 'right', 'hidden');
        card.classList.add('filtered-out');
    });

    // 指派可見卡片的空間堆疊樣式 (使用你提供的 2D 平面大平移架構)
    visibleCards.forEach((card, i) => {
        card.classList.remove('filtered-out');

        if (i === currentIdx) {
            card.classList.add('active');
        } else if (i === currentIdx - 1) {
            card.classList.add('left');
        } else if (i === currentIdx + 1) {
            card.classList.add('right');
        } else {
            card.classList.add('hidden');
        }
    });

    // 更新手機 dots
    const dots = dotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIdx);
    });
}

// 重新構建手機點點 (Dots)
function buildMobileDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    visibleCards.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dot.addEventListener('click', () => {
            currentIdx = i;
            updateCarousel();
        });
        dotsContainer.appendChild(dot);
        if (i === currentIdx) dot.classList.add('active');
    });
}

// 手機 Carousel 篩選邏輯
/* 修改為接收 resetIndex 參數 */
function filterCarouselCards(resetIndex = true) {
    allCards.forEach(card => card.classList.add('filtered-out'));

    if (activeFilter === 'all') {
        visibleCards = Array.from(allCards);
    } else {
        visibleCards = Array.from(allCards).filter(card => card.dataset.category === activeFilter);
    }

    // 只有當 resetIndex 為 true 時，才重置索引
    if (resetIndex) {
        currentIdx = 0; 
    }
    
    // 確保 currentIdx 不會超出新的範圍
    if (currentIdx >= visibleCards.length) currentIdx = visibleCards.length - 1;
    if (currentIdx < 0) currentIdx = 0;

    buildMobileDots();
    updateCarousel();
}

/* ===== 分類篩選按鈕點擊事件監聽 ===== */
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        activeFilter = e.target.dataset.filter;

        // 重算並優化動態
        checkLayoutMode();
    });
});

/* ===== 手機版 Carousel 切換與滑動手勢 ===== */
if (btnLeft) {
    btnLeft.addEventListener('click', () => {
        if (currentIdx > 0) {
            currentIdx--;
            updateCarousel();
        }
    });
}

if (btnRight) {
    btnRight.addEventListener('click', () => {
        if (currentIdx < visibleCards.length - 1) {
            currentIdx++;
            updateCarousel();
        }
    });
}

// 滑動手勢
let startX = 0;
if (cardsContainer) {
    cardsContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    cardsContainer.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        const diff = endX - startX;

        if (Math.abs(diff) > 50) {
            if (diff > 0 && currentIdx > 0) {
                currentIdx--;
                updateCarousel();
            } else if (diff < 0 && currentIdx < visibleCards.length - 1) {
                currentIdx++;
                updateCarousel();
            }
        }
    });
}

/* ===== 視窗 Resize 監聽（保證桌機與手機即時切換） ===== */
window.addEventListener('resize', checkLayoutMode);

/* ===== 點擊跳出 overlay (修改開啟函式) ===== */
/* ===== 更新後的開啟彈出層函式 ===== */
const openOverlay = () => {
    worksOverlay.classList.add('show');
    document.body.style.overflow = 'hidden'; 
    checkLayoutMode(); 

    // 新增：觸發卡片入場動畫
    if (!window.matchMedia("(max-width: 768px)").matches) {
        // 僅在桌機模式執行，因為手機模式是輪播 (carousel-mode)
        let delay = 0;
        // 重新選取當前可見的卡片，避免選到被篩選掉的
        const activeCards = document.querySelectorAll('.cards.grid-mode .work-card:not(.filtered-out)');
        
        activeCards.forEach(card => {
            // 重置動畫
            card.style.animation = 'none';
            card.offsetHeight; // 強制重繪 (Reflow) 以重啟動畫
            
            // 套用動畫
            card.style.animation = `fadeInUp 0.6s cubic-bezier(0.25, 1, 0.5, 1) both`;
            card.style.animationDelay = `${delay}s`;
            delay += 0.1; // 每個卡片間隔 0.1 秒入場
        });
    }
};

/* ===== 關閉 overlay (修改關閉函式) ===== */
if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        worksOverlay.classList.remove('show');
        document.body.style.overflow = ''; // 恢復 body 滾動
    });
}

// 同步處理點擊遮罩關閉的部分
worksOverlay.addEventListener('click', (e) => {
    if (e.target === worksOverlay) {
        worksOverlay.classList.remove('show');
        document.body.style.overflow = ''; // 恢復 body 滾動
    }
});

// 綁定各類 Works 按鈕
if (openWorksBtn) openWorksBtn.addEventListener('click', openOverlay);
if (worksBtn) worksBtn.addEventListener('click', openOverlay);
if (heroBtn) heroBtn.addEventListener('click', openOverlay);

if (mobileWorksBtn) {
    mobileWorksBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openOverlay();

        // 行動裝置優化：可自行加上關閉側邊菜單邏輯
        const mobileMenu = document.getElementById('mobileMenu');
        const hamburger = document.getElementById('hamburger');
        if (mobileMenu) mobileMenu.classList.remove('show');
        if (hamburger) hamburger.classList.remove('active');
    });
}

if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        worksOverlay.classList.remove('show');
    });
}

// 點擊遮罩外部空白處自動關閉
worksOverlay.addEventListener('click', (e) => {
    if (e.target === worksOverlay) {
        worksOverlay.classList.remove('show');
    }
});

/* ===== 插畫卡片：滑鼠移入才自動多圖片輪播邏輯 ===== */
document.querySelectorAll('.image-slider-card').forEach(card => {
    const track = card.querySelector('.track');
    const slides = card.querySelectorAll('.slide');
    if (!track || slides.length === 0) return;

    let slideIdx = 0;
    let intervalId = null;

    // 僅在桌機端滑鼠移入時觸發自動切換
    card.addEventListener('mouseenter', () => {
        if (window.innerWidth > 768) {
            intervalId = setInterval(() => {
                slideIdx = (slideIdx + 1) % slides.length;
                track.style.transform = `translateX(-${slideIdx * 100}%)`;
            }, 2000); // 2秒切換一次，更具動感
        }
    });

    // 滑鼠移出時，立即停止並歸零重置
    card.addEventListener('mouseleave', () => {
        if (window.innerWidth > 768) {
            clearInterval(intervalId);
            slideIdx = 0;
            track.style.transform = `translateX(0%)`;
        }
    });
});

/* ===== 影片 Hover 播放與暫停控制邏輯 ===== */
allCards.forEach(card => {
    const video = card.querySelector('.card-video');
    const logo = card.querySelector('.card-logo');

    if (video && logo) {
        card.addEventListener('mouseenter', () => {
            if (window.innerWidth > 768) { // 僅在桌機模式啟用
                video.style.opacity = '1';
                logo.style.opacity = '0';
                video.play().catch(() => { });
            }
        });

        card.addEventListener('mouseleave', () => {
            if (window.innerWidth > 768) {
                video.style.opacity = '0';
                logo.style.opacity = '1';
                video.pause();
                video.currentTime = 0; // 重置回影片開頭
            }
        });
    }
});