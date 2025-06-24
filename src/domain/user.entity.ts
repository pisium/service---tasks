export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
  ) {}

  static create(
    id: string, 
    name: string
  ): User {
    if (!id || !name) { 
      throw new Error("ID e Nome do usuário são necessários para a representação local.");
    }
    return new User(
      id, 
      name
    );
  }
}