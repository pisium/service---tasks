import { TaskRepository } from "@/application/repositories/task-repository";

export class FindTasksByUserUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(userId: string) {
    const tasks = await this.taskRepository.findByUserId(userId);
    return tasks;
  }
}