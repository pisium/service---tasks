import { TaskRepository } from '@/application/repositories/task-repository';
import { TaskDTO } from '@/application/DTO/task.dto';
import { Task } from '@/domain/task.entity';
import { v4 as uuidv4 } from 'uuid';
import { TaskEnrichmentService } from '@/application/services/task-enrichment.service';

interface CreateTaskInput{
  title: string;
  description?:string;
  creatorId: string;
  groupId: string;
  responsibleId?: string;
  dueDate?: Date;
  memberIds?: string[];
  };

  export class CreateTaskUseCase{
    constructor(
      private readonly taskRepository: TaskRepository,
      private readonly taskEnrichmentService: TaskEnrichmentService,
    ){}

    async execute(input: CreateTaskInput): Promise<TaskDTO>{

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

    if (enrichedTasks.length === 0){
      throw new Error(
        "Tarefa criada, mas não foi possível obter os dados do usuário.");
    }

    return enrichedTasks[0];
  }
}
