import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { authenticateAPI } from '../middlewares/auth.middleware';

export const createTaskRoutes = (taskController: TaskController): Router => {
  
  const router = Router();
  router.post('/', authenticateAPI, taskController.create);
  router.put('/:taskId', authenticateAPI, taskController.update);
  router.delete('/:taskId', authenticateAPI, taskController.delete);
  router.get('/group/:groupId', authenticateAPI, taskController.findByGroup);
  router.get('/user/:userId', authenticateAPI, taskController.findByUser);
  router.get('/calendar', authenticateAPI, taskController.findTasksByDueDate);

  return router;
};