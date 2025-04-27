import { APIGatewayProxyHandler } from 'aws-lambda';
import swaggerDocument from './docs/swagger';

export const handler: APIGatewayProxyHandler = async () => {
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(swaggerDocument),
    };
};
