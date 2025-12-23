// Component Loader Utility
class ComponentLoader {
    constructor() {
        this.loadedComponents = new Set();
    }

    async loadComponent(elementId, componentPath) {
        try {
            const response = await fetch(componentPath);
            if (!response.ok) {
                throw new Error(`Failed to load component: ${componentPath}`);
            }
            const html = await response.text();
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = html;
                this.loadedComponents.add(elementId);
                return true;
            }
        } catch (error) {
            console.warn(`Could not load component ${componentPath}:`, error);
            // Fallback to inline content if component loading fails
            return false;
        }
    }

    async loadHeader() {
        const loaded = await this.loadComponent('header-placeholder', 'components/header.html');
        if (loaded) {
            this.initializeHeader();
        }
    }

    async loadFooter() {
        await this.loadComponent('footer-placeholder', 'components/footer.html');
    }

    initializeHeader() {
        // Update active navigation link based on current page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            
            if (href === currentPage || 
                (currentPage === 'index.html' && href === 'index.html') ||
                (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            }
        });

        // Update auth button based on user state
        this.updateAuthButton();
        
        // Initialize theme system after header is loaded
        this.initializeThemeSystem();
    }

    initializeThemeSystem() {
        // Always create a fresh theme manager to ensure proper initialization
        this.createSimpleThemeManager();
        
        console.log('Theme system initialized with controls:', {
            themeToggle: !!document.getElementById('themeToggle'),
            colorTheme: !!document.getElementById('colorTheme')
        });
    }

    createSimpleThemeManager() {
        window.themeManager = {
            currentTheme: localStorage.getItem('theme') || 'light',
            currentColorTheme: localStorage.getItem('colorTheme') || 'default',
            
            init() {
                console.log('Initializing theme manager...');
                this.applyTheme();
                // Use setTimeout to ensure DOM is fully ready
                setTimeout(() => {
                    this.setupEventListeners();
                }, 100);
            },
            
            applyTheme() {
                console.log('Applying theme:', this.currentTheme, this.currentColorTheme);
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
            },
            
            toggleTheme() {
                this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
                localStorage.setItem('theme', this.currentTheme);
                this.applyTheme();
                console.log('Theme toggled to:', this.currentTheme);
            },
            
            setColorTheme(theme) {
                this.currentColorTheme = theme;
                localStorage.setItem('colorTheme', theme);
                this.applyTheme();
                console.log('Color theme changed to:', theme);
            },
            
            setupEventListeners() {
                const themeToggle = document.getElementById('themeToggle');
                const colorThemeSelect = document.getElementById('colorTheme');

                console.log('Setting up theme event listeners...', {
                    themeToggle: !!themeToggle,
                    colorThemeSelect: !!colorThemeSelect
                });

                if (themeToggle) {
                    // Remove any existing event listeners by cloning the element
                    const newThemeToggle = themeToggle.cloneNode(true);
                    themeToggle.parentNode.replaceChild(newThemeToggle, themeToggle);
                    
                    newThemeToggle.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.toggleTheme();
                    });
                    
                    console.log('Theme toggle listener attached');
                }

                if (colorThemeSelect) {
                    // Remove any existing event listeners by cloning the element
                    const newColorThemeSelect = colorThemeSelect.cloneNode(true);
                    colorThemeSelect.parentNode.replaceChild(newColorThemeSelect, colorThemeSelect);
                    
                    newColorThemeSelect.addEventListener('change', (e) => {
                        this.setColorTheme(e.target.value);
                    });
                    
                    console.log('Color theme selector listener attached');
                }
            }
        };
        
        // Initialize immediately
        window.themeManager.init();
    }

    updateAuthButton() {
        const authButton = document.getElementById('authButton');
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
        
        if (authButton) {
            if (currentUser) {
                authButton.textContent = 'Profile';
                authButton.href = 'profile.html';
                authButton.classList.remove('btn-primary');
                authButton.classList.add('btn-secondary');
            } else {
                authButton.textContent = 'Sign In';
                authButton.href = 'signin.html';
                authButton.classList.remove('btn-secondary');
                authButton.classList.add('btn-primary');
            }
        }
    }

    async loadAllComponents() {
        await Promise.all([
            this.loadHeader(),
            this.loadFooter()
        ]);
        
        // Initialize other managers after components are loaded
        this.initializeOtherManagers();
    }

    initializeOtherManagers() {
        // Call the global initialization function if it exists
        if (typeof initializeManagers === 'function') {
            initializeManagers();
        } else {
            // Fallback: Initialize managers directly
            if (typeof CartManager !== 'undefined' && !window.cartManager) {
                window.cartManager = new CartManager();
            }
            
            if (typeof NavigationManager !== 'undefined' && !window.navigationManager) {
                window.navigationManager = new NavigationManager();
            }
            
            if (typeof ScrollAnimations !== 'undefined' && !window.scrollAnimations) {
                window.scrollAnimations = new ScrollAnimations();
            }
        }
    }
}

