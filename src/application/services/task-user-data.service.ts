import { Task } from '@/domain/task.entity';
import { User } from '@/domain/user.entity'
import { UserRepository } from '@/application/repositories/task-user-repository';

export class TaskUserDataService {
  constructor(
    private userRepository: UserRepository
  ){}

  public async getUsersMembersTasks(tasks: Task[]): Promise<Map<string, User>>{
    if (tasks.length === 0)
      return new Map();

    const membersIds = new Set<string>();
    tasks.forEach(task => {
      membersIds.add(task.creatorId);
      if (task.responsibleId) 
        membersIds.add(task.responsibleId);
      if (task.memberIds)
        task.memberIds.forEach(
          id => membersIds.add(id));
    });
    const members = await this.userRepository.findManyById(
      Array.from(membersIds));
    return new Map(members.map(member => [member.id, member]));
  }
}