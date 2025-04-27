import {CreateAppointmentCommand} from "../../interfaces/CreateAppointmentCommand";

export class CreateAppointmentValidator {
    static validate(command: CreateAppointmentCommand): void {
        if (!/^\d{5}$/.test(command.insuredId)) {
            throw new Error('insuredId debe tener 5 dígitos');
        }
        if (!['PE', 'CL'].includes(command.countryISO)) {
            throw new Error('countryISO debe ser PE o CL');
        }
    }
}
