import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import crypto from 'crypto'; // para generar un hash único si no tienes un ID específico

export class SnsPublisher {
  private snsClient: SNSClient;

  constructor() {
    this.snsClient = new SNSClient({ region: process.env.AWS_REGION });
  }

  async publish(message: { countryISO: string, insuredId: string, scheduleId: number }) {
    const topicArn = process.env.SNS_TOPIC_ARN;
    if (!topicArn) throw new Error('SNS_TOPIC_ARN no está definido');

    try {
      const messageStr = JSON.stringify(message);

      const params = {
        TopicArn: topicArn,
        Message: messageStr,
        MessageAttributes: {
          countryISO: {
            DataType: 'String',
            StringValue: message.countryISO,
          },
        },
        MessageGroupId: `appointments-${message.countryISO.toLowerCase()}`, // para separar PE y CH
        MessageDeduplicationId: crypto.createHash('md5').update(messageStr).digest('hex'),
      };

      const command = new PublishCommand(params);
      await this.snsClient.send(command);
      console.log('Mensaje publicado en SNS:', params);
    } catch (error) {
      console.error('Error al publicar mensaje en SNS:', error);
      throw new Error('No se pudo publicar el mensaje en SNS.');
    }
  }
}
