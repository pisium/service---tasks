import { Task } from '@/domain/task.entity';

export interface TaskRepository {
  create(task: Task): Promise<void>;
  save(task: Task): Promise<void>;
  delete(taskId: string): Promise<void>;
  findById(taskId: string): Promise<Task | null>;
  findByGroupId(groupId: string): Promise<Task[]>;
  findByUserId(userId: string): Promise<Task[]>;
  findByDueTask(dueDate: Date): Promise<Task[]>;
}