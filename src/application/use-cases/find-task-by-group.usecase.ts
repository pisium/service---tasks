import { TaskRepository } from '@/application/repositories/task-repository';
import { TaskEnrichmentService } from '@/application/services/task-enrichment.service';
import { TaskDTO } from '@/application/DTO/task.dto';

export class FindTasksByGroupUseCase {
  constructor(
    private taskRepository: TaskRepository,
    private taskEnrichementService: TaskEnrichmentService
  ) {}

  async execute(groupId: string): Promise<TaskDTO[]> {
    const tasks = await this.taskRepository.findByGroupId(groupId);
    const enrichedTasks = await this.taskEnrichementService.enrichTasks(tasks);

    return enrichedTasks;
  }
}