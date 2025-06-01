// Global variables
let currentLandlord = null;
let properties = [];
let tenants = [];
let requests = [];
let currentRequestId = null;
let formMode = 'add'; // Can be 'add' or 'edit'
let editingPropertyId = null;

// DOM Elements
const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
const sections = document.querySelectorAll('.section');
const logoutBtn = document.getElementById('logout-btn');
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.main-content');

// Dashboard elements
const landlordNameEl = document.getElementById('landlord-name');
const propertiesCountEl = document.getElementById('properties-count');
const tenantsCountEl = document.getElementById('tenants-count');
const requestsCountEl = document.getElementById('requests-count');

// Property elements
const addPropertyBtn = document.getElementById('add-property-btn');
const propertiesGridEl = document.getElementById('properties-grid');
const propertyModal = document.getElementById('property-modal');
const closePropertyModal = document.getElementById('close-property-modal');
const cancelProperty = document.getElementById('cancel-property');
const saveProperty = document.getElementById('save-property');
const propertyForm = document.getElementById('property-form');

// Tenant elements
const addTenantBtn = document.getElementById('add-tenant-btn');
const tenantsGridEl = document.getElementById('tenants-grid');
const tenantModal = document.getElementById('tenant-modal');
const closeTenantModal = document.getElementById('close-tenant-modal');
const cancelTenant = document.getElementById('cancel-tenant');
const saveTenant = document.getElementById('save-tenant');
const tenantForm = document.getElementById('tenant-form');
const tenantPropertySelect = document.getElementById('tenant-property');

// Request elements
const requestsListEl = document.getElementById('requests-list');
const requestModal = document.getElementById('request-modal');
const closeRequestModal = document.getElementById('close-request-modal');
const cancelRequest = document.getElementById('cancel-request');
const saveRequest = document.getElementById('save-request');
const requestForm = document.getElementById('request-form');

// Toast elements
const toastEl = document.getElementById('toast');
const toastMessageEl = document.getElementById('toast-message');

// API Base URL
const API_BASE_URL = 'https://renterhub.onrender.com';

// Configure Axios defaults
axios.defaults.baseURL = API_BASE_URL;

axios.interceptors.request.use(config => {
    const token = localStorage.getItem('RenterHubToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Initialize the application
function initApp() {
    setupEventListeners();
    checkAuthentication();
    setupResponsiveBehavior();
}

// Setup all event listeners
function setupEventListeners() {
    // Sidebar navigation
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigateToSection(link.getAttribute('data-section'));
        });
    });

    // Logout
    logoutBtn.addEventListener('click', logout);

    // Sidebar toggle
    sidebarToggle.addEventListener('click', toggleSidebar);

    // Property modal
    addPropertyBtn.addEventListener('click', addProperty);
    closePropertyModal.addEventListener('click', () => propertyModal.style.display = 'none');
    cancelProperty.addEventListener('click', () => propertyModal.style.display = 'none');
    saveProperty.addEventListener('click', savePropertyHandler);

    // Tenant modal
    addTenantBtn.addEventListener('click', () => tenantModal.style.display = 'flex');
    closeTenantModal.addEventListener('click', () => tenantModal.style.display = 'none');
    cancelTenant.addEventListener('click', () => tenantModal.style.display = 'none');
    saveTenant.addEventListener('click', saveTenantHandler);

    // Request modal
    closeRequestModal.addEventListener('click', () => {
        requestModal.style.display = 'none';
        currentRequestId = null;
    });
    cancelRequest.addEventListener('click', () => {
        requestModal.style.display = 'none';
        currentRequestId = null;
    });
    saveRequest.addEventListener('click', saveRequestHandler);

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === propertyModal) propertyModal.style.display = 'none';
        if (e.target === tenantModal) tenantModal.style.display = 'none';
        if (e.target === requestModal) {
            requestModal.style.display = 'none';
            currentRequestId = null;
        }
    });

    // Close modals with escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            propertyModal.style.display = 'none';
            tenantModal.style.display = 'none';
            requestModal.style.display = 'none';
            currentRequestId = null;
        }
    });
}

