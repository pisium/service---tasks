import { Request, Response } from 'express';
import { CreateTaskUseCase } from '@/application/use-cases/create-task.usecase';
import { UpdateTaskUseCase } from '@/application/use-cases/update-task.usecase';
import { DeleteTaskUseCase } from '@/application/use-cases/delete-task.usecase';
import { FindTasksByGroupUseCase } from '@/application/use-cases/find-task-by-group.usecase';
import { FindTasksByUserUseCase } from "@/application/use-cases/find-task-by-user.usecase";
import { AuthenticatedRequest } from '../middlewares/auth.middleware';


export class TaskController {
  constructor(private createTaskUseCase: CreateTaskUseCase,
              private updateTaskUseCase: UpdateTaskUseCase,
              private deleteTaskUseCase: DeleteTaskUseCase,
              private findTasksByGroupUseCase: FindTasksByGroupUseCase,
              private findTasksByUserUseCase: FindTasksByUserUseCase,
  ) {}


  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { title, description, responsibleId, groupId} = req.body;

      if (!req.user){
        res.status(401).json({message: 'Unauthorized'})
      }

      const creatorId = req.user.id;
      const userGroups = req.user.groups || [];
      
      if (!groupId){
        res.status(400).json({message: "GroupId é obrigatório"})
        return;
      }
       
      if (!userGroups){
        res.status(400).json({message:'Você não pode criar uma tarefa sem grupo associado'});
        return;
      }

      const task = await this.createTaskUseCase.execute({
        title,
        description,
        creatorId,
        groupId,
        responsibleId,
      });

      res.status(201).json(task)

    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: "Erro desconhecido" });
      }
    }
  }

  async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { taskId } = req.params;
      const { title, description, status, responsibleId, projectId } = req.body;

      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const userId = req.user.id;

      const response = await this.updateTaskUseCase.execute({
        taskId,
        userId,
        title,
        description,
        status,
        responsibleId,
        projectId,
      });

      res.status(200).json(response);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Unexpected error' });
      }
    }
  }

  async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { taskId } = req.params;

      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const userId = req.user.id;

      await this.deleteTaskUseCase.execute({
        taskId,
        userId,
      });

      res.status(200).json({ message: 'Tarefa deletada com sucesso' });

    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Erro desconhecido" });
      }
    }
  }
  async findByGroup(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { groupId } = req.params;

      const tasks = await this.findTasksByGroupUseCase.execute(groupId);

      res.status(200).json(tasks);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Erro desconhecido" });
      }
    }
  }

  async findByUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      const tasks = await this.findTasksByUserUseCase.execute(userId);

      res.status(200).json(tasks);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Erro desconhecido" });
      }
    }
  }
}
