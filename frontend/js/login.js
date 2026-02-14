document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
        window.location.href = '/dashboard.html';
        return;
    }
    
    // Login form handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            const errorDiv = document.getElementById('loginError');
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            
            // Clear previous errors
            errorDiv.textContent = '';
            
            // Validate inputs
            if (!email || !password) {
                errorDiv.textContent = 'Please fill in all fields';
                return;
            }
            
            // Disable button
            submitBtn.disabled = true;
            submitBtn.textContent = 'Logging in...';
            
            try {
                const data = await login(email, password);
                
                // Save to localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.username);
                localStorage.setItem('userId', data.userId);
                
                // Redirect to dashboard
                window.location.href = '/dashboard.html';
                
            } catch (error) {
                errorDiv.textContent = error.message || 'Login failed';
                submitBtn.disabled = false;
                submitBtn.textContent = 'Login';
            }
        });
    }
    
    // Register form handler
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('registerUsername').value.trim();
            const email = document.getElementById('registerEmail').value.trim();
            const password = document.getElementById('registerPassword').value;
            const errorDiv = document.getElementById('registerError');
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            
            // Clear previous errors
            errorDiv.textContent = '';
            
            // Validate inputs
            if (!username || !email || !password) {
                errorDiv.textContent = 'Please fill in all fields';
                return;
            }
            
            if (password.length < 6) {
                errorDiv.textContent = 'Password must be at least 6 characters';
                return;
            }
            
            // Disable button
            submitBtn.disabled = true;
            submitBtn.textContent = 'Registering...';
            
            try {
                const data = await register(username, email, password);
                
                // Save to localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.username);
                localStorage.setItem('userId', data.userId);
                
                // Redirect to dashboard
                window.location.href = '/dashboard.html';
                
            } catch (error) {
                errorDiv.textContent = error.message || 'Registration failed';
                submitBtn.disabled = false;
                submitBtn.textContent = 'Register';
            }
        });
    }
});

// Tab switching function
function showTab(tab) {
    const tabs = document.querySelectorAll('.tab-btn');
    const forms = document.querySelectorAll('.auth-form');
    
    tabs.forEach(t => t.classList.remove('active'));
    forms.forEach(f => f.classList.remove('active'));
    
    if (tab === 'login') {
        tabs[0].classList.add('active');
        document.getElementById('loginForm').classList.add('active');
    } else {
        tabs[1].classList.add('active');
        document.getElementById('registerForm').classList.add('active');
    }
}