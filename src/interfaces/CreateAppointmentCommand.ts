export interface CreateAppointmentCommand {
    insuredId: string;
    scheduleId: number;
    countryISO: 'PE' | 'CL';
}