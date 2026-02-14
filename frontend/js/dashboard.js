let currentFilter = 'All';
let currentSortBy = 'createdAt';
let currentSortOrder = 'desc';
let currentEditTaskId = null;

document.addEventListener('DOMContentLoaded', () => 
{
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    
    console.log('Dashboard loaded. Token exists:', !!token);
    console.log('Username:', username);
    
    if (!token) 
    {
        console.log('No token found, redirecting to login');
        window.location.href = '/login.html';
        return;
    }
    
    // Display username
    const welcomeElement = document.getElementById('welcomeUser');
    if (welcomeElement) 
    {
        welcomeElement.textContent = `Welcome, ${username || 'User'}!`;
    }
    
    // Load tasks
    loadTasks();
    
    // Task form handler
    const taskForm = document.getElementById('taskForm');
    if (taskForm) 
    {
        taskForm.addEventListener('submit', async (e) => 
        {
            e.preventDefault();
            
            const title = document.getElementById('taskTitle').value;
            const category = document.getElementById('taskCategory').value;
            const errorDiv = document.getElementById('taskError');
            
            if (!title.trim()) {
                errorDiv.textContent = 'Please enter a task title';
                errorDiv.style.display = 'block';
                return;
            }
            
            try {
                await createTask(title, category);
                document.getElementById('taskTitle').value = '';
                errorDiv.style.display = 'none';
                loadTasks();
            } catch (error) {
                console.error('Error creating task:', error);
                errorDiv.textContent = error.message || 'Failed to create task';
                errorDiv.style.display = 'block';
            }
        });
    }
    
    // Edit form handler
    const editForm = document.getElementById('editForm');
    if (editForm) 
    {
        editForm.addEventListener('submit', async (e) => 
        {
            e.preventDefault();
            
            const title = document.getElementById('editTitle').value;
            const category = document.getElementById('editCategory').value;
            
            if (currentEditTaskId) 
            {
                try 
                {
                    await updateTask(currentEditTaskId, { title, category });
                    closeEditModal();
                    loadTasks();
                } 
                
                catch (error) 
                {
                    console.error('Error updating task:', error);
                    alert('Failed to update task: ' + error.message);
                }
            }
        });
    }
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => 
    {
        btn.addEventListener('click', function() 
        {
            filterTasks(this.textContent);
        });
    });
    
    // Sort buttons
    document.querySelectorAll('.sort-btn').forEach(btn => 
    {
        btn.addEventListener('click', function() 
        {
            sortTasks(this.textContent.toLowerCase().includes('date') ? 'createdAt' : 'title');
        });
    });
});

async function loadTasks() 
{
    const tasksList = document.getElementById('tasksList');
    const loading = document.getElementById('loading');
    const noTasks = document.getElementById('noTasks');
    
    if (!tasksList) return;
    
    try 
    {
        loading.style.display = 'block';
        tasksList.innerHTML = '';
        noTasks.style.display = 'none';
        
        console.log('Loading tasks with filter:', currentFilter);
        
        // Check if getTasks function exists
        if (typeof getTasks !== 'function') 
        {
            throw new Error('getTasks function is not defined. Make sure api.js is loaded correctly.');
        }
        
        const tasks = await getTasks(currentFilter, currentSortBy, currentSortOrder);
        console.log('Tasks loaded:', tasks.length);
        
        loading.style.display = 'none';
        
        if (tasks.length === 0) 
        {
            noTasks.style.display = 'block';
        } 
        
        else 
        {
            displayTasks(tasks);
        }
    } 
    
    catch (error) 
    {
        console.error('Error loading tasks:', error);
        loading.style.display = 'none';
        tasksList.innerHTML = `<div class="error-message">Error loading tasks: ${error.message}</div>`;
    }
}

function displayTasks(tasks) 
{
    const tasksList = document.getElementById('tasksList');
    tasksList.innerHTML = tasks.map(task => createTaskHTML(task)).join('');
}

function createTaskHTML(task) 
{
    const date = new Date(task.createdAt).toLocaleDateString();
    const categoryClass = task.category ? task.category.toLowerCase() : 'personal';
    const completedClass = task.completed ? 'completed' : '';
    
    return `
        <div class="task-item ${completedClass}" data-task-id="${task._id}">
            <div class="task-content">
                <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTaskComplete('${task._id}', ${!task.completed})">
                <div class="task-details">
                    <span class="task-title">${task.title || 'Untitled'}</span>
                    <span class="category-badge ${categoryClass}">${task.category || 'Personal'}</span>
                    <span class="task-date">Created: ${date}</span>
                </div>
            </div>
            <div class="task-actions">
                <button class="btn-edit" onclick="openEditModal('${task._id}', '${task.title.replace(/'/g, "\\'")}', '${task.category}')">Edit</button>
                <button class="btn-delete" onclick="deleteTaskHandler('${task._id}')">Delete</button>
            </div>
        </div>
    `;
}

async function toggleTaskComplete(taskId, completed) 
{
    try 
    {
        await updateTask(taskId, { completed });
        loadTasks();
    } 
    
    catch (error) 
    {
        console.error('Error updating task:', error);
        alert('Failed to update task: ' + error.message);
    }
}

async function deleteTaskHandler(taskId) 
{
    if (confirm('Are you sure you want to delete this task?')) 
    {
        try 
        {
            await deleteTask(taskId);
            loadTasks();
        } 
        
        catch (error) 
        {
            console.error('Error deleting task:', error);
            alert('Failed to delete task: ' + error.message);
        }
    }
}

function filterTasks(category) 
{
    currentFilter = category;
    
    document.querySelectorAll('.filter-btn').forEach(btn => 
    {
        btn.classList.remove('active');
        if (btn.textContent === category) 
        {
            btn.classList.add('active');
        }
    });
    
    loadTasks();
}

function sortTasks(sortBy) 
{
    if (currentSortBy === sortBy) 
    {
        currentSortOrder = currentSortOrder === 'desc' ? 'asc' : 'desc';
    } 
    
    else 
    {
        currentSortBy = sortBy;
        currentSortOrder = 'desc';
    }
    
    document.querySelectorAll('.sort-btn').forEach(btn => 
    {
        btn.classList.remove('active');
    });
    
    // Find and activate the correct button
    document.querySelectorAll('.sort-btn').forEach(btn => 
    {
        if (btn.textContent.toLowerCase().includes(sortBy === 'createdAt' ? 'date' : 'title')) 
        {
            btn.classList.add('active');
        }
    });
    
    loadTasks();
}

function openEditModal(taskId, title, category) 
{
    currentEditTaskId = taskId;
    document.getElementById('editTitle').value = title || '';
    document.getElementById('editCategory').value = category || 'Personal';
    document.getElementById('editModal').style.display = 'block';
}

function closeEditModal() 
{
    currentEditTaskId = null;
    document.getElementById('editModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) 
{
    const modal = document.getElementById('editModal');
    if (event.target === modal) 
    {
        closeEditModal();
    }
}

// Logout function
function logout() 
{
    localStorage.clear();
    window.location.href = '/login.html';
}

// Make functions globally available for onclick handlers
window.toggleTaskComplete = toggleTaskComplete;
window.deleteTaskHandler = deleteTaskHandler;
window.openEditModal = openEditModal;
window.closeEditModal = closeEditModal;
window.logout = logout;
window.filterTasks = filterTasks;
window.sortTasks = sortTasks;