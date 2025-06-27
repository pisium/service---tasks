import { TaskRepository } from "@/application/repositories/task-repository";

interface DeleteTaskRequest {
  taskId: string;
  creatorId: string;
}

export class DeleteTaskUseCase {
  constructor(
    private taskRepository: TaskRepository,
  ) {}

  async execute(data: DeleteTaskRequest): Promise<void> {
    const task = await this.taskRepository.findById(data.taskId);

    if (!task) {
      throw new Error('Tarefa não encontrada');
    }

    // Apenas o criador pode deletar
    if (task.creatorId !== data.creatorId) {
      throw new Error('Você não tem permissão para deletar esta tarefa');
    }

    await this.taskRepository.delete(data.taskId);
  }
}