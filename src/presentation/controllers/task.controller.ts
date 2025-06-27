import { Request, Response } from 'express';
import { CreateTaskUseCase } from '@/application/use-cases/create-task.usecase';
import { UpdateTaskUseCase } from '@/application/use-cases/update-task.usecase';
import { DeleteTaskUseCase } from '@/application/use-cases/delete-task.usecase';
import { FindTasksByGroupUseCase } from '@/application/use-cases/find-task-by-group.usecase';
import { FindTasksByUserUseCase } from '@/application/use-cases/find-task-by-user.usecase';
import { FindTasksByDueDateUseCase } from '@/application/use-cases/find-task-by-due-date.usecase';

export class TaskController {
  constructor(
    private createTaskUseCase: CreateTaskUseCase,
    private updateTaskUseCase: UpdateTaskUseCase,
    private deleteTaskUseCase: DeleteTaskUseCase,
    private findTasksByGroupUseCase: FindTasksByGroupUseCase,
    private findTasksByUserUseCase: FindTasksByUserUseCase,
    private findTaskByDueDateUseCase: FindTasksByDueDateUseCase
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try{
      const{
        title,description, groupId, dueDate,
        creator, creatorId: creatorIdField,
        responsible, responsibleId: resposibleIdField,
        members, memberIds: memberIdsField
      } = req.body;

      const creatorId = creatorIdField || creator?.id;
      if (!creatorId){
        throw new Error("é obrigatório fornecer um 'creator' (objeto com id) ou 'creatorId' (string).")
      }

      const responsibleId = resposibleIdField || responsible?.id;

      let memberIds = [];
      if (Array.isArray(memberIdsField)){
        memberIds = memberIdsField;
      } else if (Array.isArray(members)){
        memberIds = members.map((member: any) => member?.id)
                           .filter(Boolean);
      }

      const task = await this.createTaskUseCase.execute({
        title,
        description,
        creatorId,
        groupId,
        responsibleId,
        dueDate,
        memberIds,
      });
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof Error){
        res.status(400).json({
          message: error.message
        });
      } else {
        res.status(500).json({
          message: "Ocorreu um erro inesperado ao criar a tarefa."
        });
      }
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { taskId } = req.params;
      const { 
        creatorId: creatorIdField,
        creator,
        title,
        description,
        status, 
        responsible,
        responsibleId: resposibleIdField,
        dueDate,
        addMembers,
        addMemberIds: addMemberIdsField,
        removeMembers, 
        removeMemberIds: removeMemberIdsField,
        
      } = req.body;

      const creatorId = creatorIdField || creator?.id
      if (!creatorId){
        throw new Error("É obrigatório fornecer um 'creator' (objeto com id) ou 'creatorId' (string).");
      }

      const responsibleId = resposibleIdField || responsible?.id;
      const addMemberIds = addMemberIdsField || (Array.isArray(addMembers) ? addMembers.map(
        member => member?.id).filter(Boolean) : []);
      const removeMemberIds = removeMemberIdsField || (Array.isArray(removeMembers) ? removeMembers.map(
        member => member?.id).filter(Boolean) : [])

      const response = await this.updateTaskUseCase.execute({
        taskId,
        creatorId,
        title,
        description,
        status,
        responsibleId,
        dueDate,
        addMemberIds,
        removeMemberIds,
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

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { taskId } = req.params;
      const { creatorId } = req.body;
      await this.deleteTaskUseCase.execute({ taskId, creatorId });
      res.status(204).send(); 
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Ocorreu um erro inesperado." });
      }
    }
  }

  async findByGroup(req: Request, res: Response): Promise<void> {
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

  async findByUser(req: Request, res: Response): Promise<void> {
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
        res.status(400).json({ message: 'O parâmetro de query "date" é obrigatório e deve ser uma string no formato YYYY-MM-DD.' });
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