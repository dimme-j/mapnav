// DOM Elements
const authForm = document.getElementById('authForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const toggleAuthBtn = document.getElementById('toggleAuth');
const formTitle = document.getElementById('formTitle');
const formSubtitle = document.getElementById('formSubtitle');
const toggleText = document.getElementById('toggleText');
const errorMsg = document.getElementById('errorMsg');

// State
let isLoginMode = true;

// Toggle between login and signup
toggleAuthBtn.addEventListener('click', () => {
    isLoginMode = !isLoginMode;

    // Update UI
    formTitle.textContent = isLoginMode ? 'Welcome Back' : 'Create Account';
    formSubtitle.textContent = isLoginMode ? 'Sign in to continue navigation' : 'Sign up for free navigation';
    toggleText.textContent = isLoginMode ? "Don't have an account?" : 'Already have an account?';
    toggleAuthBtn.textContent = isLoginMode ? 'Sign Up' : 'Sign In';
    errorMsg.classList.add('hidden');
});

// Enhanced email validation with strict checks
function isValidEmail(email) {
    // Basic format check
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        showError('Invalid email format');
        return false;
    }

    const [localPart, domain] = email.split('@');

    // Check local part length
    if (localPart.length > 64 || localPart.length < 3) {
        showError('Email username must be between 3 and 64 characters');
        return false;
    }

    // Check for valid characters in local part
    if (!/^[a-zA-Z0-9].*[a-zA-Z0-9]$/.test(localPart)) {
        showError('Email must start and end with letters or numbers');
        return false;
    }

    // Check domain part
    if (domain.length > 255 || domain.length < 4) {
        showError('Invalid email domain length');
        return false;
    }

    // Validate domain format
    const domainParts = domain.split('.');
    if (domainParts.length < 2) {
        showError('Invalid email domain format');
        return false;
    }

    // Check each domain part
    for (const part of domainParts) {
        if (part.length < 1 || part.length > 63) {
            showError('Invalid domain name format');
            return false;
        }
        if (!/^[a-zA-Z0-9-]+$/.test(part)) {
            showError('Domain contains invalid characters');
            return false;
        }
        if (part.startsWith('-') || part.endsWith('-')) {
            showError('Domain parts cannot start or end with hyphens');
            return false;
        }
    }

    // List of common valid email domains
    const commonDomains = [
        'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
        'aol.com', 'icloud.com', 'protonmail.com', 'mail.com'
    ];

    // Check for common disposable email domains
    const disposableDomains = [
        'tempmail.com', 'throwawaymail.com', 'mailinator.com',
        'temp-mail.org', 'guerrillamail.com', 'sharklasers.com'
    ];

    // If it's a common domain, ensure it's exactly matched
    if (domain.toLowerCase().includes('gmail.com') && domain !== 'gmail.com') {
        showError('Invalid Gmail address format');
        return false;
    }

    // Check for disposable email services
    if (disposableDomains.some(d => domain.toLowerCase().includes(d))) {
        showError('Disposable email addresses are not allowed');
        return false;
    }

    // Additional check for common domain typos
    const commonTypos = {
        'gmail.co': 'gmail.com',
        'gmail.com': 'gmail.com',
        'gamil.com': 'gmail.com',
        'yahoo.co': 'yahoo.com',
        'hotmail.co': 'hotmail.com'
    };

    for (const [typo, correct] of Object.entries(commonTypos)) {
        if (domain.toLowerCase().includes(typo) && domain.toLowerCase() !== correct) {
            showError(`Did you mean ${correct}?`);
            return false;
        }
    }

    // If not a common domain, ensure it follows proper structure
    if (!commonDomains.includes(domain.toLowerCase())) {
        // Check for suspicious patterns
        if (domain.includes('1234') || domain.includes('test') || 
            domain.includes('fake') || domain.includes('example')) {
            showError('Invalid or suspicious email domain');
            return false;
        }

        // Ensure proper TLD length
        const tld = domainParts[domainParts.length - 1];
        if (tld.length < 2 || tld.length > 6) {
            showError('Invalid top-level domain');
            return false;
        }
    }

    return true;
}

// Password strength validation
function isStrongPassword(password) {
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasMinLength) {
        showError('Password must be at least 8 characters long');
        return false;
    }
    if (!hasUppercase || !hasLowercase) {
        showError('Password must contain both uppercase and lowercase letters');
        return false;
    }
    if (!hasNumber) {
        showError('Password must contain at least one number');
        return false;
    }
    if (!hasSpecial) {
        showError('Password must contain at least one special character');
        return false;
    }

    return true;
}

// Form submission
authForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    // Reset error message
    errorMsg.classList.add('hidden');

    // Validate email
    if (!isValidEmail(email)) {
        return; // Error is shown in isValidEmail function
    }

    // Validate password
    if (!isStrongPassword(password)) {
        return; // Error is shown in isStrongPassword function
    }

    // Handle authentication
    if (isLoginMode) {
        handleLogin(email, password);
    } else {
        handleSignup(email, password);
    }
});

// Show error message with animation
function showError(message) {
    errorMsg.textContent = message;
    errorMsg.classList.remove('hidden');
    errorMsg.classList.remove('shake');
    void errorMsg.offsetWidth; // Force reflow
    errorMsg.classList.add('shake');
}

// Handle login
function handleLogin(email, password) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'index.html';
    } else {
        showError('Invalid email or password');
    }
}

// Handle signup
function handleSignup(email, password) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    if (users.some(u => u.email === email)) {
        showError('An account with this email already exists');
        return;
    }

    const newUser = {
        email,
        password,
        createdAt: new Date().toISOString()
    };
    users.push(newUser);

    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    window.location.href = 'index.html';
}


// Function to view stored users
function viewStoredData() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    console.log('All registered users:', users);
    console.log('Current logged-in user:', currentUser);

    // Create a formatted string of user data
    const userList = users.map(user => `Email: ${user.email}, Created: ${user.createdAt}`).join('\n');

    // Show in alert for easy viewing
    alert(`Registered Users:\n${userList}\n\nCurrent User:\n${currentUser ? currentUser.email : 'None'}`);
}

// Function to clear all stored data
function clearStoredData() {
    if (confirm('Are you sure you want to clear all stored user data? This will log out all users.')) {
        localStorage.removeItem('users');
        localStorage.removeItem('currentUser');
        alert('All data cleared. You will be redirected to the login page.');
        window.location.href = 'login.html';
    }
}

// Add buttons to login.html for data management
document.addEventListener('DOMContentLoaded', () => {
    const adminSection = document.createElement('div');
    adminSection.className = 'mt-8 text-center';
    adminSection.innerHTML = `
        <div class="border-t border-gray-600/30 pt-4">
            <p class="text-sm text-gray-400 mb-2">Data Management (Admin)</p>
            <div class="space-x-4">
                <button onclick="viewStoredData()"
                    class="text-sm text-blue-400 hover:text-blue-300 focus:outline-none">
                    View Stored Data
                </button>
                <button onclick="clearStoredData()"
                    class="text-sm text-red-400 hover:text-red-300 focus:outline-none">
                    Clear All Data
                </button>
            </div>
        </div>
    `;

    const authForm = document.getElementById('authForm');
    if (authForm) {
        authForm.parentElement.appendChild(adminSection);
    }
});

// Check if user is already logged in
window.addEventListener('load', () => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        window.location.href = 'index.html';
    }
});