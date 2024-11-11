import React, { useState, useEffect } from 'react';
import './App.css';

function Button({ text, type, onClick }) {
  return (
    <button className={type} onClick={onClick}>{text}</button>
  );
}

function SearchBar({
  filterText,
  inProgressOnly,
  onFilterTextChange,
  onInProgressOnlyChange
}) {
  return (
    <div className='division'>
      <form>
        <input
          type="text"
          value={filterText}
          placeholder="Search..."
          onChange={(e) => onFilterTextChange(e.target.value)}
        />
        <br />
        <label>
          <input
            type="checkbox"
            checked={inProgressOnly}
            onChange={(e) => onInProgressOnlyChange(e.target.checked)}
          />
          {' '}
          Only show tasks in Progress
        </label>
      </form>
    </div>
  );
}

function AddForm({ addInput, setAddInput, addTask }) {
  return (
    <div className="division">
      <input
        type="text"
        value={addInput}
        placeholder="Add task..."
        onChange={(e) => setAddInput(e.target.value)}
      />
      <Button text="Add Task" type="brightButton" onClick={addTask} />
    </div>
  );
}

function TaskList({ tasks, setTasks,deleteTask, startEdit, applyEdit,filterText,
  inProgressOnly }) {
  const [editedTaskIndex, setEditedTaskIndex] = useState(null);
  const [editedTaskName, setEditedTaskName] = useState('');

  const handleEditStart = (index) => {
    setEditedTaskIndex(index);
    setEditedTaskName(tasks[index].name); // Set the name of the task to edit
  };

  const handleApplyEdit = (index) => {
    applyEdit(index, editedTaskName);
    setEditedTaskIndex(null); // Reset editing state after applying edit
  };

  return (
    <>
      <h2>Tasks</h2>
      <div className="list">
        {tasks.map((task, index) => {
          // Check if we should filter by in-progress status
          const shouldRenderTask = !inProgressOnly || (inProgressOnly && task.status === 'In Progress');

          // Check if the task name contains the filter text
          const matchesFilterText = task.name.toLowerCase().indexOf(filterText.toLowerCase()) !== -1;

          // Render the task only if it matches both conditions
          if (shouldRenderTask && matchesFilterText) {
            return (
              <div className="division" key={index}>
                {editedTaskIndex === index ? (
                  <>
                    <input
                      type="text"
                      value={editedTaskName}
                      onChange={(e) => setEditedTaskName(e.target.value)}
                      placeholder="Edit task"
                    />
                    <Button text="Apply" type="brightButton" onClick={() => handleApplyEdit(index)} />
                  </>
                ) : (
                  <>
                    <span>{task.name}</span>
                    <Button text="Delete" type="darkButton" onClick={() => deleteTask(index)} />
                    <Button text="Edit" type="darkButton" onClick={() => handleEditStart(index)} />
                    <input
                      type="checkbox"
                      checked={task.status === 'Done'}
                      onChange={() => {
                        const updatedTasks = tasks.map((t, i) =>
                          i === index ? { ...t, status: t.status === 'Done' ? 'In Progress' : 'Done' } : t
                        );
                        setTasks(updatedTasks);
                      }}
                    />
                  </>
                )}
              </div>
            );
          }

          // If conditions are not met, return null (or nothing) to skip rendering this task
          return null;
        })}
      </div>
    </>
  );
}

function App() {
  const [filterText, setFilterText] = useState('');
  const [inProgressOnly, setInProgressOnly] = useState(false);
  const [addInput, setAddInput] = useState('');

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (addInput.trim()) {
      setTasks([...tasks, { name: addInput, status: 'In Progress', isEditing: false }]);
      setAddInput('');
    }
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const startEdit = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, isEditing: true } : task
    );
    setTasks(updatedTasks);
  };

  const applyEdit = (index, editedTask) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, name: editedTask, isEditing: false } : task
    );
    setTasks(updatedTasks);
  };

  return (
    <body>
      <div id="app_island">
        <h1 id="app_title">TODO LIST</h1>
        <AddForm addInput={addInput} setAddInput={setAddInput} addTask={addTask} />
        <SearchBar
          filterText={filterText}
          inProgressOnly={inProgressOnly}
          onFilterTextChange={setFilterText}
          onInProgressOnlyChange={setInProgressOnly}
        />
        <TaskList tasks={tasks} 
        setTasks={setTasks} 
        deleteTask={deleteTask} 
        startEdit={startEdit} 
        applyEdit={applyEdit} 
        filterText={filterText}
        inProgressOnly={inProgressOnly}/>
      </div>
    </body>
  );
}

export default App;