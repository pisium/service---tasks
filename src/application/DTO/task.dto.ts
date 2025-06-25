export interface UserInfoDTO{
  id: string;
  name: string;
  email?: string;
}

export interface TaskDTO {
  id: string;
  title: string;
  description?: string;
  status: string;
  groupId: string;
  creator: UserInfoDTO;
  responsible: UserInfoDTO;
  members: UserInfoDTO[];
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
}

export interface CreateTaskDTO{
  title: string;
  description?: string;
  creatorId: string;
  groupId: string;
  responsibleId?: string;
  dueDate?: Date;
  memberIds?: string[];
}