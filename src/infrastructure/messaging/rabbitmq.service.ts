import amqp from 'amqplib';

export class RabbitMQService {

  constructor(
    private uri: string,
    private channel = null
  ) {}

  async start(): Promise<void> {
    try {
      const connection = await amqp.connect(this.uri);
      this.channel = await connection.createChannel();
      console.log('✅ Conectado ao RabbitMQ.');
    } catch (error) {
      console.error('❌ Falha ao conectar ao RabbitMQ:', error);
      throw error;
    }
  }

  async publish(exchange: string, routingKey: string, message: any): Promise<boolean> {
    if (!this.channel) {
      throw new Error('Canal não está disponível. Chame start() primeiro.');
    }

    await this.channel.assertExchange(exchange, 'topic', { durable: true });

    const bufferMessage = Buffer.from(JSON.stringify(message));
    console.log(`[p] Publicando mensagem para o exchange '${exchange}' com a chave '${routingKey}'`);
    
    return this.channel.publish(exchange, routingKey, bufferMessage);
  }
}