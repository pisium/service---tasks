import { Request, Response } from 'express';
import { CreateTaskUseCase } from '@/application/use-cases/create-task.usecase';
import { UpdateTaskUseCase } from '@/application/use-cases/update-task.usecase';
import { DeleteTaskUseCase } from '@/application/use-cases/delete-task.usecase';
import { FindTasksByGroupUseCase } from '@/application/use-cases/find-task-by-group.usecase';
import { FindTasksByUserUseCase } from '@/application/use-cases/find-task-by-user.usecase';
import { FindTasksByDueDateUseCase } from '@/application/use-cases/find-task-by-due-date.usecase';
import { AuthenticatedRequest } from '@/presentation/middlewares/auth.middleware';

export class TaskController {
  constructor(
    private createTaskUseCase: CreateTaskUseCase,
    private updateTaskUseCase: UpdateTaskUseCase,
    private deleteTaskUseCase: DeleteTaskUseCase,
    private findTasksByGroupUseCase: FindTasksByGroupUseCase,
    private findTasksByUserUseCase: FindTasksByUserUseCase,
    private findTaskByDueDateUseCase: FindTasksByDueDateUseCase
  ) {}

  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { title, description, responsibleId, groupId, dueDate, memberIds } = req.body;
      const creatorId = req.user!.id; 
      const task = await this.createTaskUseCase.execute({
        title,
        description,
        creatorId,
        groupId,
        responsibleId,
        dueDate,
        memberIds
      });

      res.status(201).json(task);


  }

  async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { taskId } = req.params;
      const dataToUpdate = req.body;
      const userId = req.user!.id;

      const response = await this.updateTaskUseCase.execute({
        taskId,
        userId,
        ...dataToUpdate,
      });

      res.status(200).json(response);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Ocorreu um erro inesperado.' });
      }
    }
  }

  async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { taskId } = req.params;
      const userId = req.user!.id;

      await this.deleteTaskUseCase.execute({ taskId, userId });

      res.status(204).send(); 

    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Ocorreu um erro inesperado." });
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
        res.status(500).json({ message: "Ocorreu um erro inesperado." });
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
        res.status(500).json({ message: "Ocorreu um erro inesperado." });
      }
    }
  }

  async findTasksByDueDate(req: Request, res: Response): Promise<void> {
    try {
      const { date } = req.query;

      if (!date || typeof date !== 'string') {
        res.status(400).json({
          message: 'O parâmetro de query "date" é obrigatório e deve ser uma string no formato YYYY-MM-DD.'
        });
        return;
      }

      const tasks = await this.findTaskByDueDateUseCase.execute(date);
      res.status(200).json(tasks);

    } catch (error) {
      if (error instanceof Error) {
        console.error('Erro ao buscar tarefas por data:', error.message);
        if (error.message.includes('Formato de data inválido')) {
          res.status(400).json({ message: error.message });
        } else {
          res.status(500).json({ message: 'Erro interno do servidor.' });
        }
      } else {
        res.status(500).json({ message: 'Erro desconhecido ao buscar tarefas.' });
      }
    }
  }
}