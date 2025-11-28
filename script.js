// Global state
let currentUser = null;
let selectedClient = null;
let selectedDocType = null;
let processedDocuments = [];

// Authentication Functions
function showLogin() {
    document.getElementById('login-form').classList.add('active');
    document.getElementById('register-form').classList.remove('active');
}

function showRegister() {
    document.getElementById('register-form').classList.add('active');
    document.getElementById('login-form').classList.remove('active');
}

// Handle form submissions
document.addEventListener('DOMContentLoaded', function () {
    // Login form handler
    document.querySelector('#login-form form').addEventListener('submit', function (e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        if (email && password) {
            login(email, password);
        }
    });

    // Register form handler
    document.querySelector('#register-form form').addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirm = document.getElementById('register-confirm').value;
        const userType = document.getElementById('register-type').value;
        const phone = document.getElementById('register-phone').value;
        const company = document.getElementById('register-company').value;
        const address = document.getElementById('register-address').value;
        const isVisible = document.getElementById('register-visible').checked;
        const acceptsOffers = document.getElementById('register-offers').checked;

        if (password !== confirm) {
            alert('Passwords do not match!');
            return;
        }

        if (name && email && password) {
            const userData = {
                name,
                email,
                password,
                userType,
                phone,
                address,
                isVisibleToClients: isVisible,
                acceptsJobOffers: acceptsOffers
            };

            if (userType === 'BUSINESS') {
                userData.company = company;
            }

            register(userData);
        }
    });

    // Handle Account Type change
    const typeSelect = document.getElementById('register-type');
    if (typeSelect) {
        typeSelect.addEventListener('change', function (e) {
            const companyGroup = document.getElementById('company-group');
            if (e.target.value === 'BUSINESS') {
                companyGroup.classList.remove('hidden');
            } else {
                companyGroup.classList.add('hidden');
            }
        });
    }

    // Set current date in filters
    const now = new Date();
    const currentYear = now.getFullYear().toString();
    const currentMonth = String(now.getMonth() + 1).padStart(2, '0');

    document.getElementById('year-filter').value = currentYear;
    document.getElementById('month-filter').value = currentMonth;
});

function login(email, password) {
    // Simulate login process
    showLoading();

    setTimeout(() => {
        currentUser = {
            name: email.split('@')[0],
            email: email
        };

        document.querySelector('.user-info').textContent = `Welcome, ${currentUser.name}`;
        document.getElementById('auth-container').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('hidden');
        hideLoading();
    }, 1000);
}

function register(userData) {
    // Simulate registration process
    showLoading();

    console.log('Registering user with data:', userData);

    setTimeout(() => {
        alert('Account created successfully! Please sign in.');
        showLogin();
        hideLoading();
    }, 1000);
}

function logout() {
    currentUser = null;
    selectedClient = null;
    selectedDocType = null;
    processedDocuments = [];

    // Reset forms
    document.querySelectorAll('form').forEach(form => form.reset());

    // Reset UI state
    document.querySelectorAll('.client-content').forEach(content => {
        content.classList.remove('expanded');
    });
    document.querySelectorAll('.client-header').forEach(header => {
        header.classList.remove('expanded');
    });
    document.querySelectorAll('.doc-type').forEach(docType => {
        docType.classList.remove('selected');
    });

    // Show auth screen
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('auth-container').classList.remove('hidden');
    showLogin();
}

// Client Tree Functions
function toggleClient(clientId) {
    const content = document.getElementById(clientId + '-content');
    const icon = document.getElementById(clientId + '-icon');
    const header = document.querySelector(`[onclick="toggleClient('${clientId}')"]`);

    if (content.classList.contains('expanded')) {
        content.classList.remove('expanded');
        header.classList.remove('expanded');
        icon.style.transform = 'rotate(0deg)';
    } else {
        // Close other clients
        document.querySelectorAll('.client-content').forEach(c => {
            if (c !== content) {
                c.classList.remove('expanded');
            }
        });
        document.querySelectorAll('.client-header').forEach(h => {
            if (h !== header) {
                h.classList.remove('expanded');
            }
        });
        document.querySelectorAll('.client-header i').forEach(i => {
            if (i !== icon) {
                i.style.transform = 'rotate(0deg)';
            }
        });

        content.classList.add('expanded');
        header.classList.add('expanded');
        icon.style.transform = 'rotate(90deg)';
    }
}

