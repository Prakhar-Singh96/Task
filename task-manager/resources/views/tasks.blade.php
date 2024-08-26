<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Task Manager</title>
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
    <meta name="csrf-token" content="{{ csrf_token() }}">
</head>
<body>
    <div id="task-app">
        <h1>Task Manager</h1>
        
        <!-- Input and Add Task Button -->
        <div class="input-container">
            <input type="text" id="task-input" placeholder="Enter task">
            <button id="add-task-button">Add Task</button>
        </div>

        <!-- Show All Tasks Button and Task List Table -->
        <div class="task-container">
            <button id="show-all-tasks">Show All Tasks</button>
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Task</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="task-list">
                    <!-- Tasks will be dynamically inserted here -->
                </tbody>
            </table>
        </div>
    </div>

    <script src="{{ asset('js/app.js') }}"></script>
</body>
</html>
