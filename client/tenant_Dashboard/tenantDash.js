// Global variables
let currentTenant = null;
let currentLandlord = null;
let currentProperty = null;
let requests = [];
let currentRequestId = null;

// DOM Elements
const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
const sections = document.querySelectorAll('.section');
const logoutBtn = document.getElementById('logout-btn');
const menuToggle = document.createElement('button');
menuToggle.className = 'menu-toggle';
menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
document.body.appendChild(menuToggle);

// Dashboard elements
const tenantNameEl = document.getElementById('tenant-name');
const landlordNameEl = document.getElementById('landlord-name');
const propertyNameEl = document.getElementById('property-name');
const requestsCountEl = document.getElementById('requests-count');

// Info elements
const landlordFullNameEl = document.getElementById('landlord-full-name');
const landlordEmailEl = document.getElementById('landlord-email');
const landlordPhoneEl = document.getElementById('landlord-phone');
const propertyFullNameEl = document.getElementById('property-full-name');
const propertyAddressEl = document.getElementById('property-address');
const propertyRentEl = document.getElementById('property-rent');

// Request elements
const addRequestBtn = document.getElementById('add-request-btn');
const requestsListEl = document.getElementById('requests-list');
const requestModal = document.getElementById('request-modal');
const closeRequestModal = document.getElementById('close-request-modal');
const cancelRequestBtn = document.getElementById('cancel-request');
const saveRequestBtn = document.getElementById('save-request');
const requestForm = document.getElementById('request-form');

// View request elements
const viewRequestModal = document.getElementById('view-request-modal');
const closeViewRequestModal = document.getElementById('close-view-request-modal');
const closeViewRequestBtn = document.getElementById('close-view-request-btn');

// Toast elements
const toastEl = document.getElementById('toast');
const toastMessageEl = document.getElementById('toast-message');

// API Base URL
const API_BASE_URL = 'https://renterhub.onrender.com';

// Configure Axios defaults
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.timeout = 10000; // 10 seconds timeout

axios.interceptors.request.use(config => {
    const token = localStorage.getItem('RenterHubToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Add retry mechanism for failed requests
axios.interceptors.response.use(null, error => {
    if (error.config && error.response && error.response.status >= 500) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(axios(error.config));
            }, 1000);
        });
    }
    return Promise.reject(error);
});

// Check authentication on page load
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('RenterHubToken');
    
    if (!token) {
        window.location.href = '../login_signup/login_signup.html';
        return;
    }
    
    // Initialize service worker for offline support
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('ServiceWorker registration successful');
        }).catch(err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    }
    
    fetchTenantProfile();
    fetchLandlordInfo();
    fetchPropertyInfo();
    fetchRequests();
});

// Mobile menu toggle
menuToggle.addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('active');
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    const sidebar = document.querySelector('.sidebar');
    if (window.innerWidth <= 768 && sidebar.classList.contains('active') && 
        !e.target.closest('.sidebar') && !e.target.closest('.menu-toggle')) {
        sidebar.classList.remove('active');
    }
});

// Sidebar navigation
sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all links
        sidebarLinks.forEach(l => l.classList.remove('active'));
        
        // Add active class to clicked link
        link.classList.add('active');
        
        // Hide all sections
        sections.forEach(section => {
            section.style.display = 'none';
        });
        
        // Show selected section
        const sectionId = link.getAttribute('data-section') + '-section';
        document.getElementById(sectionId).style.display = 'block';
        
        // Close sidebar on mobile after selection
        if (window.innerWidth <= 768) {
            document.querySelector('.sidebar').classList.remove('active');
        }
    });
});

// Logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('RenterHubToken');
    window.location.href = '../home.html';
});

