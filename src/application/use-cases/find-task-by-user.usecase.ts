import { TaskRepository } from '@/application/repositories/task-repository';
import { TaskEnrichmentService } from '@/application/services/task-enrichment.service';
import { TaskDTO } from '@/application/DTO/task.dto';

export class FindTasksByUserUseCase {
  constructor(
    private taskRepository: TaskRepository,
    private taskEnrichmentService: TaskEnrichmentService
  ) {}

  async execute(userId: string): Promise<TaskDTO[]> {
    const tasks = await this.taskRepository.findByUserId(userId);
    const enrichedTasks = await this.taskEnrichmentService.enrichTasks(tasks);

    return enrichedTasks;
  }
}