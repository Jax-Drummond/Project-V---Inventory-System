/**
 * API Helper Class
 * Handles generic Fetch requests to the Express Backend
 */
class ApiClient {
    constructor(baseUrl = 'api') {
        this.baseUrl = baseUrl;
    }

    async get(endpoint) {
        // This expects the backend to be serving at /api/{endpoint}
        const res = await fetch(`${this.baseUrl}/${endpoint}`);
        if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
        return await res.json();
    }

    async put(endpoint, id, data) {
        const res = await fetch(`${this.baseUrl}/${endpoint}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error(`Update Failed: ${res.statusText}`);
        return await res.json();
    }

    async delete(endpoint, id) {
        const res = await fetch(`${this.baseUrl}/${endpoint}/${id}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error(`Delete Failed: ${res.statusText}`);
        return true;
    }
}

/**
 * Configuration for different Data Types
 * Maps the API data structure to the UI Columns
 */
const RESOURCE_CONFIG = {
    products: {
        label: 'Products',
        columns: [
            { key: 'id', label: 'ID', type: 'text', editable: false },
            { key: 'name', label: 'Name', type: 'text', editable: false },
            { key: 'price', label: 'Price', type: 'currency', editable: false },
            { key: 'description', label: 'Description', type: 'text', editable: false }
        ],
        endpoint: 'products' // matches /api/products
    },
    stock: {
        label: 'Stock',
        columns: [
            { key: 'id', label: 'ID', type: 'text', editable: false },
            { key: 'Product.name', label: 'Product Name', type: 'text', editable: false }, 
            { key: 'qty', label: 'Qty', type: 'number', editable: true },
            { key: 'threshold', label: 'Threshold', type: 'number', editable: true },
            { key: 'price', label: 'Price', type: 'currency', editable: true }
        ],
        endpoint: 'stock' // matches /api/stock
    },
    orders: {
        label: 'Orders',
        columns: [
            { key: 'id', label: 'Order ID', type: 'text', editable: false },
            { key: 'date', label: 'Date', type: 'date', editable: false },
            { key: 'status', label: 'Status', type: 'status', editable: true },
            { key: 'cost', label: 'Total Cost', type: 'currency', editable: false },
            { key: 'qty', label: 'Items', type: 'number', editable: false }
        ],
        endpoint: 'orders' // matches /api/orders
    },
    equipment: {
        label: 'Equipment',
        columns: [
            { key: 'id', label: 'Asset ID', type: 'text', editable: false },
            { key: 'Product.name', label: 'Equipment Type', type: 'text', editable: false },
            { key: 'status', label: 'Condition', type: 'status', editable: true },
            { key: 'qty', label: 'Qty', type: 'number', editable: false }
        ],
        endpoint: 'equipment' // matches /api/equipment
    }
};

/**
 * Main Application Class
 */
class InventoryApp {
    constructor() {
        this.api = new ApiClient();
        this.currentType = 'products';
        this.currentData = [];

        // Bind DOM elements
        this.els = {
            nav: document.getElementById('nav-menu'),
            tableHead: document.getElementById('table-head'),
            tableBody: document.getElementById('table-body'),
            searchInput: document.getElementById('search-input'),
            modal: document.getElementById('modal-overlay'),
            modalContent: document.getElementById('modal-content'),
            modalFields: document.getElementById('modal-fields'),
            editForm: document.getElementById('edit-form'),
            editId: document.getElementById('edit-id'),
            emptyState: document.getElementById('empty-state'),
            toast: document.getElementById('toast'),
            toastMsg: document.getElementById('toast-message')
        };

        this.init();
    }

    init() {
        this.renderNav();
        this.loadData(this.currentType);

        // Event Listeners
        document.getElementById('btn-refresh').addEventListener('click', () => this.loadData(this.currentType));
        document.getElementById('btn-create').addEventListener('click', () => alert("Feature not yet implemented."));

        this.els.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));

        this.els.editForm.addEventListener('submit', (e) => this.handleSave(e));

