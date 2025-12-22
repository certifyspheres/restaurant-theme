// Menu Page Functionality
class MenuManager {
    constructor() {
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.setupCategoryFilter();
        this.setupSearch();
        this.showAllCategories();
    }

    setupCategoryFilter() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const categories = document.querySelectorAll('.menu-category');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Get selected category
                const selectedCategory = button.getAttribute('data-category');
                this.currentFilter = selectedCategory;
                
                // Show/hide categories
                this.filterCategories(selectedCategory, categories);
            });
        });
    }

    filterCategories(selectedCategory, categories) {
        categories.forEach(category => {
            const categoryType = category.getAttribute('data-category');
            
            if (selectedCategory === 'all' || categoryType === selectedCategory) {
                category.classList.remove('hidden');
                category.classList.add('show');
                
                // Remove show class after animation
                setTimeout(() => {
                    category.classList.remove('show');
                }, 500);
            } else {
                category.classList.add('hidden');
            }
        });
    }

    showAllCategories() {
        const categories = document.querySelectorAll('.menu-category');
        categories.forEach(category => {
            category.classList.remove('hidden');
        });
    }

    setupSearch() {
        // Create search input if it doesn't exist
        const menuSection = document.querySelector('.menu-section .container');
        const categoryFilter = document.querySelector('.category-filter');
        
        if (menuSection && categoryFilter && !document.querySelector('.menu-search')) {
            const searchContainer = document.createElement('div');
            searchContainer.className = 'menu-search';
            searchContainer.innerHTML = `
                <input type="text" class="search-input" placeholder="Search menu items..." id="menuSearch">
                <i class="fas fa-search search-icon"></i>
            `;
            
            menuSection.insertBefore(searchContainer, categoryFilter.nextSibling);
            
            // Setup search functionality
            const searchInput = document.getElementById('menuSearch');
            searchInput.addEventListener('input', (e) => {
                this.searchMenuItems(e.target.value);
            });
        }
    }

    searchMenuItems(searchTerm) {
        const menuItems = document.querySelectorAll('.menu-list-item');
        const categories = document.querySelectorAll('.menu-category');
        
        searchTerm = searchTerm.toLowerCase().trim();
        
        if (searchTerm === '') {
            // Show all items and categories based on current filter
            this.showAllCategories();
            if (this.currentFilter !== 'all') {
                const filterBtn = document.querySelector(`[data-category="${this.currentFilter}"]`);
                if (filterBtn) filterBtn.click();
            }
            return;
        }
        
        // Hide all categories first
        categories.forEach(category => {
            category.classList.add('hidden');
        });
        
        // Show categories that have matching items
        menuItems.forEach(item => {
            const itemName = item.querySelector('h3').textContent.toLowerCase();
            const itemDescription = item.querySelector('p').textContent.toLowerCase();
            const category = item.closest('.menu-category');
            
            if (itemName.includes(searchTerm) || itemDescription.includes(searchTerm)) {
                item.style.display = 'block';
                if (category) {
                    category.classList.remove('hidden');
                }
            } else {
                item.style.display = 'none';
            }
        });
        
        // Hide categories with no visible items
        categories.forEach(category => {
            const visibleItems = category.querySelectorAll('.menu-list-item[style="display: block"], .menu-list-item:not([style*="display: none"])');
            if (visibleItems.length === 0) {
                category.classList.add('hidden');
            }
        });
    }

    addFeaturedItems() {
        // Mark some items as featured (chef's specials)
        const featuredItems = [
            'Signature Burger',
            'Grilled Salmon',
            'Truffle Pizza',
            'Chocolate Lava Cake'
        ];
        
        featuredItems.forEach(itemName => {
            const menuItems = document.querySelectorAll('.menu-list-item');
            menuItems.forEach(item => {
                const title = item.querySelector('h3').textContent;
                if (title === itemName) {
                    item.classList.add('featured');
                }
            });
        });
    }

    addDietaryIcons() {
        // Add dietary restriction icons to menu items
        const dietaryInfo = {
            'Caprese Salad': ['vegetarian'],
            'Stuffed Mushrooms': ['vegetarian'],
            'Truffle Pizza': ['vegetarian'],
            'Pasta Carbonara': ['gluten-free'],
            'Grilled Salmon': ['gluten-free'],
            'Fresh Juice': ['vegan', 'gluten-free']
        };
        
        Object.keys(dietaryInfo).forEach(itemName => {
            const menuItems = document.querySelectorAll('.menu-list-item');
            menuItems.forEach(item => {
                const title = item.querySelector('h3').textContent;
                if (title === itemName) {
                    const description = item.querySelector('p');
                    const iconsContainer = document.createElement('div');
                    iconsContainer.className = 'dietary-icons';
                    
                    dietaryInfo[itemName].forEach(dietary => {
                        const icon = document.createElement('span');
                        icon.className = `dietary-icon ${dietary}`;
                        
                        switch(dietary) {
                            case 'vegetarian':
                                icon.textContent = 'V';
                                icon.title = 'Vegetarian';
                                break;
                            case 'vegan':
                                icon.textContent = 'VG';
                                icon.title = 'Vegan';
                                break;
                            case 'gluten-free':
                                icon.textContent = 'GF';
                                icon.title = 'Gluten Free';
                                break;
                            case 'spicy':
                                icon.innerHTML = '🌶️';
                                icon.title = 'Spicy';
                                break;
                        }
                        
                        iconsContainer.appendChild(icon);
                    });
                    
                    description.appendChild(iconsContainer);
                }
            });
        });
    }
}

