import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';

import { PrismaTaskRepository } from '@/infrastructure/database/prisma-task.repository';
import { UserGateway } from '@/infrastructure/gateways/user.gateway';
import { NotificationGateway } from '@/infrastructure/gateways/notification.gateway';
import { SendTaskRemindersUseCase } from '@/application/use-cases/send-task-reminders.usecase';
import { NotificationService } from '@/application/services/task-notification.service';
import { TaskUserDataService } from '@/application/services/task-user-data.service';

async function start() {
  const prismaClient = new PrismaClient();
  const taskRepository = new PrismaTaskRepository(prismaClient);
  const userGateway = new UserGateway();
  const notificationGateway: NotificationService = new NotificationGateway();

  const taskUserDataService = new TaskUserDataService(userGateway);
  const sendTaskRemindersUseCase = new SendTaskRemindersUseCase(
    taskRepository,
    taskUserDataService,
    notificationGateway
  );

  cron.schedule('*/3 * * * *', async () => {
    console.log('-------------------------------------------');
    console.log(`[${new Date().toISOString()}] A executar o job de lembretes de tarefas...`); 
    try {
      await sendTaskRemindersUseCase.execute();
    } catch (error){
      console.log('[Scheduler] Ocorreu um erro ao executar o job:', error);
    }
  }, {
    timezone: "America/Sao_Paulo"
  })
}

start().catch(e => {
  console.error('❌ Falha crítica ao inicializar o agendador:', e);
  process.exit(1);
});