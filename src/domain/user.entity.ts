export class User {
  public readonly id: string;
  public readonly name: string;
  public readonly email?: string;

  private constructor(props: { 
    id: string; 
    name: string; 
    email?: string 
  }) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
  }

  public static create(props: { 
    id: string; 
    name: string; 
    email?: string
   }): User {
    if (!props.id || !props.name) { 
      throw new Error("ID e Nome do usuário são necessários para a representação local.");
    }

    return new User(props);
  }
}