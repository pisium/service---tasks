import express from 'express';
import { config } from './config'; 

import { PrismaClient } from '@prisma/client';
import { PrismaTaskRepository } from '@/infrastructure/database/prisma-task.repository';
import { UserGateway } from '@/infrastructure/gateways/user.gateway'
import { NotificationGateway } from '@/infrastructure/gateways/notification.gateway';

import { TaskUserDataService } from '@/application/services/task-user-data.service';
import { TaskEnrichmentService } from '@/application/services/task-enrichment.service';
import { NotificationService } from '@/application/services/task-notification.service'
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

  const taskRepository = new PrismaTaskRepository(prismaClient);
  const userGateway = new UserGateway();
  const notificationGateway : NotificationService = new NotificationGateway();

  const taskUserDataService = new TaskUserDataService(userGateway)
  const taskEnrichmentService = new TaskEnrichmentService(taskUserDataService);

  const createTaskUseCase = new CreateTaskUseCase(taskRepository, taskEnrichmentService);
  const updateTaskUseCase = new UpdateTaskUseCase(taskRepository, taskEnrichmentService);
  const deleteTaskUseCase = new DeleteTaskUseCase(taskRepository);
  const findTasksByGroupUseCase = new FindTasksByGroupUseCase(taskRepository, taskEnrichmentService);
  const findTasksByUserUseCase = new FindTasksByUserUseCase(taskRepository, taskEnrichmentService);
  const findTasksByDueDateUseCase = new FindTasksByDueDateUseCase(taskRepository, taskEnrichmentService);

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
  app.listen(port, () => console.log(`Server online na porta ${port} ✅`));
}

start().catch((error) => {
  console.error('❌ Falha ao inicializar o servidor:', error);
  process.exit(1);
});