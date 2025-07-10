import { useState } from 'react';
import { Card, CardContent, CardActions, Typography, Checkbox, IconButton, Box, Collapse } from '@mui/material';
// Import the new icons
import { Edit, Delete, ExpandMore as ExpandMoreIcon, DragIndicator as DragIndicatorIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useTasks } from '../contexts/TaskContext';
import type { Task } from '../types';
import TaskForm from './TaskForm';

const ExpandMore = styled((props: { expand: boolean } & IconButton['props']) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const TaskItem = ({ task }: { task: Task }) => {
  const { updateTask, deleteTask } = useTasks();
  const [isEditing, setIsEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      deleteTask(task.id);
    }
  };

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          opacity: task.completed ? 0.7 : 1,
          borderLeft: 5,
          borderColor: task.completed ? 'success.main' : 'primary.main',
          transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
          '&:hover': { boxShadow: 3 }, // Add a subtle shadow on hover
        }}
      >
        <Box display="flex" alignItems="center" pl={0.5} pr={1} py={0.5}>
          {/* --- DRAG HANDLE --- */}
          {/* This Box provides a visual cue and is part of the drag handle area */}
          <Box display="flex" alignItems="center" sx={{ color: 'text.disabled', cursor: 'grab' }}>
            <DragIndicatorIcon />
          </Box>
          {/* --- END DRAG HANDLE --- */}

          <Checkbox
            checked={task.completed}
            onChange={() => updateTask(task.id, { completed: !task.completed })}
          />
          <Box
            flexGrow={1}
            onClick={() => task.description && setExpanded(!expanded)}
            sx={{ cursor: task.description ? 'pointer' : 'default', py: 1 }}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{
                textDecoration: task.completed ? 'line-through' : 'none',
                color: task.completed ? 'text.secondary' : 'text.primary',
              }}
            >
              {task.title}
            </Typography>
          </Box>
          <CardActions>
            <IconButton onClick={() => setIsEditing(true)} aria-label="edit task"><Edit /></IconButton>
            <IconButton onClick={handleDelete} aria-label="delete task"><Delete /></IconButton>
            {task.description && (
              <ExpandMore expand={expanded} onClick={() => setExpanded(!expanded)} aria-expanded={expanded} aria-label="show more">
                <ExpandMoreIcon />
              </ExpandMore>
            )}
          </CardActions>
        </Box>
        {task.description && (
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent sx={{ pt: 0, borderTop: 1, borderColor: 'divider' }}>
              <Typography variant="body2" color="text.secondary">{task.description}</Typography>
            </CardContent>
          </Collapse>
        )}
      </Card>
      {isEditing && <TaskForm open={isEditing} onClose={() => setIsEditing(false)} taskToEdit={task} />}
    </>
  );
};

export default TaskItem;
