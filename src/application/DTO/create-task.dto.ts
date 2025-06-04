export interface CreateTaskDTO {
  title: string;
  description?: string;
  creatorId: string;
  groupId: string;
  responsibleId?: string;
}