// Show toast notification
function showToast(message, type = 'success') {
    toastMessageEl.textContent = message;
    toastEl.className = 'toast';
    
    // Set icon based on type
    const icon = toastEl.querySelector('i');
    if (type === 'success') {
        icon.className = 'fas fa-check-circle';
        toastEl.classList.add('success');
    } else if (type === 'error') {
        icon.className = 'fas fa-times-circle';
        toastEl.classList.add('error');
    } else if (type === 'warning') {
        icon.className = 'fas fa-exclamation-circle';
        toastEl.classList.add('warning');
    }
    
    toastEl.classList.add('show');
    
    // Hide after 5 seconds
    setTimeout(() => {
        toastEl.classList.remove('show');
    }, 5000);
}

// API Functions with enhanced error handling
async function fetchTenantProfile() {
    try {
        const response = await axios.get('/tenant/getTenant');
        currentTenant = response.data;
        
        // Update UI
        tenantNameEl.textContent = currentTenant.name.toUpperCase();
        
    } catch (error) {
        console.error('Error fetching tenant profile:', error);
        showToast('Failed to load tenant profile. Please try again later.', 'error');
        if (error.response && error.response.status === 401) {
            setTimeout(() => {
                window.location.href = '../login_signup/login_signup.html';
            }, 2000);
        }
    }
}

async function fetchLandlordInfo() {
    try {
        // First get property to get landlord ID
        const propertyResponse = await axios.get('/tenant/getlandlordByTenant');
        currentProperty = propertyResponse.data;
        
        if (currentProperty) {
            landlordNameEl.textContent = currentProperty.name;
            landlordFullNameEl.textContent = currentProperty.name;
            landlordEmailEl.textContent = currentProperty.email;
            landlordPhoneEl.textContent = currentProperty.phone || 'Not provided';
        }
        
    } catch (error) {
        console.error('Error fetching landlord info:', error);
        showToast('Failed to load landlord information', 'error');
    }
}

async function fetchPropertyInfo() {
    try {
        const response = await axios.get('/tenant/getProperty');
        currentProperty = response.data;
        
        if (currentProperty) {
            // Update UI
            propertyNameEl.textContent = currentProperty.name;
            propertyFullNameEl.textContent = currentProperty.name;
            propertyAddressEl.textContent = currentProperty.address;
            propertyRentEl.textContent = `$${currentProperty.rent || '0'} / month`;
        }
        
    } catch (error) {
        console.error('Error fetching property info:', error);
        showToast('Failed to load property information', 'error');
    }
}

async function fetchRequests() {
    try {
        showLoading(true, 'requests-list');
        const response = await axios.get('/tenant/requests');
        requests = response.data;
        
        // Update dashboard count
        requestsCountEl.textContent = requests.length;
        
        // Update requests list
        renderRequests();
        
    } catch (error) {
        console.error('Error fetching requests:', error);
        showToast('Failed to load maintenance requests', 'error');
        renderRequests(); // Will show empty state
    } finally {
        showLoading(false, 'requests-list');
    }
}

// Show loading state
function showLoading(show, elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    if (show) {
        element.innerHTML = `
            <tr>
                <td colspan="7" class="loading-state">
                    <div class="spinner"></div>
                    <p>Loading data...</p>
                </td>
            </tr>
        `;
    }
}

// Render Functions
function renderRequests() {
    requestsListEl.innerHTML = '';
    
    if (requests.length === 0) {
        requestsListEl.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    <i class="fas fa-tools"></i>
                    <h3>No Maintenance Requests</h3>
                    <p>You haven't submitted any maintenance requests yet.</p>
                </td>
            </tr>
        `;
        return;
    }

    requests.forEach(request => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${request.title}</td>
            <td>${request.category || 'General'}</td>
            <td>
                <span class="priority priority-${getPriorityClass(request.priority)}">
                    ${request.priority || 'Medium'}
                </span>
            </td>
            <td>
                <span class="status status-${getStatusClass(request.status)}">
                    ${request.status}
                </span>
            </td>
            <td>${formatDate(request.createdAt)}</td>
            <td>${request.response || 'Waiting for response'}</td>
            <td>
                <button class="action-btn view-btn view-request-btn" data-id="${request._id}">
                    <i class="fas fa-eye"></i> <span class="btn-text">View</span>
                </button>
            </td>
        `;
        requestsListEl.appendChild(row);
    });

    // Add event listeners to request action buttons
    document.querySelectorAll('.view-request-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const requestId = btn.getAttribute('data-id');
            viewRequest(requestId);
        });
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function getPriorityClass(priority) {
    if (!priority) return 'medium';
    return priority.toLowerCase().replace(' ', '-');
}

