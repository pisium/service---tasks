import { Task } from '@/domain/task.entity';
import { TaskDTO } from '@/application/DTO/task.dto';
import { TaskUserDataService } from '@/application/services/task-user-data.service';
import { TaskDTOMapper } from '@/application/mappers/response-dto.mapper';

export class TaskEnrichmentService {
  constructor(
    private taskUserDataService: TaskUserDataService
  ) {}

  public async enrichTasks(tasks: Task[]): Promise<TaskDTO[]>{
    if(tasks.length === 0)
      return [];

    const membersMap = await this.taskUserDataService.getUsersMembersTasks(tasks)

    return tasks.map(task => {
      const creator = membersMap.get(task.creatorId);
      const responsible = task.responsibleId ? membersMap.get(task.responsibleId) : undefined;
      const members = (task.memberIds || [])
        .map(id => membersMap.get(id))
        .filter(Boolean)
        .map(user => ({
          id: user!.id,
          name: user!.name,
          email: user!.email
        }));
        return TaskDTOMapper.toDTO(task, creator, responsible, members);
    });
  }
}