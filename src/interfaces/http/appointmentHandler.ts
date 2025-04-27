import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { DynamoDBAppointmentRepository } from '../../infrastructure/aws/DynamoDBAppointmentRepository';
import { SnsPublisher } from '../../infrastructure/aws/SnsPublisher';
import { CreateAppointment } from '../../application/usecases/CreateAppointment';
import { GetAppointmentsByInsuredId } from '../../application/usecases/GetAppointmentsByInsuredId';
import {RdsAppointmentRepository} from "../../infrastructure/aws/RdsAppointmentRepository";

const dynamoDBAppointmentRepository = new DynamoDBAppointmentRepository();
const rdsAppointmentRepository = new RdsAppointmentRepository();
const publisher = new SnsPublisher();

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
    try {
        const method = event.requestContext.http.method;

        if (method === 'POST') {
            const body = JSON.parse(event.body || '{}');
            const useCase = new CreateAppointment(
                dynamoDBAppointmentRepository,
                rdsAppointmentRepository,
                publisher);
            await useCase.execute({
                insuredId: body.insuredId,
                scheduleId: body.scheduleId,
                countryISO: body.countryISO
            });

            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Agendamiento en proceso' })
            };
        }

        if (method === 'GET') {
            const insuredId = event.pathParameters?.insuredId || '';
            const useCase = new GetAppointmentsByInsuredId(dynamoDBAppointmentRepository);
            const appointments = await useCase.execute(insuredId);

            return {
                statusCode: 200,
                body: JSON.stringify({ insuredId, appointments })
            };
        }

        return { statusCode: 405, body: 'Método no permitido' };
    } catch (error: any) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
