
    // Global variables
    let currentMode = 'login';
    let passwordVisible = false;
    let toastTimeout;

    // DOM Content Loaded
    document.addEventListener('DOMContentLoaded', () => {
        // Initialize page with entrance animation
        setTimeout(() => {
            document.querySelector('.auth-container').style.opacity = '1';
            document.querySelector('.auth-container').style.transform = 'translateY(0)';
        }, 100);

        // Setup password strength indicator
        document.getElementById('password').addEventListener('input', validatePassword);

        // Check for prefers-color-scheme and adjust accordingly
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }

        // Listen for color scheme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        });
    });

    // Switch between login and signup modes
    function switchMode(mode) {
        if (currentMode === mode) return;

        const authForm = document.getElementById('authForm');
        const authTitle = document.getElementById('authTitle');
        const authSubtitle = document.getElementById('authSubtitle');
        const btnText = document.getElementById('btnText');
        const nameGroup = document.getElementById('nameGroup');
        const phoneGroup = document.getElementById('phoneGroup');
        const loginToggle = document.getElementById('loginToggle');
        const signupToggle = document.getElementById('signupToggle');
        const termsText = document.getElementById('termsText');

        // Add switching animation
        authForm.classList.add('switching');

        setTimeout(() => {
            currentMode = mode;

            if (mode === 'login') {
                // Switch to login mode
                authTitle.textContent = 'Welcome Back';
                authSubtitle.textContent = 'Sign in to access your dashboard';
                btnText.textContent = 'Sign In';
                forgotPassword.style.display = 'block';
                nameGroup.classList.add('hidden');
                phoneGroup.classList.add('hidden');
                loginToggle.classList.add('active');
                signupToggle.classList.remove('active');
                authForm.classList.add('slide-in-left');
                termsText.style.display = 'none';
            } else {
                // Switch to signup mode
                authTitle.textContent = 'Create Account';
                authSubtitle.textContent = 'Get started with your RenterHub account';
                btnText.textContent = 'Sign Up';
                forgotPassword.style.display = 'none';
                nameGroup.classList.remove('hidden');
                phoneGroup.classList.remove('hidden');
                signupToggle.classList.add('active');
                loginToggle.classList.remove('active');
                authForm.classList.add('slide-in-right');
                termsText.style.display = 'block';
            }

            // Remove switching animation
            authForm.classList.remove('switching');

            // Clear all form fields and errors
            clearAllFields();

            // Remove slide animation after completion
            setTimeout(() => {
                authForm.classList.remove('slide-in-left', 'slide-in-right');
            }, 600);
        }, 300);
    }

    // Clear all form fields and errors
    function clearAllFields() {
        document.querySelectorAll('input').forEach(input => {
            input.value = '';
            clearError(input.id);
        });
        document.getElementById('strengthMeter').style.width = '0';
        document.getElementById('strengthMeter').className = 'strength-meter';
    }

    // Password toggle functionality
    function togglePassword(inputId) {
        const input = document.getElementById(inputId);
        const toggle = input.parentElement.querySelector('.password-toggle i');
        
        passwordVisible = !passwordVisible;
        input.type = passwordVisible ? 'text' : 'password';
        toggle.className = passwordVisible ? 'far fa-eye-slash' : 'far fa-eye';
        
        // Add animation to the toggle button
        toggle.style.transform = 'scale(1.2)';
        setTimeout(() => {
            toggle.style.transform = 'scale(1)';
        }, 200);
    }

    // Form validation functions
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePhone(phone) {
        const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        return re.test(phone.replace(/\s/g, ''));
    }

    function validatePassword(password) {
        return password.length >= 8;
    }

    function showError(inputId, message) {
        const formGroup = document.getElementById(inputId).closest('.form-group');
        formGroup.classList.add('error');
        if (message) {
            formGroup.querySelector('.error-message').textContent = message;
        }
    }

    function clearError(inputId) {
        const formGroup = document.getElementById(inputId).closest('.form-group');
        if (formGroup) {
            formGroup.classList.remove('error');
        }
    }

    // Clear errors on input
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            clearError(input.id);
            
            // Add subtle focus effect
            input.parentElement.style.transform = 'scale(1.005)';
            setTimeout(() => {
                input.parentElement.style.transform = 'scale(1)';
            }, 200);
        });
    });

    // Handle form submission
    // Modify your handleSubmit function to check the role
