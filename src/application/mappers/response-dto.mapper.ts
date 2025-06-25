import { Task } from '@/domain/task.entity';
import { User } from '@/domain/user.entity';
import { TaskDTO, UserInfoDTO } from '@/application/DTO/task.dto';

export class TaskDTOMapper {
  public static toDTO(
    task: Task, 
    creator: User | undefined, 
    responsible: User | null | undefined,
    members: User[]
  ): TaskDTO {
    const mapUserToDTO = (user: User | undefined): UserInfoDTO | null => {
      if(!user) return null;
      return{
        id: user.id,
        name: user.name,
        email: user.email,
      };
    };
      return {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        groupId: task.groupId,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        dueDate: task.dueDate,
        creator: mapUserToDTO(creator) || { id: task.creatorId, name: 'Usuário Desconhecido'},
        responsible: mapUserToDTO(responsible),
        members: members.map(mapUserToDTO).filter(Boolean) as UserInfoDTO[],
      };
  }
}