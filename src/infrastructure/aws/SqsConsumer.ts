import { Appointment } from '../../domain/entities/Appointment';

export class SqsConsumer {
  async consume(message: any): Promise<void> {
    const appointment: Appointment = JSON.parse(message.Body);
    console.log('Mensaje recibido en SQS:', appointment);
    // Aquí se usaría RdsAppointmentRepository
  }
}
