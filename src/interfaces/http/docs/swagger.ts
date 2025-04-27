import { createAppointmentSchema } from './components/appointmentSchemas';

const swaggerDocumentation = {
    openapi: '3.0.0',
    info: {
        title: 'Rimac Appointment API',
        version: '1.0.0',
        description: 'Documentación de la API de agendamiento de citas médicas.',
    },
    paths: {
        '/appointments': {
            post: {
                summary: 'Crear una cita',
                tags: ['Appointments'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: createAppointmentSchema,
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Cita creada exitosamente',
                    },
                },
            },
        },
    },
    components: {
        schemas: {
            CreateAppointmentCommand: createAppointmentSchema,
        },
    },
};

export default swaggerDocumentation;