// Check authentication on page load
function checkAuthentication() {
    const token = localStorage.getItem('RenterHubToken');
    
    if (!token) {
        window.location.href = '../login_signup/login_signup.html';
        return;
    }
    
    fetchLandlordProfile();
    fetchProperties();
    fetchTenants();
    fetchRequests();
}

// Setup responsive behavior
function setupResponsiveBehavior() {
    adjustLayoutForScreenSize();
    
    // Handle window resize with debounce
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(adjustLayoutForScreenSize, 250);
    });

    // Detect touch devices
    document.body.classList.toggle('touch-device', 'ontouchstart' in window || navigator.maxTouchPoints);
}

function adjustLayoutForScreenSize() {
    const screenWidth = window.innerWidth;
    
    // Adjust sidebar behavior
    if (screenWidth < 768) {
        sidebar.classList.add('collapsed');
    } else {
        sidebar.classList.remove('collapsed');
    }
}

function toggleSidebar() {
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('collapsed');
}

// Navigation function
function navigateToSection(sectionId) {
    // Remove active class from all links
    sidebarLinks.forEach(l => l.classList.remove('active'));
    
    // Add active class to clicked link
    const activeLink = document.querySelector(`.sidebar-menu a[data-section="${sectionId}"]`);
    if (activeLink) activeLink.classList.add('active');
    
    // Hide all sections
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Show selected section
    document.getElementById(`${sectionId}-section`).style.display = 'block';
}

// Logout function
function logout() {
    localStorage.removeItem('RenterHubToken');
    window.location.href = '../home.html';
}

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
    
    // Hide after 3 seconds
    setTimeout(() => {
        toastEl.classList.remove('show');
    }, 5000);
}

// API Functions
async function fetchLandlordProfile() {
    try {
        const response = await axios.get('/landlord/getlandlord');
        currentLandlord = response.data;
        
        // Update UI
        landlordNameEl.textContent = currentLandlord.name.toUpperCase();
        document.getElementById('property-landlord-name').value = currentLandlord.name;
        
    } catch (error) {
        console.error('Error fetching landlord profile:', error);
        showToast('Failed to load landlord profile', 'error');
    }
}

async function fetchProperties() {
    try {
        // Show loading state
        propertiesGridEl.innerHTML = '<div class="loading-state">Loading properties...</div>';
        
        const response = await axios.get('/landlord/getProperties');
        properties = response.data;
        
        // Update dashboard count
        propertiesCountEl.textContent = properties.length;
        renderProperties();
        updatePropertyDropdown();
        
    } catch (error) {
        console.error('Error fetching properties:', error);
        showToast('Failed to load properties', 'error');
        propertiesGridEl.innerHTML = `
            <div class="error-state">
                Failed to load properties. 
                <button onclick="fetchProperties()" class="btn btn-secondary">Retry</button>
            </div>
        `;
    }
}

async function fetchTenants() {
    try {
        // Show loading state
        tenantsGridEl.innerHTML = '<div class="loading-state">Loading tenants...</div>';
        
        const response = await axios.get('/landlord/getTenants');
        tenants = response.data;
        
        // Update dashboard count
        tenantsCountEl.textContent = tenants.length;
        renderTenants();
        
    } catch (error) {
        console.error('Error fetching tenants:', error);
        showToast('Failed to load tenants', 'error');
        tenantsGridEl.innerHTML = `
            <div class="error-state">
                Failed to load tenants. 
                <button onclick="fetchTenants()" class="btn btn-secondary">Retry</button>
            </div>
        `;
    }
}

