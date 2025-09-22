/**
 * Runivo Community Page - JavaScript Functionality
 * Handles form submission, validation, interactions, and header scroll behavior
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
    setupOriginalFormFunctionality();
});



/**
 * Setup original form functionality from HTML file
 */
function setupOriginalFormFunctionality() {
    // Character counters
    const fullNameInput = document.getElementById('fullName');
    if (fullNameInput) {
        fullNameInput.addEventListener('input', function() {
            const counter = document.getElementById('nameCounter');
            if (counter) {
                counter.textContent = this.value.length;
            }
        });
    }

    const additionalInfoInput = document.getElementById('additionalInfo');
    if (additionalInfoInput) {
        additionalInfoInput.addEventListener('input', function() {
            const counter = document.getElementById('textCounter');
            if (counter) {
                counter.textContent = this.value.length;
            }
        });
    }

    // Phone validation
    const whatsappInput = document.getElementById('whatsappNumber');
    if (whatsappInput) {
        whatsappInput.addEventListener('input', function() {
            const phone = this.value;
            const validation = document.getElementById('phoneValidation');
            const submitBtn = document.getElementById('submitBtn');
            
            if (!validation) return;
            
            // Basic phone number validation (more lenient)
            const phoneRegex = /^(\+91|91)?[6-9]\d{9}$/;
            
            if (phone.length === 0) {
                validation.style.display = 'none';
                validation.className = 'phone-validation';
            } else if (phoneRegex.test(phone)) {
                validation.textContent = '✓ Valid phone number';
                validation.className = 'phone-validation valid';
                checkFormValidity();
            } else {
                validation.textContent = '✗ Please enter a valid phone number (e.g., +91 9876543210)';
                validation.className = 'phone-validation invalid';
                if (submitBtn) {
                    submitBtn.disabled = true;
                }
            }
        });
    }

    // Form validation
    function checkFormValidity() {
        const form = document.getElementById('communityForm');
        const submitBtn = document.getElementById('submitBtn');
        if (!form || !submitBtn) return;

        const requiredFields = form.querySelectorAll('input[required], select[required]');
        const interests = form.querySelectorAll('input[name="interests"]:checked');
        const consent = document.getElementById('consent');
        const phoneValidation = document.getElementById('phoneValidation');
        
        let allValid = true;
        
        // Check required fields
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                allValid = false;
            }
        });
        
        // Check at least one interest selected
        if (interests.length === 0) {
            allValid = false;
        }
        
        // Check consent
        if (!consent || !consent.checked) {
            allValid = false;
        }
        
        // Check phone validation
        if (!phoneValidation || !phoneValidation.classList.contains('valid')) {
            allValid = false;
        }
        
        submitBtn.disabled = !allValid;

        // Debug: Log validation status
        console.log('Form validation:', {
            allValid,
            requiredFieldsCount: requiredFields.length,
            interestsSelected: interests.length,
            consentChecked: consent?.checked,
            phoneValidationValid: phoneValidation?.classList.contains('valid')
        });
    }

    // Add event listeners to all form elements
    if (communityForm) {
        const inputs = communityForm.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('input', checkFormValidity);
            input.addEventListener('change', checkFormValidity);
        });
        
        // Form submission is handled by setupFormHandling() function
    }

    // FAQ functionality
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const faqItem = button.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            // Close all FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                const toggle = item.querySelector('.faq-toggle');
                if (toggle) {
                    toggle.textContent = '+';
                }
            });
            
            // Toggle current item
            if (!isActive) {
                faqItem.classList.add('active');
                const toggle = button.querySelector('.faq-toggle');
                if (toggle) {
                    toggle.textContent = '-';
                }
            }
        });
    });
}

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
        // Submit form data to your backend
        await submitFormData();
        
        // Show success modal with WhatsApp integration
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
 * Submit form data (simplified for regular WhatsApp)
 */
async function submitFormData() {
    // For regular WhatsApp setup, you might just want to:
    // 1. Store data locally/send to simple backend
    // 2. Log the submission
    // 3. Prepare for WhatsApp redirect
    
    console.log('Form submitted:', formData);
    
    // If you have a simple backend endpoint:
    // const response = await fetch('/api/join-community', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(formData)
    // });
    
    // For now, just simulate success
    return new Promise(resolve => {
        setTimeout(resolve, 1500);
    });
}

/**
 * WhatsApp Integration Functions
 */

