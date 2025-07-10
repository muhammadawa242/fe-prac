import { useState, useMemo } from 'react';
import { Box, Typography, Stack, ToggleButtonGroup, ToggleButton, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
// import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { useTasks } from '../contexts/TaskContext';
import TaskItem from './TaskItem';

type SortOption = 'createdAt_desc' | 'createdAt_asc' | 'completed_first';
type FilterOption = 'all' | 'completed' | 'pending';

const TaskList = () => {
  const { tasks, setTasks } = useTasks();
  const [filter, setFilter] = useState<FilterOption>('all');
  const [sort, setSort] = useState<SortOption>('createdAt_desc');

  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    // Filtering
    if (filter === 'completed') {
      result = result.filter(task => task.completed);
    } else if (filter === 'pending') {
      result = result.filter(task => !task.completed);
    }

    // Sorting
    switch (sort) {
      case 'createdAt_asc':
        result.sort((a, b) => a.createdAt - b.createdAt);
        break;
      case 'completed_first':
        result.sort((a, b) => Number(b.completed) - Number(a.completed));
        break;
      case 'createdAt_desc':
      default:
        result.sort((a, b) => b.createdAt - a.createdAt);
        break;
    }

    return result;
  }, [tasks, filter, sort]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const reorderedTasks = Array.from(tasks);
    const [removed] = reorderedTasks.splice(source.index, 1);
    reorderedTasks.splice(destination.index, 0, removed);

    setTasks(reorderedTasks);
  };

  return (
    <Box mt={4}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems="center" mb={3}>
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={(_, newFilter) => newFilter && setFilter(newFilter)}
          aria-label="Filter tasks"
        >
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="pending">Pending</ToggleButton>
          <ToggleButton value="completed">Completed</ToggleButton>
        </ToggleButtonGroup>

        <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
          <InputLabel>Sort By</InputLabel>
          <Select value={sort} label="Sort By" onChange={(e) => setSort(e.target.value as SortOption)}>
            <MenuItem value="createdAt_desc">Newest First</MenuItem>
            <MenuItem value="createdAt_asc">Oldest First</MenuItem>
            <MenuItem value="completed_first">Completed First</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {tasks.length === 0 ? (
         <Typography variant="h6" color="text.secondary" align="center" mt={5}>
            No tasks yet. Add one to get started!
        </Typography>
      ) : (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <Box {...provided.droppableProps} ref={provided.innerRef}>
              {filteredAndSortedTasks.map((task, index) => (
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
