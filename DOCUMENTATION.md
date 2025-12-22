# Savory Restaurant Theme - Complete Documentation

## 📋 Table of Contents

1. [Installation](#installation)
2. [File Structure](#file-structure)
3. [Customization](#customization)
4. [Features Guide](#features-guide)
5. [Browser Support](#browser-support)
6. [Troubleshooting](#troubleshooting)

## 🚀 Installation

### Method 1: Direct Upload
1. Extract the theme files
2. Upload all files to your web server
3. Access `index.html` in your browser
4. Your restaurant website is ready!

### Method 2: Local Development
1. Extract files to a local folder
2. Open `index.html` in a web browser
3. Or use a local server (Live Server, XAMPP, etc.)

## 📁 File Structure

```
restaurant-theme/
├── 📄 index.html              # Homepage with hero, categories, restaurants
├── 📄 menu.html               # Complete menu with filtering
├── 📄 checkout.html           # Multi-step checkout process
├── 📄 profile.html            # User dashboard and settings
├── 📄 signin.html             # User authentication
├── 📄 signup.html             # User registration
├── 📁 components/
│   ├── header.html            # Reusable navigation header
│   └── footer.html            # Reusable footer with links
├── 📁 styles/
│   ├── main.css               # Core styles and theme system
│   ├── menu.css               # Menu page specific styles
│   ├── checkout.css           # Checkout process styles
│   ├── profile.css            # Profile page styles
│   └── auth.css               # Authentication pages styles
├── 📁 js/
│   ├── main.js                # Core functionality and theme management
│   ├── components.js          # Component loading system
│   ├── menu.js                # Menu filtering and search
│   ├── checkout.js            # Checkout process management
│   ├── profile.js             # Profile and user management
│   └── auth.js                # Authentication system
└── 📁 documentation/          # This documentation
```

## 🎨 Customization

### 1. Basic Branding

#### Update Restaurant Name
```html
<!-- In components/header.html and all pages -->
<h2>Your Restaurant Name</h2>
```

#### Change Colors
```css
/* In styles/main.css - Update CSS variables */
:root {
  --primary-color: #your-color;
  --secondary-color: #your-color;
  --accent-color: #your-color;
}
```

#### Add Your Logo
```html
<!-- Replace text logo with image -->
<div class="nav-logo">
    <img src="your-logo.png" alt="Your Restaurant">
</div>
```

### 2. Content Customization

#### Homepage Hero Section
```html
<!-- In index.html -->
<div class="hero-text">
    <h1>Your Custom Headline</h1>
    <p>Your restaurant description</p>
</div>
```

#### Menu Items
```html
<!-- In menu.html - Update menu items -->
<div class="menu-list-item">
    <div class="menu-item-header">
        <h3>Your Dish Name</h3>
        <span class="price">$XX.XX</span>
    </div>
    <p>Your dish description</p>
</div>
```

#### Contact Information
```html
<!-- In index.html contact section -->
<div class="contact-item">
    <i class="fas fa-map-marker-alt"></i>
    <div>
        <h4>Location</h4>
        <p>Your Address</p>
    </div>
</div>
```

### 3. Theme Customization

#### Color Themes
The theme includes 4 pre-built color schemes:

```css
/* Default Theme - Gold/Professional */
[data-color-theme="default"] {
  --primary-color: #d4af37;
  --secondary-color: #2c3e50;
}

/* Warm Theme - Orange/Energetic */
[data-color-theme="warm"] {
  --primary-color: #ff6b35;
  --secondary-color: #8b4513;
}

/* Cool Theme - Blue/Modern */
[data-color-theme="cool"] {
  --primary-color: #3498db;
  --secondary-color: #2c3e50;
}

/* Elegant Theme - Purple/Luxury */
[data-color-theme="elegant"] {
  --primary-color: #8e44ad;
  --secondary-color: #2c2c54;
}
```

#### Create Custom Theme
```css
/* Add your custom theme */
[data-color-theme="custom"] {
  --primary-color: #your-primary;
  --secondary-color: #your-secondary;
  --accent-color: #your-accent;
}
```

Then add to the theme selector:
```html
<option value="custom">Custom</option>
```

## 🌟 Features Guide

### 1. Theme System
- **4 Color Themes**: Default, Warm, Cool, Elegant
- **Dark/Light Mode**: Toggle with persistent storage
- **Automatic Application**: Themes apply across all pages

### 2. Shopping Cart
- **Add Items**: Click "Add to Cart" on any menu item
- **View Cart**: Click cart icon (bottom right)
- **Modify Quantities**: Use +/- buttons in cart
- **Checkout**: Proceed to multi-step checkout

### 3. User Authentication
- **Sign Up**: Create new account with validation
- **Sign In**: Login with email/password
- **Profile**: View orders, favorites, settings
- **Persistent Sessions**: Stay logged in across visits

### 4. Menu System
- **Categories**: Filter by Appetizers, Mains, Desserts, Drinks
- **Search**: Find specific dishes
- **Price Filter**: Filter by price range
- **Responsive**: Works on all devices

### 5. Checkout Process
- **Step 1**: Order review and delivery/pickup selection
- **Step 2**: Delivery information and address
- **Step 3**: Payment method selection
- **Order Confirmation**: Success page with order details

## 🔧 Advanced Customization

### 1. Adding New Pages
1. Create new HTML file
2. Include header/footer placeholders:
```html
<div id="header-placeholder"><!-- Fallback header --></div>
<!-- Your content -->
<div id="footer-placeholder"><!-- Fallback footer --></div>
<script src="js/components.js"></script>
<script src="js/main.js"></script>
```

### 2. Custom JavaScript Functions
```javascript
// Add to js/main.js or create new file
function yourCustomFunction() {
    // Your code here
}
```

### 3. Additional Styling
```css
/* Add to styles/main.css or create new CSS file */
.your-custom-class {
    /* Your styles */
}
```

## 🌐 Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
/* Base styles: Mobile (320px+) */

@media (max-width: 768px) {
    /* Tablet styles */
}

@media (max-width: 480px) {
    /* Small mobile styles */
}
```

## 🔍 SEO Optimization

### Meta Tags
Update in each HTML file:
```html
<title>Your Restaurant Name - Delicious Food Delivery</title>
<meta name="description" content="Your restaurant description">
<meta name="keywords" content="restaurant, food, delivery, your-city">
```

### Structured Data
Add JSON-LD structured data for better search results:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "Your Restaurant Name",
  "address": "Your Address",
  "telephone": "Your Phone"
}
</script>
```

## 🛠️ Troubleshooting

### Common Issues

#### Theme Not Switching
- Check if `js/components.js` is loaded
- Verify theme controls are present in header
- Check browser console for errors

#### Cart Not Working
- Ensure `js/main.js` is loaded
- Check localStorage is enabled in browser
- Verify cart toggle button exists

#### Components Not Loading
- Check file paths are correct
- Ensure server supports fetch API
- Verify components folder exists

#### Mobile Menu Not Working
- Check hamburger button exists
- Verify mobile CSS is loaded
- Test on actual mobile device

### Debug Mode
Add to any page for debugging:
```html
<script>
console.log('Theme Manager:', window.themeManager);
console.log('Cart Manager:', window.cartManager);
console.log('Current Theme:', localStorage.getItem('theme'));
</script>
```

## 📞 Support

For technical support or customization help:
- Check this documentation first
- Review code comments in files
- Test in different browsers
- Check browser console for errors

## 🔄 Updates

To update the theme:
1. Backup your customizations
2. Replace core files
3. Reapply your customizations
4. Test all functionality

---

**Created by [CertifySphere](https://certifysphere.com/)**

This documentation covers all aspects of the Savory Restaurant Theme. For additional help, refer to the code comments within the files.