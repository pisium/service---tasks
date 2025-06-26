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
  creator: UserInfoDTO;
  groupId: string;
  responsible?: UserInfoDTO;
  dueDate?: Date;
  members?: UserInfoDTO[];
}