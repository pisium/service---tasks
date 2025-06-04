import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

export interface AuthenticatedRequest extends Request {
  user?: {
  id: string;
  email?: string;
  groups?: string[];
  [key: string]: any;
  };
}

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';

export async function authenticateAPI(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: 'Buscando autorização' });
    return; 
  }

  try {
    const response = await axios.get(`${AUTH_SERVICE_URL}/validate-api`, {
      headers: {
        Authorization: authHeader,
      },
    });

    req.user = response.data;
    next(); 
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      res.status(401).json({ message: 'Unauthorized' });
    } else {
      res.status(500).json({ message: 'Serviço de autenticação indisponivel'});
    }
    return;
  }
}
