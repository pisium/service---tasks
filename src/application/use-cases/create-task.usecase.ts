import { TaskRepository } from '@/application/repositories/task-repository';
import { CreateTaskDTO, TaskDTO } from '@/application/DTO/task.dto';
import { Task } from '@/domain/task.entity';
import { v4 as uuidv4 } from 'uuid';
import { TaskEnrichmentService } from '@/application/services/task-enrichment.service';
import { NotificationService } from '@/application/services/task-notification.service';

export class CreateTaskUseCase {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly taskEnrichmentService: TaskEnrichmentService,
    private readonly notificationService: NotificationService
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

    const enrichedTasks = await this.taskEnrichmentService.enrichTasks([task])

    await this.notificationService.send({
      to:enrichedTasks[0].responsible.email, 
      type: 'TASK_CREATED',
      creator: enrichedTasks[0].creator.name,
      data:{
        task: enrichedTasks[0].title,
        status: enrichedTasks[0].status,
        responsible: enrichedTasks[0].responsible.name
      }
    });

    if (enrichedTasks.length === 0){
      throw new Error(
        "Tarefa criada, mas não foi possível obter os dados do usuário.");
    }

    return enrichedTasks[0];
  }
}
