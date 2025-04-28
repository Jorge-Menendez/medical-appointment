import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { Appointment } from '../../domain/entities/Appointment';
import { SNS_SUBJECT, TOPIC_ARM, AWS_REGION } from "../../config/constants";
import { v4 as uuidv4 } from 'uuid';

export class SnsPublisher {
  private snsClient: SNSClient;

  constructor() {
    this.snsClient = new SNSClient({ region: AWS_REGION });
  }

  async publish(appointment: Appointment): Promise<void> {
    try {
      const messageBody = {
        insuredId: appointment.insuredId,
        scheduleId: appointment.scheduleId,
        countryISO: appointment.countryISO,
        status: appointment.status,
      };

      const command = new PublishCommand({
        TopicArn: TOPIC_ARM,
        Message: JSON.stringify(messageBody),
        Subject: SNS_SUBJECT,
        MessageGroupId: appointment.countryISO,
        MessageDeduplicationId: uuidv4(),
      });

      await this.snsClient.send(command);

      console.log('Mensaje publicado en SNS exitosamente:', messageBody);
    } catch (error) {
      console.error('Error al publicar en SNS. Datos:', appointment, 'Error:', error);
      throw new Error('No se pudo publicar el mensaje en SNS.');
    }
  }
}
