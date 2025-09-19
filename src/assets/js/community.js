/**
 * Runivo Community Page - JavaScript Functionality
 * Handles form submission, validation, and interactions
 */

// DOM Elements
const communityForm = document.getElementById('communityForm');
const successModal = document.getElementById('successModal');
const faqItems = document.querySelectorAll('.faq-item');

// Form validation state
let formData = {};
let isSubmitting = false;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCommunityPage();
});

/**
 * Initialize all community page functionality
 */
function initializeCommunityPage() {
    setupFormHandling();
    setupFAQAccordion();
    setupFormValidation();
    setupPhoneNumberFormatting();
    setupCountryCodeDetection();
    setupFormAnimations();
}

/**
 * Setup form submission handling
 */
function setupFormHandling() {
    if (communityForm) {
        communityForm.addEventListener('submit', handleFormSubmit);
        
        // Track form changes
        const inputs = communityForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('change', trackFormData);
            input.addEventListener('input', trackFormData);
        });
    }
}

/**
 * Handle form submission
 */
async function handleFormSubmit(e) {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    // Validate form
    if (!validateForm()) {
        showNotification('Please fill in all required fields correctly.', 'error');
        return;
    }
    
    isSubmitting = true;
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.innerHTML = `
        <div class="loading-spinner"></div>
        <span>Joining Community...</span>
    `;
    submitButton.disabled = true;
    
    try {
        // Simulate API call (replace with actual API endpoint)
        await simulateFormSubmission();
        
        // Show success modal
        showSuccessModal();
        
        // Reset form
        communityForm.reset();
        formData = {};
        
    } catch (error) {
        console.error('Form submission error:', error);
        showNotification('Something went wrong. Please try again.', 'error');
    } finally {
        // Reset button state
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        isSubmitting = false;
    }
}

/**
 * Simulate form submission (replace with actual API call)
 */
function simulateFormSubmission() {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Here you would normally send data to your backend
            console.log('Form submitted with data:', formData);
            resolve();
        }, 2000);
    });
}

/**
 * Track form data changes
 */
function trackFormData(e) {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
        if (!formData[name]) formData[name] = [];
        
        if (checked) {
            formData[name].push(value);
        } else {
            formData[name] = formData[name].filter(v => v !== value);
        }
    } else {
        formData[name] = value;
    }
}

/**
 * Validate the entire form
 */
function validateForm() {
    const requiredFields = [
        'fullName',
        'age',
        'location',
        'whatsappNumber',
        'runningLevel',
        'preferredTime',
        'guidelines'
    ];
    
    let isValid = true;
    const errors = [];
    
    // Check required fields
    requiredFields.forEach(fieldName => {
        const field = communityForm.querySelector(`[name="${fieldName}"]`);
        if (!field) return;
        
        const value = field.type === 'checkbox' ? field.checked : field.value.trim();
        
        if (!value || (Array.isArray(formData[fieldName]) && formData[fieldName].length === 0)) {
            showFieldError(field, 'This field is required');
            isValid = false;
            errors.push(fieldName);
        } else {
            clearFieldError(field);
        }
    });
    
    // Validate email if provided
    const emailField = communityForm.querySelector('[name="email"]');
    if (emailField && emailField.value.trim()) {
        if (!isValidEmail(emailField.value.trim())) {
            showFieldError(emailField, 'Please enter a valid email address');
            isValid = false;
            errors.push('email');
        }
    }
    
    // Validate phone number
    const phoneField = communityForm.querySelector('[name="whatsappNumber"]');
    if (phoneField && !isValidPhoneNumber(phoneField.value.trim())) {
        showFieldError(phoneField, 'Please enter a valid WhatsApp number');
        isValid = false;
        errors.push('whatsappNumber');
    }
    
    // Validate goals selection
    const goalsChecked = communityForm.querySelectorAll('[name="goals"]:checked');
    if (goalsChecked.length === 0) {
        const goalsSection = communityForm.querySelector('[name="goals"]').closest('.checkbox-group');
        showSectionError(goalsSection, 'Please select at least one running goal');
        isValid = false;
        errors.push('goals');
    }
    
    // Validate interests selection
    const interestsChecked = communityForm.querySelectorAll('[name="interests"]:checked');
    if (interestsChecked.length === 0) {
        const interestsSection = communityForm.querySelector('[name="interests"]').closest('.checkbox-group');
        showSectionError(interestsSection, 'Please select at least one interest');
        isValid = false;
        errors.push('interests');
    }
    
    return isValid;
}

