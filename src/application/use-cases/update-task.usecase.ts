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
  dueDate?: Date;
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

    const {taskId, userId, ...dataToUpdate } = data;

    if (Object.keys(dataToUpdate).length ===0){
      return task;
    }

    await this.taskRepository.update(task);

    return task;
  }
}
