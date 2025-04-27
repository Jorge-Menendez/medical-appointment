import { Appointment } from '../../domain/entities/Appointment';
import { pool } from '../database/MySQLConnection';
import { ResultSetHeader } from 'mysql2/promise';
import { NEW_APPOINTMENTS } from '../../config/constants'
import {IRdsAppointmentRepository} from "../../domain/repositories/IRdsAppointmentRepository";

export class RdsAppointmentRepository implements IRdsAppointmentRepository {
  async save(appointment: Appointment): Promise<void> {
    const query = NEW_APPOINTMENTS;

    const values = [
      appointment.insuredId,
      appointment.scheduleId,
      appointment.countryISO,
      appointment.status ?? 'pending'
    ];

    try {
      const [result] = await pool.execute<ResultSetHeader>(query, values);
      console.log('Cita guardada en RDS con ID:', result.insertId);
    } catch (error) {
      console.error('Error al guardar cita en RDS:', error);
      throw new Error('No se pudo guardar la cita en la base de datos.');
    }
  }
}
