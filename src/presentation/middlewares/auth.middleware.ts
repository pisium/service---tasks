import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { config } from '@/config';

export interface AuthenticatedRequest extends Request {
  user?: {
  id: string;
  email?: string;
  groups?: string[];
  [key: string]: any;
  };
}

export async function authenticateAPI(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  next()
}
