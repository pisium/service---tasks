import { Task as PrismaTask, TaskMember, TaskStatus as PrismaTaskStatus } from '@prisma/client';
import { Task } from '@/domain/task.entity';
import { TaskStatus } from '@/domain/task-status.enum';

type PrismaTaskWithMembers = PrismaTask & {
  members: TaskMember[];
};

export class TaskMapper {
  static toDomain(prismaTask: PrismaTaskWithMembers): Task {
    const memberIds = prismaTask.members.map(
      member => member.memberId
    );

    return new Task(
      prismaTask.id,
      prismaTask.title,
      prismaTask.creatorId,
      prismaTask.groupId,
      TaskMapper.statusFromPrisma(prismaTask.status),
      prismaTask.createdAt,
      prismaTask.updatedAt,
      prismaTask.dueDate,
      prismaTask.description,
      prismaTask.responsibleId,
      memberIds
    );
  }

  static statusToPrisma(status: TaskStatus): PrismaTaskStatus {
    return status as PrismaTaskStatus;
  }

  static statusFromPrisma(status: string): TaskStatus {
    switch(status){
      case 'TO_DO': return TaskStatus.TO_DO;
      case 'IN_PROGRESS': return TaskStatus.IN_PROGRESS;
      case 'DONE': return TaskStatus.DONE;
      case 'ARCHIVED': return TaskStatus.ARCHIVED;
      default: 
        throw new Error(`Status Prisma desconhecido: ${status}`);
    }
  }
}