// Initialize component loader
const componentLoader = new ComponentLoader();

// Load components when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    await componentLoader.loadAllComponents();
    
    console.log('Components loaded successfully!');
});

// Fallback inline header and footer for when component loading fails
function createFallbackHeader() {
    return `
        <nav class="navbar">
            <div class="nav-container">
                <div class="nav-logo">
                    <a href="index.html"><h2>Savory</h2></a>
                </div>
                <ul class="nav-menu">
                    <li><a href="index.html" class="nav-link">Home</a></li>
                    <li><a href="menu.html" class="nav-link">Menu</a></li>
                    <li><a href="index.html#about" class="nav-link">About</a></li>
                    <li><a href="index.html#contact" class="nav-link">Contact</a></li>
                    <li><a href="profile.html" class="nav-link">Profile</a></li>
                </ul>
                <div class="nav-controls">
                    <div class="theme-controls">
                        <select id="colorTheme" class="theme-selector">
                            <option value="default">Default</option>
                            <option value="warm">Warm</option>
                            <option value="cool">Cool</option>
                            <option value="elegant">Elegant</option>
                        </select>
                        <button id="themeToggle" class="theme-toggle">
                            <i class="fas fa-moon"></i>
                        </button>
                    </div>
                    <a href="signin.html" class="btn btn-primary" id="authButton">Sign In</a>
                </div>
                <div class="hamburger">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </nav>
    `;
}

function createFallbackFooter() {
    return `
        <footer class="footer">
            <div class="container">
                <div class="footer-content">
                    <div class="footer-section">
                        <h3>Savory</h3>
                        <p>Your favorite food, delivered fast</p>
                        <div class="social-links">
                            <a href="#" onclick="shareOnFacebook()"><i class="fab fa-facebook"></i></a>
                            <a href="#" onclick="shareOnTwitter()"><i class="fab fa-twitter"></i></a>
                            <a href="#" onclick="shareOnInstagram()"><i class="fab fa-instagram"></i></a>
                        </div>
                    </div>
                    <div class="footer-section">
                        <h4>Company</h4>
                        <ul>
                            <li><a href="index.html#about">About Us</a></li>
                            <li><a href="#careers">Careers</a></li>
                            <li><a href="#press">Press</a></li>
                            <li><a href="#blog">Blog</a></li>
                        </ul>
                    </div>
                    <div class="footer-section">
                        <h4>Support</h4>
                        <ul>
                            <li><a href="#help">Help Center</a></li>
                            <li><a href="index.html#contact">Contact Us</a></li>
                            <li><a href="#safety">Safety</a></li>
                            <li><a href="#accessibility">Accessibility</a></li>
                        </ul>
                    </div>
                    <div class="footer-section">
                        <h4>Legal</h4>
                        <ul>
                            <li><a href="#terms">Terms of Service</a></li>
                            <li><a href="#privacy">Privacy Policy</a></li>
                            <li><a href="#cookies">Cookie Policy</a></li>
                        </ul>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>&copy; 2024 Savory Restaurant. All rights reserved.</p>
                    <p class="created-by">Created by <a href="https://certifysphere.com/" target="_blank" rel="noopener">CertifySphere</a></p>
                </div>
            </div>
        </footer>
    `;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ComponentLoader };
}