import React, { useState, useEffect } from 'react';
import './App.css';

function CustomButton({ label, variant, handleClick }) {
  return (
    <button className={variant} onClick={handleClick}>{label}</button>
  );
}

function FilterBar({
  searchQuery,
  showInProgress,
  onSearchQueryChange,
  onShowInProgressChange
}) {
  return (
    <div className='filter-container'>
      <form>
        <input
          type="text"
          value={searchQuery}
          placeholder="Search tasks..."
          onChange={(e) => onSearchQueryChange(e.target.value)}
        />
        <br />
        <label>
          <input
            type="checkbox"
            checked={showInProgress}
            onChange={(e) => onShowInProgressChange(e.target.checked)}
          />
          {' '}
          Show only ongoing tasks
        </label>
      </form>
    </div>
  );
}

function TaskInput({ taskInput, setTaskInput, handleAddTask }) {
  return (
    <div className="input-container">
      <input
        type="text"
        value={taskInput}
        placeholder="New task..."
        onChange={(e) => setTaskInput(e.target.value)}
      />
      <CustomButton label="Add Task" variant="primaryButton" handleClick={handleAddTask} />
    </div>
  );
}

function TaskOverview({ taskList, setTaskList, removeTask, initiateEdit, confirmEdit, searchQuery, showInProgress }) {
  const [currentEditIndex, setCurrentEditIndex] = useState(null);
  const [currentEditValue, setCurrentEditValue] = useState('');

  const startEditing = (index) => {
    setCurrentEditIndex(index);
    setCurrentEditValue(taskList[index].title);
  };

  const applyEdit = (index) => {
    confirmEdit(index, currentEditValue);
    setCurrentEditIndex(null);
  };

  return (
    <>
      <h2>Your Tasks</h2>
      <div className="task-list">
        {taskList.map((task, index) => {
          const shouldDisplayTask = !showInProgress || (showInProgress && task.state === 'In Progress');
          const matchesSearchQuery = task.title.toLowerCase().includes(searchQuery.toLowerCase());

          if (shouldDisplayTask && matchesSearchQuery) {
            return (
              <div className="task-item" key={index}>
                {currentEditIndex === index ? (
                  <>
                    <input
                      type="text"
                      value={currentEditValue}
                      onChange={(e) => setCurrentEditValue(e.target.value)}
                      placeholder="Edit task"
                    />
                    <CustomButton label="Confirm" variant="primaryButton" handleClick={() => applyEdit(index)} />
                  </>
                ) : (
                  <>
                    <span>{task.title}</span>
                    <CustomButton label="Remove" variant="secondaryButton" handleClick={() => removeTask(index)} />
                    <CustomButton label="Edit" variant="secondaryButton" handleClick={() => startEditing(index)} />
                    <input
                      type="checkbox"
                      checked={task.state === 'Completed'}
                      onChange={() => {
                        const updatedTaskList = taskList.map((t, i) =>
                          i === index ? { ...t, state: t.state === 'Completed' ? 'In Progress' : 'Completed' } : t
                        );
                        setTaskList(updatedTaskList);
                      }}
                    />
                  </>
                )}
              </div>
            );
          }

          return null;
        })}
      </div>
    </>
  );
}

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showInProgress, setShowInProgress] = useState(false);
  const [taskInput, setTaskInput] = useState('');

  const [taskList, setTaskList] = useState(() => {
    const storedTasks = localStorage.getItem('taskList');
    return storedTasks ? JSON.parse(storedTasks) : [];
  });

  useEffect(() => {
    localStorage.setItem('taskList', JSON.stringify(taskList));
  }, [taskList]);

  const handleAddTask = () => {
    if (taskInput.trim()) {
      setTaskList([...taskList, { title: taskInput, state: 'In Progress' }]);
      setTaskInput('');
    }
  };

  const removeTask = (index) => {
    setTaskList(taskList.filter((_, i) => i !== index));
  };

  const initiateEdit = (index) => {
    const updatedTaskList = taskList.map((task, i) =>
      i === index ? { ...task, isEditing: true } : task
    );
    setTaskList(updatedTaskList);
  };

  const confirmEdit = (index, editedTitle) => {
    const updatedTaskList = taskList.map((task, i) =>
      i === index ? { ...task, title: editedTitle } : task
    );
    setTaskList(updatedTaskList);
  };

  return (
    <div id="app-container">
      <h1 id="app-header">Task Manager</h1>
      <TaskInput taskInput={taskInput} setTaskInput={setTaskInput} handleAddTask={handleAddTask} />
      <FilterBar
        searchQuery={searchQuery}
        showInProgress={showInProgress}
        onSearchQueryChange={setSearchQuery}
        onShowInProgressChange={setShowInProgress}
      />
      <TaskOverview taskList={taskList} 
        setTaskList={setTaskList} 
        removeTask={removeTask} 
        initiateEdit={initiateEdit} 
        confirmEdit={confirmEdit} 
        searchQuery={searchQuery}
        showInProgress={showInProgress} />
    </div>
  );
}

export default App;