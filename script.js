const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-link"); // Get all nav links
const sections = document.querySelectorAll("section[id]");
const header = document.querySelector("header"); 
const scrollThreshold = 50;
let currentSectionIndex = 0; // Tracks the currently visible section for tunnel effect
const mainElement = document.querySelector('main'); // For managing height
let isAnimating = false; // Flag to prevent animation overlap

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
});

document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}));

// Disable updateTunnelView function to allow regular scrolling
function updateTunnelView(newActiveIndex, scrollDirection = null) {
    // Completely disabled to allow normal scrolling
    console.log("Section navigation disabled for better content visibility");
    return;
}

// Function to create SAO-style prompt at the end of the tunnel
function showSAOPrompt() {
    let saoPrompt = document.getElementById('sao-prompt');
    
    if (!saoPrompt) {
        // Create the SAO prompt if it doesn't exist
        saoPrompt = document.createElement('div');
        saoPrompt.id = 'sao-prompt';
        saoPrompt.className = 'sao-prompt';
        
        const promptContent = document.createElement('div');
        promptContent.className = 'sao-prompt-content';
        
        const title = document.createElement('h3');
        title.textContent = 'Terima kasih telah menjelajahi portofolio saya!';
        title.className = 'sao-prompt-title';
        
        const question = document.createElement('p');
        question.textContent = 'Apakah Anda ingin memesan desain flyer?';
        question.className = 'sao-prompt-question';
        
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'sao-prompt-buttons';
        
        const yesButton = document.createElement('button');
        yesButton.textContent = 'Ya, Hubungi Sekarang';
        yesButton.className = 'sao-button yes-button';
        yesButton.addEventListener('click', () => {
            // Direct to existing WhatsApp link or floating widget click
            const whatsappWidget = document.querySelector('.whatsapp-widget');
            if (whatsappWidget) {
                whatsappWidget.click();
            } else {
                window.open('https://wa.me/yourphonenumber', '_blank');
            }
            hideSAOPrompt();
        });
        
        const noButton = document.createElement('button');
        noButton.textContent = 'Belum, Kembali ke Portofolio';
        noButton.className = 'sao-button no-button';
        noButton.addEventListener('click', () => {
            // Go back to portfolio section
            const portfolioIndex = Array.from(sections).findIndex(sec => sec.id === 'portfolio');
            if (portfolioIndex !== -1) {
                hideSAOPrompt();
                updateTunnelView(portfolioIndex, 'prev');
            }
        });
        
        buttonsContainer.appendChild(yesButton);
        buttonsContainer.appendChild(noButton);
        
        promptContent.appendChild(title);
        promptContent.appendChild(question);
        promptContent.appendChild(buttonsContainer);
        saoPrompt.appendChild(promptContent);
        
        document.body.appendChild(saoPrompt);
    }
    
    // Show the prompt with animation
    setTimeout(() => {
        saoPrompt.classList.add('active');
    }, 200);
}

function hideSAOPrompt() {
    const saoPrompt = document.getElementById('sao-prompt');
    if (saoPrompt) {
        saoPrompt.classList.remove('active');
    }
}

// Nav link click listeners for tunnel effect
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        // Allow normal browser scrolling behavior with smooth scrolling
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            e.preventDefault(); // Prevent default only if we have the target
            
            // Enhanced smooth scrolling with better easing
            smoothScrollTo(targetElement);
        }
        
        // Close mobile menu if open
        if (hamburger.classList.contains('active')) {
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
        }
    });
});

// Enhanced smooth scrolling function
function smoothScrollTo(targetElement) {
    const headerHeight = document.querySelector('header').offsetHeight;
    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 1000; // longer duration for smoother transition
    let startTimestamp = null;
    
    function step(timestamp) {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = timestamp - startTimestamp;
        
        // Easing function for smoother transition (cubic easing out)
        const easeOutCubic = function(t) {
            return (--t) * t * t + 1;
        };
        
        // Calculate current position using easing
        const progressFraction = Math.min(progress / duration, 1);
        const easeProgress = easeOutCubic(progressFraction);
        
        window.scrollTo(0, startPosition + distance * easeProgress);
        
        if (progress < duration) {
            window.requestAnimationFrame(step);
        } else {
            // When scrolling is complete, focus on the section for accessibility
            targetElement.setAttribute('tabindex', '-1');
            targetElement.focus({preventScroll: true});
            
            // Add highlight animation to indicate arrival
            targetElement.classList.add('section-highlight');
            setTimeout(() => {
                targetElement.classList.remove('section-highlight');
            }, 1000);
        }
    }
    
    window.requestAnimationFrame(step);
}

// Header scroll effect (independent of section scrolling for now)
window.addEventListener("scroll", () => {
    if (header) { 
        if (window.pageYOffset > scrollThreshold) {
            header.classList.add("header-scrolled");
        } else {
            header.classList.remove("header-scrolled");
        }
    }
});

