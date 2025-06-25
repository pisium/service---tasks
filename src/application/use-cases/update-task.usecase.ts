import { TaskRepository } from '@/application/repositories/task-repository';
import { TaskStatus } from '@/domain/task-status.enum';
import { config } from '@/config';
import { TaskEnrichmentService } from '@/application/services/task-enrichment.service';
import { TaskDTO } from '@/application/DTO/task.dto';
import { NotificationService } from '@/application/services/task-notification.service';

interface UpdateTaskRequest {
  taskId: string;
  userId: string;
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
    private notificationService: NotificationService
  ){}

  async execute(data: UpdateTaskRequest): Promise<TaskDTO> {
    const task = await this.taskRepository.findById(data.taskId);

    if (!task) {
      throw new Error('Tarefa não encontrada.');
    }

    const isCreator = task.creatorId === data.userId;
    const isResponsible = task.responsibleId === data.userId;

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
      await this.taskRepository.save(task)
        const notificationPayload = {
          type: 'TASK_UPDATED',
          recipientId: task.creatorId,
          data:{
            taskId: task.id,
            title: task.title,
            description: task.description,
            dueDate: task.dueDate,
            responsible: task.responsibleId
          }
        };
    
    }
    const enrichedTasks = await this.taskEnrichmentService.enrichTasks([task]);

    await this.notificationService.send({
      to:enrichedTasks[0].responsible.email, 
      type: 'TASK_UPDATED',
      creator: enrichedTasks[0].creator.name,
      data:{
        task: enrichedTasks[0].title,
        status: enrichedTasks[0].status,
        responsible: enrichedTasks[0].responsible.name
      }
    });

    if (enrichedTasks.length === 0){
      throw new Error(
        "Tarefa criada, mas não foi possível obter os dados do usuário."
      )
    }
    return enrichedTasks[0];
  }
}