function selectDocType(client, docType) {
    // Remove previous selection
    document.querySelectorAll('.doc-type').forEach(dt => {
        dt.classList.remove('selected');
    });

    // Add selection to clicked item
    event.target.classList.add('selected');

    selectedClient = client;
    selectedDocType = docType;

    // Update UI to show filtered documents
    filterDocuments(client, docType);
}

function filterDocuments(client, docType) {
    // This would typically filter the document queue based on client and document type
    console.log(`Filtering documents for ${client} - ${docType}`);

    // For demo purposes, we'll just show a message
    const queueContent = document.getElementById('queue-content');
    queueContent.innerHTML = `
        <div class="filter-info">
            <p><strong>Filtered by:</strong> ${getClientDisplayName(client)} - ${getDocTypeDisplayName(docType)}</p>
            <button class="btn btn-secondary" onclick="clearFilter()">Clear Filter</button>
        </div>
        <div class="empty-state">No documents found for the selected filter.</div>
    `;
}

function clearFilter() {
    selectedClient = null;
    selectedDocType = null;

    document.querySelectorAll('.doc-type').forEach(dt => {
        dt.classList.remove('selected');
    });

    document.getElementById('queue-content').innerHTML =
        '<p class="empty-state">Select documents from the queue above to process them.</p>';
}

function getClientDisplayName(client) {
    const names = {
        'totalflow': 'TotalFlow Ltd',
        'jeff': 'Jeff Nuttall',
        'schneider': 'Schneider Ltd'
    };
    return names[client] || client;
}

function getDocTypeDisplayName(docType) {
    const types = {
        'invoice': 'Invoice',
        'bill': 'Bill',
        'receipt': 'Receipt / Cash Receipt',
        'proforma': 'Proforma Invoice',
        'credit': 'Credit Note',
        'debit': 'Debit Note',
        'purchase': 'Purchase Order',
        'sales': 'Sales Order'
    };
    return types[docType] || docType;
}

// Document Management Functions
function uploadDocument() {
    // Create file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf';
    input.multiple = true;

    input.onchange = function (e) {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            addDocumentToQueue(file);
        });
    };

    input.click();
}

