// Check if user is logged in
const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (token) {
        document.getElementById('loginBtn').style.display = 'none';
        document.getElementById('registerBtn').style.display = 'none';
        // Add logout button
        const navLinks = document.querySelector('.nav-links');
        const logoutBtn = document.createElement('a');
        logoutBtn.href = '#';
        logoutBtn.textContent = 'Logout';
        logoutBtn.onclick = handleLogout;
        navLinks.appendChild(logoutBtn);
    }
};

// Handle logout
const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    window.location.reload();
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
}); 