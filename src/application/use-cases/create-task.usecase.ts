import { TaskRepository } from '@/application/repositories/task-repository';
import { CreateTaskDTO} from '@/application/DTO/create-task.dto';
import { TaskDTO } from '@/application/DTO/task.dto';
import { Task } from '@/domain/task.entity';
import { v4 as uuidv4 } from 'uuid';
import { RabbitMQService } from '@/infrastructure/messaging/rabbitmq.service';
import { config } from '@/config';

export class CreateTaskUseCase {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly notificationService: RabbitMQService
  ) {}

  async execute(input: CreateTaskDTO): Promise<TaskDTO> {
    let validDueDate: Date | null = null;
    if (input.dueDate){
      const parsedDate = new Date(input.dueDate);
        validDueDate = parsedDate;
    }

    const task = Task.create(
      uuidv4(),
      input.title,
      input.creatorId,
      input.groupId,
      input.description,
      input.responsibleId,
      validDueDate
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

    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      creatorId: task.creatorId,
      groupId: task.groupId,
      responsibleId: task.responsibleId,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      dueDate: task.dueDate
    };
  }
}
