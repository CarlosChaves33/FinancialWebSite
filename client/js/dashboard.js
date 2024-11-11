// Check if user is logged in
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
    }
    return token;
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Fetch and display dashboard data
async function loadDashboard() {
    const token = checkAuth();
    try {
        const response = await fetch('/api/entries', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const entries = await response.json();

        // Calculate totals
        let income = 0;
        let expenses = 0;
        entries.forEach(entry => {
            if (entry.type === 'income') {
                income += entry.amount;
            } else {
                expenses += entry.amount;
            }
        });

        // Update dashboard cards
        document.getElementById('totalIncome').textContent = formatCurrency(income);
        document.getElementById('totalExpenses').textContent = formatCurrency(expenses);
        document.getElementById('totalBalance').textContent = formatCurrency(income - expenses);

        // Display recent transactions
        const recentTransactions = entries
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

        const transactionsList = document.getElementById('recentTransactions');
        transactionsList.innerHTML = recentTransactions.map(entry => `
            <li class="p-4">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm font-medium text-gray-900">${entry.description}</p>
                        <p class="text-sm text-gray-500">${entry.category}</p>
                    </div>
                    <div class="text-sm ${entry.type === 'income' ? 'text-green-600' : 'text-red-600'}">
                        ${entry.type === 'income' ? '+' : '-'}${formatCurrency(entry.amount)}
                    </div>
                </div>
            </li>
        `).join('');

    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// Handle logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
});

// Load dashboard data when page loads
document.addEventListener('DOMContentLoaded', loadDashboard); 