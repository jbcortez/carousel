class Carousel {
    constructor() {
        this.track = document.querySelector('.carousel-track');
        this.cards = document.querySelectorAll('.carousel-card');
        this.prevBtn = document.querySelector('.carousel-prev');
        this.nextBtn = document.querySelector('.carousel-next');
        this.dots = document.querySelectorAll('.dot');

        this.currentIndex = 0;
        this.cardWidth = 0;
        this.cardsPerView = 1;
        this.totalCards = this.cards.length;

        this.init();
    }

    init() {
        this.calculateDimensions();
        this.updateCarousel();
        this.addEventListeners();

        // Recalculate on window resize
        window.addEventListener('resize', () => {
            this.calculateDimensions();
            this.updateCarousel();
        });
    }

    calculateDimensions() {
        const containerWidth = this.track.parentElement.offsetWidth;
        const cardStyle = getComputedStyle(this.cards[0]);
        this.cardWidth = this.cards[0].offsetWidth;
        const gap = parseInt(getComputedStyle(this.track).gap) || 0;

        // Calculate how many cards can fit
        const availableWidth = containerWidth - 64; // Account for padding
        this.cardsPerView = Math.floor((availableWidth + gap) / (this.cardWidth + gap));
        this.cardsPerView = Math.max(1, Math.min(this.cardsPerView, this.totalCards));
    }

    updateCarousel() {
        const gap = parseInt(getComputedStyle(this.track).gap) || 0;
        const translateX = -(this.currentIndex * (this.cardWidth + gap));
        this.track.style.transform = `translateX(${translateX}px)`;

        this.updateDots();
        this.updateButtons();
    }

    updateDots() {
        this.dots.forEach((dot, index) => {
            if (index === this.currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    updateButtons() {
        this.prevBtn.disabled = this.currentIndex === 0;
        this.nextBtn.disabled = this.currentIndex >= this.totalCards - this.cardsPerView;
    }

    goToSlide(index) {
        const maxIndex = this.totalCards - this.cardsPerView;
        this.currentIndex = Math.max(0, Math.min(index, maxIndex));
        this.updateCarousel();
    }

    nextSlide() {
        if (this.currentIndex < this.totalCards - this.cardsPerView) {
            this.currentIndex += this.cardsPerView;
            this.updateCarousel();
        }
    }

    prevSlide() {
        if (this.currentIndex > 0) {
            this.currentIndex = Math.max(0, this.currentIndex - this.cardsPerView);
            this.updateCarousel();
        }
    }

    addEventListeners() {
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        this.prevBtn.addEventListener('click', () => this.prevSlide());

        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });

        // Touch/swipe support
        let startX = 0;
        let isDragging = false;

        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });

        this.track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
        });

        this.track.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;

            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            const threshold = 50;

            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        });
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Carousel();
});
