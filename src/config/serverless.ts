import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
    service: 'rimac-appointment-service',
    frameworkVersion: '4',
    configValidationMode: 'warn',
    provider: {
        name: 'aws',
        runtime: 'nodejs20.x',
        region: process.env.AWS_REGION ?? 'us-east-1',
        memorySize: 128,
        timeout: 30,
        environment: {
            DYNAMODB_TABLE: process.env.DB_DYNAMO_TABLE!,
            DYNAMODB_LOGS_TABLE: process.env.DB_DYNAMO_LOGS_TABLE!,
            SNS_TOPIC_ARN: process.env.SNS_TOPIC_ARN!,

            DB_HOST: process.env.DB_HOST!,
            DB_USER: process.env.DB_USER!,
            DB_PASSWORD: process.env.DB_PASSWORD!,
            DB_NAME: process.env.DB_NAME!,
            AWS_REGION0: process.env.AWS_REGION!
        },
    },
    functions: {
        appointment: {
            handler: 'src/interfaces/http/appointmentHandler.handler',
            events: [
                {
                    httpApi: {
                        path: '/appointments',
                        method: 'post',
                    },
                },
                {
                    httpApi: {
                        path: '/appointments/{insuredId}',
                        method: 'get',
                    },
                }
            ],
        },

        docs: {
            handler: 'src/interfaces/http/swaggerHandler.handler',
            events: [
                {
                    httpApi: {
                        path: '/docs',
                        method: 'get',
                    },
                },
            ],
        },
    },
    package: {
        individually: true,
    },
    plugins: ['serverless-offline', 'serverless-aws-documentation'],
    custom: {
        'serverless-offline': {
            httpPort: 3000,
        },
        'serverless-aws-documentation': {
            auto: true,
            apiDocumentation: {
                swagger: true,
            },
            models: {
                CreateAppointmentCommand: {
                    name: 'CreateAppointmentCommand',
                    description: 'Modelo de la solicitud para crear una cita',
                    contentType: 'application/json',
                },
            },
        },
    },
    resources: {
        Resources: {
            AppointmentsTable: {
                Type: 'AWS::DynamoDB::Table',
                Properties: {
                    TableName: 'Appointments',
                    BillingMode: 'PAY_PER_REQUEST',
                    AttributeDefinitions: [
                        { AttributeName: 'insuredId', AttributeType: 'S' },
                        { AttributeName: 'scheduleId', AttributeType: 'N' }
                    ],
                    KeySchema: [
                        { AttributeName: 'insuredId', KeyType: 'HASH' },
                        { AttributeName: 'scheduleId', KeyType: 'RANGE' }
                    ]
                }
            },
            AppointmentLogsTable: {
                Type: 'AWS::DynamoDB::Table',
                Properties: {
                    TableName: 'AppointmentLogs',
                    BillingMode: 'PAY_PER_REQUEST',
                    AttributeDefinitions: [
                        { AttributeName: 'logId', AttributeType: 'S' }
                    ],
                    KeySchema: [
                        { AttributeName: 'logId', KeyType: 'HASH' }
                    ]
                }
            }
        }
    }
};

export default serverlessConfiguration;
