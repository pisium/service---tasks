import { TaskRepository } from '@/application/repositories/task-repository';
import { TaskStatus } from '@/domain/task-status.enum';
import { TaskEnrichmentService } from '@/application/services/task-enrichment.service';
import { TaskDTO } from '@/application/DTO/task.dto';

interface UpdateTaskRequest {
  taskId: string;
  creatorId: string;
  title?: string;
  description?: string;
  status?: TaskStatus;
  responsibleId?: string;
  dueDate?: Date | string | null;
  addMemberIds?: string[];
  removeMemberIds?: string[];
}

export class UpdateTaskUseCase {
  constructor(
    private taskRepository: TaskRepository,
    private taskEnrichmentService: TaskEnrichmentService,
  ){}

  async execute(data: UpdateTaskRequest): Promise<TaskDTO> {
    const task = await this.taskRepository.findById(data.taskId);

    if (!task) {
      throw new Error('Tarefa não encontrada.');
    }

    const isCreator = task.creatorId === data.creatorId;
    const isResponsible = task.responsibleId === data.responsibleId;

    if (!isCreator && !isResponsible) {
      throw new Error('Você não tem permissão para atualizar esta tarefa');
    }

    let hasChanges = false;

    if (data.title !== undefined){
      task.updateTitle(data.title);
      hasChanges = true;
    }
    if (data.description !== undefined){
      task.updateDescription(data.description);
      hasChanges = true;
    }
    if (data.status !== undefined){
      task.updateStatus(data.status);
      hasChanges = true;
    }
    if (data.responsibleId !== undefined){
      task.assignResponsible(data.responsibleId);
      hasChanges = true;
    }
    if (data.addMemberIds && data.addMemberIds.length > 0){
      data.addMemberIds.forEach(id => task.addMember(id));
      hasChanges = true;
    }
    if (data.removeMemberIds && data.removeMemberIds.length >0){
      data.removeMemberIds.forEach(id => task.removeMember(id));
      hasChanges = true;
    }

    if (data.dueDate !== undefined){
      if (data.dueDate === null){
        task.updateDueDate(undefined)
      } else {
        const dateString = `${data.dueDate}T12:00:00`
        const newDueDate = new Date(dateString);
        if (!isNaN(newDueDate.getTime())){
          
          task.updateDueDate(newDueDate);
        }
      }
      hasChanges = true;
    }

    if (hasChanges){
      await this.taskRepository.save(task);
    };
    
    const enrichedTasks = await this.taskEnrichmentService.enrichTasks([task]);

    if (enrichedTasks.length === 0){
      throw new Error(
        "Tarefa atualizada, mas não foi possível obter os dados do usuário."
      )
    }
    return enrichedTasks[0];
  }
}