// Price Filter Functionality
class PriceFilter {
    constructor() {
        this.minPrice = 0;
        this.maxPrice = 100;
        this.init();
    }

    init() {
        this.createPriceFilter();
        this.setupPriceFilter();
    }

    createPriceFilter() {
        const menuSection = document.querySelector('.menu-section .container');
        const searchContainer = document.querySelector('.menu-search');
        
        if (menuSection && searchContainer && !document.querySelector('.price-filter')) {
            const priceFilterContainer = document.createElement('div');
            priceFilterContainer.className = 'price-filter';
            priceFilterContainer.innerHTML = `
                <span>Price Range:</span>
                <div class="price-range">
                    <span>$</span>
                    <input type="number" class="price-input" id="minPrice" placeholder="Min" min="0" value="0">
                    <span>-</span>
                    <span>$</span>
                    <input type="number" class="price-input" id="maxPrice" placeholder="Max" min="0" value="100">
                </div>
                <button class="btn btn-small" id="applyPriceFilter">Apply</button>
            `;
            
            menuSection.insertBefore(priceFilterContainer, searchContainer.nextSibling);
        }
    }

    setupPriceFilter() {
        const applyButton = document.getElementById('applyPriceFilter');
        const minPriceInput = document.getElementById('minPrice');
        const maxPriceInput = document.getElementById('maxPrice');
        
        if (applyButton && minPriceInput && maxPriceInput) {
            applyButton.addEventListener('click', () => {
                this.minPrice = parseFloat(minPriceInput.value) || 0;
                this.maxPrice = parseFloat(maxPriceInput.value) || 100;
                this.filterByPrice();
            });
            
            // Apply filter on Enter key
            [minPriceInput, maxPriceInput].forEach(input => {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        applyButton.click();
                    }
                });
            });
        }
    }

    filterByPrice() {
        const menuItems = document.querySelectorAll('.menu-list-item');
        const categories = document.querySelectorAll('.menu-category');
        
        // Hide all categories first
        categories.forEach(category => {
            category.classList.add('hidden');
        });
        
        menuItems.forEach(item => {
            const priceText = item.querySelector('.price').textContent;
            const price = parseFloat(priceText.replace('$', ''));
            const category = item.closest('.menu-category');
            
            if (price >= this.minPrice && price <= this.maxPrice) {
                item.style.display = 'block';
                if (category) {
                    category.classList.remove('hidden');
                }
            } else {
                item.style.display = 'none';
            }
        });
        
        // Hide categories with no visible items
        categories.forEach(category => {
            const visibleItems = category.querySelectorAll('.menu-list-item[style="display: block"], .menu-list-item:not([style*="display: none"])');
            if (visibleItems.length === 0) {
                category.classList.add('hidden');
            }
        });
    }
}

// Smooth scrolling for category navigation
function scrollToCategory(categoryId) {
    const category = document.querySelector(`[data-category="${categoryId}"]`);
    if (category) {
        category.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Initialize menu functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.menuManager = new MenuManager();
    window.priceFilter = new PriceFilter();
    
    // Add featured items and dietary icons after a short delay
    setTimeout(() => {
        window.menuManager.addFeaturedItems();
        window.menuManager.addDietaryIcons();
    }, 500);
    
    console.log('Menu page initialized successfully!');
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MenuManager,
        PriceFilter
    };
}