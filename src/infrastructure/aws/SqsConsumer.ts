import {Appointment} from '../../domain/entities/Appointment';
import {IRdsAppointmentRepository} from "../../domain/repositories/IRdsAppointmentRepository";

interface SqsMessage {
  Body: string;
}

export class SqsConsumer {
  constructor(private readonly appointmentRepository: IRdsAppointmentRepository) {}
  async consume(message: SqsMessage): Promise<void> {
    try {
        const appointment = new Appointment(this.parseMessage(message));
        console.log('Mensaje recibido en SQS:', appointment);

      appointment.status = 'completed';
      await this.appointmentRepository.save(appointment);
      console.log('Cita registrada correctamente en RDS');

    } catch (error) {
      console.error('Error procesando el mensaje SQS:', error);
      // notificar el error, reintentar, enviar a DLQ, etc.
    }
  }

  private parseMessage(message: SqsMessage): Appointment {
    if (!message.Body) {
      throw new Error('El mensaje no tiene Body');
    }

    try {
      return JSON.parse(message.Body);
    } catch (error) {
      throw new Error('Body inválido: no se puede parsear a Appointment');
    }
  }
}