        // Close modal on outside click
        this.els.modal.addEventListener('click', (e) => {
            if (e.target === this.els.modal) this.closeModal();
        });
    }

    renderNav() {
        this.els.nav.innerHTML = Object.keys(RESOURCE_CONFIG).map(key => {
            const isActive = key === this.currentType;
            const classes = isActive
                ? 'bg-gray-900 text-green-400 border-green-500'
                : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200 border-transparent';

            return `<button onclick="app.switchType('${key}')"
                    class="w-full text-left px-4 py-3 rounded-md border-l-4 font-medium transition-all duration-200 flex items-center justify-between ${classes}">
                    <span>${RESOURCE_CONFIG[key].label}</span>
                    ${isActive ? '<span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>' : ''}
                </button>`;
        }).join('');
    }

    switchType(type) {
        this.currentType = type;
        this.renderNav();
        this.loadData(type);
    }

    async loadData(type) {
        try {
            const config = RESOURCE_CONFIG[type];
            this.showToast('Loading data...', 'info');

            // Call the Backend
            this.currentData = await this.api.get(config.endpoint);

            this.renderTable(this.currentData);
            this.showToast('Data synchronized', 'success');
        } catch (error) {
            console.error(error);
            this.showToast('Failed to connect to Backend', 'error');
            this.renderTable([]);
        }
    }

    // Helper to access nested properties safely (e.g. 'Product.name')
    getNestedValue(obj, path) {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    }

    renderTable(data) {
        const config = RESOURCE_CONFIG[this.currentType];

        // Render Headers
        this.els.tableHead.innerHTML = `
            <tr>
                ${config.columns.map(col =>
                    `<th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">${col.label}</th>`
                ).join('')}
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
        `;

        // Render Body
        if (!data || data.length === 0) {
            this.els.tableBody.innerHTML = '';
            this.els.emptyState.classList.remove('hidden');
            return;
        }

        this.els.emptyState.classList.add('hidden');

        this.els.tableBody.innerHTML = data.map(item => `
            <tr class="hover:bg-gray-700/50 transition-colors">
                ${config.columns.map(col => {
                    let val = this.getNestedValue(item, col.key);

                    // Formatting
                    if (col.type === 'currency') val = val ? `$${parseFloat(val).toFixed(2)}` : '-';
                    if (col.type === 'date') val = val ? new Date(val).toLocaleDateString() : '-';
                    if (val === undefined || val === null) val = '<span class="text-gray-600 italic">N/A</span>';

                    // Status Badges
                    if (col.type === 'status') {
                        const color = String(val).toLowerCase().includes('available') ? 'bg-green-900 text-green-300'
                                    : String(val).toLowerCase().includes('stock') ? 'bg-yellow-900 text-yellow-300'
                                    : String(val).toLowerCase().includes('received') ? 'bg-green-900 text-green-300'
                                    : 'bg-red-900 text-red-300';
                        val = `<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${color}">${val}</span>`;
                    }

                    return `<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${val}</td>`;
                }).join('')}

                ${this.currentType != "products" && this.currentType != "equipment" ? 
    `<td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button onclick="app.openModal(${item.id})" class="text-green-400 hover:text-green-300 mr-3">Edit</button>
        
        ${this.currentType  == "stock" ? 
            `<button onclick="app.deleteEntry(${item.id})" class="text-red-400 hover:text-red-300">Delete</button>` 
            : '' 
        }
            </td>` 
        : ''}
            </tr>
        `).join('');
    }

    handleSearch(query) {
        const lowerQuery = query.toLowerCase();
        const config = RESOURCE_CONFIG[this.currentType];

        const filtered = this.currentData.filter(item => {
            // Search across all defined columns
            return config.columns.some(col => {
                const val = this.getNestedValue(item, col.key);
                return val && String(val).toLowerCase().includes(lowerQuery);
            });
        });

        this.renderTable(filtered);
    }

    openModal(id) {
        const item = this.currentData.find(d => d.id === id);
        if (!item) return;

        const config = RESOURCE_CONFIG[this.currentType];
        this.els.editId.value = id;

        // Generate Form Fields
        this.els.modalFields.innerHTML = config.columns.map(col => {
            if (!col.editable) return ''; // Skip non-editable fields

            const val = this.getNestedValue(item, col.key);

            return `
                <div>
                    <label class="block text-sm font-medium text-gray-400 mb-1">${col.label}</label>
                    <input type="${col.type === 'number' ? 'number' : 'text'}"
                           name="${col.key}"
                           value="${val || ''}"
                           class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:border-green-500 focus:outline-none transition-colors"
                    >
                </div>
            `;
        }).join('');

        this.els.modal.classList.remove('hidden');
        setTimeout(() => this.els.modal.classList.remove('opacity-0'), 10); // Fade in
    }

    closeModal() {
        this.els.modal.classList.add('opacity-0');
        setTimeout(() => this.els.modal.classList.add('hidden'), 300); // Wait for transition
    }

    async handleSave(e) {
        e.preventDefault();
        const id = this.els.editId.value;
        const formData = new FormData(this.els.editForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const config = RESOURCE_CONFIG[this.currentType];
            await this.api.put(config.endpoint, id, data);
            this.showToast('Entry updated successfully', 'success');
            this.closeModal();
            this.loadData(this.currentType);
        } catch (error) {
            console.error(error);
            this.showToast('Failed to update entry', 'error');
        }
    }

    async deleteEntry(id) {
        if (!confirm("Are you sure you want to cross the streams? (Delete this item?)")) return;

        try {
            const config = RESOURCE_CONFIG[this.currentType];
            await this.api.delete(config.endpoint, id);
            this.showToast('Entry deleted', 'success');
            this.loadData(this.currentType);
        } catch (error) {
            console.error(error);
            this.showToast('Failed to delete', 'error');
        }
    }

    showToast(msg, type = 'info') {
        const colors = {
            info: 'bg-blue-600 text-white',
            success: 'bg-green-600 text-white',
            error: 'bg-red-600 text-white'
        };

        this.els.toast.className = `fixed bottom-5 right-5 px-6 py-3 rounded-md shadow-lg transform transition-transform duration-300 flex items-center gap-3 text-sm font-medium z-50 ${colors[type]}`;
        this.els.toastMsg.innerText = msg;

        // Slide up
        this.els.toast.classList.remove('translate-y-20');

        // Hide after 3s
        setTimeout(() => {
            this.els.toast.classList.add('translate-y-20');
        }, 3000);
    }
}

// Initialize App
// Ensure 'app' is accessible globally for HTML event handlers (onclick="app.switchType...")
window.app = new InventoryApp();