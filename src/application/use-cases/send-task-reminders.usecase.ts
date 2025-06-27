import { TaskRepository } from '@/application/repositories/task-repository';
import { TaskUserDataService } from '@/application/services/task-user-data.service';
import { NotificationService } from '@/application/services/task-notification.service';

export class SendTaskRemindersUseCase {
  constructor (
    private taskRepository: TaskRepository,
    private taskUserDataService: TaskUserDataService,
    private notificationService: NotificationService
  ) {}

  async execute(): Promise <void> {
    const tasks = await this.taskRepository.findDueTasksToSendReminder();

    if (tasks.length === 0){
      return
    }

    const membersMap = await this.taskUserDataService.getUsersMembersTasks(tasks);

    for (const task of tasks){
      const recipientId = task.responsibleId || task.creatorId;
      const recipient = membersMap.get(recipientId);

      if (!recipient || !recipient.email){
        console.warn(`[Scheduler] Resonsavel ou email não encontrado para a tarefa ${task.id}. A saltar.`);
        continue;  
      }
      console.log(`[Scheduler] A enviar lembrete para a tarefa "${task.title}" para ${recipient.email}...`);

      await this.notificationService.send({
        to: recipient.email,
        type: 'tarefa-vencendo',
        data: {
          nomeUsuario: recipient.name,
          tituloTarefa: task.title,
          descricaoTarefa: task.description,
          dataVencimento: task.dueDate!.toISOString().split('T')[0]
        },
      });

      await this.taskRepository.markReminderAsSent(task.id);
    }
    console.log('[Scheduler] Processo de lembretes finalizado com sucesso.');
 }
}