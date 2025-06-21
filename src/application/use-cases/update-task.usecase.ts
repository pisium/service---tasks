import { TaskRepository } from "@/application/repositories/task-repository";
import { Task } from "@/domain/task.entity";
import { TaskStatus } from "@/domain/task-status.enum";

interface UpdateTaskRequest {
  taskId: string;
  userId: string;
  title?: string;
  description?: string;
  status?: TaskStatus;
  responsibleId?: string;
  dueDate?: Date | string | null;
}

export class UpdateTaskUseCase {
  constructor(
    private taskRepository: TaskRepository
  ){}

  async execute(data: UpdateTaskRequest): Promise<Task> {
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
      await this.taskRepository.update(task)
    }

    return task;
  }
}