// Initialize corridor wall elements for Disneyland-style experience
function initCorridorWalls() {
    // Create left and right corridor walls for each section
    sections.forEach((section, index) => {
        // Skip if walls already exist
        if (section.querySelector('.corridor-wall-left')) return;
        
        // Create left wall
        const leftWall = document.createElement('div');
        leftWall.className = 'corridor-wall corridor-wall-left';
        
        // Create right wall
        const rightWall = document.createElement('div');
        rightWall.className = 'corridor-wall corridor-wall-right';
        
        // Create floor and ceiling
        const floor = document.createElement('div');
        floor.className = 'corridor-floor';
        
        const ceiling = document.createElement('div');
        ceiling.className = 'corridor-ceiling';
        
        // Add wall content based on section
        const sectionId = section.id;
        
        if (sectionId === 'hero') {
            leftWall.innerHTML = `
                <div class="wall-content">
                    <i class="wall-icon fas fa-pencil-ruler"></i>
                    <h3>Desain Kreatif</h3>
                </div>
            `;
            rightWall.innerHTML = `
                <div class="wall-content">
                    <i class="wall-icon fas fa-palette"></i>
                    <h3>Visual Menarik</h3>
                </div>
            `;
        } else if (sectionId === 'portfolio') {
            // Find actual flyer images from the portfolio section
            const flyerImages = Array.from(document.querySelectorAll('#portfolio .flyer-image-container img'));
            
            leftWall.innerHTML = `
                <div class="wall-content">
                    <h3>Portofolio Terbaik</h3>
                    ${flyerImages[0] ? `<img src="${flyerImages[0].src}" class="corridor-img" alt="Flyer Preview">` : 
                    '<i class="wall-icon fas fa-image"></i>'}
                </div>
            `;
            rightWall.innerHTML = `
                <div class="wall-content">
                    <h3>Karya Berkualitas</h3>
                    ${flyerImages[1] ? `<img src="${flyerImages[1].src}" class="corridor-img" alt="Flyer Preview">` : 
                    '<i class="wall-icon fas fa-image"></i>'}
                </div>
            `;
        } else if (sectionId === 'about') {
            leftWall.innerHTML = `
                <div class="wall-content">
                    <i class="wall-icon fas fa-user"></i>
                    <h3>Perkenalan</h3>
                </div>
            `;
            rightWall.innerHTML = `
                <div class="wall-content">
                    <i class="wall-icon fas fa-briefcase"></i>
                    <h3>Pengalaman Desain</h3>
                    <p>+3 tahun pengalaman di bidang desain grafis</p>
                </div>
            `;
        } else if (sectionId === 'contact') {
            leftWall.innerHTML = `
                <div class="wall-content">
                    <i class="wall-icon fas fa-envelope"></i>
                    <h3>Hubungi Segera</h3>
                </div>
            `;
            rightWall.innerHTML = `
                <div class="wall-content">
                    <i class="wall-icon fas fa-phone"></i>
                    <h3>Diskusi Lebih Lanjut</h3>
                </div>
            `;
        }
        
        // Add walls, floor and ceiling to the section
        section.appendChild(leftWall);
        section.appendChild(rightWall);
        section.appendChild(floor);
        section.appendChild(ceiling);
    });
}

// Make gallery creation more reliable
function createGalleryHall() {
    const portfolioSection = document.getElementById('portfolio');
    
    // Skip if gallery hall already exists
    if (portfolioSection.querySelector('.gallery-hall')) return;
    
    console.log("Creating simplified gallery hall");
    
    // Create gallery hall structure with simplifications
    const galleryHall = document.createElement('div');
    galleryHall.className = 'gallery-hall';
    galleryHall.style.position = 'absolute';
    galleryHall.style.top = '0';
    galleryHall.style.left = '0';
    galleryHall.style.width = '100%';
    galleryHall.style.height = '100%';
    galleryHall.style.zIndex = '0';
    
    // Create background wall only (simplified approach)
    const backWall = document.createElement('div');
    backWall.className = 'gallery-wall gallery-wall-back';
    backWall.style.position = 'absolute';
    backWall.style.width = '100%'; 
    backWall.style.height = '100%';
    backWall.style.top = '0';
    backWall.style.left = '0';
    backWall.style.backgroundColor = '#f0f0f0';
    backWall.style.boxShadow = 'inset 0 0 30px rgba(0,0,0,0.1)';
    
    // Assemble the gallery hall (simplified)
    galleryHall.appendChild(backWall);
    
    // Add the gallery hall to the portfolio section
    portfolioSection.style.position = 'relative';
    portfolioSection.style.zIndex = '1';
    
    // Insert the gallery hall at the beginning of the portfolio section
    portfolioSection.insertBefore(galleryHall, portfolioSection.firstChild);
    
    // Ensure the container is properly styled and visible
    const portfolioContainer = portfolioSection.querySelector('.container');
    if (portfolioContainer) {
        portfolioContainer.style.position = 'relative';
        portfolioContainer.style.zIndex = '2';
    }
    
    console.log("Simplified gallery hall created");
}

// Back to Top Button Functionality
const backToTopButton = document.querySelector('.back-to-top');
const bgGradientWrapper = document.querySelector('.bg-gradient-wrapper');
const bgGradientFade = document.querySelector('.bg-gradient-fade');
const scrollShowThreshold = 400; // How far to scroll before showing the button

