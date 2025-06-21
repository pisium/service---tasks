import { TaskRepository } from '@/application/repositories/task-repository';
import { CreateTaskDTO} from '@/application/DTO/create-task.dto';
import { TaskDTO } from '@/application/DTO/task.dto';
import { Task } from '@/domain/task.entity';
import { v4 as uuidv4 } from 'uuid';

export class CreateTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(input: CreateTaskDTO): Promise<TaskDTO> {
    const task = Task.create(
      uuidv4(),
      input.title,
      input.creatorId,
      input.groupId,
      input.description,
      input.responsibleId,
      input.dueDate,
    );

    await this.taskRepository.create(task);

    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      creatorId: task.creatorId,
      groupId: task.groupId,
      responsibleId: task.responsibleId,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      dueDate: task.dueDate
    };
  }
}