function addDocumentToQueue(file) {
    const queueTableBody = document.getElementById('queue-table-body');
    const docId = 'doc' + Date.now();
    const uploadDate = new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="checkbox" class="doc-checkbox" id="${docId}"></td>
        <td><div class="doc-thumbnail clickable" onclick="openImageModal('${docId}', '${file.name}')"><i class="fas fa-file-image"></i></div></td>
        <td>${file.name}</td>
        <td>${formatFileSize(file.size)}</td>
        <td>${uploadDate}</td>
        <td>
            <div class="action-buttons">
                <button class="btn btn-success btn-action" onclick="processDocument('${docId}')">Proceed</button>
                <button class="btn btn-danger btn-action" onclick="deleteDocument('${docId}')">Delete</button>
            </div>
        </td>
    `;

    queueTableBody.appendChild(row);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function processDocument(docId) {
    const docElement = document.getElementById(docId).closest('tr');
    const docName = docElement.cells[2].textContent;

    // Add loading state
    docElement.classList.add('loading');

    // Simulate OCR processing
    setTimeout(() => {
        // Generate mock extracted data
        const extractedData = generateMockData(docName);
        processedDocuments.push(extractedData);

        // Remove from queue
        docElement.remove();

        // Update digitized tab
        updateDigitizedTab();

        // Show digitized tab
        showTab('digitized');

        // Show notification
        showNotification(`Document "${docName}" processed successfully!`, 'success');
    }, 2000);
}

function deleteDocument(docId) {
    if (confirm('Are you sure you want to delete this document?')) {
        const docElement = document.getElementById(docId).closest('tr');
        const docName = docElement.cells[2].textContent;
        docElement.remove();
        showNotification(`Document "${docName}" deleted.`, 'info');
    }
}

function generateMockData(docName) {
    const vendors = [
        { name: 'UGG EXPRESS AUSTRALIA', abn: '44 168 465 405' },
        { name: 'Spotlight Hoppers Crossing', abn: '39564681886' },
        { name: 'Kmart Werribee', abn: '73 004 700 485' },
        { name: 'Woolworths Metro', abn: '88 000 014 675' }
    ];

    const descriptions = [
        'AS+MINI CLASSIC boots',
        'Zanzibar pillows return',
        'Goods: microwave, screen',
        'Groceries and household items'
    ];

    const paymentMethods = [
        'Cash + Mastercard',
        'Mastercard (EFTPOS)',
        'Mastercard',
        'Visa Debit'
    ];

    const statuses = ['Accepted', 'Approved', 'Refund', 'Pending'];
    const docTypes = ['Tax Invoice', 'Return Tax Invoice', 'Receipt', 'Credit Note'];

    const vendor = vendors[Math.floor(Math.random() * vendors.length)];
    const amount = (Math.random() * 200 + 10).toFixed(2);
    const gst = (amount * 0.091).toFixed(2);
    const isRefund = Math.random() < 0.2;

    return {
        id: Date.now(),
        number: processedDocuments.length + 1,
        transactionDate: new Date().toLocaleString('en-AU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }),
        vendor: vendor.name,
        abn: vendor.abn,
        amount: isRefund ? `-$${amount}` : `$${amount}`,
        gst: isRefund ? `-$${gst}` : `$${gst}`,
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        transactionStatus: statuses[Math.floor(Math.random() * statuses.length)],
        documentType: docTypes[Math.floor(Math.random() * docTypes.length)],
        status: 'Processed'
    };
}

function updateDigitizedTab() {
    const tableBody = document.getElementById('digitized-table-body');

    // Get existing static rows
    const existingRows = tableBody.querySelectorAll('tr');
    const staticRowsCount = existingRows.length;

    // Add processed documents after static rows
    processedDocuments.forEach((doc, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${staticRowsCount + index + 1}</td>
            <td>${doc.transactionDate}</td>
            <td>${doc.vendor}</td>
            <td>${doc.abn}</td>
            <td>${doc.amount}</td>
            <td>${doc.gst}</td>
            <td>${doc.description}</td>
            <td>${doc.paymentMethod}</td>
            <td>${doc.transactionStatus}</td>
            <td>${doc.documentType}</td>
            <td><span class="status-badge status-processed">${doc.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-primary btn-action" onclick="editDigitizedDocument(${doc.id})">Edit</button>
                    <button class="btn btn-danger btn-action" onclick="deleteDigitizedDocument(${doc.id})">Delete</button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Enable digitized tab
    const digitizedTab = document.getElementById('digitized-tab');
    digitizedTab.style.opacity = '1';
    digitizedTab.style.pointerEvents = 'auto';
}

function editDocument(docId) {
    const doc = processedDocuments.find(d => d.id === docId);
    if (doc) {
        alert(`Edit functionality for "${doc.document}" would open here.`);
    }
}

function deleteDigitizedDocument(docId) {
    if (confirm('Are you sure you want to delete this digitized document?')) {
        const docIndex = processedDocuments.findIndex(d => d.id === docId);
        if (docIndex !== -1) {
            const docName = processedDocuments[docIndex].document;
            processedDocuments.splice(docIndex, 1);
            updateDigitizedTab();
            showNotification(`Document "${docName}" deleted from digitized.`, 'info');
        }
    }
}

function exportToExcel() {
    if (processedDocuments.length === 0) {
        showNotification('No data to export', 'error');
        return;
    }

    // Create CSV content
    const headers = ['Document', 'Date', 'Amount', 'Vendor', 'Tax Info', 'Status', 'Processed At'];
    const csvContent = [headers.join(',')];

    processedDocuments.forEach(doc => {
        const row = [
            `"${doc.document}"`,
            `"${doc.date}"`,
            `"${doc.amount}"`,
            `"${doc.vendor}"`,
            `"${doc.taxInfo}"`,
            `"${doc.status}"`,
            `"${doc.processedAt}"`
        ];
        csvContent.push(row.join(','));
    });

    const csvData = csvContent.join('\n');
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `digitized_documents_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();

    URL.revokeObjectURL(url);
    showNotification('Data exported to Excel!', 'success');
}

// Tab Management
function showTab(tabName) {
    // Remove active class from all tabs and content
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });

    // Add active class to selected tab and content
    document.querySelector(`[onclick="showTab('${tabName}')"]`).classList.add('active');
    document.getElementById(tabName + '-content').classList.add('active');
}

// Utility Functions
function showLoading() {
    document.body.style.cursor = 'wait';
}

