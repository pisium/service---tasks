import { NotificationPayload, NotificationService } from '@/application/services/task-notification.service';
import { config } from '@/config';
import axios from 'axios';

export class NotificationGateway implements NotificationService{

  private readonly notificationSerivice: string = config.baseUrl.taskReminder

  public async send(payload: NotificationPayload): Promise<void>{
    const{
      endpoint,
      body
    } = this.getEndpointAndBody(payload);
    try {
      await axios.post(`${this.notificationSerivice}${endpoint}`,body);
    } catch (error){
      console.error(
        `[NotificationGateway] Falha ao enviar notificação do tipo "${payload.type}". Erro: ${error.message}`
      );
    }
  } 

  private getEndpointAndBody(payload: NotificationPayload): {
    endpoint: string;
    body: any;} {
    switch(payload.type){
      case 'TASK_REMINDER':
        return {
          endpoint: '/notifications/email/task-reminder',
          body: payload.data,
        };
      default:
        throw new Error(`Tipo de notificação não suportado:${payload.type}`);
    }
  }
}