// Variabel untuk deteksi arah scroll
let lastScrollTop = 0;
let scrollingTimeoutId = null;

// Show/hide back to top button based on scroll position
function handleScroll() {
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Mendeteksi arah scroll
    if (currentScrollTop < lastScrollTop) {
        // Scrolling ke atas
        document.body.classList.add('scrolling-up');
    } else {
        // Scrolling ke bawah atau diam
        document.body.classList.remove('scrolling-up');
    }
    
    // Bersihkan timeout sebelumnya jika ada
    if (scrollingTimeoutId) {
        clearTimeout(scrollingTimeoutId);
    }
    
    // Set timeout untuk menghapus class scrolling-up setelah berhenti scroll
    scrollingTimeoutId = setTimeout(() => {
        document.body.classList.remove('scrolling-up');
    }, 300);
    
    // Simpan posisi scroll terakhir
    lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    
    // Tampilkan/sembunyikan tombol
    if (currentScrollTop > scrollShowThreshold) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
    
    // Adjust gradient opacity based on scroll position
    // Maximum scroll progress capped at 2000px for full effect
    const scrollProgress = Math.min(currentScrollTop / 2000, 1);
    bgGradientWrapper.style.opacity = 1 - (scrollProgress * 0.5); // Fade to 50% at most
}

// Scroll to top when button is clicked
function scrollToTop() {
    // Tambahkan kelas tambahan untuk animasi roket "boost"
    document.body.classList.add('rocket-boosting');
    
    // Aktifkan efek api roket
    if (backToTopButton) {
        const rocketFlame = backToTopButton.querySelector('.rocket-flame');
        if (rocketFlame) {
            rocketFlame.style.opacity = '1';
        }
    }
    
    // Scroll ke atas dengan animasi smooth
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    // Hapus kelas dan reset efek setelah animasi selesai
    setTimeout(() => {
        document.body.classList.remove('rocket-boosting');
        if (backToTopButton) {
            const rocketFlame = backToTopButton.querySelector('.rocket-flame');
            if (rocketFlame && window.pageYOffset < 10) {
                rocketFlame.style.opacity = '';
            }
        }
    }, 1000); // Durasi sedikit lebih lama dari durasi scrolling
}

// Event listeners for back to top functionality
window.addEventListener('scroll', handleScroll);
if (backToTopButton) {
    backToTopButton.addEventListener('click', scrollToTop);
}

// Initialize gradient and back to top when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize existing functionality
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);

    const savedLanguage = localStorage.getItem('language') || 'id';
    setLanguage(savedLanguage);
    
    // Initialize flying flyers for hero section only
    initFlyingFlyersAnimation();
    
    // Create gallery hall for portfolio section
    setTimeout(createGalleryHall, 100); // Small delay to ensure DOM is ready
    
    // Initialize animation on scroll
    initAnimateOnScroll();
    
    // Initialize custom cursor
    initCustomCursor();
    
    // Initialize custom right-click menu
    initCustomContextMenu();
    
    // Initialize back to top visibility
    handleScroll();
    
    // Initialize client logos
    loadClientLogos();
    
    console.log("Normal scrolling enabled for better content visibility");
});

// Image Preview Modal Functionality
const modal = document.getElementById("imagePreviewModal");
const modalImage = document.getElementById("modalImageContent");
const modalCaption = document.getElementById("modalCaption");
const closeModalButton = document.querySelector(".modal-close-button");
const modalPrevButton = document.querySelector(".image-modal .modal-nav-button.prev");
const modalNextButton = document.querySelector(".image-modal .modal-nav-button.next");

const flyerImageElements = document.querySelectorAll(".flyer-image-container img");
let currentImageIndex = 0;

// Helper function to update modal content
function updateModalContent(index) {
    const imgElement = flyerImageElements[index];
    
    modalImage.style.opacity = 0; // Start fade out

    // Give a moment for opacity to take effect before changing src and fading in
    setTimeout(() => {
        modalImage.src = imgElement.src;
        // No need to force onload for opacity, browser handles image loading before display
        modalImage.style.opacity = 1; // Start fade in

        const flyerItem = imgElement.closest('.flyer-grid-item');
        let captionText = "";
        if (flyerItem) {
            const titleElement = flyerItem.querySelector('.flyer-caption h3');
            const descElement = flyerItem.querySelector('.flyer-caption p');
            if (titleElement) captionText += titleElement.textContent;
            if (descElement) captionText += (captionText ? " - " : "") + descElement.textContent;
        }
        modalCaption.textContent = captionText || imgElement.alt; 
    }, 150); // 150ms delay, can be adjusted. Should be less than opacity transition time.
    
    currentImageIndex = index;
}

flyerImageElements.forEach((img, index) => {
    img.addEventListener("click", function() {
        modal.style.display = "block";
        updateModalContent(index);
    });
});

if(closeModalButton) {
    closeModalButton.onclick = function() {
        modal.style.display = "none";
    }
}

// Close modal when clicking outside the image content (on the overlay)
if (modal) {
    modal.addEventListener('click', function(event) {
        if (event.target === modal) { 
            modal.style.display = "none";
        }
    });
}

