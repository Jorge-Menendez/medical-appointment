export class GetAppointmentsByInsuredIdValidator {
    static validate(insuredId: string): void {
        if (!/^\d{5}$/.test(insuredId)) {
            throw new Error('El insuredId debe tener exactamente 5 dígitos');
        }
    }
}
