import { TaskRepository } from "@/application/repositories/task-repository";

export class FindTasksByGroupUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(groupId: string) {
    const tasks = await this.taskRepository.findByGroupId(groupId);
    return tasks;
  }
}