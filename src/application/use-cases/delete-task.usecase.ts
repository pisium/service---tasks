import { TaskRepository } from "@/application/repositories/task-repository";
import { RabbitMQService } from "@/infrastructure/messaging/rabbitmq.service";
import { config } from "@/config";

interface DeleteTaskRequest {
  taskId: string;
  userId: string;
}

export class DeleteTaskUseCase {
  constructor(
    private taskRepository: TaskRepository,
    private notificationService : RabbitMQService
  ) {}

  async execute(data: DeleteTaskRequest): Promise<void> {
    const task = await this.taskRepository.findById(data.taskId);

    if (!task) {
      throw new Error('Tarefa não encontrada');
    }

    // Apenas o criador pode deletar
    if (task.creatorId !== data.userId) {
      throw new Error('Você não tem permissão para deletar esta tarefa');
    }

    await this.taskRepository.delete(data.taskId);

        const notificationPayload = {
          type: 'TASK_DELETED',
          recipientId: task.creatorId,
          data:{
            taskId: task.id,
            title: task.title,
            responsible: task.responsibleId
          }
        };
    
        await this.notificationService.publish(
          config.rabbitMQ.notificationExchange,
          config.rabbitMQ.taskDeletedRoutingKey,
          notificationPayload
        );
  }
}