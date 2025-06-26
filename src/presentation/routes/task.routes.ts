import { Router } from 'express';
import { TaskController } from '@/presentation/controllers/task.controller';

export const createTaskRoutes = (taskController: TaskController): Router => {
  const router = Router();

  router.post('/', taskController.create.bind(taskController));
  router.put('/:taskId', taskController.update.bind(taskController));
  router.delete('/:taskId', taskController.delete.bind(taskController));
  router.get('/group/:groupId', taskController.findByGroup.bind(taskController));
  router.get('/user/:userId', taskController.findByUser.bind(taskController));
  router.get('/calendar', taskController.findTasksByDueDate.bind(taskController));
  
  return router;
};
