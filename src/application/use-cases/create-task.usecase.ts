import { TaskRepository } from '@/application/repositories/task-repository';
import { CreateTaskDTO, TaskDTO } from '@/application/DTO/task.dto';
import { Task } from '@/domain/task.entity';
import { v4 as uuidv4 } from 'uuid';
import { RabbitMQService } from '@/infrastructure/messaging/rabbitmq.service';
import { config } from '@/config';
import { TaskEnrichmentService } from '@/application/services/task-enrichment.service';

export class CreateTaskUseCase {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly taskEnrichmentService: TaskEnrichmentService,
    private readonly notificationService: RabbitMQService
  ) {}

  async execute(input: CreateTaskDTO): Promise<TaskDTO> {

    const task = Task.create(
      uuidv4(),
      input.title,
      input.creatorId,
      input.groupId,
      input.description,
      input.responsibleId,
      input.dueDate,
      input.memberIds,
  );

    await this.taskRepository.create(task);

    const notificationPayload = {
      type: 'TASK_CREATED',
      recipientId: task.creatorId,
      data:{
        taskId: task.id,
        title: task.title,
        responsible: task.responsibleId
      }
    };

    await this.notificationService.publish(
      config.rabbitMQ.notificationExchange,
      config.rabbitMQ.taskCreatedRoutingKey,
      notificationPayload
    )

    const enrichedTasks = await this.taskEnrichmentService.enrichTasks([task])

    if (enrichedTasks.length === 0){
      throw new Error(
        "Tarefa criada, mas não foi possível obter os dados do usuário.");
    }

    return enrichedTasks[0];
  }
}