// Modal Carousel Navigation
if (modalPrevButton && modalNextButton) {
    modalPrevButton.addEventListener('click', () => {
        let newIndex = currentImageIndex - 1;
        if (newIndex < 0) {
            newIndex = flyerImageElements.length - 1; // Loop to last image
        }
        updateModalContent(newIndex);
    });

    modalNextButton.addEventListener('click', () => {
        let newIndex = currentImageIndex + 1;
        if (newIndex >= flyerImageElements.length) {
            newIndex = 0; // Loop to first image
        }
        updateModalContent(newIndex);
    });
}

// (Space for a new feature if needed in the future) 

// Theme Toggle Functionality
const themeToggleCheckbox = document.getElementById('theme-toggle-checkbox');
const bodyElement = document.body;

// Function to apply the selected theme
function applyTheme(theme) {
    const sunIcon = document.querySelector('.theme-switch-container .sun-icon');
    const moonIcon = document.querySelector('.theme-switch-container .moon-icon');

    if (theme === 'light') {
        bodyElement.classList.add('light-mode');
        if(themeToggleCheckbox) themeToggleCheckbox.checked = true;
        if(sunIcon) sunIcon.style.display = 'block';
        if(moonIcon) moonIcon.style.display = 'none';
    } else { // Default to dark theme
        bodyElement.classList.remove('light-mode');
        if(themeToggleCheckbox) themeToggleCheckbox.checked = false;
        if(sunIcon) sunIcon.style.display = 'none';
        if(moonIcon) moonIcon.style.display = 'block';
    }
}

// Event listener for the theme toggle
if (themeToggleCheckbox) {
    themeToggleCheckbox.addEventListener('change', () => {
        if (themeToggleCheckbox.checked) {
            applyTheme('light');
            localStorage.setItem('theme', 'light');
        } else {
            applyTheme('dark');
            localStorage.setItem('theme', 'dark');
        }
    });
}