function getStatusClass(status) {
    if (!status) return 'pending';
    return status.toLowerCase().replace(' ', '-');
}

// Request Modal Functions
addRequestBtn.addEventListener('click', () => {
    currentRequestId = null;
    requestForm.reset();
    requestModal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
});

closeRequestModal.addEventListener('click', () => {
    requestModal.style.display = 'none';
    document.body.style.overflow = '';
});

cancelRequestBtn.addEventListener('click', () => {
    requestModal.style.display = 'none';
    document.body.style.overflow = '';
});

window.addEventListener('click', (e) => {
    if (e.target === requestModal) {
        requestModal.style.display = 'none';
        document.body.style.overflow = '';
    }
    if (e.target === viewRequestModal) {
        viewRequestModal.style.display = 'none';
        document.body.style.overflow = '';
    }
});

// Save Request
saveRequestBtn.addEventListener('click', async () => {
    if (!requestForm.checkValidity()) {
        requestForm.reportValidity();
        return;
    }

    const requestData = {
        title: document.getElementById('request-title').value,
        category: document.getElementById('request-category').value,
        priority: document.getElementById('request-priority').value,
        description: document.getElementById('request-description').value,
        tenantName: currentTenant.name 
    };

    try {
        saveRequestBtn.disabled = true;
        saveRequestBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        
        const response = await axios.post('/request/addRequest', requestData);
        
        if (response.data.message === "New request created") {
            showToast('Request submitted successfully');
            fetchRequests();
            requestModal.style.display = 'none';
            document.body.style.overflow = '';
        } else {
            showToast('Request submission failed', 'error');
        }
    } catch (error) {
        console.error('Error saving request:', error);
        if (error.response && error.response.data && error.response.data.message) {
            showToast(error.response.data.message, 'error');
        } else {
            showToast('Failed to submit request. Please check your connection.', 'error');
        }
    } finally {
        saveRequestBtn.disabled = false;
        saveRequestBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Request';
    }
});

// View Request
async function viewRequest(requestId) {
    try {
        const request = requests.find(r => r._id === requestId);
        if (!request) {
            showToast('Request not found', 'error');
            return;
        }

        // Populate view modal
        document.getElementById('view-request-title').textContent = request.title;
        document.getElementById('view-request-category').textContent = request.category || 'General';
        document.getElementById('view-request-priority').textContent = request.priority || 'Medium';
        document.getElementById('view-request-priority').className = `priority priority-${getPriorityClass(request.priority)}`;
        document.getElementById('view-request-status').textContent = request.status;
        document.getElementById('view-request-status').className = `status status-${getStatusClass(request.status)}`;
        document.getElementById('view-request-date').textContent = formatDate(request.createdAt);
        document.getElementById('view-request-description').textContent = request.description;
        document.getElementById('view-request-response').textContent = request.response || 'No response yet';

        // Show the modal
        viewRequestModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    } catch (error) {
        console.error('Error viewing request:', error);
        showToast('Failed to load request details', 'error');
    }
}

// Close View Request Modal
closeViewRequestModal.addEventListener('click', () => {
    viewRequestModal.style.display = 'none';
    document.body.style.overflow = '';
});

closeViewRequestBtn.addEventListener('click', () => {
    viewRequestModal.style.display = 'none';
    document.body.style.overflow = '';
});

// Detect if the device is offline
window.addEventListener('offline', () => {
    showToast('You are currently offline. Some features may not work.', 'warning');
});

window.addEventListener('online', () => {
    showToast('Your connection has been restored.', 'success');
    // Refresh data when connection is restored
    fetchRequests();
});