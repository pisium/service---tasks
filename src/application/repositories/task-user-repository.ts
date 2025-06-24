import { User } from '@/domain/user.entity';

export interface UserRepository {
  findManyById(ids: string[]): Promise<User[]>;
}
