import { Task } from '@/domain/task.entity';
import { TaskRepository } from '@/application/repositories/task-repository';

export class FindTasksByDueDateUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(dateString: string): Promise<Task[]> {
    const targetDate = new Date(dateString);

    if (isNaN(targetDate.getTime())) {
      throw new Error('Formato de data inválido. Por favor, use YYYY-MM-DD.');
    }
    return this.taskRepository.findByDueTask(targetDate);
  }
}