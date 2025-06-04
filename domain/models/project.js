export class Project{
  constructor(
    id,
    groupId,
    name,
    description = null,
    createdAt = new Date(), 
    tasks = []
  )
  {
    this.id = id;
    this.groupId = groupId;
    this.name = name;
    this.description = description;
    this.createdAt = createdAt;
    this.tasks = tasks
  }
}