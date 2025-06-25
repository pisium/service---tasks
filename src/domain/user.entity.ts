export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email?: string
  ) {}

  static create(
    id: string, 
    name: string,
    email: string
  ): User {
    if (!id || !name || !email) { 
      throw new Error("ID e Nome do usuário são necessários para a representação local.");
    }
    return new User(
      id, 
      name,
      email,
    );
  }
}