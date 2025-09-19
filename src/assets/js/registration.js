// =================================
//   RUNIVO REGISTRATION JAVASCRIPT
// =================================

let currentStep = 1;
const totalSteps = 4;

// Initialize registration form
document.addEventListener('DOMContentLoaded', function() {
    initializeRegistration();
    setupEventListeners();
    updatePricing();
});

// Initialize the registration form
function initializeRegistration() {
    showStep(1);
    updateProgressBar();
    
    // Auto-populate some test data (remove in production)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        populateTestData();
    }
}

// Show specific step
function showStep(step) {
    // Hide all steps
    document.querySelectorAll('.registration-step').forEach(stepEl => {
        stepEl.classList.remove('active');
    });
    
    // Show current step
    const currentStepEl = document.getElementById(`step${step}`);
    if (currentStepEl) {
        currentStepEl.classList.add('active');
    }
    
    currentStep = step;
    updateProgressBar();
    
    // Scroll to top of form
    document.querySelector('.registration-section').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

// Update progress bar
function updateProgressBar() {
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        const stepNumber = index + 1;
        if (stepNumber <= currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

// Go to next step
function nextStep() {
    if (currentStep < totalSteps) {
        // Validate current step before proceeding
        if (validateCurrentStep()) {
            currentStep++;
            showStep(currentStep);
            
            // Update summary if moving to payment step
            if (currentStep === 3) {
                updatePaymentSummary();
            }
            
            // Generate confirmation details if moving to confirmation step
            if (currentStep === 4) {
                generateConfirmationDetails();
            }
        }
    }
}

// Go to previous step
function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
    }
}

// Validate current step
function validateCurrentStep() {
    switch(currentStep) {
        case 1:
            return validateStep1();
        case 2:
            return validateStep2();
        case 3:
            return validateStep3();
        default:
            return true;
    }
}

// Validate step 1 (event details)
function validateStep1() {
    const selectedRegistration = document.querySelector('input[name="registration_type"]:checked');
    if (!selectedRegistration) {
        alert('Please select a registration option');
        return false;
    }
    return true;
}

// Validate step 2 (personal information)
function validateStep2() {
    const requiredFields = [
        'firstName',
        'lastName', 
        'email',
        'phone',
        'birthDate',
        'emergencyContact',
        'emergencyPhone'
    ];
    
    const waiver = document.querySelector('input[name="waiver"]:checked');
    if (!waiver) {
        alert('You must agree to the waiver to continue');
        return false;
    }
    
    for (let field of requiredFields) {
        const input = document.getElementById(field);
        if (!input || !input.value.trim()) {
            alert(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field`);
            input?.focus();
            return false;
        }
    }
    
    // Validate email format
    const email = document.getElementById('email').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        document.getElementById('email').focus();
        return false;
    }
    
    return true;
}

// Validate step 3 (payment)
function validateStep3() {
    const paymentMethod = document.querySelector('input[name="payment_method"]:checked');
    if (!paymentMethod) {
        alert('Please select a payment method');
        return false;
    }
    
    if (paymentMethod.value === 'card') {
        const cardFields = ['cardNumber', 'expiryDate', 'cvv', 'cardName'];
        for (let field of cardFields) {
            const input = document.getElementById(field);
            if (!input || !input.value.trim()) {
                alert(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field`);
                input?.focus();
                return false;
            }
        }
    }
    
    return true;
}

// Setup event listeners
function setupEventListeners() {
    // Registration type changes
    document.querySelectorAll('input[name="registration_type"]').forEach(input => {
        input.addEventListener('change', updatePricing);
    });
    
    // Add-on changes
    document.querySelectorAll('input[type="checkbox"][name="tshirt"], input[type="checkbox"][name="parking"]').forEach(input => {
        input.addEventListener('change', updatePricing);
    });
    
    // Payment method changes
    document.querySelectorAll('input[name="payment_method"]').forEach(input => {
        input.addEventListener('change', handlePaymentMethodChange);
    });
    
    // Card number formatting
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', formatCardNumber);
    }
    
    // Expiry date formatting
    const expiryInput = document.getElementById('expiryDate');
    if (expiryInput) {
        expiryInput.addEventListener('input', formatExpiryDate);
    }
    
    // Form submission prevention
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
        });
    });
}

// Update pricing
function updatePricing() {
    const selectedRegistration = document.querySelector('input[name="registration_type"]:checked');
    const tshirtAddon = document.querySelector('input[name="tshirt"]:checked');
    const parkingAddon = document.querySelector('input[name="parking"]:checked');
    
    let registrationPrice = 0;
    let addonsPrice = 0;
    
    // Get registration price
    if (selectedRegistration) {
        switch(selectedRegistration.value) {
            case 'early':
                registrationPrice = 25;
                break;
            case 'regular':
                registrationPrice = 35;
                break;
            case 'late':
                registrationPrice = 45;
                break;
        }
    }
    
    // Calculate add-ons
    if (tshirtAddon) addonsPrice += 15;
    if (parkingAddon) addonsPrice += 5;
    
    const total = registrationPrice + addonsPrice;
    
    // Update display
    document.getElementById('registrationPrice').textContent = `$${registrationPrice}`;
    document.getElementById('addonsPrice').textContent = `$${addonsPrice}`;
    document.getElementById('totalPrice').textContent = `$${total}`;
}