// Multi-language Functionality
const translations = {
    en: {
        pageTitle: "My Portfolio - Flyer Designer",
        navLogo: "Portfolio",
        navHome: "Home",
        navPortfolio: "Portfolio",
        navClients: "Clients",
        navAbout: "About Me",
        navContact: "Contact",
        heroTitle: "Creative Flyer Design Services in Bitung",
        heroSubtitle: "Helping you convey messages through attractive and effective flyer designs.",
        heroCTA: "View Design Portfolio",
        scrollIndicator: "Scroll",
        portfolioTitle: "Flyer Gallery",
        clientsTitle: "Our Clients",
        clientsSubtitle: "Some organizations and companies that have trusted us with their design needs.",
        flyer1Title: "Official Event Celebration",
        flyer1Desc: "Flyer for official government holiday celebration event.",
        flyer1Alt: "Flyer for official government holiday celebration",
        flyer2Title: "Official Event Celebration",
        flyer2Desc: "Flyer for official government holiday celebration event.",
        flyer2Alt: "Flyer for official government holiday celebration",
        flyer3Title: "Government Institution Flyer",
        flyer3Desc: "Custom designed flyer for government institution needs.",
        flyer3Alt: "Flyer for government institution",
        flyer4Title: "Government Institution Flyer",
        flyer4Desc: "Custom designed flyer for government institution needs.",
        flyer4Alt: "Flyer for government institution",
        flyer5Title: "Private Event Flyer",
        flyer5Desc: "Professionally designed flyer for private corporate events.",
        flyer5Alt: "Flyer for private event",
        flyer6Title: "Religious Event Flyer",
        flyer6Desc: "Elegant flyer design for religious ceremonies and events.",
        flyer6Alt: "Flyer for religious event",
        flyer7Title: "Official Personal Flyer",
        flyer7Desc: "Personalized flyer design for government official needs.",
        flyer7Alt: "Personal flyer for government official",
        flyer8Title: "Official Personal Flyer",
        flyer8Desc: "Personalized flyer design for government official needs.",
        flyer8Alt: "Personal flyer for government official",
        flyer9Title: "Institution Flyer",
        flyer9Desc: "Professional flyer design for institutional events and announcements.",
        flyer9Alt: "Flyer for institution",
        flyer10Title: "Institution Flyer",
        flyer10Desc: "Professional flyer design for institutional events and announcements.",
        flyer10Alt: "Flyer for institution",
        aboutTitle: "About Me",
        aboutParagraph: "As a graphic designer from Bitung, Indonesia, I focus on creating flyers that are not only visually appealing but also informative, supporting effective communication for your needs.",
        aboutParagraph2: "I have over 5 years of experience as a graphic designer specializing in promotional design and marketing materials. With a formal education background in Visual Communication Design, I have developed a modern and eye-catching design style to ensure your flyers get the attention they deserve.",
        aboutParagraph3: "Besides flyer design, I also have skills in photography which helps me understand visual composition and effective use of color. My approach to design is always customer-oriented, ensuring the final result aligns with your brand's specific vision and needs.",
        skillsTitle: "Skills:",
        skill1: "Promotional Flyer Design",
        skill2: "Digital Marketing Design",
        skill3: "Branding & Visual Identity",
        skill4: "Desktop Publishing",
        skill5: "Adobe Creative Suite",
        contactTitle: "Contact Me",
        contactIntro: "Ready to bring your flyer ideas to life for your business. Contact me for further discussion!",
        formNamePlaceholder: "Your Name",
        formEmailPlaceholder: "Your Email (for reply)",
        formSubjectPlaceholder: "Message Subject",
        formMessagePlaceholder: "Your Message",
        formSubmitButton: "Send Message via Email",
        footerText: "Nama Anda. Flyer Design Services in Bitung.",
        modalPreviousAriaLabel: "Previous Image",
        modalNextAriaLabel: "Next Image",
        widgetWhatsAppAriaLabel: "Contact via WhatsApp",
        widgetTelegramAriaLabel: "Contact via Telegram",
        widgetWhatsAppTooltip: "Chat on WhatsApp",
        widgetTelegramTooltip: "Chat on Telegram",
        contextMenuHeader: "Contact via:",
        contextMenuWhatsApp: "WhatsApp",
        contextMenuTelegram: "Telegram"
    },
    id: {
        pageTitle: "Portfolio Saya - Desainer Flyer",
        navLogo: "Portfolio",
        navHome: "Beranda",
        navPortfolio: "Portfolio",
        navClients: "Klien",
        navAbout: "Tentang Saya",
        navContact: "Kontak",
        heroTitle: "Jasa Desain Flyer Kreatif di Bitung",
        heroSubtitle: "Membantu Anda menyampaikan pesan melalui desain flyer yang menarik dan efektif.",
        heroCTA: "Lihat Portfolio Desain",
        scrollIndicator: "Scroll",
        portfolioTitle: "Galeri Flyer",
        clientsTitle: "Klien Kami",
        clientsSubtitle: "Beberapa instansi dan perusahaan yang telah mempercayakan kebutuhan desain mereka pada kami.",
        flyer1Title: "Perayaan Hari Besar Pejabat",
        flyer1Desc: "Flyer perayaan hari besar untuk pejabat.",
        flyer1Alt: "Flyer perayaan hari besar untuk pejabat",
        flyer2Title: "Perayaan Hari Besar Pejabat",
        flyer2Desc: "Flyer perayaan hari besar untuk pejabat.",
        flyer2Alt: "Flyer perayaan hari besar untuk pejabat",
        flyer3Title: "Flyer Instansi Pemerintah",
        flyer3Desc: "Untuk instansi pemerintah.",
        flyer3Alt: "Flyer untuk instansi pemerintah",
        flyer4Title: "Flyer Instansi Pemerintah",
        flyer4Desc: "Untuk instansi pemerintah.",
        flyer4Alt: "Flyer untuk instansi pemerintah",
        flyer5Title: "Flyer Event Swasta",
        flyer5Desc: "Untuk event swasta.",
        flyer5Alt: "Flyer untuk event swasta",
        flyer6Title: "Flyer Acara Kerohanian",
        flyer6Desc: "Acara kerohanian.",
        flyer6Alt: "Flyer acara kerohanian",
        flyer7Title: "Flyer Personal Pejabat",
        flyer7Desc: "Flyer personal pejabat.",
        flyer7Alt: "Flyer personal pejabat",
        flyer8Title: "Flyer Personal Pejabat",
        flyer8Desc: "Flyer personal pejabat.",
        flyer8Alt: "Flyer personal pejabat",
        flyer9Title: "Flyer Instansi",
        flyer9Desc: "Untuk flyer instansi.",
        flyer9Alt: "Flyer untuk instansi",
        flyer10Title: "Flyer Instansi",
        flyer10Desc: "Untuk flyer instansi.",
        flyer10Alt: "Flyer untuk instansi",
        aboutTitle: "Tentang Saya",
        aboutParagraph: "Sebagai desainer grafis dari Bitung, Indonesia, saya berfokus pada layanan pembuatan flyer yang tidak hanya menarik secara visual tetapi juga informatif, mendukung komunikasi efektif untuk kebutuhan Anda.",
        aboutParagraph2: "Saya memiliki pengalaman lebih dari 5 tahun sebagai graphic designer dengan spesialisasi di desain promosi dan marketing material. Dengan latar belakang pendidikan formal di bidang Desain Komunikasi Visual, saya telah mengembangkan gaya desain yang modern dan eye-catching untuk memastikan flyer Anda mendapatkan perhatian yang diinginkan.",
        aboutParagraph3: "Selain desain flyer, saya juga memiliki kemampuan dalam fotografi yang membantu saya memahami komposisi visual dan penggunaan warna yang efektif. Pendekatan saya dalam desain selalu customer-oriented, memastikan hasil akhir sesuai dengan visi dan kebutuhan spesifik brand Anda.",
        skillsTitle: "Keahlian:",
        skill1: "Desain Flyer Promosi",
        skill2: "Desain Digital Marketing",
        skill3: "Branding & Visual Identity",
        skill4: "Desktop Publishing",
        skill5: "Adobe Creative Suite",
        contactTitle: "Hubungi Saya",
        contactIntro: "Siap membantu mewujudkan ide flyer untuk bisnis Anda. Hubungi saya untuk diskusi lebih lanjut!",
        formNamePlaceholder: "Nama Anda",
        formEmailPlaceholder: "Email Anda (untuk balasan)",
        formSubjectPlaceholder: "Subjek Pesan",
        formMessagePlaceholder: "Pesan Anda",
        formSubmitButton: "Kirim Pesan via Email",
        footerText: "Nama Anda. Jasa Desain Flyer di Bitung.",
        modalPreviousAriaLabel: "Gambar Sebelumnya",
        modalNextAriaLabel: "Gambar Berikutnya",
        widgetWhatsAppAriaLabel: "Hubungi via WhatsApp",
        widgetTelegramAriaLabel: "Hubungi via Telegram",
        widgetWhatsAppTooltip: "Chat di WhatsApp",
        widgetTelegramTooltip: "Chat di Telegram",
        contextMenuHeader: "Hubungi Via:",
        contextMenuWhatsApp: "WhatsApp",
        contextMenuTelegram: "Telegram"
    }
};

