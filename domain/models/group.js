export class Group{
  constructor(
    id,
    name, 
    createdBy, 
    createdAt = new Date(),
    members = [],
    projects = []
  )
  {
    this.id = id;
    this.name = name;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
    this.members = members;
    this.projects = projects;
  }    
}