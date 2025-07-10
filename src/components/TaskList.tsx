import { useState, useMemo } from 'react';
import { Box, Typography, Stack, ToggleButtonGroup, ToggleButton, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { useTasks } from '../contexts/TaskContext';
import TaskItem from './TaskItem';

type SortOption = 'manual' | 'createdAt_desc' | 'createdAt_asc' | 'completed_first';
type FilterOption = 'all' | 'completed' | 'pending';

const TaskList = () => {
  const { tasks, setTasks } = useTasks();
  const [filter, setFilter] = useState<FilterOption>('all');
  // Set default sort to 'manual' to respect drag-and-drop order
  const [sort, setSort] = useState<SortOption>('manual');

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    
    // When a user drags, we should switch to manual sorting
    setSort('manual');

    const reorderedTasks = Array.from(tasks);
    const [removed] = reorderedTasks.splice(source.index, 1);
    reorderedTasks.splice(destination.index, 0, removed);
    
    setTasks(reorderedTasks);
  };

  const displayedTasks = useMemo(() => {
    let processableTasks = [...tasks];

    // 1. Apply Sorting (if not manual)
    if (sort !== 'manual') {
      switch (sort) {
        case 'createdAt_asc': processableTasks.sort((a, b) => a.createdAt - b.createdAt); break;
        case 'completed_first': processableTasks.sort((a, b) => Number(a.completed) - Number(b.completed)).reverse(); break;
        case 'createdAt_desc': processableTasks.sort((a, b) => b.createdAt - a.createdAt); break;
      }
    }

    // 2. Apply Filtering
    if (filter === 'all') return processableTasks;
    return processableTasks.filter(task => filter === 'completed' ? task.completed : !task.completed);
  }, [tasks, sort, filter]);

  return (
    <Box mt={2}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems="center" mb={3}>
        <ToggleButtonGroup value={filter} exclusive onChange={(_, newFilter) => newFilter && setFilter(newFilter)} aria-label="Filter tasks">
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="pending">Pending</ToggleButton>
          <ToggleButton value="completed">Completed</ToggleButton>
        </ToggleButtonGroup>
        <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
          <InputLabel>Sort By</InputLabel>
          <Select value={sort} label="Sort By" onChange={(e) => setSort(e.target.value as SortOption)}>
            <MenuItem value="manual">Manual</MenuItem> {/* Added Manual Sort */}
            <MenuItem value="createdAt_desc">Newest First</MenuItem>
            <MenuItem value="createdAt_asc">Oldest First</MenuItem>
            <MenuItem value="completed_first">Status</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {tasks.length === 0 ? (
        <Typography variant="h6" color="text.secondary" align="center" mt={8}>
          No tasks yet. Add one to get started!
        </Typography>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <Box {...provided.droppableProps} ref={provided.innerRef}>
                {displayedTasks.map((task) => (
                  // --- BUG FIX IS HERE ---
                  // We find the *true* index of the task in the original 'tasks' array.
                  // This ensures drag-and-drop works correctly even when the list is filtered or sorted.
                  <Draggable key={task.id} draggableId={task.id} index={tasks.findIndex(t => t.id === task.id)}>
                    {(provided) => (
                      <Box ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} mb={2}>
                        <TaskItem task={task} />
                      </Box>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </Box>
  );
};

export default TaskList;