const languageSelect = document.getElementById('language-select');

function setLanguage(lang) {
    if (!translations[lang]) {
        console.warn(`Language "${lang}" not found in translations. Defaulting to 'id'.`);
        lang = 'id';
    }

    document.documentElement.lang = lang;
    localStorage.setItem('language', lang);
    if(languageSelect) languageSelect.value = lang;

    document.querySelectorAll('[data-lang-key]').forEach(element => {
        const key = element.getAttribute('data-lang-key');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        } else {
            console.warn(`Translation key "${key}" not found for language "${lang}".`);
        }
    });

    document.querySelectorAll('[data-lang-key-placeholder]').forEach(element => {
        const key = element.getAttribute('data-lang-key-placeholder');
        if (translations[lang][key]) {
            element.placeholder = translations[lang][key];
        } else {
            console.warn(`Placeholder key "${key}" not found for language "${lang}".`);
        }
    });

    document.querySelectorAll('[data-lang-key-alt]').forEach(element => {
        const key = element.getAttribute('data-lang-key-alt');
        if (translations[lang][key]) {
            element.alt = translations[lang][key];
        } else {
            console.warn(`Alt text key "${key}" not found for language "${lang}".`);
        }
    });

    document.querySelectorAll('[data-lang-key-aria-label]').forEach(element => {
        const key = element.getAttribute('data-lang-key-aria-label');
        if (translations[lang][key]) {
            element.setAttribute('aria-label', translations[lang][key]);
        } else {
            console.warn(`Aria-label key "${key}" not found for language "${lang}".`);
        }
    });

    // Special case for page title
    if (translations[lang].pageTitle) {
        document.title = translations[lang].pageTitle;
    }

    // Update aria-labels for new widgets
    const whatsAppWidget = document.querySelector('.whatsapp-widget');
    if (whatsAppWidget && translations[lang].widgetWhatsAppAriaLabel) {
        whatsAppWidget.setAttribute('aria-label', translations[lang].widgetWhatsAppAriaLabel);
    }

    const telegramWidget = document.querySelector('.telegram-widget');
    if (telegramWidget && translations[lang].widgetTelegramAriaLabel) {
        telegramWidget.setAttribute('aria-label', translations[lang].widgetTelegramAriaLabel);
    }

    // Update nav links with data-lang-key if not already covered by general selector
    // (The general selector should cover them if data-lang-key is applied correctly in HTML)
    // Example for nav logo if it's a special case (it is covered if using data-lang-key)
    const navLogoElement = document.querySelector('.nav-logo');
    if (navLogoElement && translations[lang].navLogo) {
        navLogoElement.textContent = translations[lang].navLogo; // Or use data-lang-key directly
    }
    const navHomeElement = document.querySelector('a[href="#hero"].nav-link');
    if (navHomeElement && translations[lang].navHome) {
        navHomeElement.textContent = translations[lang].navHome;
    }
    const navPortfolioElement = document.querySelector('a[href="#portfolio"].nav-link');
    if (navPortfolioElement && translations[lang].navPortfolio) {
        navPortfolioElement.textContent = translations[lang].navPortfolio;
    }
    const navAboutElement = document.querySelector('a[href="#about"].nav-link');
    if (navAboutElement && translations[lang].navAbout) {
        navAboutElement.textContent = translations[lang].navAbout;
    }
    // navContact is already handled by data-lang-key in the HTML edit

}

if (languageSelect) {
    languageSelect.addEventListener('change', (event) => {
        setLanguage(event.target.value);
    });
}