async function fetchRequests() {
    try {
        // Show loading state
        requestsListEl.innerHTML = '<tr><td colspan="8" class="loading-state">Loading requests...</td></tr>';
        
        const response = await axios.get('/landlord/getRequests');
        requests = response.data;
        
        // Update dashboard count
        requestsCountEl.textContent = requests.length;
        renderRequests();
        
    } catch (error) {
        console.error('Error fetching requests:', error);
        showToast('Failed to load maintenance requests', 'error');
        requestsListEl.innerHTML = `
            <tr>
                <td colspan="8" class="error-state">
                    Failed to load requests. 
                    <button onclick="fetchRequests()" class="btn btn-secondary">Retry</button>
                </td>
            </tr>
        `;
    }
}

// Update property dropdown in tenant modal
function updatePropertyDropdown() {
    tenantPropertySelect.innerHTML = '<option value="">Select a property</option>';
    
    properties.forEach(property => {
        const option = document.createElement('option');
        option.value = property._id;
        option.textContent = property.name;
        tenantPropertySelect.appendChild(option);
    });
}

// Render Functions
function renderProperties() {
    propertiesGridEl.innerHTML = '';
    
    if (properties.length === 0) {
        propertiesGridEl.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-home"></i>
                <h3>No Properties Found</h3>
                <p>You haven't added any properties yet. Click the "Add Property" button to get started.</p>
            </div>
        `;
        return;
    }

    properties.forEach(property => {
        const propertyCard = document.createElement('div');
        propertyCard.className = 'grid-card';
        propertyCard.innerHTML = `
            <div class="grid-card-header">
                <h4 class="grid-card-title">${property.name}</h4>
                <span class="badge">${property.status || 'Active'}</span>
            </div>
            <div class="grid-card-body">
                <div class="grid-card-item">
                    <span class="grid-card-label">Address:</span>
                    <span class="grid-card-value">${property.address}</span>
                </div>
                <div class="grid-card-item">
                    <span class="grid-card-label">Rent:</span>
                    <span class="grid-card-value">$${property.rent || '0'} / month</span>
                </div>
            </div>
            <div class="grid-card-actions">
                <button class="action-btn view-btn" data-id="${property._id}">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="action-btn edit-btn" data-id="${property._id}">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="action-btn delete-btn" data-id="${property._id}">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
        propertiesGridEl.appendChild(propertyCard);
    });

    // Add event listeners to property action buttons
    document.querySelectorAll('.grid-card-actions .view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const propertyId = e.currentTarget.getAttribute('data-id');
            viewProperty(propertyId);
        });
    });

    document.querySelectorAll('.grid-card-actions .edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const propertyId = e.currentTarget.getAttribute('data-id');
            editProperty(propertyId);
        });
    });

    document.querySelectorAll('.grid-card-actions .delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const propertyId = e.currentTarget.getAttribute('data-id');
            deleteProperty(propertyId);
        });
    });
}

