// Checkout Page Functionality
class CheckoutManager {
    constructor() {
        this.currentStep = 1;
        this.orderType = 'delivery';
        this.paymentMethod = 'card';
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.init();
    }

    init() {
        this.displayOrderSummary();
        this.calculateTotals();
        this.setupEventListeners();
        this.setupFormValidation();
        this.setupPaymentMethodToggle();
    }

    displayOrderSummary() {
        const checkoutItems = document.getElementById('checkoutItems');
        
        if (!checkoutItems) return;
        
        checkoutItems.innerHTML = '';
        
        if (this.cart.length === 0) {
            checkoutItems.innerHTML = `
                <div class="empty-cart">
                    <p>Your cart is empty</p>
                    <a href="menu.html" class="btn btn-primary">Browse Menu</a>
                </div>
            `;
            return;
        }

        this.cart.forEach((item, index) => {
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            orderItem.innerHTML = `
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)} each</p>
                    <div class="item-quantity">
                        <span>Qty: </span>
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="checkoutManager.updateQuantity(${index}, ${item.quantity - 1})">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn" onclick="checkoutManager.updateQuantity(${index}, ${item.quantity + 1})">+</button>
                        </div>
                    </div>
                </div>
                <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            `;
            checkoutItems.appendChild(orderItem);
        });
    }

    updateQuantity(index, newQuantity) {
        if (newQuantity <= 0) {
            this.cart.splice(index, 1);
        } else {
            this.cart[index].quantity = newQuantity;
        }
        
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.displayOrderSummary();
        this.calculateTotals();
        
        // Update cart count in navigation if it exists
        if (window.cartManager) {
            window.cartManager.cart = this.cart;
            window.cartManager.updateCartDisplay();
        }
    }

    calculateTotals() {
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const taxRate = 0.085; // 8.5%
        const tax = subtotal * taxRate;
        const deliveryFee = this.orderType === 'delivery' ? 3.99 : 0;
        const total = subtotal + tax + deliveryFee;

        // Update display
        const subtotalEl = document.getElementById('subtotal');
        const taxEl = document.getElementById('tax');
        const deliveryFeeEl = document.getElementById('deliveryFee');
        const finalTotalEl = document.getElementById('finalTotal');

        if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
        if (deliveryFeeEl) deliveryFeeEl.textContent = this.orderType === 'delivery' ? `$${deliveryFee.toFixed(2)}` : 'Free';
        if (finalTotalEl) finalTotalEl.textContent = `$${total.toFixed(2)}`;

        return { subtotal, tax, deliveryFee, total };
    }

    setupEventListeners() {
        // Order type selection
        document.addEventListener('change', (e) => {
            if (e.target.name === 'orderType') {
                this.orderType = e.target.value;
                this.calculateTotals();
            }
            
            if (e.target.name === 'paymentMethod') {
                this.paymentMethod = e.target.value;
                this.togglePaymentForm();
            }
        });

        // Form input formatting
        this.setupInputFormatting();
    }