// New Flying Flyers Animation Functionality
function initFlyingFlyersAnimation() {
    const flyerContainer = document.querySelector('.hero-background-slideshow');
    const heroSection = document.querySelector('.hero-section');

    if (!heroSection || !flyerContainer) return;

    let flyers = Array.from(flyerContainer.querySelectorAll('.hero-slide-image'));
    const initialFlyerCount = flyers.length;
    if (initialFlyerCount === 0) return;

    const desiredFlyerCount = 18; // Target total flyers
    let currentTotalFlyers = initialFlyerCount;

    if (initialFlyerCount > 0 && currentTotalFlyers < desiredFlyerCount) {
        for (let i = 0; i < desiredFlyerCount - initialFlyerCount; i++) {
            const originalFlyerIndex = i % initialFlyerCount;
            const clonedFlyer = flyers[originalFlyerIndex].cloneNode(true);
            // Remove .active class if cloning from an active state (though not used now)
            clonedFlyer.classList.remove('active'); 
            flyerContainer.appendChild(clonedFlyer);
        }
        // Update the flyers NodeList to include cloned elements
        flyers = Array.from(flyerContainer.querySelectorAll('.hero-slide-image'));
    }

    const heroWidth = heroSection.offsetWidth;
    const heroHeight = heroSection.offsetHeight;

    flyers.forEach(flyer => {
        // Random initial position within hero section (leaving some margin)
        const flyerWidth = flyer.offsetWidth || 150; // Approx width if not rendered yet
        const flyerHeight = flyer.offsetHeight || 150; // Approx height

        flyer.style.top = Math.random() * (heroHeight - flyerHeight * 1.5) + 'px'; // *1.5 to keep it more centered
        flyer.style.left = Math.random() * (heroWidth - flyerWidth * 1.5) + 'px';

        // Random animation duration and delay
        flyer.style.animationDuration = (Math.random() * 8 + 7) + 's'; // 7-15 seconds
        flyer.style.animationDelay = (Math.random() * 5) + 's'; // 0-5 seconds delay

        // Randomize CSS variables for animation variety
        flyer.style.setProperty('--current-rotate', (Math.random() * 30 - 15) + 'deg'); // -15 to +15 deg
        flyer.style.setProperty('--current-scale', (Math.random() * 0.2 + 0.5)); // Scale between 0.5 and 0.7
        
        // Randomize flight path modifiers for flyAround keyframes
        const xSign = Math.random() < 0.5 ? -1 : 1;
        const ySign = Math.random() < 0.5 ? -1 : 1;
        flyer.style.setProperty('--fly-x-25', (Math.random() * 20 + 10) * xSign + 'px');
        flyer.style.setProperty('--fly-y-25', (Math.random() * 20 + 10) * ySign + 'px');
        flyer.style.setProperty('--fly-x-50', (Math.random() * 20 + 10) * -xSign + 'px');
        flyer.style.setProperty('--fly-y-50', (Math.random() * 20 + 10) * ySign + 'px');
        flyer.style.setProperty('--fly-x-75', (Math.random() * 20 + 10) * xSign + 'px');
        flyer.style.setProperty('--fly-y-75', (Math.random() * 20 + 10) * -ySign + 'px');
    });
}

// Function to handle animation on scroll
function initAnimateOnScroll() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    // Setup flyer grid items animation
    const flyerItems = document.querySelectorAll('.flyer-grid-item');
    flyerItems.forEach((item, index) => {
        // Acak rotasi awal untuk efek dinamis
        const randomRotation = Math.random() * 20 - 10; // -10 to +10 degrees
        item.style.setProperty('--random-rotate', `${randomRotation}deg`);
        
        // Set indeks untuk animasi bertahap
        item.style.setProperty('--item-index', index);
        
        // Randomize trajectory paths untuk efek roket menuju target
        const xOffset = Math.random() * 200 - 100; // -100px to +100px
        const yOffset = Math.random() * 50 + 100; // 100px to 150px
        
        // Gunakan custom properties untuk trajectory
        item.style.setProperty('--x-offset', `${xOffset}px`);
        item.style.setProperty('--y-offset', `${yOffset}px`);
    });
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    };
    
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    };
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        animatedElements.forEach(element => {
            element.classList.add('is-visible');
        });
    }
}

