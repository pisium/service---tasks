export interface NotificationPayload {
  to: any;
  type: 'TASK_REMINDER' | 'TASK_CREATED' | 'TASK_UPDATED';
  creator: any;
  data: any;
}

export interface NotificationService{
  send(payload:NotificationPayload): Promise<void>;
}