async function handleSubmit() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    
    // Get the selected role from localStorage
    const selectedRole = localStorage.getItem('RenterHubRole') || sessionStorage.getItem('selectedRole');
    
    let isValid = true;

    // Common validation
    clearError('email');
    clearError('password');

    // Validate email
    if (!email) {
        showError('email', 'Email is required');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }

    // Validate password
    if (!password) {
        showError('password', 'Password is required');
        isValid = false;
    } else if (!validatePassword(password)) {
        showError('password', 'Password must be at least 8 characters');
        isValid = false;
    }

    // Additional validation for signup
    if (currentMode === 'signup') {
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();

        clearError('name');
        clearError('phone');

        // Validate name
        if (!name) {
            showError('name', 'Name is required');
            isValid = false;
        } else if (name.length < 2) {
            showError('name', 'Name must be at least 2 characters');
            isValid = false;
        }

        // Validate phone
        if (!phone) {
            showError('phone', 'Phone number is required');
            isValid = false;
        } else if (!validatePhone(phone)) {
            showError('phone', 'Please enter a valid phone number');
            isValid = false;
        }
    }

    if (isValid) {
        // Show loading state
        submitBtn.classList.add('loading');
        btnText.textContent = currentMode === 'login' ? 'Signing In...' : 'Creating Account...';

        try {
            let response;
            const baseUrl = 'https://renterhub.onrender.com'; // Your deployed backend URL
            
            if (currentMode === 'login') {
                // Determine the login endpoint based on role
                const loginEndpoint = selectedRole === 'landlord' ? '/landlord/login' : '/tenant/login';
                
                response = await axios.post(`${baseUrl}${loginEndpoint}`, {
                    email: email,
                    password: password
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                // Store the received token
                localStorage.setItem('RenterHubToken', response.data.token);
                localStorage.setItem('RenterHubRole', response.data.role);
                
            } else {
                // Determine the signup endpoint based on role
                const signupEndpoint = selectedRole === 'landlord' ? '/landlord/signup' : '/tenant/signup';
                const name = document.getElementById('name').value.trim();
                const phone = document.getElementById('phone').value.trim();
                
                const requestBody = selectedRole === 'landlord' 
                    ? { name, email, phone, password }
                    : { name, email, phone, password, landlord: null }; // You might want to handle landlord assignment differently
                
                response = await axios.post(`${baseUrl}${signupEndpoint}`, requestBody, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.data.token) {
                    localStorage.setItem('RenterHubToken', response.data.token);
                    localStorage.setItem('RenterHubRole', response.data.role);
                    localStorage.setItem('RenterHubName',response.data.name);
                }
            }

            // Success handling
            document.querySelector('.auth-container').classList.add('success');
            submitBtn.classList.remove('loading');
            btnText.textContent = currentMode === 'login' ? 'Sign In' : 'Sign Up';
            
            const successMessage = currentMode === 'login' 
                ? 'Login successful! Redirecting to your dashboard...' 
                : 'Account created successfully! Welcome to RenterHub.';
            
            showToast('Success', successMessage, 'success');
            
            if (currentMode === 'signup') {
                clearAllFields();
            }
            
            setTimeout(() => {
                document.querySelector('.auth-container').classList.remove('success');
                
                // Redirect after login/signup
                if (selectedRole === 'landlord') {
                    window.location.href = '../landlord_Dashboard/landDash.html';
                } else {
                    window.location.href = '../tenant_Dashboard/tenantDash.html';
                }
            }, 1000);
            
        } catch (error) {
            // Error handling
            submitBtn.classList.remove('loading');
            btnText.textContent = currentMode === 'login' ? 'Sign In' : 'Sign Up';
            
            let errorMessage = 'An error occurred. Please try again.';
            
            if (error.response) {
                // Server responded with a status code outside 2xx
                errorMessage = error.response.data.message || errorMessage;
                
                // Handle specific error cases
                if (error.response.status === 401) {
                    errorMessage = 'Invalid credentials. Please try again.';
                } else if (error.response.status === 409) {
                    errorMessage = 'RenterHub already exists. Please login instead.';
                }
            } else if (error.request) {
                errorMessage = 'Network error. Please check your connection.';
            }
            
            showToast('Error', errorMessage, 'error');
        }
    } else {
        showToast('Error', 'Please fix the errors in the form', 'error');
    }
}

// Modify your initial role selection to store in localStorage
document.querySelectorAll('.RenterHub-type-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        RenterHubTypeBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        selectedRenterHubType = this.dataset.type;
        continueBtn.disabled = false;
        
        // Store the selected role in localStorage for persistence
        localStorage.setItem('RenterHubRole', selectedRenterHubType);
    });
});

    // Toast notification functions
    function showToast(title, message, type) {
        const toast = document.getElementById('toast');
        const toastIcon = document.getElementById('toastIcon');
        const toastTitle = document.getElementById('toastTitle');
        const toastMessage = document.getElementById('toastMessage');
        
        // Clear previous timeout if exists
        if (toastTimeout) clearTimeout(toastTimeout);
        
        // Set content and style
        toastTitle.textContent = title;
        toastMessage.textContent = message;
        toast.className = `toast ${type}`;
        
        // Set icon based on type
        if (type === 'success') {
            toastIcon.className = 'fas fa-check-circle toast-icon';
        } else {
            toastIcon.className = 'fas fa-exclamation-circle toast-icon';
        }
        
        // Show toast
        toast.classList.add('visible');
        
        // Auto-hide after 5 seconds
        toastTimeout = setTimeout(() => {
            hideToast();
        }, 5000);
    }


    function hideToast() {
        const toast = document.getElementById('toast');
        toast.classList.remove('visible');
    }

    // Social login handler
    function socialLogin(provider) {
        const submitBtn = document.getElementById('submitBtn');
        const btnText = document.getElementById('btnText');
        
        // Show loading state on clicked button
        const socialBtn = document.querySelector(`.social-btn.${provider}`);
        socialBtn.innerHTML = `<div class="spinner" style="width: 18px; height: 18px;"></div>`;
        
        // Simulate social login
        setTimeout(() => {
            // Reset social button
            socialBtn.innerHTML = `<i class="fab fa-${provider}"></i>`;
            
            // Show success message
            showToast('Success', `Signed in with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`, 'success');
            
            // Redirect to dashboard (simulated)
            setTimeout(() => {
                window.location.href = '../home/home.html';
            }, 1000);
        }, 2000);
    }

    // Terms and privacy links
    function showTerms() {
        showToast('Terms of Service', 'You agree to our terms and conditions when using renterHub.', 'success');
    }
    

    function showPrivacy() {
        showToast('Privacy Policy', 'Your data is protected under our privacy policy.', 'success');
    }


