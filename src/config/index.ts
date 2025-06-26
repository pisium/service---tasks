import dotenv from 'dotenv';
dotenv.config();
export const config = {
  auth:{
    AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
  },
  server: {
    port: process.env.PORT || 3002,
  },
  baseUrl:{
    url: process.env.USER_BASE_URL || 'http://service_user:3001',
    taskReminder: process.env.TASK_REMINDER_URL || 'http://service_notification:3001'
  },
  database: {
    database: process.env.DATABASE_URL || 'file:./dev.db'
  },
};