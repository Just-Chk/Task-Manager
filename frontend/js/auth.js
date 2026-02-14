// Check if user is authenticated
function isAuthenticated() 
{
    return localStorage.getItem('token') !== null;
}

// Redirect to login if not authenticated
function requireAuth() 
{
    if (!isAuthenticated()) 
    {
        window.location.href = '/login.html';
    }
}

// Redirect to dashboard if authenticated
function redirectIfAuthenticated() 
{
    if (isAuthenticated()) 
    {
        window.location.href = '/dashboard.html';
    }
}

// Logout function
function logout() 
{
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = '/login.html';
}

// Get current user
function getCurrentUser() 
{
    return localStorage.getItem('username');
}