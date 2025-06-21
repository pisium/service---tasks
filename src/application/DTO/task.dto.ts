export interface TaskDTO {
  id: string;
  title: string;
  description?: string;
  status: string;
  creatorId: string;
  groupId: string;
  responsibleId?: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
}