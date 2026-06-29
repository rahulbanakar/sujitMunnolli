// ===== Carousel Functionality =====
let slideIndex = 1;

function nextSlide() {
    showSlide(slideIndex += 1);
}

function prevSlide() {
    showSlide(slideIndex -= 1);
}

function currentSlide(n) {
    showSlide(slideIndex = n);
}

function showSlide(n) {
    const slides = document.querySelectorAll(".carousel-slide");
    const dots = document.querySelectorAll(".dot");

    if (n > slides.length) {
        slideIndex = 1;
    }
    if (n < 1) {
        slideIndex = slides.length;
    }

    slides.forEach(slide => slide.classList.remove("fade"));
    dots.forEach(dot => dot.classList.remove("active"));

    if (slides[slideIndex - 1]) {
        slides[slideIndex - 1].classList.add("fade");
    }
    if (dots[slideIndex - 1]) {
        dots[slideIndex - 1].classList.add("active");
    }
    // Play video in the active slide (if any) and pause others
    slides.forEach((slide, idx) => {
        const vid = slide.querySelector('video');
        if (!vid) return;
        if (idx === slideIndex - 1) {
            vid.currentTime = 0;
            const p = vid.play();
            if (p && typeof p.catch === 'function') p.catch(() => {});
        } else {
            try {
                vid.pause();
            } catch (e) {}
            vid.currentTime = 0;
        }
    });
}

let aboutSlideIndex = 0;

function showAboutSlide(index) {
    const slides = document.querySelectorAll(".about-slide");
    if (!slides.length) return;

    if (index >= slides.length) {
        aboutSlideIndex = 0;
    }
    if (index < 0) {
        aboutSlideIndex = slides.length - 1;
    }

    slides.forEach(slide => slide.classList.remove("active"));
    slides[aboutSlideIndex].classList.add("active");
}

function nextAboutSlide() {
    showAboutSlide(++aboutSlideIndex);
}

function startAboutSlideShow() {
    setInterval(nextAboutSlide, 2000);
}

// Initialize carousel
document.addEventListener("DOMContentLoaded", function () {
    showSlide(slideIndex);
    showAboutSlide(aboutSlideIndex);
    startAboutSlideShow();
});

// ===== Hamburger Menu =====
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

if (hamburger) {
    hamburger.addEventListener("click", function () {
        navLinks.classList.toggle("active");
    });
}

// Close menu when a link is clicked
document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", function () {
        navLinks.classList.remove("active");
    });
});

// ===== Contact Form Validation =====
const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = this.querySelector('input[type="text"]').value.trim();
        const email = this.querySelector('input[type="email"]').value.trim();
        const phone = this.querySelector('input[type="tel"]').value.trim();
        const message = this.querySelector('textarea').value.trim();

        // Validation
        if (!name || !email || !phone || !message) {
            alert("Please fill in all fields");
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Please enter a valid email address");
            return;
        }

        // Phone validation (basic)
        if (phone.length < 10) {
            alert("Please enter a valid phone number (at least 10 digits)");
            return;
        }

        // Success message
        alert(
            `Thank you, ${name}! Your message has been sent. We'll contact you soon at ${phone}.`
        );

        // Reset form
        this.reset();

        // In a real scenario, you would send this data to a server
        console.log({
            name,
            email,
            phone,
            message,
            timestamp: new Date().toISOString(),
        });
    });
}

// ===== Smooth Scroll for Navigation Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (href !== "#") {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        }
    });
});

// ===== Active Navigation Link Highlight =====
function updateActiveLink() {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-links a");

    let current = "";

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href").slice(1) === current) {
            link.classList.add("active");
        }
    });
}

window.addEventListener("scroll", updateActiveLink);

// ===== Scroll Animation for Elements =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = "slideInLeft 0.8s ease forwards";
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll(".service-card, .pricing-card, .testimonial-card").forEach(el => {
    el.style.opacity = "0";
    observer.observe(el);
});

// ===== Auto-rotate Carousel =====
let autoRotateTimer;

function startAutoRotate() {
    autoRotateTimer = setInterval(() => {
        nextSlide();
    }, 5000); // Change slide every 5 seconds
}

function stopAutoRotate() {
    clearInterval(autoRotateTimer);
}

// Start carousel auto-rotation
startAutoRotate();

// Stop on hover, resume on mouse leave
const carouselContainer = document.querySelector(".carousel-container");
if (carouselContainer) {
    carouselContainer.addEventListener("mouseenter", stopAutoRotate);
    carouselContainer.addEventListener("mouseleave", startAutoRotate);
}

// ===== Mobile Menu Auto-close on Scroll =====
let lastScrollTop = 0;
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
    let scrollTop = window.scrollY || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop) {
        // Scrolling down
        if (navLinks && navLinks.classList.contains("active")) {
            navLinks.classList.remove("active");
        }
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// ===== Utility Functions =====

// Format phone number
function formatPhoneNumber(phoneNumber) {
    const cleaned = phoneNumber.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phoneNumber;
}

// Add subtle animation to elements on page load
window.addEventListener("load", () => {
    document.querySelectorAll(".stat, .service-icon").forEach((el, index) => {
        setTimeout(() => {
            el.style.animation = "slideInLeft 0.6s ease forwards";
        }, index * 100);
    });
});

// ===== Keyboard Navigation =====
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
        prevSlide();
        stopAutoRotate();
        startAutoRotate();
    } else if (e.key === "ArrowRight") {
        nextSlide();
        stopAutoRotate();
        startAutoRotate();
    }
});

// ===== Video Carousel Controls (mobile-first) =====
function initVideoCarousels() {
    const carousels = document.querySelectorAll('.video-carousel');
    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const prev = carousel.querySelector('.carousel-btn.prev');
        const next = carousel.querySelector('.carousel-btn.next');

        if (!track) return;

        const slides = Array.from(track.children);

        // Pause all videos except the first visible one
        function pauseHiddenVideos() {
            const rect = track.getBoundingClientRect();
            slides.forEach(slide => {
                const vid = slide.querySelector('video');
                if (!vid) return;
                const srect = slide.getBoundingClientRect();
                // consider visible if center of slide is within track viewport
                const center = (srect.left + srect.right) / 2;
                if (center >= rect.left && center <= rect.right) {
                    vid.play().catch(() => {});
                } else {
                    try { vid.pause(); } catch (e) {}
                    vid.currentTime = 0;
                }
            });
        }

        // Scroll by one slide width (current viewport width of a slide)
        function scrollBySlide(direction = 1) {
            const slideWidth = track.querySelector('.carousel-slide')?.getBoundingClientRect().width || track.clientWidth;
            track.scrollBy({ left: Math.round(slideWidth * direction), behavior: 'smooth' });
            setTimeout(pauseHiddenVideos, 300);
        }

        if (prev) prev.addEventListener('click', () => scrollBySlide(-1));
        if (next) next.addEventListener('click', () => scrollBySlide(1));

        // Pause/Play handling on scroll
        let scrollTimer;
        track.addEventListener('scroll', () => {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(pauseHiddenVideos, 150);
        });

        // Initialize
        pauseHiddenVideos();
    });
}

// ===== Log Initial Load =====
console.log("Munnolli Engineering Works - Website loaded successfully!");
