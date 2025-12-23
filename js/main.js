// Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.currentColorTheme = localStorage.getItem('colorTheme') || 'default';
        // Don't auto-initialize - wait for proper call
    }

    init() {
        this.applyTheme();
        this.setupEventListeners();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        document.documentElement.setAttribute('data-color-theme', this.currentColorTheme);
        
        const themeToggle = document.getElementById('themeToggle');
        const colorThemeSelect = document.getElementById('colorTheme');
        
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = this.currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        }
        
        if (colorThemeSelect) {
            colorThemeSelect.value = this.currentColorTheme;
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.currentTheme);
        this.applyTheme();
    }

    setColorTheme(theme) {
        this.currentColorTheme = theme;
        localStorage.setItem('colorTheme', theme);
        this.applyTheme();
    }

    setupEventListeners() {
        const themeToggle = document.getElementById('themeToggle');
        const colorThemeSelect = document.getElementById('colorTheme');

        if (themeToggle) {
            // Remove existing listeners to prevent duplicates
            themeToggle.replaceWith(themeToggle.cloneNode(true));
            const newThemeToggle = document.getElementById('themeToggle');
            newThemeToggle.addEventListener('click', () => this.toggleTheme());
        }

        if (colorThemeSelect) {
            // Remove existing listeners to prevent duplicates
            colorThemeSelect.replaceWith(colorThemeSelect.cloneNode(true));
            const newColorThemeSelect = document.getElementById('colorTheme');
            newColorThemeSelect.addEventListener('change', (e) => {
                this.setColorTheme(e.target.value);
            });
        }
    }
}

// Cart Management
class CartManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.init();
    }

    init() {
        this.updateCartDisplay();
        this.setupEventListeners();
    }

    addItem(name, price) {
        const existingItem = this.cart.find(item => item.name === name);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                name,
                price: parseFloat(price),
                quantity: 1
            });
        }
        
        this.saveCart();
        this.updateCartDisplay();
        this.showNotification(`${name} added to cart!`);
    }

    removeItem(name) {
        this.cart = this.cart.filter(item => item.name !== name);
        this.saveCart();
        this.updateCartDisplay();
    }

    updateQuantity(name, quantity) {
        const item = this.cart.find(item => item.name === name);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(name);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.updateCartDisplay();
            }
        }
    }

    getTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getItemCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    updateCartDisplay() {
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        const cartCount = document.getElementById('cartCount');

        if (cartCount) {
            cartCount.textContent = this.getItemCount();
        }

        if (cartTotal) {
            cartTotal.textContent = this.getTotal().toFixed(2);
        }

        if (cartItems) {
            cartItems.innerHTML = '';
            
            if (this.cart.length === 0) {
                cartItems.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Your cart is empty</p>';
                return;
            }

            this.cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>$${item.price.toFixed(2)} each</p>
                    </div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="cartManager.updateQuantity('${item.name}', ${item.quantity - 1})">-</button>
                        <span style="margin: 0 10px; color: var(--text-primary);">${item.quantity}</span>
                        <button class="quantity-btn" onclick="cartManager.updateQuantity('${item.name}', ${item.quantity + 1})">+</button>
                    </div>
                `;
                cartItems.appendChild(cartItem);
            });
        }
    }

    setupEventListeners() {
        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart')) {
                const name = e.target.getAttribute('data-item');
                const price = e.target.getAttribute('data-price');
                this.addItem(name, price);
            }
        });

        // Cart toggle
        const cartToggle = document.getElementById('cartToggle');
        const cartSidebar = document.getElementById('cartSidebar');
        const closeCart = document.getElementById('closeCart');

        if (cartToggle && cartSidebar) {
            cartToggle.addEventListener('click', () => {
                cartSidebar.classList.toggle('open');
            });
        }

        if (closeCart && cartSidebar) {
            closeCart.addEventListener('click', () => {
                cartSidebar.classList.remove('open');
            });
        }

        // Close cart when clicking outside
        document.addEventListener('click', (e) => {
            if (cartSidebar && cartSidebar.classList.contains('open')) {
                if (!cartSidebar.contains(e.target) && !cartToggle.contains(e.target)) {
                    cartSidebar.classList.remove('open');
                }
            }
        });
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-md);
            box-shadow: 0 4px 20px var(--shadow);
            z-index: 1002;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Navigation Management
class NavigationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupSmoothScrolling();
        this.setupMobileMenu();
        this.setupScrollEffects();
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }
    }

    setupScrollEffects() {
        const navbar = document.querySelector('.navbar');
        let lastScrollTop = 0;

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (navbar) {
                if (scrollTop > lastScrollTop && scrollTop > 100) {
                    // Scrolling down
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    // Scrolling up
                    navbar.style.transform = 'translateY(0)';
                }
            }
            
            lastScrollTop = scrollTop;
        });
    }
}

// Social Media Sharing
function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Check out Savory Restaurant - Experience Culinary Excellence!');
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank', 'width=600,height=400');
}

function shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Check out Savory Restaurant - Experience Culinary Excellence! 🍽️');
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'width=600,height=400');
}

function shareOnInstagram() {
    // Instagram doesn't support direct URL sharing, so we'll copy to clipboard
    navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Link copied to clipboard! You can now paste it in your Instagram post or story.');
    });
}

function shareOnLinkedIn() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('Savory Restaurant');
    const summary = encodeURIComponent('Experience Culinary Excellence at Savory Restaurant');
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${summary}`, '_blank', 'width=600,height=400');
}

