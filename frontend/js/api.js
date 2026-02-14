const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api'
    : 'https://your-backend.onrender.com/api'; // Replace with your Render URL after deployment

async function apiRequest(endpoint, method = 'GET', data = null) {
    const headers = {
        'Content-Type': 'application/json'
    };
    
    const token = localStorage.getItem('token');
    if (token) {
        headers['x-auth-token'] = token;
    }
    
    const config = {
        method,
        headers
    };
    
    if (data) {
        config.body = JSON.stringify(data);
    }
    
    try {
        console.log(`Making ${method} request to: ${API_URL}${endpoint}`);
        const response = await fetch(`${API_URL}${endpoint}`, config);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Request failed');
        }
        
        return result;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Auth APIs
async function login(email, password) 
{
    return apiRequest('/users/login', 'POST', { email, password });
}

async function register(username, email, password) 
{
    return apiRequest('/users/register', 'POST', { username, email, password });
}

// Task APIs
async function getTasks(category = 'All', sortBy = 'createdAt', order = 'desc') 
{
    return apiRequest(`/tasks?category=${category}&sortBy=${sortBy}&order=${order}`);
}

async function createTask(title, category) 
{
    return apiRequest('/tasks', 'POST', { title, category });
}

async function updateTask(id, updates) 
{
    return apiRequest(`/tasks/${id}`, 'PUT', updates);
}

async function deleteTask(id) 
{
    return apiRequest(`/tasks/${id}`, 'DELETE');
}

// Make functions globally available
window.login = login;
window.register = register;
window.getTasks = getTasks;
window.createTask = createTask;
window.updateTask = updateTask;
window.deleteTask = deleteTask;