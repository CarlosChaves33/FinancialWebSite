// Check authentication
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/';
    }
    return token;
}

// Format date for display
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Load entries
async function loadEntries() {
    const token = checkAuth();
    try {
        const response = await fetch('/api/entries', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const entries = await response.json();
        
        const tableBody = document.getElementById('entriesTableBody');
        tableBody.innerHTML = entries.map(entry => `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap">${formatDate(entry.date)}</td>
                <td class="px-6 py-4 whitespace-nowrap capitalize">${entry.type}</td>
                <td class="px-6 py-4 whitespace-nowrap">${entry.category}</td>
                <td class="px-6 py-4 whitespace-nowrap">${entry.description}</td>
                <td class="px-6 py-4 whitespace-nowrap ${entry.type === 'income' ? 'text-green-600' : 'text-red-600'}">
                    ${entry.type === 'income' ? '+' : '-'}${formatCurrency(entry.amount)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onclick="editEntry('${entry._id}')" class="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                    <button onclick="deleteEntry('${entry._id}')" class="text-red-600 hover:text-red-900">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading entries:', error);
    }
}

// Show modal
function showModal(title = 'Add New Entry') {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('entryModal').classList.remove('hidden');
    document.getElementById('entryForm').reset();
    document.getElementById('date').valueAsDate = new Date();
}

// Hide modal
function hideModal() {
    document.getElementById('entryModal').classList.add('hidden');
    document.getElementById('entryForm').reset();
    document.getElementById('entryId').value = '';
}

// Edit entry
async function editEntry(id) {
    const token = checkAuth();
    try {
        const response = await fetch(`/api/entries/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const entry = await response.json();
        
        document.getElementById('entryId').value = entry._id;
        document.getElementById('type').value = entry.type;
        document.getElementById('amount').value = entry.amount;
        document.getElementById('category').value = entry.category;
        document.getElementById('description').value = entry.description;
        document.getElementById('date').value = new Date(entry.date).toISOString().split('T')[0];
        
        showModal('Edit Entry');
    } catch (error) {
        console.error('Error loading entry:', error);
    }
}

// Delete entry
async function deleteEntry(id) {
    if (!confirm('Are you sure you want to delete this entry?')) return;
    
    const token = checkAuth();
    try {
        await fetch(`/api/entries/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        loadEntries();
    } catch (error) {
        console.error('Error deleting entry:', error);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadEntries();
    
    // Add Entry button
    document.getElementById('addEntryBtn').addEventListener('click', () => showModal());
    
    // Close modal button
    document.getElementById('closeModal').addEventListener('click', hideModal);
    
    // Form submission
    document.getElementById('entryForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const token = checkAuth();
        const entryId = document.getElementById('entryId').value;
        const entryData = {
            type: document.getElementById('type').value,
            amount: parseFloat(document.getElementById('amount').value),
            category: document.getElementById('category').value,
            description: document.getElementById('description').value,
            date: document.getElementById('date').value
        };
        
        try {
            const url = entryId ? `/api/entries/${entryId}` : '/api/entries';
            const method = entryId ? 'PUT' : 'POST';
            
            await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(entryData)
            });
            
            hideModal();
            loadEntries();
        } catch (error) {
            console.error('Error saving entry:', error);
        }
    });
});

// Handle logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/';
}); 