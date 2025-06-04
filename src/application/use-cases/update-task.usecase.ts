import { TaskRepository } from "@/application/repositories/task-repository";

interface UpdateTaskRequest {
  taskId: string;
  userId: string;
  title?: string;
  description?: string;
  status?: string;
  responsibleId?: string;
  projectId?: string;
}

export class UpdateTaskUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(data: UpdateTaskRequest) {
    const task = await this.taskRepository.findById(data.taskId);

    if (!task) {
      throw new Error('Task not found');
    }

    const isCreator = task.creatorId === data.userId;
    const isResponsible = task.responsibleId === data.userId;

    if (!isCreator && !isResponsible) {
      throw new Error('Você não tem permissão para atualizar esta tarefa');
    }

    const updateData: any = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.responsibleId !== undefined) updateData.responsibleId = data.responsibleId;
    if (data.projectId !== undefined) updateData.projectId = data.projectId;

    updateData.updatedAt = new Date();

    await this.taskRepository.update(data.taskId, updateData);

    return { message: 'Atualização realizada com sucesso' };
  }
}
