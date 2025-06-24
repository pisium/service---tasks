import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { authenticateAPI } from '../middlewares/auth.middleware';

export const createTaskRoutes = (taskController: TaskController): Router => {
  
  const router = Router();

  router.post('/', authenticateAPI, taskController
    .create.bind(taskController));
  router.put('/:taskId', authenticateAPI, taskController
    .update.bind(taskController));
  router.delete('/:taskId', authenticateAPI, taskController
    .delete.bind(taskController));
  router.get('/group/:groupId', authenticateAPI, taskController
    .findByGroup.bind(taskController));
  router.get('/user/:userId', authenticateAPI, taskController
    .findByUser.bind(taskController));
  router.get('/calendar', authenticateAPI, taskController
    .findTasksByDueDate.bind(taskController));

  return router;
};