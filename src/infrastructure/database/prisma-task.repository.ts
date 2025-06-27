import { PrismaClient, TaskStatus as PrismaTaskStatus } from '@prisma/client';
import { Task } from '@/domain/task.entity';
import { TaskRepository } from '@/application/repositories/task-repository';
import { TaskMapper } from '@/infrastructure/database/mappers/task-mapper';

export class PrismaTaskRepository implements TaskRepository {
  constructor(private prisma: PrismaClient) {}

  async create(task: Task): Promise<void> {
    const memberIds = task.memberIds || [];
    await this.prisma.task.create({
      data: {
        id: task.id,
        title: task.title,
        description: task.description,
        status: TaskMapper.statusToPrisma(task.status), 
        creatorId: task.creatorId,
        groupId: task.groupId,
        responsibleId: task.responsibleId,
        dueDate: task.dueDate,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        members: {
          create: memberIds.map(id => ({
            memberId: id,
          })),
        }
      },
    });
  }

  async save(task: Task): Promise<void> {
    const memberIds = task.memberIds || [];

    await this.prisma.task.update({
      where: { 
        id: task.id 
      },
      data:{
        title: task.title,
        description: task.description,
        status: TaskMapper.statusToPrisma(task.status),
        responsibleId: task.responsibleId,
        updatedAt: task.updatedAt,
        dueDate: task.dueDate,
        members:{
          deleteMany: {},
          create: memberIds.map(
            id => ({
              memberId:id,
            }),
          ),
        },
      }
    });
  }

  async delete(taskId: string): Promise<void> {
    await this.prisma.task.delete({
      where: { id: taskId },
    });
  }

  async findById(taskId: string): Promise<Task | null> {
    const prismaTask = await this.prisma.task.findUnique({ 
      where: { id: taskId } ,
      include: {members: true},
    });
    if (!prismaTask) return null;

    return TaskMapper.toDomain(prismaTask);
  }

  async findByGroupId(groupId: string): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: { groupId },
      include: { members: true},
    });

    return tasks.map(TaskMapper.toDomain); 
  }

  async findByUserId(userId: string): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: {
        OR: [
          { creatorId: userId },
          { responsibleId: userId },
          { members: { some: {memberId: userId}}},
        ],
      },
      include: { members: true},
    });

    return tasks.map(TaskMapper.toDomain);
  }

  async findByDueTask(date: Date): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: {
        dueDate:{
          gte: new Date(
            date.getFullYear(), 
            date.getMonth(), 
            date.getDate(),0, 0, 0),
          lt: new Date(
            date.getFullYear(), 
            date.getMonth(),
            date.getDate() + 1, 0, 0, 0),
        },
      },
      include: { members: true},
    });
    
    return tasks.map(TaskMapper.toDomain);
  }

  async findDueTasksToSendReminder(): Promise<Task[]> {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(), 0, 0, 0
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(), 23, 59, 59
    );

    const tasks = await this.prisma.task.findMany({
      where: {
        dueDate: {
          gte: startOfDay,
          lte: endOfDay,
        },

        lastReminderSentAt: null,
        status:{
          notIn: [PrismaTaskStatus.DONE, PrismaTaskStatus.ARCHIVED]
        }
      },
      include: { members: true},
    });
    return tasks.map(TaskMapper.toDomain)
  }

  async markReminderAsSent(taskId: string): Promise<void> {
    await this.prisma.task.update({
      where: {
        id: taskId
      },
      data: {
        lastReminderSentAt: new Date(),
      },
    });
  }
}
