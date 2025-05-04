export class Task{
  constructor(
    id,
    projectId,
    title,
    description = null,
    status = 'to_do',
    responsibleId = null,
    createdAt = new Date()
  )
  {
    this.id = id,
    this.projectId = projectId,
    this.title = title,
    this.description = description,
    this.status = status,
    this.responsibleId = responsibleId,
    this.createdAt = createdAt;
  }
}