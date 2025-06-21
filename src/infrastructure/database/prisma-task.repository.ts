import { PrismaClient } from "@prisma/client";
import { Task } from "@/domain/task.entity";
import { TaskRepository } from "@/application/repositories/task-repository";
import { TaskMapper } from "./mappers/task-mapper";

export class PrismaTaskRepository implements TaskRepository {
  constructor(private prisma: PrismaClient) {}

  async create(task: Task): Promise<void> {
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
      },
    });
  }

  async update(task: Task): Promise<void> {
    const data = TaskMapper.toPersistence(task);
    await this.prisma.task.update({
      where: { 
        id: task.id 
      },
      data,
    });
  }

  async delete(taskId: string): Promise<void> {
    await this.prisma.task.delete({
      where: { id: taskId },
    });
  }

  async findById(taskId: string): Promise<Task | null> {
    const prismaTask = await this.prisma.task.findUnique({ 
      where: { id: taskId } 
    });
    if (!prismaTask) return null;

    return TaskMapper.toDomain(prismaTask);
  }

  async save(task: Task): Promise<void> {
    await this.prisma.task.update({
      where: { id: task.id },
      data: {
        title: task.title,
        description: task.description,
        status: TaskMapper.statusToPrisma(task.status), 
        responsibleId: task.responsibleId,
        updatedAt: task.updatedAt,
        dueDate: task.dueDate
      },
    });
  }

  async findByGroupId(groupId: string): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: { groupId },
    });

    return tasks.map(TaskMapper.toDomain); 
  }

  async findByUserId(userId: string): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: {
        OR: [
          { creatorId: userId },
          { responsibleId: userId },
        ],
      },
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
    });
    
    return tasks.map(TaskMapper.toDomain);
  }
}
