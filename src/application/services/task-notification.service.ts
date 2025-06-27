export interface NotificationPayload {
  to: any;
  type: 'tarefa-vencendo';
  data: any;
}

export interface NotificationService{
  send(payload: NotificationPayload): Promise<void>;
}