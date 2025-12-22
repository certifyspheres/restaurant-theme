// Authentication Management
class AuthManager {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.init();
    }

    init() {
        this.setupFormHandlers();
        this.setupPasswordStrength();
        this.setupFormValidation();
        this.checkAuthState();
    }

    setupFormHandlers() {
        // Sign In Form
        const signinForm = document.getElementById('signinForm');
        if (signinForm) {
            signinForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSignIn(new FormData(signinForm));
            });
        }

        // Sign Up Form
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSignUp(new FormData(signupForm));
            });
        }
    }

    setupPasswordStrength() {
        const passwordInput = document.getElementById('password');
        const strengthIndicator = document.getElementById('passwordStrength');
        
        if (passwordInput && strengthIndicator) {
            passwordInput.addEventListener('input', (e) => {
                this.updatePasswordStrength(e.target.value, strengthIndicator);
            });
        }
    }

    updatePasswordStrength(password, indicator) {
        const strengthFill = indicator.querySelector('.strength-fill');
        const strengthText = indicator.querySelector('.strength-text');
        
        if (!strengthFill || !strengthText) return;

        const strength = this.calculatePasswordStrength(password);
        
        // Remove existing classes
        strengthFill.className = 'strength-fill';
        
        if (password.length === 0) {
            strengthText.textContent = 'Password strength';
            return;
        }

        switch (strength.level) {
            case 1:
                strengthFill.classList.add('weak');
                strengthText.textContent = 'Weak password';
                break;
            case 2:
                strengthFill.classList.add('fair');
                strengthText.textContent = 'Fair password';
                break;
            case 3:
                strengthFill.classList.add('good');
                strengthText.textContent = 'Good password';
                break;
            case 4:
                strengthFill.classList.add('strong');
                strengthText.textContent = 'Strong password';
                break;
        }
    }

    calculatePasswordStrength(password) {
        let score = 0;
        const checks = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            numbers: /\d/.test(password),
            symbols: /[^A-Za-z0-9]/.test(password)
        };

        // Calculate score
        Object.values(checks).forEach(check => {
            if (check) score++;
        });

        return {
            score,
            level: Math.min(4, Math.max(1, score - 1)),
            checks
        };
    }

    setupFormValidation() {
        // Real-time validation
        const inputs = document.querySelectorAll('input[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });

        // Password confirmation validation
        const confirmPassword = document.getElementById('confirmPassword');
        const password = document.getElementById('password');
        
        if (confirmPassword && password) {
            confirmPassword.addEventListener('input', () => {
                this.validatePasswordMatch(password, confirmPassword);
            });
        }
    }

    validateField(input) {
        const value = input.value.trim();
        let isValid = true;
        let message = '';

        // Required field validation
        if (input.hasAttribute('required') && !value) {
            isValid = false;
            message = 'This field is required';
        }

        // Email validation
        if (input.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                message = 'Please enter a valid email address';
            }
        }

        // Password validation
        if (input.type === 'password' && input.id === 'password' && value) {
            const strength = this.calculatePasswordStrength(value);
            if (strength.level < 2) {
                isValid = false;
                message = 'Password is too weak';
            }
        }

        // Phone validation
        if (input.type === 'tel' && value) {
            const phoneRegex = /^\(\d{3}\)\s\d{3}-\d{4}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                message = 'Please enter a valid phone number';
            }
        }

        if (isValid) {
            this.showFieldSuccess(input);
        } else {
            this.showFieldError(input, message);
        }

        return isValid;
    }

    validatePasswordMatch(password, confirmPassword) {
        if (confirmPassword.value && password.value !== confirmPassword.value) {
            this.showFieldError(confirmPassword, 'Passwords do not match');
            return false;
        } else if (confirmPassword.value) {
            this.showFieldSuccess(confirmPassword);
            return true;
        }
        return true;
    }

    showFieldError(input, message) {
        this.clearFieldMessages(input);
        
        const formGroup = input.closest('.form-group');
        formGroup.classList.add('error');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        formGroup.appendChild(errorDiv);
    }

    showFieldSuccess(input) {
        this.clearFieldMessages(input);
        
        const formGroup = input.closest('.form-group');
        formGroup.classList.add('success');
    }

    clearFieldError(input) {
        this.clearFieldMessages(input);
    }

    clearFieldMessages(input) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.remove('error', 'success');
        
        const existingMessage = formGroup.querySelector('.error-message, .success-message');
        if (existingMessage) {
            existingMessage.remove();
        }
    }

    async handleSignIn(formData) {
        const email = formData.get('email');
        const password = formData.get('password');
        const rememberMe = formData.get('rememberMe');

        // Validate form
        if (!this.validateSignInForm(email, password)) {
            return;
        }

        this.showLoading('Signing you in...');

        try {
            // Simulate API call
            await this.simulateApiCall();
            
            // Create user session
            const user = {
                id: Date.now(),
                email: email,
                firstName: 'John',
                lastName: 'Doe',
                loginTime: new Date().toISOString(),
                rememberMe: !!rememberMe
            };

            this.setCurrentUser(user);
            this.hideLoading();
            this.showSuccessMessage('Welcome back! Redirecting...');
            
            // Redirect after success
            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 1500);

        } catch (error) {
            this.hideLoading();
            this.showErrorMessage('Invalid email or password. Please try again.');
        }
    }

    async handleSignUp(formData) {
        const firstName = formData.get('firstName');
        const lastName = formData.get('lastName');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        const agreeTerms = formData.get('agreeTerms');
        const newsletter = formData.get('newsletter');

        // Validate form
        if (!this.validateSignUpForm(formData)) {
            return;
        }

        this.showLoading('Creating your account...');

        try {
            // Simulate API call
            await this.simulateApiCall();
            
            // Create user
            const user = {
                id: Date.now(),
                firstName,
                lastName,
                email,
                phone,
                joinDate: new Date().toISOString(),
                newsletter: !!newsletter,
                preferences: {
                    theme: 'light',
                    colorTheme: 'default'
                }
            };

            this.setCurrentUser(user);
            this.hideLoading();
            this.showSuccessMessage('Account created successfully! Welcome to Savory!');
            
            // Redirect after success
            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 1500);

        } catch (error) {
            this.hideLoading();
            this.showErrorMessage('Failed to create account. Please try again.');
        }
    }

    validateSignInForm(email, password) {
        let isValid = true;

        // Validate email
        const emailInput = document.getElementById('email');
        if (!email || !this.validateField(emailInput)) {
            isValid = false;
        }

        // Validate password
        const passwordInput = document.getElementById('password');
        if (!password || !this.validateField(passwordInput)) {
            isValid = false;
        }

        return isValid;
    }

    validateSignUpForm(formData) {
        let isValid = true;
        const requiredFields = ['firstName', 'lastName', 'email', 'password', 'confirmPassword'];
        
        // Validate required fields
        requiredFields.forEach(fieldName => {
            const input = document.getElementById(fieldName);
            if (input && !this.validateField(input)) {
                isValid = false;
            }
        });

        // Check password match
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');
        if (!this.validatePasswordMatch(password, confirmPassword)) {
            isValid = false;
        }

        // Check terms agreement
        const agreeTerms = document.getElementById('agreeTerms');
        if (!agreeTerms.checked) {
            this.showErrorMessage('You must agree to the Terms of Service and Privacy Policy');
            isValid = false;
        }

        return isValid;
    }

    setCurrentUser(user) {
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Update UI if needed
        this.updateAuthUI();
    }

    getCurrentUser() {
        return this.currentUser;
    }

    signOut() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.updateAuthUI();
        window.location.href = 'index.html';
    }

    checkAuthState() {
        // Update UI based on auth state
        this.updateAuthUI();
    }

    updateAuthUI() {
        const signInButton = document.querySelector('a[href="signin.html"]');
        
        if (this.currentUser && signInButton) {
            signInButton.textContent = 'Profile';
            signInButton.href = 'profile.html';
        }
    }

    async simulateApiCall() {
        // Simulate network delay
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 90% success rate
                if (Math.random() > 0.1) {
                    resolve();
                } else {
                    reject(new Error('API Error'));
                }
            }, 1500);
        });
    }

    showLoading(message) {
        const overlay = document.getElementById('loadingOverlay');
        const loadingText = overlay.querySelector('p');
        
        if (loadingText) {
            loadingText.textContent = message;
        }
        
        overlay.classList.add('show');
    }

    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        overlay.classList.remove('show');
    }

    showSuccessMessage(message) {
        this.showNotification(message, 'success');
    }

    showErrorMessage(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'error' ? 'var(--accent-color)' : type === 'success' ? '#27ae60' : 'var(--primary-color)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-md);
            box-shadow: 0 4px 20px var(--shadow);
            z-index: 1002;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
}