// Configuration - Replace with your actual WhatsApp details
const WHATSAPP_CONFIG = {
    // Your personal WhatsApp number (with country code, no + sign)
    adminNumber: '919876543210',

    // Your WhatsApp group invite link
    groupInviteLink: 'https://chat.whatsapp.com/Gs7dSyK7HRb3xESaNG5gdo',
    
    // Welcome message when contacting admin
    getAdminMessage: (userData) => {
        return `Hi! I'm ${userData.fullName} and I just joined the Runivo Community form.

My details:
- Running Level: ${userData.runningLevel}
- Interests: ${userData.interests?.join(', ')}
- Email: ${userData.email}

Please add me to the running group. Thanks!`;
    }
};

/**
 * WhatsApp Integration Functions (Standard WhatsApp)
 */

/**
 * Open WhatsApp group invite link
 */
function openWhatsAppGroup() {
    // Direct link to join group
    window.open(WHATSAPP_CONFIG.groupInviteLink, '_blank');
}

/**
 * Contact admin via WhatsApp
 */
function contactWhatsAppAdmin() {
    const message = WHATSAPP_CONFIG.getAdminMessage(formData);
    const whatsappURL = `https://wa.me/${WHATSAPP_CONFIG.adminNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
}

/**
 * Multiple WhatsApp redirection options for regular WhatsApp
 */
function handleWhatsAppRedirection(option = 'group') {
    switch(option) {
        case 'group':
            openWhatsAppGroup();
            trackWhatsAppClick('group_join');
            showNotification('Opening WhatsApp group invite...', 'success');
            break;
        case 'admin':
            contactWhatsAppAdmin();
            trackWhatsAppClick('admin_contact');
            showNotification('Opening WhatsApp chat with admin...', 'success');
            break;
        default:
            openWhatsAppGroup();
            break;
    }
}

/**
 * Track WhatsApp clicks for analytics
 */
function trackWhatsAppClick(type) {
    console.log(`WhatsApp ${type} clicked by ${formData.fullName || 'Anonymous'}`);
    
    // Add Google Analytics if you have it
    if (typeof gtag !== 'undefined') {
        gtag('event', 'whatsapp_click', {
            'event_category': 'community',
            'event_label': type,
            'custom_parameters': {
                'user_name': formData.fullName,
                'running_level': formData.runningLevel
            }
        });
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
        'dateOfBirth',
        'gender',
        'whatsappNumber',
        'email',
        'runningLevel',
        'howHeard',
        'additionalInfo'
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
    
    // Validate interests selection
    const interestsChecked = communityForm.querySelectorAll('[name="interests"]:checked');
    if (interestsChecked.length === 0) {
        const interestsSection = communityForm.querySelector('[name="interests"]').closest('.checkbox-group');
        showSectionError(interestsSection, 'Please select at least one interest');
        isValid = false;
        errors.push('interests');
    }
    
    // Validate consent
    const consent = document.getElementById('consent');
    if (!consent || !consent.checked) {
        showFieldError(consent, 'You must agree to receive WhatsApp messages');
        isValid = false;
        errors.push('consent');
    }
    
    return isValid;
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
    if (!field) return;
    
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
    if (!section) return;
    
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
    if (!field) return;
    
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
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all FAQ items
                faqItems.forEach(faq => faq.classList.remove('active'));
                
                // Open clicked item if it wasn't active
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });
}

/**
 * Setup form validation on input
 */
function setupFormValidation() {
    if (!communityForm) return;
    
    const inputs = communityForm.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldErrorOnInput);
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
    console.log('showSuccessModal function called');
    console.log('successModal element:', successModal);
    if (successModal) {
        console.log('Adding show class to modal');
        successModal.classList.add('show');
        document.body.style.overflow = 'hidden';
        console.log('Modal should now be visible');

        // Optional: Auto-redirect to WhatsApp after 3 seconds
        // setTimeout(() => {
        //     handleWhatsAppRedirection('group');
        // }, 3000);
    } else {
        console.error('successModal element not found!');
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

// Global functions for modal (called from HTML)
window.closeModal = closeModal;
window.handleWhatsAppRedirection = handleWhatsAppRedirection;

// Debug: Log that functions are being exported
console.log('Global functions exported:', {
    closeModal: typeof window.closeModal,
    handleWhatsAppRedirection: typeof window.handleWhatsAppRedirection
});