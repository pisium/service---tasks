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
      prismaTask.status as unknown as TaskStatus,
      prismaTask.createdAt,
      prismaTask.updatedAt,
      prismaTask.description,
      prismaTask.responsibleId,
    );
  }

  static statusToPrisma(status: TaskStatus): PrismaTaskStatus {
    return status as unknown as PrismaTaskStatus;
  }
}