/**
 * Email validation
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Phone number validation (basic)
 */
function isValidPhoneNumber(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]{7,15}$/;
    return phoneRegex.test(phone);
}

/**
 * Show field error
 */
function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #ef4444;
        font-size: 0.8rem;
        margin-top: 0.25rem;
        display: block;
        animation: errorSlideIn 0.3s ease-out;
    `;
    
    field.parentNode.appendChild(errorDiv);
}

/**
 * Show section error for checkbox groups
 */
function showSectionError(section, message) {
    const existingError = section.querySelector('.section-error');
    if (existingError) existingError.remove();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'section-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #ef4444;
        font-size: 0.85rem;
        margin-top: 0.5rem;
        padding: 0.5rem;
        background: rgba(239, 68, 68, 0.1);
        border-radius: 6px;
        border-left: 3px solid #ef4444;
    `;
    
    section.appendChild(errorDiv);
}

/**
 * Clear field error
 */
function clearFieldError(field) {
    field.classList.remove('error');
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) errorDiv.remove();
}

/**
 * Setup FAQ accordion functionality
 */
function setupFAQAccordion() {
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faq => faq.classList.remove('active'));
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

/**
 * Setup form validation on input
 */
function setupFormValidation() {
    const inputs = communityForm.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', debounce(clearFieldErrorOnInput, 300));
    });
}

/**
 * Validate individual field
 */
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // Skip validation if field is empty and not required
    if (!value && !field.required) {
        clearFieldError(field);
        return;
    }
    
    // Required field validation
    if (field.required && !value) {
        showFieldError(field, 'This field is required');
        return;
    }
    
    // Email validation
    if (field.type === 'email' && value && !isValidEmail(value)) {
        showFieldError(field, 'Please enter a valid email address');
        return;
    }
    
    // Phone validation
    if (field.name === 'whatsappNumber' && value && !isValidPhoneNumber(value)) {
        showFieldError(field, 'Please enter a valid WhatsApp number');
        return;
    }
    
    // Clear error if validation passes
    clearFieldError(field);
}

/**
 * Clear field error on input
 */
function clearFieldErrorOnInput(e) {
    clearFieldError(e.target);
}

/**
 * Setup phone number formatting
 */
function setupPhoneNumberFormatting() {
    const phoneInput = document.querySelector('[name="whatsappNumber"]');
    if (phoneInput) {
        phoneInput.addEventListener('input', formatPhoneNumber);
    }
}

/**
 * Format phone number as user types
 */
function formatPhoneNumber(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    // Basic formatting based on length
    if (value.length > 0) {
        if (value.length <= 3) {
            value = value;
        } else if (value.length <= 6) {
            value = `${value.slice(0, 3)} ${value.slice(3)}`;
        } else {
            value = `${value.slice(0, 3)} ${value.slice(3, 6)} ${value.slice(6, 10)}`;
        }
    }
    
    e.target.value = value;
}

/**
 * Setup country code detection (basic)
 */
function setupCountryCodeDetection() {
    // This is a placeholder for more advanced country detection
    // You could use IP geolocation or other methods here
    const countrySelect = document.querySelector('.country-code');
    if (countrySelect && !countrySelect.value) {
        // Default to India as mentioned in original requirements
        countrySelect.value = '+91';
    }
}

/**
 * Setup form animations
 */
function setupFormAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe form sections for animation
    const formSections = document.querySelectorAll('.form-section');
    formSections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.6s ease';
        observer.observe(section);
    });
}

/**
 * Show success modal
 */
function showSuccessModal() {
    if (successModal) {
        successModal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Generate a fake confirmation number
        const confirmationNumber = 'RUN-' + Date.now().toString().slice(-8);
        const confirmationElement = document.getElementById('whatsappContactNumber');
        if (confirmationElement) {
            confirmationElement.textContent = '+91 98765 43210'; // Your actual WhatsApp number
        }
    }
}

/**
 * Close modal
 */
function closeModal() {
    if (successModal) {
        successModal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4ade80' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        font-weight: 500;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

/**
 * Debounce utility function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Add CSS animations
 */
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes errorSlideIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        .error {
            border-color: #ef4444 !important;
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
        }
        
        .loading-spinner {
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-top: 2px solid white;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            display: inline-block;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .notification {
            animation: notificationSlide 0.3s ease-out;
        }
        
        @keyframes notificationSlide {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize dynamic styles
addDynamicStyles();

// Global functions for modal (called from HTML)
window.closeModal = closeModal;