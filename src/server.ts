import express from 'express';
import { config } from './config'; 

import { PrismaClient } from '@prisma/client';
import { RabbitMQService } from '@/infrastructure/messaging/rabbitmq.service';
import { PrismaTaskRepository } from '@/infrastructure/database/prisma-task.repository';

import { CreateTaskUseCase } from '@/application/use-cases/create-task.usecase';
import { UpdateTaskUseCase } from '@/application/use-cases/update-task.usecase';
import { DeleteTaskUseCase } from '@/application/use-cases/delete-task.usecase';
import { FindTasksByGroupUseCase } from '@/application/use-cases/find-task-by-group.usecase';
import { FindTasksByUserUseCase } from '@/application/use-cases/find-task-by-user.usecase';
import { FindTasksByDueDateUseCase } from '@/application/use-cases/find-task-by-due-date.usecase';

import { TaskController } from '@/presentation/controllers/task.controller';
import { createTaskRoutes } from '@/presentation/routes/task.routes';

async function start() {
  const app = express();
  app.use(express.json());

  const prismaClient = new PrismaClient();
  const rabbitMQService = new RabbitMQService(config.rabbitMQ.uri);
  await rabbitMQService.start();

  const taskRepository = new PrismaTaskRepository(prismaClient);

  const createTaskUseCase = new CreateTaskUseCase(taskRepository, rabbitMQService);
  const updateTaskUseCase = new UpdateTaskUseCase(taskRepository, rabbitMQService);
  const deleteTaskUseCase = new DeleteTaskUseCase(taskRepository, rabbitMQService);
  const findTasksByGroupUseCase = new FindTasksByGroupUseCase(taskRepository);
  const findTasksByUserUseCase = new FindTasksByUserUseCase(taskRepository);
  const findTasksByDueDateUseCase = new FindTasksByDueDateUseCase(taskRepository);

  const taskController = new TaskController(
    createTaskUseCase,
    updateTaskUseCase,
    deleteTaskUseCase,
    findTasksByGroupUseCase,
    findTasksByUserUseCase,
    findTasksByDueDateUseCase
  );

  const taskRoutes = createTaskRoutes(taskController);

  app.get('/', (req, res) => {
    res.status(200).send('🟢 Server is running');
  });

  app.use('/api/tasks', taskRoutes);

  const port = config.server.port;
  app.listen(3002, () => console.log(`Server online na porta ${port} ✅`));
}

start().catch((error) => {
  console.error('❌ Falha ao inicializar o servidor:', error);
  process.exit(1);
});