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
    url: process.env.USER_BASE_URL || 'http://localhost:3001',
    taskReminder: process.env.TASK_REMINDER_URL || 'https://49f0-2804-1ae0-203f-c01-f88-29a4-dd0f-b36b.ngrok-free.app'
  },
  database: {
    database: process.env.DATABASE_URL || 'file:./dev.db'
  },
};