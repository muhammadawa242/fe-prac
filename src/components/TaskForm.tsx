// src/components/TaskForm.tsx

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import { useTasks } from '../contexts/TaskContext';
import type { Task } from '../types';

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  taskToEdit?: Task;
}

const TaskForm = ({ open, onClose, taskToEdit }: TaskFormProps) => {
  const { addTask, updateTask } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(false);

  // If we are editing, populate the form with existing task data
  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
    } else {
      // Reset form when opening for a new task
      setTitle('');
      setDescription('');
    }
  }, [taskToEdit, open]);

  const handleSubmit = () => {
    if (!title.trim()) {
      setError(true);
      return;
    }

    if (taskToEdit) {
      updateTask(taskToEdit.id, { title, description });
    } else {
      addTask(title, description);
    }
    handleClose();
  };

  const handleClose = () => {
    onClose();
    // A small delay to allow the dialog to close before resetting state
    setTimeout(() => {
      setTitle('');
      setDescription('');
      setError(false);
    }, 300);
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{taskToEdit ? 'Edit Task' : 'Add New Task'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Task Title"
          type="text"
          fullWidth
          variant="outlined"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError(false);
          }}
          required
          error={error}
          helperText={error ? 'Title is required.' : ''}
          sx={{ mt: 2 }}
        />
        <TextField
          margin="dense"
          label="Description (Optional)"
          type="text"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {taskToEdit ? 'Save Changes' : 'Add Task'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskForm;
