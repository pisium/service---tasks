import { UserRepository } from '@/application/repositories/task-user-repository';
import { User } from '@/domain/user.entity'
import axios from 'axios'
import { config } from '@/config';

export class UserGateway implements UserRepository {
  private readonly userServiceBaseUrl: string = config.baseUrl.url;

  async findManyById(id: string[]): Promise<User[]>{
    if (id.length === 0)
      return [];
    try{
      const response = await axios.get(
        `${this.userServiceBaseUrl}/api/users/${id.join(',')}`
      );
      return response.data.map((
        userData: any
      )=> User.create(userData.id, userData.name));
    } catch(error) {
        console.error(`Erro ao buscar usuário ${id}:`, error);
        return [];
    };
  }
}

