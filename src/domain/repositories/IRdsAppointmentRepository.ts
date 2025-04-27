import { Appointment } from '../entities/Appointment';

export interface IRdsAppointmentRepository {
    save(appointment: Appointment): Promise<void>;
}
