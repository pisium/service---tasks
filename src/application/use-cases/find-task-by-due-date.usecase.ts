import { TaskRepository } from '@/application/repositories/task-repository';
import { TaskEnrichmentService } from '@/application/services/task-enrichment.service';
import { TaskDTO } from '@/application/DTO/task.dto';

export class FindTasksByDueDateUseCase {
  constructor(
    private taskRepository: TaskRepository,
    private taskEnrichmentService: TaskEnrichmentService,
  ) {}

  async execute(dateString: string): Promise<TaskDTO[]> {
    const targetDate = new Date(`${dateString}T12:00:00`);

    if (isNaN(targetDate.getTime())) {
      throw new Error('Formato de data inválido. Por favor, use YYYY-MM-DD.');
    }
    const tasks = await this.taskRepository.findByDueTask(targetDate);
    const enrichedTasks = await this.taskEnrichmentService.enrichTasks(tasks);

    return enrichedTasks
  }
}