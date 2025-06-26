import { UserRepository } from '@/application/repositories/task-user-repository';
import { User } from '@/domain/user.entity'
import axios from 'axios'
import { config } from '@/config';

export class UserGateway implements UserRepository {
  private readonly userServiceBaseUrl: string = config.baseUrl.url;

  async findManyById(ids: string[]): Promise<User[]>{
    if (ids.length === 0)
      return [];
    try{
      const url = `${this.userServiceBaseUrl}/internal/users?ids=${ids.join(',')}`;
      const response = await axios.get(url);

      return response.data.map((userData: any) => {
        return User.create({
          id: userData.id, 
          name: userData.name, 
          email: userData.email
      });
    });
    } catch(error) {
        console.error(`Erro ao buscar usuário ${ids.join(',')}:`, error.message);
        return [];
    };
  }
}