function hideLoading() {
    document.body.style.cursor = 'default';
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
    `;

    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
                max-width: 400px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                animation: slideIn 0.3s ease-out;
            }
            .notification-content {
                padding: 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 12px;
            }
            .notification-content button {
                background: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
                opacity: 0.7;
            }
            .notification-content button:hover {
                opacity: 1;
            }
            .notification-success {
                background: #dcfce7;
                color: #166534;
                border-left: 4px solid #10b981;
            }
            .notification-info {
                background: #dbeafe;
                color: #1e40af;
                border-left: 4px solid #3b82f6;
            }
            .notification-error {
                background: #fee2e2;
                color: #991b1b;
                border-left: 4px solid #ef4444;
            }
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
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

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Date filter handlers
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('year-filter').addEventListener('change', function (e) {
        const selectedYear = e.target.value;
        const selectedMonth = document.getElementById('month-filter').value;
        console.log('Year filter changed to:', selectedYear);
        showNotification(`Filtering documents for ${getMonthName(selectedMonth)} ${selectedYear}`, 'info');
    });

    document.getElementById('month-filter').addEventListener('change', function (e) {
        const selectedMonth = e.target.value;
        const selectedYear = document.getElementById('year-filter').value;
        console.log('Month filter changed to:', selectedMonth);
        showNotification(`Filtering documents for ${getMonthName(selectedMonth)} ${selectedYear}`, 'info');
    });
});

function getMonthName(monthValue) {
    const months = {
        '01': 'January', '02': 'February', '03': 'March', '04': 'April',
        '05': 'May', '06': 'June', '07': 'July', '08': 'August',
        '09': 'September', '10': 'October', '11': 'November', '12': 'December'
    };
    return months[monthValue] || monthValue;
}

// Keyboard shortcuts
document.addEventListener('keydown', function (e) {
    // Ctrl/Cmd + U for upload
    if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        if (!document.getElementById('dashboard').classList.contains('hidden')) {
            uploadDocument();
        }
    }

    // Escape to clear filters
    if (e.key === 'Escape') {
        if (selectedClient || selectedDocType) {
            clearFilter();
        }
    }
});

// Modal functions
function openImageModal(docId, docName) {
    const modal = document.getElementById('image-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalImage = document.getElementById('modal-image');

    modalTitle.textContent = docName;
    // For demo purposes, we'll use a placeholder image
    // In real implementation, this would be the actual document image
    modalImage.src = `https://via.placeholder.com/800x600/f8fafc/64748b?text=${encodeURIComponent(docName)}`;

    modal.classList.remove('hidden');

    // Close modal on background click
    modal.onclick = function (e) {
        if (e.target === modal) {
            closeImageModal();
        }
    };
}

function closeImageModal() {
    const modal = document.getElementById('image-modal');
    modal.classList.add('hidden');
}

// Select all functionality
document.addEventListener('DOMContentLoaded', function () {
    const selectAllCheckbox = document.getElementById('select-all');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function () {
            const checkboxes = document.querySelectorAll('.doc-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }
});

// Initialize digitized tab as disabled and add sample documents
document.addEventListener('DOMContentLoaded', function () {
    const digitizedTab = document.getElementById('digitized-tab');
    digitizedTab.style.opacity = '0.5';
    digitizedTab.style.pointerEvents = 'none';

    // Close modal with Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeImageModal();
        }
    });

    // Add sample documents to queue
    addSampleDocumentToQueue('Cash Receipt 2', 1.8 * 1024 * 1024); // 1.8 MB
    addSampleDocumentToQueue('Cash Receipt 3', 2.1 * 1024 * 1024); // 2.1 MB
});

// Function to add sample documents
function addSampleDocumentToQueue(name, size) {
    const queueTableBody = document.getElementById('queue-table-body');
    const docId = 'doc' + Date.now() + Math.random();
    const uploadDate = new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="checkbox" class="doc-checkbox" id="${docId}"></td>
        <td><div class="doc-thumbnail clickable" onclick="openImageModal('${docId}', '${name}')"><i class="fas fa-file-image"></i></div></td>
        <td>${name}</td>
        <td>${formatFileSize(size)}</td>
        <td>${uploadDate}</td>
        <td>
            <div class="action-buttons">
                <button class="btn btn-success btn-action" onclick="processDocument('${docId}')">Proceed</button>
                <button class="btn btn-danger btn-action" onclick="deleteDocument('${docId}')">Delete</button>
            </div>
        </td>
    `;

    queueTableBody.appendChild(row);
}