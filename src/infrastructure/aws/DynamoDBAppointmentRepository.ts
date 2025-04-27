import { Appointment } from '../../domain/entities/Appointment';
import { IDynamoDBAppointmentRepository } from '../../domain/repositories/IDynamoDBAppointmentRepository';
import { DynamoDBDocumentClient, PutCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { ddbClient } from '../database/DynamoDBConnection';
import {TABLE_NAME} from "../../config/constants";


export class DynamoDBAppointmentRepository implements IDynamoDBAppointmentRepository {
  private readonly docClient = DynamoDBDocumentClient.from(ddbClient);

  async savePending(appointment: Appointment): Promise<void> {
    try {
      const command = new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          insuredId: appointment.insuredId,
          scheduleId: appointment.scheduleId,
          countryISO: appointment.countryISO,
          status: appointment.status ?? 'pending',
          createdAt: appointment.createdAt,
        },
      });

      await this.docClient.send(command);
      console.log('Guardado en DynamoDB (pending):', appointment);
    } catch (error) {
      console.error('Error al guardar cita en DynamoDB:', error);
      throw new Error('No se pudo guardar la cita.');
    }
  }

  async updateStatusToCompleted(insuredId: string, scheduleId: number): Promise<void> {
    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        insuredId,
        scheduleId,
      },
      UpdateExpression: 'SET #status = :completed',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':completed': 'completed',
      },
    });

    await this.docClient.send(command);
    console.log(`Actualizado a completed: insuredId=${insuredId}, scheduleId=${scheduleId}`);
  }

  async findByInsuredId(insuredId: string): Promise<Appointment[]> {
    const command = new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'insuredId = :insuredId',
      ExpressionAttributeValues: {
        ':insuredId': insuredId,
      },
    });

    const response = await this.docClient.send(command);

    return (response.Items ?? []).map(item => new Appointment({
      insuredId: item.insuredId,
      scheduleId: item.scheduleId,
      countryISO: item.countryISO,
      status: item.status,
      createdAt: item.createdAt,
    }));
  }
}