function renderTenants() {
    tenantsGridEl.innerHTML = '';
    
    if (tenants.length === 0) {
        tenantsGridEl.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-users"></i>
                <h3>No Tenants Found</h3>
                <p>You haven't added any tenants yet. Click the "Add Tenant" button to get started.</p>
            </div>
        `;
        return;
    }

    tenants.forEach(tenant => {
        const tenantCard = document.createElement('div');
        tenantCard.className = 'grid-card';
        tenantCard.innerHTML = `
            <div class="grid-card-header">
                <h4 class="grid-card-title">${tenant.name}</h4>
                <span class="badge">${tenant.status || 'Active'}</span>
            </div>
            <div class="grid-card-body">
                <div class="grid-card-item">
                    <span class="grid-card-label">Email:</span>
                    <span class="grid-card-value">${tenant.email}</span>
                </div>
                <div class="grid-card-item">
                    <span class="grid-card-label">Phone:</span>
                    <span class="grid-card-value">${tenant.phone || 'N/A'}</span>
                </div>
                <div class="grid-card-item">
                    <span class="grid-card-label">Property:</span>
                    <span class="grid-card-value">${tenant.property?.name || 'N/A'}</span>
                </div>
            </div>
            <div class="grid-card-actions">
                <button class="action-btn view-btn" data-id="${tenant._id}">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="action-btn delete-btn" data-id="${tenant._id}">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        `;
        tenantsGridEl.appendChild(tenantCard);
    });

    // Add event listeners to tenant action buttons
    document.querySelectorAll('.grid-card-actions .view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tenantId = e.currentTarget.getAttribute('data-id');
            viewTenant(tenantId);
        });
    });

    document.querySelectorAll('.grid-card-actions .delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tenantId = e.currentTarget.getAttribute('data-id');
            removeTenant(tenantId);
        });
    });
}

function renderRequests() {
    requestsListEl.innerHTML = '';
    
    if (requests.length === 0) {
        requestsListEl.innerHTML = `
            <tr>
                <td colspan="8" class="empty-state">
                    <i class="fas fa-tools"></i>
                    <h3>No Maintenance Requests</h3>
                    <p>There are no active maintenance requests at this time.</p>
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
            <td>${getPropertyName(request.property)}</td>
            <td>${request.tenantName || 'N/A'}</td>
            <td>${new Date(request.createdAt).toLocaleDateString()}</td>
            <td>
                <button class="action-btn view-btn view-request-btn" data-id="${request._id}">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="action-btn edit-btn edit-request-btn" data-id="${request._id}">
                    <i class="fas fa-edit"></i> Update
                </button>
            </td>
        `;
        requestsListEl.appendChild(row);
    });

    // Add event listeners to request action buttons
    document.querySelectorAll('.view-request-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const requestId = e.currentTarget.getAttribute('data-id');
            viewRequest(requestId);
        });
    });

    document.querySelectorAll('.edit-request-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const requestId = e.currentTarget.getAttribute('data-id');
            editRequest(requestId);
        });
    });
}

// Helper functions
function getPropertyName(propertyId) {
    if (!propertyId) return 'N/A';
    const property = properties.find(p => p._id == propertyId);
    return property ? property.name : 'N/A';
}

function getPriorityClass(priority) {
    if (!priority) return 'medium';
    return priority.toLowerCase().replace(' ', '-');
}

function getStatusClass(status) {
    if (!status) return 'pending';
    return status.toLowerCase().replace(' ', '-');
}

// Property CRUD operations
function addProperty() {
    formMode = 'add';
    editingPropertyId = null;
    propertyForm.reset();
    document.getElementById('property-landlord-name').value = currentLandlord.name;
    
    document.querySelector('#property-modal .modal-title').textContent = 'Add Property';
    saveProperty.innerHTML = '<i class="fas fa-plus"></i> Add Property';
    
    propertyModal.style.display = 'flex';
}

function viewProperty(propertyId) {
    const property = properties.find(p => p._id === propertyId);
    if (!property) return;
    showToast(`Viewing property: ${property._id}`);
}

function editProperty(propertyId) {
    const property = properties.find(p => p._id === propertyId);
    if (!property) return;

    formMode = 'edit';
    editingPropertyId = propertyId;

    document.getElementById('property-name').value = property.name;
    document.getElementById('property-address').value = property.address;
    document.getElementById('property-landlord-name').value = property.landlordName;
    document.getElementById('property-rent').value = property.rent;

    document.querySelector('#property-modal .modal-title').textContent = 'Edit Property';
    saveProperty.innerHTML = '<i class="fas fa-save"></i> Update Property';

    propertyModal.style.display = 'flex';
}

async function savePropertyHandler() {
    const name = document.getElementById('property-name').value;
    const address = document.getElementById('property-address').value;
    const landlordName = document.getElementById('property-landlord-name').value;
    const rent = document.getElementById('property-rent').value;

    if (!name || !address || !landlordName || !rent) {
        showToast('Please fill in all fields', 'error');
        return;
    }

    try {
        if (formMode === 'add') {
            await axios.post('/property/addProperty', {
                name,
                address,
                landlordName,
                rent: parseFloat(rent)
            });
            showToast('Property added successfully');
        } else if (formMode === 'edit' && editingPropertyId) {
            await axios.patch(`/property/updateProperty/${editingPropertyId}`, {
                name,
                address,
                landlordName,
                rent: parseFloat(rent)
            });
            showToast('Property updated successfully');
        }

        propertyModal.style.display = 'none';
        fetchProperties();
    } catch (error) {
        console.error('Error saving property:', error);
        showToast('Failed to save property', 'error');
    }
}

async function deleteProperty(propertyId) {
    if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
        return;
    }

    try {
        await axios.delete(`/property/deleteProperty/${propertyId}`);
        showToast('Property deleted successfully');
        fetchProperties();
    } catch (error) {
        console.error('Error deleting property:', error);
        showToast('Failed to delete property', 'error');
    }
}

// Tenant CRUD operations
async function saveTenantHandler() {
    const tenantId = document.getElementById('tenant-id').value;
    const propertyId = document.getElementById('tenant-property').value;

    if (!tenantId || !propertyId) {
        showToast('Please fill in all fields', 'error');
        return;
    }

    try {
        await axios.patch(`/landlord/addTenant/${tenantId}`, { propertyId });
        showToast('Tenant added to property successfully');
        tenantModal.style.display = 'none';
        fetchTenants();
    } catch (error) {
        console.error('Error adding tenant:', error);
        showToast('Failed to add tenant to property', 'error');
    }
}

function viewTenant(tenantId) {
    const tenant = tenants.find(t => t._id === tenantId);
    if (!tenant) return;
    showToast(`Viewing tenant: ${tenant._id}`);
}

async function removeTenant(tenantId) {
    if (!confirm('Are you sure you want to remove this tenant from the property?')) {
        return;
    }

    try {
        await axios.patch(`/landlord/removeTenant/${tenantId}`);
        showToast('Tenant removed successfully');
        fetchTenants();
    } catch (error) {
        console.error('Error removing tenant:', error);
        showToast('Failed to remove tenant', 'error');
    }
}

// Request operations
function viewRequest(requestId) {
    const request = requests.find(r => r._id === requestId);
    if (!request) return;

    document.getElementById('request-title').value = request.title;
    document.getElementById('request-description').value = request.description;
    document.getElementById('request-status').value = request.status;
    document.getElementById('request-response').value = request.response || '';

    document.querySelector('#request-modal .modal-title').textContent = 'Request Details';
    document.getElementById('request-status').disabled = true;
    document.getElementById('request-response').disabled = true;
    document.getElementById('save-request').style.display = 'none';
    requestModal.style.display = 'flex';
}

function editRequest(requestId) {
    const request = requests.find(r => r._id === requestId);
    if (!request) return;

    currentRequestId = requestId;

    document.getElementById('request-title').value = request.title;
    document.getElementById('request-description').value = request.description;
    document.getElementById('request-status').value = request.status;
    document.getElementById('request-response').value = request.response || '';

    document.querySelector('#request-modal .modal-title').textContent = 'Update Request';
    document.getElementById('request-status').disabled = false;
    document.getElementById('request-response').disabled = false;
    document.getElementById('save-request').style.display = 'inline-block';
    requestModal.style.display = 'flex';
}

async function saveRequestHandler() {
    const status = document.getElementById('request-status').value;
    const response = document.getElementById('request-response').value;

    if (!status) {
        showToast('Please select a status', 'error');
        return;
    }

    try {
        const updateData = { status, response };
        await axios.patch(`/request/updateRequest/${currentRequestId}`, updateData);
        
        showToast('Request updated successfully');
        requestModal.style.display = 'none';
        currentRequestId = null;
        fetchRequests();
    } catch (error) {
        console.error('Error updating request:', error);
        showToast('Failed to update request', 'error');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);