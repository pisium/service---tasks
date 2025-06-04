export class GroupMember{
  constructor(
    id,
    groupId,
    userId,
    role = 'member',
    addedAt = new Date()
  )
  {
    this.id = id;
    this.groupId = groupId;
    this.userId = userId;
    this.role = role;
    this.addedAt = addedAt;   
  }
}