import { TaskStatus } from '@/domain/task-status.enum';

export class Task {
  constructor(
    public readonly id: string,
    public title: string,
    public readonly creatorId: string,
    public readonly groupId: string,
    public status: TaskStatus,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public dueDate?: Date,
    public description?: string,
    public responsibleId?: string,
    public memberIds: string[] = []
  ) {}

  static create(
    id: string,
    title: string,
    creatorId: string,
    groupId: string,
    description?: string,
    responsibleId?: string,
    dueDate?: Date,
    memberIds?: string [],
  ): Task {
    if (!title.trim()) {
      throw new Error('O título da tarefa não deve estar vazio.');
    }

    const now = new Date();
    return new Task(
      id,
      title,
      creatorId,
      groupId,
      TaskStatus.TO_DO,
      now,
      now,
      dueDate,
      description,
      responsibleId,
      memberIds || []
    );
  }

  updateTitle(newTitle: string): void{
    if (!newTitle.trim()){
      throw new Error('O título da tarefa não deve estar vazio.');
    }
    this.title = newTitle;
    this.updatedAt = new Date();
  }

  updateDescription(newDescription?: string): void{
    this.description = newDescription;
    this.updatedAt = new Date ();
  }

  updateStatus(newStatus: TaskStatus): void {
    if (!Object.values(TaskStatus).includes(newStatus)) {
      throw new Error('Status de tarefa inválido');
    }

    if (this.status === TaskStatus.ARCHIVED && newStatus !== TaskStatus.ARCHIVED) {
      throw new Error('Não é possível alterar o status de uma tarefa arquivada.');
    }

    this.status = newStatus;
    this.updatedAt = new Date();
  }

  updateDueDate(newDueDate?: Date): void{
    this.dueDate = newDueDate;
    this.updatedAt = new Date();
  }

  assignResponsible(responsibleId: string): void {
    this.responsibleId = responsibleId;
    this.updatedAt = new Date();
  }

  addMember(memberId: string): void{
    if (!this.memberIds.includes(memberId)){
      this.memberIds.push(memberId);
      this.updatedAt = new Date();
    }
  }

  removeMember(memberId: string): void{
    const memberIndex = this.memberIds.indexOf(memberId);
    if (memberIndex > -1){
      this.memberIds.splice(memberIndex, 1);
      this.updatedAt = new Date();
    }
  }
}
