import { Appointment } from '../../domain/entities/Appointment';
import { IDynamoDBAppointmentRepository } from '../../domain/repositories/IDynamoDBAppointmentRepository';
import { SnsPublisher } from '../../infrastructure/aws/SnsPublisher';
import { CreateAppointmentCommand } from "../../interfaces/CreateAppointmentCommand";
import { CreateAppointmentValidator } from '../validators/CreateAppointmentValidator';
import {IRdsAppointmentRepository} from "../../domain/repositories/IRdsAppointmentRepository";

export class CreateAppointment {
    constructor(
        private readonly dynamoRepository: IDynamoDBAppointmentRepository,
        private readonly rdsRepository: IRdsAppointmentRepository,
        private readonly snsPublisher: SnsPublisher
    ) {}

    async execute(command: CreateAppointmentCommand): Promise<void> {
        CreateAppointmentValidator.validate(command);

        const appointment = new Appointment({
            insuredId: command.insuredId,
            scheduleId: command.scheduleId,
            countryISO: command.countryISO,
            centerId: 4,
            specialtyId: 3,
            medicId: 4,
            status: 'pending',
            date : new Date()
        });

        try {
            await this.dynamoRepository.savePending(appointment);

            await this.snsPublisher.publish(appointment);
        } catch (error) {
            console.error('Error en CreateAppointment:', error);
            throw new Error('No se pudo procesar el agendamiento.');
        }
    }

}
