import { Task as PrismaTask } from '@prisma/client';
import { Task } from '@/domain/task.entity';
import { TaskStatus } from '@/domain/task-status.enum';
import { TaskStatus as PrismaTaskStatus } from '@prisma/client';

export class TaskMapper {
  static toDomain(prismaTask: PrismaTask): Task {
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
      prismaTask.responsibleId
    );
  }

  static toPersistence(task: Task){
     return { 
      id: task.id,
      title: task.title,
      description: task.description,
      status: TaskMapper.statusFromPrisma(task.status),
      creatorId: task.creatorId,
      groupId: task.groupId,
      responsibleId: task.responsibleId,
      dueDate: task.dueDate,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
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