// Handle payment method changes
function handlePaymentMethodChange() {
    const selectedMethod = document.querySelector('input[name="payment_method"]:checked');
    
    // Hide all payment forms
    document.getElementById('cardForm').style.display = 'none';
    document.getElementById('paypalForm').style.display = 'none';
    document.getElementById('venmoForm').style.display = 'none';
    
    // Show selected payment form
    if (selectedMethod) {
        switch(selectedMethod.value) {
            case 'card':
                document.getElementById('cardForm').style.display = 'grid';
                break;
            case 'paypal':
                document.getElementById('paypalForm').style.display = 'block';
                break;
            case 'venmo':
                document.getElementById('venmoForm').style.display = 'block';
                break;
        }
    }
}

// Format card number
function formatCardNumber(e) {
    let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    
    if (formattedValue !== e.target.value) {
        e.target.value = formattedValue;
    }
}

// Format expiry date
function formatExpiryDate(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0,2) + '/' + value.substring(2,4);
    }
    e.target.value = value;
}

// Update payment summary
function updatePaymentSummary() {
    const selectedRegistration = document.querySelector('input[name="registration_type"]:checked');
    const tshirtAddon = document.querySelector('input[name="tshirt"]:checked');
    const parkingAddon = document.querySelector('input[name="parking"]:checked');
    
    let registrationPrice = 0;
    let registrationType = '';
    
    if (selectedRegistration) {
        switch(selectedRegistration.value) {
            case 'early':
                registrationPrice = 25;
                registrationType = 'Early Bird';
                break;
            case 'regular':
                registrationPrice = 35;
                registrationType = 'Regular';
                break;
            case 'late':
                registrationPrice = 45;
                registrationType = 'Late Registration';
                break;
        }
    }
    
    // Update summary lines
    document.querySelector('.summary-line span').textContent = `Spring 10K Challenge - ${registrationType}`;
    document.querySelector('.summary-line span:last-child').textContent = `$${registrationPrice}.00`;
    
    // Show/hide add-ons
    const tshirtSummary = document.getElementById('tshirtSummary');
    const parkingSummary = document.getElementById('parkingSummary');
    
    if (tshirtAddon) {
        tshirtSummary.style.display = 'flex';
    } else {
        tshirtSummary.style.display = 'none';
    }
    
    if (parkingAddon) {
        parkingSummary.style.display = 'flex';
    } else {
        parkingSummary.style.display = 'none';
    }
    
    // Calculate total
    let total = registrationPrice;
    if (tshirtAddon) total += 15;
    if (parkingAddon) total += 5;
    
    document.getElementById('finalTotal').textContent = `$${total}.00`;
}

// Process payment
function processPayment() {
    if (!validateStep3()) return;
    
    const btn = document.querySelector('.btn-primary.btn-large');
    const btnText = btn.querySelector('.btn-text');
    const btnLoader = btn.querySelector('.btn-loader');
    
    // Show loading state
    btn.classList.add('loading');
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-block';
    btn.disabled = true;
    
    // Simulate payment processing
    setTimeout(() => {
        // Hide loading state
        btn.classList.remove('loading');
        btnText.style.display = 'inline-block';
        btnLoader.style.display = 'none';
        btn.disabled = false;
        
        // Move to confirmation step
        nextStep();
    }, 2000);
}

// Generate confirmation details
function generateConfirmationDetails() {
    // Generate confirmation number
    const confirmationNumber = 'RUN-2025-' + Math.floor(Math.random() * 900000 + 100000);
    document.getElementById('confirmationNumber').textContent = confirmationNumber;
    
    // Update paid amount
    const finalTotal = document.getElementById('finalTotal').textContent;
    document.getElementById('paidAmount').textContent = finalTotal;
}

// Download confirmation (placeholder)
function downloadConfirmation() {
    alert('Confirmation PDF download would start here');
}

// Add to calendar (placeholder)
function addToCalendar() {
    alert('Calendar event would be created here');
}

// Populate test data for development
function populateTestData() {
    const testData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '555-123-4567',
        birthDate: '1990-01-01',
        emergencyContact: 'Jane Doe',
        emergencyPhone: '555-987-6543',
        address: '123 Main St',
        city: 'San Francisco',
        zipCode: '94102'
    };
    
    Object.keys(testData).forEach(key => {
        const input = document.getElementById(key);
        if (input) {
            input.value = testData[key];
        }
    });
    
    // Check waiver checkbox
    const waiver = document.querySelector('input[name="waiver"]');
    if (waiver) waiver.checked = true;
}

// Utility functions
function showError(message) {
    alert(message); // Replace with better error handling in production
}

function showSuccess(message) {
    console.log('Success:', message);
}

// Export functions for global access
window.nextStep = nextStep;
window.previousStep = previousStep;
window.processPayment = processPayment;
window.downloadConfirmation = downloadConfirmation;
window.addToCalendar = addToCalendar;