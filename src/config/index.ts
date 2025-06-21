import dotenv from 'dotenv';
dotenv.config();
export const config = {
  auth:{
    AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
  },
  server: {
    port: process.env.PORT || 3002,
  },
  rabbitMQ: {
    uri: process.env.RABBITMQ_URI || 'amqp://guest:guest@localhost:5672',
    notificationExchange: process.env.NOTIFICATION_EXCHANGE_NAME || 'notification_events',
    taskCreatedRoutingKey: process.env.TASK_CREATED_ROUTING_KEY || 'task.created.notification',
    taskUpdatedRoutingKey: process.env.TASK_UPDATED_ROUTING_KEY || 'task.updated.notification',
    taskDeletedRoutingKey: process.env.TASK_DELETED_ROUTING_KEY || 'task.deleted.notification',
  },
  database: {
    database: process.env.DATABASE_URL || 'file:./dev.db'
  },
};