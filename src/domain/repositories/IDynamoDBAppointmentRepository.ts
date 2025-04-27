import { Appointment } from '../entities/Appointment';

export interface IDynamoDBAppointmentRepository {
  savePending(appointment: Appointment): Promise<void>;
  updateStatusToCompleted(insuredId: string, scheduleId: number): Promise<void>;
  findByInsuredId(insuredId: string): Promise<Appointment[]>;
}
