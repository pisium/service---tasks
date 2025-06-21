import { Router } from 'express';
import { authenticateAPI } from '@/presentation/middlewares/auth.middleware';
import { TaskController } from '@/presentation/controllers/task.controller';
import { CreateTaskUseCase } from '@/application/use-cases/create-task.usecase';
import { UpdateTaskUseCase } from '@/application/use-cases/update-task.usecase';
import { DeleteTaskUseCase } from '@/application/use-cases/delete-task.usecase';
import { PrismaTaskRepository } from '@/infrastructure/database/prisma-task.repository';
import { FindTasksByGroupUseCase } from '@/application/use-cases/find-task-by-group.usecase';
import { FindTasksByUserUseCase } from '@/application/use-cases/find-task-by-user.usecase';
import { FindTasksByDueDateUseCase } from '@/application/use-cases/find-task-by-due-date.usecase';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const taskRepository = new PrismaTaskRepository(prisma);

const createTaskUseCase = new CreateTaskUseCase(taskRepository);
const updateTaskUseCase = new UpdateTaskUseCase(taskRepository);
const deleteTaskUseCase = new DeleteTaskUseCase(taskRepository);
const findTasksByGroupUseCase = new FindTasksByGroupUseCase(taskRepository)
const findTasksByUserUseCase = new FindTasksByUserUseCase(taskRepository)
const findTaskByDyeDateUseCase = new FindTasksByDueDateUseCase(taskRepository)
const taskController = new TaskController(createTaskUseCase, 
                                          updateTaskUseCase, 
                                          deleteTaskUseCase,
                                          findTasksByGroupUseCase,
                                          findTasksByUserUseCase,
                                          findTaskByDyeDateUseCase);

const router = Router();

router.post('/createTask', authenticateAPI, (req, res) => taskController.create(req, res));
router.put('/:taskId', authenticateAPI, (req, res) => taskController.update(req, res));
router.delete('/:taskId', authenticateAPI, (req, res) => taskController.delete(req, res));
router.get('/group/:groupId', authenticateAPI, (req, res) => taskController.findByGroup(req, res));
router.get('/user/:userId', authenticateAPI, (req, res) => taskController.findByUser(req, res));
router.get('/calendar', authenticateAPI, taskController.findTasksByDueDate)

export { router as taskRoutes };