// Custom interactive cursor functionality
function initCustomCursor() {
    // Create cursor elements
    const cursorOuter = document.createElement('div');
    cursorOuter.className = 'custom-cursor';
    document.body.appendChild(cursorOuter);
    
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorDot);
    
    // Mouse move event to update cursor position
    document.addEventListener('mousemove', (e) => {
        cursorOuter.style.top = e.clientY + 'px';
        cursorOuter.style.left = e.clientX + 'px';
        
        // Add a slight delay to the dot for smooth following effect
        setTimeout(() => {
            cursorDot.style.top = e.clientY + 'px';
            cursorDot.style.left = e.clientX + 'px';
        }, 50);
    });
    
    // Add interactive effects for hover states
    const interactiveElements = document.querySelectorAll('.flyer-image-container, .about-photo, .cta-button, .nav-link, .hamburger, .theme-toggle-label, .widget-link, .modal-nav-button, .modal-close-button, button, input, textarea, select');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursorOuter.classList.add('cursor-hover');
            cursorOuter.style.width = '40px';
            cursorOuter.style.height = '40px';
            cursorOuter.style.backgroundColor = 'rgba(var(--primary-color-rgb), 0.15)';
            cursorDot.style.width = '8px';
            cursorDot.style.height = '8px';
        });
        
        element.addEventListener('mouseleave', () => {
            cursorOuter.classList.remove('cursor-hover');
            cursorOuter.style.width = '20px';
            cursorOuter.style.height = '20px';
            cursorOuter.style.backgroundColor = 'rgba(var(--primary-color-rgb), 0.3)';
            cursorDot.style.width = '6px';
            cursorDot.style.height = '6px';
        });
    });
    
    // Add click animation
    document.addEventListener('mousedown', () => {
        cursorOuter.style.transform = 'translate(-50%, -50%) scale(0.9)';
        cursorDot.style.transform = 'translate(-50%, -50%) scale(0.9)';
    });
    
    document.addEventListener('mouseup', () => {
        cursorOuter.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
    });
    
    // Special handling for flyer images and gallery
    const flyerImages = document.querySelectorAll('.flyer-image-container');
    flyerImages.forEach(image => {
        image.addEventListener('mouseenter', () => {
            cursorOuter.innerHTML = '<span style="font-size: 12px; color: white;">View</span>';
            cursorOuter.style.display = 'flex';
            cursorOuter.style.alignItems = 'center';
            cursorOuter.style.justifyContent = 'center';
        });
        
        image.addEventListener('mouseleave', () => {
            cursorOuter.innerHTML = '';
        });
    });
    
    // Fallback for mobile devices
    if ('ontouchstart' in window) {
        cursorOuter.style.display = 'none';
        cursorDot.style.display = 'none';
        document.body.style.cursor = 'auto';
        
        document.querySelectorAll('.flyer-image-container, .about-photo, .cta-button, .nav-link, .hamburger, .theme-toggle-label, .widget-link, .modal-nav-button, .modal-close-button, button').forEach(el => {
            el.style.cursor = 'pointer';
        });
    }
}

// Custom right-click context menu
function initCustomContextMenu() {
    const contextMenu = document.getElementById('custom-context-menu');
    
    if (!contextMenu) return;
    
    // Show custom context menu on right click
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault(); // Prevent default browser context menu
        
        // Calculate position to ensure menu stays within viewport
        let x = e.clientX;
        let y = e.clientY;
        
        // Menu width and height
        const menuWidth = 180;
        const menuHeight = 130; // Approximate height
        
        // Viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Adjust position if menu would go off screen
        if (x + menuWidth > viewportWidth) {
            x = viewportWidth - menuWidth - 10;
        }
        
        if (y + menuHeight > viewportHeight) {
            y = viewportHeight - menuHeight - 10;
        }
        
        // Position and show the menu
        contextMenu.style.left = `${x}px`;
        contextMenu.style.top = `${y}px`;
        contextMenu.classList.add('visible');
        
        // Add pulsing animation to the context menu for attention
        contextMenu.style.animation = 'none';
        setTimeout(() => {
            contextMenu.style.animation = 'menuPulse 0.5s ease-out';
        }, 10);
    });
    
    // Hide context menu when clicking elsewhere
    document.addEventListener('click', () => {
        contextMenu.classList.remove('visible');
    });
    
    // Hide context menu when pressing escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            contextMenu.classList.remove('visible');
        }
    });
    
    // Hide context menu when scrolling
    document.addEventListener('scroll', () => {
        contextMenu.classList.remove('visible');
    });
    
    // Add context menu interactions
    const whatsappItem = contextMenu.querySelector('.whatsapp-item');
    const telegramItem = contextMenu.querySelector('.telegram-item');
    
    if (whatsappItem) {
        whatsappItem.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent the click from closing the menu prematurely
            
            // Add visual feedback on click
            whatsappItem.style.backgroundColor = 'rgba(37, 211, 102, 0.2)';
            setTimeout(() => {
                window.open('https://wa.me/6287730569181', '_blank');
                contextMenu.classList.remove('visible');
            }, 150);
        });
    }
    
    if (telegramItem) {
        telegramItem.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent the click from closing the menu prematurely
            
            // Add visual feedback on click
            telegramItem.style.backgroundColor = 'rgba(0, 136, 204, 0.2)';
            setTimeout(() => {
                window.open('https://t.me/jojopunyaini', '_blank');
                contextMenu.classList.remove('visible');
            }, 150);
        });
    }
}

// Load client logos from the images/client folder
function loadClientLogos() {
    const clientsGrid = document.querySelector('.clients-grid');
    console.log("Loading client logos, clientsGrid found:", clientsGrid !== null);
    
    if (!clientsGrid) return;
    
    clientsGrid.innerHTML = '';
    
    const logoCount = 6;
    console.log(`Will load ${logoCount} client logos`);
    
    for (let i = 1; i <= logoCount; i++) {
        const clientItem = document.createElement('div');
        clientItem.className = 'client-item';
        
        // JavaScript styling for clientItem is minimized as CSS handles most of it.
        // Specific background/border-radius for items 2 & 6 are handled by CSS.
        
        const clientImg = document.createElement('img');
        clientImg.src = `images/client/${i}.png`;
        clientImg.alt = `Client Logo ${i}`;
        clientImg.className = 'client-logo';
        
        clientItem.appendChild(clientImg);
        clientsGrid.appendChild(clientItem);
    }
    
    console.log("Client logos loading complete");
} 