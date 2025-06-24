import { Task } from '@/domain/task.entity';
import { TaskDTO } from '@/application/DTO/task.dto';
import { UserRepository } from '@/application/repositories/task-user-repository';
import { TaskDTOMapper } from '@/application/mappers/response-dto.mapper';

export class TaskEnrichmentService {
  constructor(
    private userRepository: UserRepository
  ) {}

  public async enrichTasks(tasks: Task[]): Promise<TaskDTO[]>{
    if(tasks.length === 0)
      return [];

    const userIds = new Set<string>();
    tasks.forEach(task =>{
      userIds.add(task.creatorId);
      if(task.responsibleId)
        userIds.add(task.responsibleId);
      if(task.memberIds) 
        task.memberIds.forEach(id => userIds.add(id));
    });

    const users = await this.userRepository.findManyById(Array.from(userIds));
    const usersMap = new Map(users.map(user => [user.id, user]));

    return tasks.map(task => {
      const creator = usersMap.get(task.creatorId);
      const responsible = task.responsibleId ? usersMap.get(task.responsibleId) : undefined;
      const members = (task.memberIds || [])
        .map(id => usersMap.get(id))
        .filter(Boolean)
        .map(user => ({
          id: user!.id,
          name: user!.name
        }));
        return TaskDTOMapper.toDTO(task, creator, responsible, members);
    });
  }
}