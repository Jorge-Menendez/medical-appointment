export interface AppointmentProps {
    insuredId: string;
    scheduleId: number;
    countryISO: string;
    centerId: number;
    specialtyId: number;
    medicId: number;
    status: 'pending' | 'completed';
    date:Date;
}

export class Appointment {
    public readonly insuredId: string;
    public readonly scheduleId: number;
    public readonly countryISO: string;
    public readonly centerId: number;
    public readonly specialtyId: number;
    public readonly medicId: number;
    public status: 'pending' | 'completed';
    public readonly date: Date;

    constructor(props: AppointmentProps) {
        this.insuredId = props.insuredId;
        this.scheduleId = props.scheduleId;
        this.specialtyId = props.specialtyId;
        this.medicId = props.medicId;
        this.countryISO = props.countryISO;
        this.centerId = props.centerId;
        this.status = props.status;
        this.date = props.date;
    }
}
