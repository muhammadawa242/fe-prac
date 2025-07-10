import { useState } from 'react';
import { Card, CardContent, CardActions, Typography, Checkbox, IconButton, Box, Collapse } from '@mui/material';
import { Edit, Delete, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useTasks } from '../contexts/TaskContext';
import type { Task } from '../types';
import TaskForm from './TaskForm'; // Assuming TaskForm can handle edit mode

interface ExpandMoreProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps & { children: React.ReactNode }) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

interface TaskItemProps {
  task: Task;
}

const TaskItem = ({ task }: TaskItemProps) => {
  const { updateTask, deleteTask } = useTasks();
  const [isEditing, setIsEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleToggleComplete = () => {
    updateTask(task.id, { completed: !task.completed });
  };

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
          opacity: task.completed ? 0.6 : 1,
          borderLeft: 5,
          borderColor: task.completed ? 'success.main' : 'primary.main',
        }}
      >
        <Box display="flex" alignItems="center" p={1}>
          <Checkbox checked={task.completed} onChange={handleToggleComplete} />
          <Box flexGrow={1} onClick={() => task.description && setExpanded(!expanded)} sx={{cursor: task.description ? 'pointer' : 'default'}}>
            <Typography
              variant="h6"
              component="div"
              sx={{ textDecoration: task.completed ? 'line-through' : 'none' }}
            >
              {task.title}
            </Typography>
          </Box>
          <CardActions>
            <IconButton onClick={() => setIsEditing(true)}><Edit /></IconButton>
            <IconButton onClick={handleDelete}><Delete /></IconButton>
            {task.description && (
                 <ExpandMore
                 expand={expanded}
                 onClick={() => setExpanded(!expanded)}
                 aria-expanded={expanded}
                 aria-label="show more"
               >
                 <ExpandMoreIcon />
               </ExpandMore>
            )}
          </CardActions>
        </Box>
        {task.description && (
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent sx={{pt: 0}}>
              <Typography variant="body2" color="text.secondary">{task.description}</Typography>
            </CardContent>
          </Collapse>
        )}
      </Card>

      {isEditing && (
        <TaskForm
          open={isEditing}
          onClose={() => setIsEditing(false)}
          taskToEdit={task}
        />
      )}
    </>
  );
};

export default TaskItem;
