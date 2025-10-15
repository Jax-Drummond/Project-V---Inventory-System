const API_BASE = 'http://localhost:3000';
let currentData = [];

async function loadData(type) {
  const res = await fetch(`${API_BASE}/${type}`);
  const data = await res.json();
  currentData = data;
  renderTable(currentData);
}

function renderTable(data) {
  const tbody = document.querySelector('#data-table tbody');
  tbody.innerHTML = '';

  data.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.id}</td>
      <td>${item.name || '-'}</td>
      <td>${item.price !== undefined ? `$${item.price.toFixed(2)}` : '-'}</td>
      <td>${item.quantity !== undefined ? item.quantity : '-'}</td>
      <td>${item.status || '-'}</td>
      <td>
        <button onclick="openEditModal(${item.id})">Edit</button>
        <button onclick="deleteProduct(${item.id})">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

//Filter by name
document.getElementById('search-input').addEventListener('input', e => {
  const query = e.target.value.toLowerCase();
  const filtered = currentData.filter(item =>
    item.name?.toLowerCase().includes(query)
  );
  renderTable(filtered);
});

//Sort by name
function sortData(order) {
  const sorted = [...currentData].sort((a, b) => {
    const nameA = a.name?.toLowerCase() || '';
    const nameB = b.name?.toLowerCase() || '';
    return order === 'asc'
      ? nameA.localeCompare(nameB)
      : nameB.localeCompare(nameA);
  });
  renderTable(sorted);
}

//Edit Modal Logic
function openEditModal(id) {
  const product = currentData.find(p => p.id === id);
  if (!product) return;

  document.getElementById('edit-id').value = product.id;
  document.getElementById('edit-name').value = product.name;
  document.getElementById('edit-price').value = product.price;
  document.getElementById('edit-quantity').value = product.quantity;
  document.getElementById('edit-status').value = product.status;

  document.getElementById('edit-modal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('edit-modal').classList.add('hidden');
}

//Save
document.getElementById('edit-form').addEventListener('submit', async e => {
  e.preventDefault();

  const id = document.getElementById('edit-id').value;
  const updatedProduct = {
    name: document.getElementById('edit-name').value,
    price: parseFloat(document.getElementById('edit-price').value),
    quantity: parseInt(document.getElementById('edit-quantity').value),
    status: document.getElementById('edit-status').value
  };

  await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedProduct)
  });

  closeModal();
  loadData('products');
});

//Delete Product
async function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) return;

  await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE'
  });

  loadData('products');
}
