import { Task } from '@/domain/task.entity';
import { User } from '@/domain/user.entity';
import { TaskDTO, UserInfoDTO } from '@/application/DTO/task.dto';

export class TaskDTOMapper {
  public static toDTO(
    task: Task, 
    creator: User | undefined, 
    responsible: User | null | undefined,
    members: UserInfoDTO[]
  ): TaskDTO {
      return {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        groupId: task.groupId,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        dueDate: task.dueDate,
        creator: creator 
          ? { id: creator.id, 
            name: creator.name } 
          : { id: task.creatorId, 
            name: 'Usuário Desconhecido' },
        responsible: responsible
          ? { id: responsible.id, name: responsible.name }
          : null,
        members: members,
      };
  }
}