// Social Authentication Functions
function signInWithGoogle() {
    showSocialAuthMessage('Google');
}

function signInWithFacebook() {
    showSocialAuthMessage('Facebook');
}

function signInWithApple() {
    showSocialAuthMessage('Apple');
}

function signUpWithGoogle() {
    showSocialAuthMessage('Google', 'sign up');
}

function signUpWithFacebook() {
    showSocialAuthMessage('Facebook', 'sign up');
}

function signUpWithApple() {
    showSocialAuthMessage('Apple', 'sign up');
}

function showSocialAuthMessage(provider, action = 'sign in') {
    alert(`${provider} ${action} would be implemented here. This is a demo version.`);
}

// Password Toggle Function
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.parentNode.querySelector('.password-toggle');
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

// Phone Number Formatting
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length >= 6) {
        value = `(${value.substring(0, 3)}) ${value.substring(3, 6)}-${value.substring(6, 10)}`;
    } else if (value.length >= 3) {
        value = `(${value.substring(0, 3)}) ${value.substring(3)}`;
    }
    
    input.value = value;
}

// Initialize authentication when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
    
    // Setup phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', () => {
            formatPhoneNumber(phoneInput);
        });
    }
    
    console.log('Authentication system initialized successfully!');
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AuthManager
    };
}