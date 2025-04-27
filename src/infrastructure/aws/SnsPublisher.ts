import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { Appointment } from '../../domain/entities/Appointment';
import {SNS_SUBJECT, TOPIC_ARM} from "../../config/constants";

export class SnsPublisher {
  private snsClient: SNSClient;

  constructor() {
    this.snsClient = new SNSClient({});
  }

  async publish(appointment: Appointment): Promise<void> {
    try {
      // Aquí envías el mensaje a SNS
      const command = new PublishCommand({
        TopicArn: TOPIC_ARM,
        Message: JSON.stringify({
          insuredId: appointment.insuredId,
          scheduleId: appointment.scheduleId,
          countryISO: appointment.countryISO,
          status: appointment.status,
        }),
        Subject: SNS_SUBJECT
      });

      await this.snsClient.send(command);
      console.log('Mensaje publicado en SNS:', {
        insuredId: appointment.insuredId,
        scheduleId: appointment.scheduleId,
        countryISO: appointment.countryISO,
      });
    } catch (error) {
      console.error('Error al publicar en SNS:', error);
      throw new Error('No se pudo publicar el mensaje en SNS.');
    }
  }
}
