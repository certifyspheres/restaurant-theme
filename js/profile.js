// Profile Page Management
class ProfileManager {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.currentTab = 'orders';
        this.orders = this.generateSampleOrders();
        this.favorites = this.generateSampleFavorites();
        this.addresses = this.generateSampleAddresses();
        this.paymentMethods = this.generateSamplePaymentMethods();
        this.init();
    }

    init() {
        this.checkAuthState();
        this.loadUserProfile();
        this.setupTabNavigation();
        this.loadTabContent();
        this.setupEventListeners();
    }

    checkAuthState() {
        if (!this.currentUser) {
            // Redirect to sign in if not authenticated
            window.location.href = 'signin.html';
            return;
        }
    }

    loadUserProfile() {
        if (!this.currentUser) return;

        // Update profile information
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        const totalOrders = document.getElementById('totalOrders');
        const favoriteItems = document.getElementById('favoriteItems');
        const memberSince = document.getElementById('memberSince');

        if (profileName) {
            profileName.textContent = `${this.currentUser.firstName || 'John'} ${this.currentUser.lastName || 'Doe'}`;
        }
        
        if (profileEmail) {
            profileEmail.textContent = this.currentUser.email || 'john.doe@example.com';
        }
        
        if (totalOrders) {
            totalOrders.textContent = this.orders.length;
        }
        
        if (favoriteItems) {
            favoriteItems.textContent = this.favorites.length;
        }
        
        if (memberSince) {
            const joinDate = new Date(this.currentUser.joinDate || Date.now());
            memberSince.textContent = joinDate.getFullYear();
        }

        // Update form fields
        this.updateFormFields();
    }

    updateFormFields() {
        const firstName = document.getElementById('firstName');
        const lastName = document.getElementById('lastName');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');

        if (firstName) firstName.value = this.currentUser.firstName || 'John';
        if (lastName) lastName.value = this.currentUser.lastName || 'Doe';
        if (email) email.value = this.currentUser.email || 'john.doe@example.com';
        if (phone) phone.value = this.currentUser.phone || '(555) 123-4567';
    }

    setupTabNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const tabId = item.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });
    }

    switchTab(tabId) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabId).classList.add('active');

        this.currentTab = tabId;
        this.loadTabContent();
    }

    loadTabContent() {
        switch (this.currentTab) {
            case 'orders':
                this.loadOrders();
                break;
            case 'favorites':
                this.loadFavorites();
                break;
            case 'addresses':
                this.loadAddresses();
                break;
            case 'payment':
                this.loadPaymentMethods();
                break;
            case 'settings':
                // Settings are loaded statically
                break;
        }
    }

    loadOrders() {
        const ordersList = document.getElementById('ordersList');
        if (!ordersList) return;

        ordersList.innerHTML = '';

        if (this.orders.length === 0) {
            ordersList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-shopping-bag" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 1rem;"></i>
                    <p>No orders yet</p>
                    <a href="menu.html" class="btn btn-primary">Browse Menu</a>
                </div>
            `;
            return;
        }

        this.orders.forEach(order => {
            const orderElement = document.createElement('div');
            orderElement.className = 'order-item';
            orderElement.innerHTML = `
                <div class="order-header">
                    <div class="order-info">
                        <h4>Order #${order.id}</h4>
                        <p>${new Date(order.date).toLocaleDateString()} at ${new Date(order.date).toLocaleTimeString()}</p>
                    </div>
                    <span class="order-status ${order.status}">${order.status}</span>
                </div>
                <div class="order-items">
                    <p>${order.items.join(', ')}</p>
                </div>
                <div class="order-footer">
                    <span class="order-total">$${order.total.toFixed(2)}</span>
                    <div class="order-actions">
                        <button class="btn btn-small btn-secondary" onclick="viewOrderDetails('${order.id}')">View Details</button>
                        ${order.status === 'delivered' ? '<button class="btn btn-small btn-primary" onclick="reorderItems(\'' + order.id + '\')">Reorder</button>' : ''}
                    </div>
                </div>
            `;
            ordersList.appendChild(orderElement);
        });

        // Setup order filters
        this.setupOrderFilters();
    }

    setupOrderFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active filter
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Filter orders
                const filter = button.getAttribute('data-filter');
                this.filterOrders(filter);
            });
        });
    }

    filterOrders(filter) {
        const orderItems = document.querySelectorAll('.order-item');
        orderItems.forEach(item => {
            const status = item.querySelector('.order-status').textContent.toLowerCase();
            if (filter === 'all' || status === filter) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    loadFavorites() {
        const favoritesList = document.getElementById('favoritesList');
        if (!favoritesList) return;

        favoritesList.innerHTML = '';

        if (this.favorites.length === 0) {
            favoritesList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-heart" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 1rem;"></i>
                    <p>No favorite items yet</p>
                    <a href="menu.html" class="btn btn-primary">Browse Menu</a>
                </div>
            `;
            return;
        }

        this.favorites.forEach(item => {
            const favoriteElement = document.createElement('div');
            favoriteElement.className = 'favorite-item';
            favoriteElement.innerHTML = `
                <div class="favorite-image">
                    <i class="fas fa-utensils"></i>
                </div>
                <div class="favorite-content">
                    <h4>${item.name}</h4>
                    <p>${item.description}</p>
                    <div class="favorite-price">$${item.price.toFixed(2)}</div>
                    <div class="favorite-actions">
                        <button class="btn btn-small btn-primary" onclick="addFavoriteToCart('${item.id}')">Add to Cart</button>
                        <button class="btn btn-small btn-secondary" onclick="removeFavorite('${item.id}')">
                            <i class="fas fa-heart-broken"></i>
                        </button>
                    </div>
                </div>
            `;
            favoritesList.appendChild(favoriteElement);
        });
    }

    loadAddresses() {
        const addressesList = document.getElementById('addressesList');
        if (!addressesList) return;

        addressesList.innerHTML = '';

        this.addresses.forEach((address, index) => {
            const addressElement = document.createElement('div');
            addressElement.className = `address-item ${address.isDefault ? 'default' : ''}`;
            addressElement.innerHTML = `
                <div class="address-header">
                    <div class="address-label">
                        <i class="fas fa-map-marker-alt"></i>
                        ${address.label}
                    </div>
                    <div class="address-actions">
                        <button class="btn btn-small btn-secondary" onclick="editAddress(${index})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-small btn-danger" onclick="deleteAddress(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="address-details">
                    <p>${address.street}</p>
                    <p>${address.city}, ${address.state} ${address.zip}</p>
                </div>
            `;
            addressesList.appendChild(addressElement);
        });
    }

    loadPaymentMethods() {
        const paymentMethodsList = document.getElementById('paymentMethodsList');
        if (!paymentMethodsList) return;

        paymentMethodsList.innerHTML = '';

        this.paymentMethods.forEach((method, index) => {
            const methodElement = document.createElement('div');
            methodElement.className = `payment-method ${method.isDefault ? 'default' : ''}`;
            methodElement.innerHTML = `
                <div class="payment-info">
                    <div class="payment-icon">
                        <i class="fas fa-credit-card"></i>
                    </div>
                    <div class="payment-details">
                        <h4>${method.type} ending in ${method.lastFour}</h4>
                        <p>Expires ${method.expiry}</p>
                    </div>
                </div>
                <div class="payment-actions">
                    <button class="btn btn-small btn-secondary" onclick="editPaymentMethod(${index})">Edit</button>
                    <button class="btn btn-small btn-danger" onclick="deletePaymentMethod(${index})">Delete</button>
                </div>
            `;
            paymentMethodsList.appendChild(methodElement);
        });
    }

    setupEventListeners() {
        // Personal info form
        const personalInfoForm = document.getElementById('personalInfoForm');
        if (personalInfoForm) {
            personalInfoForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updatePersonalInfo(new FormData(personalInfoForm));
            });
        }

        // Preference checkboxes
        const preferences = ['emailNotifications', 'smsNotifications', 'newsletter'];
        preferences.forEach(pref => {
            const checkbox = document.getElementById(pref);
            if (checkbox) {
                checkbox.addEventListener('change', () => {
                    this.updatePreference(pref, checkbox.checked);
                });
            }
        });
    }

    updatePersonalInfo(formData) {
        const firstName = formData.get('firstName');
        const lastName = formData.get('lastName');
        const email = formData.get('email');
        const phone = formData.get('phone');

        // Update current user
        this.currentUser.firstName = firstName;
        this.currentUser.lastName = lastName;
        this.currentUser.email = email;
        this.currentUser.phone = phone;

        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

        // Update profile display
        this.loadUserProfile();

        // Show success message
        this.showNotification('Profile updated successfully!', 'success');
    }

    updatePreference(preference, value) {
        if (!this.currentUser.preferences) {
            this.currentUser.preferences = {};
        }
        
        this.currentUser.preferences[preference] = value;
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        
        this.showNotification('Preference updated!', 'success');
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
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Sample data generators
    generateSampleOrders() {
        return [
            {
                id: '12345',
                date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
                status: 'delivered',
                items: ['Signature Burger', 'Truffle Pizza', 'Craft Beer'],
                total: 48.97
            },
            {
                id: '12344',
                date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
                status: 'delivered',
                items: ['Grilled Salmon', 'House Wine'],
                total: 33.98
            },
            {
                id: '12343',
                date: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
                status: 'pending',
                items: ['Pasta Carbonara', 'Tiramisu'],
                total: 28.98
            }
        ];
    }

    generateSampleFavorites() {
        return [
            {
                id: 'fav1',
                name: 'Signature Burger',
                description: 'Premium beef patty with artisanal toppings',
                price: 18.99
            },
            {
                id: 'fav2',
                name: 'Truffle Pizza',
                description: 'Wood-fired pizza with truffle oil and mushrooms',
                price: 22.99
            },
            {
                id: 'fav3',
                name: 'Chocolate Lava Cake',
                description: 'Warm chocolate cake with molten center',
                price: 9.99
            }
        ];
    }

    generateSampleAddresses() {
        return [
            {
                label: 'Home',
                street: '123 Main Street',
                city: 'San Francisco',
                state: 'CA',
                zip: '94102',
                isDefault: true
            },
            {
                label: 'Work',
                street: '456 Business Ave',
                city: 'San Francisco',
                state: 'CA',
                zip: '94105',
                isDefault: false
            }
        ];
    }

    generateSamplePaymentMethods() {
        return [
            {
                type: 'Visa',
                lastFour: '4242',
                expiry: '12/25',
                isDefault: true
            },
            {
                type: 'Mastercard',
                lastFour: '8888',
                expiry: '08/26',
                isDefault: false
            }
        ];
    }
}

