<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
   public function index()
    {
        $tasks = Task::all(); // Ensure this retrieves all tasks
        return response()->json($tasks);
    }

    public function incomplete()
    {
        $tasks = Task::where('is_completed', false)->get(); // Retrieve only incomplete tasks
        return response()->json($tasks);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|unique:tasks|max:255',
        ]);

        return Task::create($request->only('title'));
    }

    public function update(Task $task)
    {
        $task->update(['is_completed' => !$task->is_completed]);
        return $task;
    }

    public function destroy(Task $task)
    {
        $task->delete();
        return response()->json(['message' => 'Task deleted']);
    }
}
