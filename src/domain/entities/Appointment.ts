export interface AppointmentProps {
    insuredId: string;
    scheduleId: number;
    countryISO: string;
    status: 'pending' | 'completed';
    createdAt: string;
}

export class Appointment {
    public readonly insuredId: string;
    public readonly scheduleId: number;
    public readonly countryISO: string;
    public status: 'pending' | 'completed';
    public readonly createdAt: string;

    constructor(props: AppointmentProps) {
        this.insuredId = props.insuredId;
        this.scheduleId = props.scheduleId;
        this.countryISO = props.countryISO;
        this.status = props.status;
        this.createdAt = props.createdAt;
    }
}
