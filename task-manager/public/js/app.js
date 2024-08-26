document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const addTaskButton = document.getElementById('add-task-button');
    const showAllTasksButton = document.getElementById('show-all-tasks');
    let showAllTasks = false; // Flag to determine which tasks to show

    const fetchTasks = async () => {
        try {
            const url = showAllTasks ? '/tasks' : '/tasks/incomplete';
            const response = await fetch(url);
            const tasks = await response.json();
            taskList.innerHTML = '';
            tasks.forEach(task => addTaskToDOM(task));
        } catch (error) {
            console.error('Error fetching tasks:', error);
            alert('Failed to fetch tasks.');
        }
    };

    const addTaskToDOM = (task) => {
        const tr = document.createElement('tr');
        tr.dataset.id = task.id;

        // Id Column
        const idCell = document.createElement('td');
        idCell.textContent = task.id;

        // Task Column
        const taskCell = document.createElement('td');
        taskCell.textContent = task.title;

        // Status Column
        const statusCell = document.createElement('td');
        const statusText = document.createElement('span');
        statusText.textContent = task.is_completed ? 'Done' : 'Incomplete';
        statusText.classList.add(task.is_completed ? 'completed' : 'incomplete');
        statusCell.appendChild(statusText);

        // Action Column
        const actionCell = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.is_completed;
        checkbox.style.display = task.is_completed ? 'none' : 'inline-block'; // Hide if completed
        checkbox.addEventListener('change', async () => {
            await toggleTask(task, tr);
            statusText.textContent = checkbox.checked ? 'Done' : 'Incomplete';
            statusText.classList.toggle('completed', checkbox.checked);
            statusText.classList.toggle('incomplete', !checkbox.checked);
            checkbox.style.display = checkbox.checked ? 'none' : 'inline-block'; // Hide if completed
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete';
        deleteButton.addEventListener('click', () => confirmDelete(task, tr));

        actionCell.appendChild(checkbox);
        actionCell.appendChild(deleteButton);

        // Append cells to the row
        tr.appendChild(idCell);
        tr.appendChild(taskCell);
        tr.appendChild(statusCell);
        tr.appendChild(actionCell);

        taskList.appendChild(tr);
    };

    const addTask = async () => {
        const title = taskInput.value.trim();
        if (title === '') return alert('Task cannot be empty');

        try {
            const response = await fetch('/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({ title })
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 422) {
                    alert(errorData.errors.title[0] || 'Validation error occurred.');
                } else {
                    alert('An error occurred while adding the task.');
                }
                return;
            }

            const newTask = await response.json();
            addTaskToDOM(newTask);
            taskInput.value = '';
        } catch (error) {
            alert('An unexpected error occurred.');
        }
    };

    const toggleTask = async (task, row) => {
        if (task.is_completed) return;

        try {
            await fetch(`/tasks/${task.id}`, {
                method: 'PATCH',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });

            row.style.display = 'none'; // Hide the task row
        } catch (error) {
            console.error('Error toggling task:', error);
            alert('Failed to update task.');
        }
    };

    const confirmDelete = (task, row) => {
        if (confirm('Are you sure you want to delete this task?')) {
            deleteTask(task, row);
        }
    };

    const deleteTask = async (task, row) => {
        try {
            await fetch(`/tasks/${task.id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });

            row.remove(); // Remove the task row from the DOM
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Failed to delete task.');
        }
    };

    addTaskButton.addEventListener('click', addTask);
    taskInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') addTask();
    });

    showAllTasksButton.addEventListener('click', () => {
        showAllTasks = !showAllTasks; // Toggle the flag
        fetchTasks();
    });

    // Fetch only incomplete tasks initially
    fetchTasks();
});
