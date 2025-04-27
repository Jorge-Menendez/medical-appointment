export const createAppointmentSchema = {
    type: 'object',
    properties: {
        insuredId: { type: 'string' },
        date: { type: 'string', format: 'date-time' },
        specialty: { type: 'string' },
    },
    required: ['insuredId', 'date', 'specialty'],
};