    setupInputFormatting() {
        // Card number formatting
        const cardNumberInput = document.getElementById('cardNumber');
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
                let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
                e.target.value = formattedValue;
            });
        }

        // Expiry date formatting
        const expiryInput = document.getElementById('expiryDate');
        if (expiryInput) {
            expiryInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 2) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                }
                e.target.value = value;
            });
        }

        // CVV formatting
        const cvvInput = document.getElementById('cvv');
        if (cvvInput) {
            cvvInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\D/g, '');
            });
        }

        // Phone number formatting
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 6) {
                    value = `(${value.substring(0, 3)}) ${value.substring(3, 6)}-${value.substring(6, 10)}`;
                } else if (value.length >= 3) {
                    value = `(${value.substring(0, 3)}) ${value.substring(3)}`;
                }
                e.target.value = value;
            });
        }
    }

    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.validateForm(form);
            });
        });
    }

    validateForm(form) {
        const inputs = form.querySelectorAll('input[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                this.showFieldError(input, 'This field is required');
                isValid = false;
            } else {
                this.clearFieldError(input);
            }
        });

        // Email validation
        const emailInput = form.querySelector('input[type="email"]');
        if (emailInput && emailInput.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) {
                this.showFieldError(emailInput, 'Please enter a valid email address');
                isValid = false;
            }
        }

        // Card validation (if payment method is card)
        if (this.paymentMethod === 'card' && this.currentStep === 3) {
            const cardNumber = document.getElementById('cardNumber');
            const expiryDate = document.getElementById('expiryDate');
            const cvv = document.getElementById('cvv');

            if (cardNumber && cardNumber.value.replace(/\s/g, '').length < 13) {
                this.showFieldError(cardNumber, 'Please enter a valid card number');
                isValid = false;
            }

            if (expiryDate && expiryDate.value.length < 5) {
                this.showFieldError(expiryDate, 'Please enter a valid expiry date');
                isValid = false;
            }

            if (cvv && cvv.value.length < 3) {
                this.showFieldError(cvv, 'Please enter a valid CVV');
                isValid = false;
            }
        }

        return isValid;
    }

    showFieldError(input, message) {
        this.clearFieldError(input);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.cssText = `
            color: var(--accent-color);
            font-size: 0.8rem;
            margin-top: 5px;
        `;
        errorDiv.textContent = message;
        
        input.style.borderColor = 'var(--accent-color)';
        input.parentNode.appendChild(errorDiv);
    }

    clearFieldError(input) {
        const existingError = input.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        input.style.borderColor = 'var(--border-color)';
    }

    setupPaymentMethodToggle() {
        this.togglePaymentForm();
    }

    togglePaymentForm() {
        const cardPayment = document.getElementById('cardPayment');
        if (cardPayment) {
            cardPayment.style.display = this.paymentMethod === 'card' ? 'block' : 'none';
        }
    }

    nextStep(step) {
        // Validate current step
        if (!this.validateCurrentStep()) {
            return;
        }

        this.currentStep = step;
        this.updateStepDisplay();
    }

    prevStep(step) {
        this.currentStep = step;
        this.updateStepDisplay();
    }

    validateCurrentStep() {
        const currentStepEl = document.getElementById(`step${this.currentStep}`);
        if (!currentStepEl) return true;

        const form = currentStepEl.querySelector('form');
        if (form) {
            return this.validateForm(form);
        }

        return true;
    }

    updateStepDisplay() {
        // Update step indicators
        document.querySelectorAll('.step').forEach((step, index) => {
            if (index + 1 <= this.currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        // Show/hide step content
        document.querySelectorAll('.checkout-step').forEach((step, index) => {
            if (index + 1 === this.currentStep) {
                step.classList.remove('hidden');
            } else {
                step.classList.add('hidden');
            }
        });
    }

    placeOrder() {
        if (!this.validateCurrentStep()) {
            return;
        }

        if (this.cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        // Show loading state
        const placeOrderBtn = document.querySelector('button[onclick="placeOrder()"]');
        if (placeOrderBtn) {
            placeOrderBtn.textContent = 'Processing...';
            placeOrderBtn.disabled = true;
        }

        // Simulate order processing
        setTimeout(() => {
            this.showOrderConfirmation();
            this.clearCart();
            
            if (placeOrderBtn) {
                placeOrderBtn.textContent = 'Place Order';
                placeOrderBtn.disabled = false;
            }
        }, 2000);
    }

    showOrderConfirmation() {
        const modal = document.getElementById('orderModal');
        const orderNumber = document.getElementById('orderNumber');
        const estimatedTime = document.getElementById('estimatedTime');
        const modalTotal = document.getElementById('modalTotal');

        // Generate order number
        const orderNum = '#' + Math.floor(Math.random() * 90000) + 10000;
        
        // Calculate estimated time
        const estimatedMinutes = this.orderType === 'delivery' ? '30-45 minutes' : '15-20 minutes';
        
        // Get total
        const totals = this.calculateTotals();

        if (orderNumber) orderNumber.textContent = orderNum;
        if (estimatedTime) estimatedTime.textContent = estimatedMinutes;
        if (modalTotal) modalTotal.textContent = `$${totals.total.toFixed(2)}`;

        if (modal) {
            modal.classList.add('show');
        }
    }

    clearCart() {
        this.cart = [];
        localStorage.setItem('cart', JSON.stringify(this.cart));
        
        // Update cart display
        if (window.cartManager) {
            window.cartManager.cart = this.cart;
            window.cartManager.updateCartDisplay();
        }
    }
}

// Global functions for button clicks
function nextStep(step) {
    if (window.checkoutManager) {
        window.checkoutManager.nextStep(step);
    }
}

function prevStep(step) {
    if (window.checkoutManager) {
        window.checkoutManager.prevStep(step);
    }
}

function placeOrder() {
    if (window.checkoutManager) {
        window.checkoutManager.placeOrder();
    }
}

function closeModal() {
    const modal = document.getElementById('orderModal');
    if (modal) {
        modal.classList.remove('show');
    }
    
    // Redirect to home page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 300);
}

// Social sharing for orders
function shareOrder(platform) {
    const orderNumber = document.getElementById('orderNumber')?.textContent || '#12345';
    const total = document.getElementById('modalTotal')?.textContent || '$0.00';
    
    const text = `Just ordered delicious food from Savory Restaurant! Order ${orderNumber} - Total: ${total} 🍽️`;
    const url = window.location.origin;

    switch (platform) {
        case 'facebook':
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`, '_blank', 'width=600,height=400');
            break;
        case 'twitter':
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
            break;
        case 'instagram':
            navigator.clipboard.writeText(`${text} ${url}`).then(() => {
                alert('Order details copied to clipboard! You can now paste it in your Instagram post or story.');
            });
            break;
    }
}

// Initialize checkout when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.checkoutManager = new CheckoutManager();
    
    // Close modal when clicking outside
    const modal = document.getElementById('orderModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
    console.log('Checkout page initialized successfully!');
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CheckoutManager
    };
}