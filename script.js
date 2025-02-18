// DOM Elements
const sidebar = document.getElementById('sidebar');
const openNavBtn = document.getElementById('openNav');
const closeNavBtn = document.getElementById('closeNav');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');

// Toggle sidebar visibility
function toggleNav() {
    if (sidebar) {
        sidebar.classList.toggle('opacity-0');
        sidebar.classList.toggle('invisible');
    }
}

// Event Listeners
openNavBtn?.addEventListener('click', toggleNav);
closeNavBtn?.addEventListener('click', toggleNav);

// Close sidebar when clicking outside
sidebar?.addEventListener('click', (e) => {
    if (e.target === sidebar) {
        toggleNav();
    }
});

// Mobile menu functionality
let mobileMenuVisible = false;
const mobileMenu = document.createElement('div');
mobileMenu.className = 'md:hidden absolute top-16 left-0 w-full bg-gray-900/95 backdrop-blur-lg py-4 px-4 transform transition-all duration-300 ease-in-out mobile-menu-enter';

mobileMenu.innerHTML = `
    <nav class="flex flex-col space-y-4">
        <a href="#" class="text-gray-300 hover:text-white transition px-4 py-2">Home</a>
        <a href="#features" class="text-gray-300 hover:text-white transition px-4 py-2">Features</a>
        <a href="#about" class="text-gray-300 hover:text-white transition px-4 py-2">About</a>
        <a href="#contact" class="text-gray-300 hover:text-white transition px-4 py-2">Contact</a>
    </nav>
`;

mobileMenuBtn?.addEventListener('click', () => {
    if (!mobileMenuVisible) {
        document.body.appendChild(mobileMenu);
        requestAnimationFrame(() => {
            mobileMenu.classList.remove('mobile-menu-enter');
            mobileMenu.classList.add('mobile-menu-enter-active');
        });
    } else {
        mobileMenu.classList.remove('mobile-menu-enter-active');
        mobileMenu.classList.add('mobile-menu-exit');
        setTimeout(() => {
            document.body.removeChild(mobileMenu);
        }, 200);
    }
    mobileMenuVisible = !mobileMenuVisible;
});

// Handle iframe loading
const mapFrame = document.querySelector('iframe');
const loader = document.getElementById('loader');

mapFrame?.addEventListener('load', () => {
    if (loader) {
        loader.style.display = 'none';
    }
    mapFrame.style.opacity = '1';
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (mobileMenuVisible && !e.target.closest('#mobileMenuBtn') && !e.target.closest('.mobile-menu')) {
        mobileMenuBtn?.click();
    }
});

// Keyboard accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (!sidebar?.classList.contains('opacity-0')) {
            toggleNav();
        }
        if (mobileMenuVisible) {
            mobileMenuBtn?.click();
        }
    }
});