import { IDynamoDBAppointmentRepository } from '../../domain/repositories/IDynamoDBAppointmentRepository';
import { Appointment } from '../../domain/entities/Appointment';
import { GetAppointmentsByInsuredIdValidator } from '../validators/GetAppointmentsByInsuredIdValidator';

export class GetAppointmentsByInsuredId {
    constructor(private readonly repository: IDynamoDBAppointmentRepository) {}

    async execute(insuredId: string): Promise<Appointment[]> {
        GetAppointmentsByInsuredIdValidator.validate(insuredId);

        return this.repository.findByInsuredId(insuredId);
    }
}