// Homepage Functions
function findRestaurants() {
    const address = document.getElementById('deliveryAddress').value;
    if (address.trim()) {
        // Simulate finding restaurants
        alert(`Finding restaurants near "${address}"... This would redirect to restaurant listings.`);
        // In a real app, this would redirect to a restaurants page with the address
        window.location.href = 'menu.html';
    } else {
        alert('Please enter your delivery address');
    }
}

function searchFood(category) {
    // Simulate food category search
    alert(`Searching for ${category} restaurants... This would show filtered results.`);
    // In a real app, this would redirect to menu page with category filter
    window.location.href = `menu.html?category=${category}`;
}

function toggleFavorite(button) {
    const icon = button.querySelector('i');
    if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        button.classList.add('active');
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        button.classList.remove('active');
    }
}

// Animation on Scroll
class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements that should animate
        document.querySelectorAll('.menu-item, .stat, .contact-item').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Apply theme immediately to prevent flash
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedColorTheme = localStorage.getItem('colorTheme') || 'default';
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.documentElement.setAttribute('data-color-theme', savedColorTheme);
    
    console.log('Main.js loaded - theme applied:', { theme: savedTheme, colorTheme: savedColorTheme });
    
    // Backup theme initialization if components don't load
    setTimeout(() => {
        if (!window.themeManager) {
            console.log('Creating backup theme manager...');
            initializeBackupThemeManager();
        }
    }, 2000);
});

// Backup theme manager for when components fail to load
function initializeBackupThemeManager() {
    const themeToggle = document.getElementById('themeToggle');
    const colorThemeSelect = document.getElementById('colorTheme');
    
    if (themeToggle || colorThemeSelect) {
        window.themeManager = {
            currentTheme: localStorage.getItem('theme') || 'light',
            currentColorTheme: localStorage.getItem('colorTheme') || 'default',
            
            toggleTheme() {
                this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
                localStorage.setItem('theme', this.currentTheme);
                document.documentElement.setAttribute('data-theme', this.currentTheme);
                
                const icon = themeToggle?.querySelector('i');
                if (icon) {
                    icon.className = this.currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
                }
                console.log('Backup theme toggled to:', this.currentTheme);
            },
            
            setColorTheme(theme) {
                this.currentColorTheme = theme;
                localStorage.setItem('colorTheme', theme);
                document.documentElement.setAttribute('data-color-theme', theme);
                console.log('Backup color theme changed to:', theme);
            }
        };
        
        if (themeToggle) {
            themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                window.themeManager.toggleTheme();
            });
        }
        
        if (colorThemeSelect) {
            colorThemeSelect.addEventListener('change', (e) => {
                window.themeManager.setColorTheme(e.target.value);
            });
        }
        
        console.log('Backup theme manager initialized');
    }
}

// Function to initialize managers - called by component loader
function initializeManagers() {
    // Don't create theme manager here - let components.js handle it
    if (!window.cartManager) {
        window.cartManager = new CartManager();
    }
    if (!window.navigationManager) {
        window.navigationManager = new NavigationManager();
    }
    if (!window.scrollAnimations) {
        window.scrollAnimations = new ScrollAnimations();
    }
    
    console.log('Savory Restaurant website initialized successfully!');
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ThemeManager,
        CartManager,
        NavigationManager,
        ScrollAnimations
    };
}