// Global functions for button clicks
function signOut() {
    if (window.authManager) {
        window.authManager.signOut();
    } else {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}

function editAvatar() {
    alert('Avatar editing would be implemented here. This is a demo version.');
}

function viewOrderDetails(orderId) {
    alert(`Order details for #${orderId} would be shown here.`);
}

function reorderItems(orderId) {
    alert(`Reordering items from #${orderId}. This would add items to cart.`);
}

function addFavoriteToCart(itemId) {
    const item = window.profileManager.favorites.find(fav => fav.id === itemId);
    if (item && window.cartManager) {
        window.cartManager.addItem(item.name, item.price);
    }
}

function removeFavorite(itemId) {
    if (confirm('Remove this item from favorites?')) {
        window.profileManager.favorites = window.profileManager.favorites.filter(fav => fav.id !== itemId);
        window.profileManager.loadFavorites();
        window.profileManager.showNotification('Item removed from favorites', 'success');
    }
}

function addAllFavoritesToCart() {
    if (window.cartManager && window.profileManager.favorites.length > 0) {
        window.profileManager.favorites.forEach(item => {
            window.cartManager.addItem(item.name, item.price);
        });
        window.profileManager.showNotification('All favorites added to cart!', 'success');
    }
}

function addNewAddress() {
    const modal = document.getElementById('addressModal');
    if (modal) {
        modal.classList.add('show');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    }
}

function saveAddress() {
    const form = document.getElementById('addressForm');
    const formData = new FormData(form);
    
    const newAddress = {
        label: formData.get('addressLabel') || document.getElementById('addressLabel').value,
        street: formData.get('streetAddress') || document.getElementById('streetAddress').value,
        city: formData.get('city') || document.getElementById('city').value,
        state: formData.get('state') || document.getElementById('state').value,
        zip: formData.get('zipCode') || document.getElementById('zipCode').value,
        isDefault: false
    };
    
    if (newAddress.label && newAddress.street && newAddress.city && newAddress.state && newAddress.zip) {
        window.profileManager.addresses.push(newAddress);
        window.profileManager.loadAddresses();
        closeModal('addressModal');
        window.profileManager.showNotification('Address added successfully!', 'success');
        
        // Reset form
        form.reset();
    } else {
        alert('Please fill in all required fields.');
    }
}

function editAddress(index) {
    alert(`Edit address functionality would be implemented here for address ${index}.`);
}

function deleteAddress(index) {
    if (confirm('Delete this address?')) {
        window.profileManager.addresses.splice(index, 1);
        window.profileManager.loadAddresses();
        window.profileManager.showNotification('Address deleted', 'success');
    }
}

function addPaymentMethod() {
    alert('Add payment method functionality would be implemented here.');
}

function editPaymentMethod(index) {
    alert(`Edit payment method functionality would be implemented here for method ${index}.`);
}

function deletePaymentMethod(index) {
    if (confirm('Delete this payment method?')) {
        window.profileManager.paymentMethods.splice(index, 1);
        window.profileManager.loadPaymentMethods();
        window.profileManager.showNotification('Payment method deleted', 'success');
    }
}

function connectSocial(platform) {
    alert(`${platform} connection would be implemented here. This is a demo version.`);
}

function changePassword() {
    alert('Change password functionality would be implemented here.');
}

function downloadData() {
    alert('Download data functionality would be implemented here.');
}

function deleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        alert('Account deletion would be implemented here.');
    }
}

// Initialize profile when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.profileManager = new ProfileManager();
    
    // Close modals when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('show');
        }
    });
    
    console.log('Profile page initialized successfully!');
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ProfileManager
    };
}