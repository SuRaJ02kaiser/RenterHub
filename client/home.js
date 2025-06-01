
        // Mobile Menu Toggle
        const mobileMenu = document.querySelector('.mobile-menu');
        const navLinks = document.querySelector('.nav-links');
        
        mobileMenu.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // Navbar scroll effect
        const navbar = document.getElementById('navbar');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // FAQ accordion
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', () => {
                const item = question.parentNode;
                item.classList.toggle('active');
            });
        });

        // Pricing toggle
        const pricingToggle = document.getElementById('pricing-toggle');
        const monthlyPrices = document.querySelectorAll('.pricing-price');
        const originalPrices = ['$19', '$49', '$99'];
        const yearlyPrices = ['$15', '$39', '$79'];
        
        pricingToggle.addEventListener('change', () => {
            monthlyPrices.forEach((price, index) => {
                if (pricingToggle.checked) {
                    price.textContent = yearlyPrices[index];
                } else {
                    price.textContent = originalPrices[index];
                }
            });
        });

        // Counter animation for stats
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const increment = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(updateCount, 5); 
            } else {
                counter.innerText = target;
            }
        };

        updateCount();
    });

        // Intersection Observer for scroll animations
        const fadeElements = document.querySelectorAll('.fade-in');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    if (entry.target.classList.contains('counter')) {
                        animateCounters();
                    }
                }
            });
        }, {
            threshold: 0.1
        });

        fadeElements.forEach(element => {
            observer.observe(element);
        });

// Dashboard link click handler
document.querySelectorAll('.btn.secondary, a[href="#dashboard"]').forEach(dashboardLink => {
    dashboardLink.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Check if token and role exist in localStorage
        const token = localStorage.getItem('RenterHubToken');
        const role = localStorage.getItem('RenterHubRole');
        
        if (token && role) {
            // Redirect to appropriate dashboard based on role
            switch(role.toLowerCase()) {
                case 'landlord':
                    window.location.href = './landlord_Dashboard/landDash.html';
                    break;
                case 'tenant':
                    window.location.href = './tenant_Dashboard/tenantDash.html';
                    break;
                default:
                    // If role is not recognized, redirect to lander page
                    window.location.href = './lander/lander.html';
            }
        } else {
            // No token found, redirect to lander page
            window.location.href = './lander/lander.html';
        }
    });
});


