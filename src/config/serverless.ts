import type { AWS } from '@serverless/typescript';

type AwsRegion = | 'us-east-1' | 'us-east-2' |  undefined;

const serverlessConfiguration: AWS = {
    service: 'rimac-appointment-service',
    frameworkVersion: '4',
    configValidationMode: 'warn',
    provider: {
        name: 'aws',
        runtime: 'nodejs20.x',
        region: process.env.AWS_REGION!  as AwsRegion,
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
            /*AppointmentSnsTopic: {
                Type: 'AWS::SNS::Topic',
                Properties: {
                    TopicName: 'appointment-topic',
                },
            },*/

            AppointmentPEQueue: {
                Type: 'AWS::SQS::Queue',
                Properties: {
                    QueueName: 'appointment-pe-queue.fifo',
                    FifoQueue: true,
                    ContentBasedDeduplication: true,  // Evita duplicados en la cola
                    Policy: {
                        Statement: [
                            {
                                Effect: 'Allow',
                                Action: 'SQS:SendMessage',
                                Resource: { 'Fn::GetAtt': ['AppointmentPEQueue', 'Arn'] },
                                Principal: '*',
                                Condition: {
                                    ArnEquals: {
                                        'aws:SourceArn': { Ref: 'AppointmentSnsTopic' },
                                    },
                                },
                            },
                        ],
                    },
                },
            },

            AppointmentCLQueue: {
                Type: 'AWS::SQS::Queue',
                Properties: {
                    QueueName: 'appointment-cl-queue.fifo',
                    FifoQueue: true,
                    ContentBasedDeduplication: true,  // Evita duplicados en la cola
                    Policy: {
                        Statement: [
                            {
                                Effect: 'Allow',
                                Action: 'SQS:SendMessage',
                                Resource: { 'Fn::GetAtt': ['AppointmentCLQueue', 'Arn'] },
                                Principal: '*',
                                Condition: {
                                    ArnEquals: {
                                        'aws:SourceArn': { Ref: 'AppointmentSnsTopic' },
                                    },
                                },
                            },
                        ],
                    },
                },
            },

            PEQueueSubscription: {
                Type: 'AWS::SNS::Subscription',
                Properties: {
                    Protocol: 'sqs',
                    TopicArn: process.env.SNS_TOPIC_ARN!,
                    Endpoint: { 'Fn::GetAtt': ['AppointmentPEQueue', 'Arn'] },
                    FilterPolicy: {
                        countryISO: ['PE'],
                    },
                    RawMessageDelivery: true,
                },
            },

            CLQueueSubscription: {
                Type: 'AWS::SNS::Subscription',
                Properties: {
                    Protocol: 'sqs',
                    TopicArn: process.env.SNS_TOPIC_ARN!,
                    Endpoint: { 'Fn::GetAtt': ['AppointmentCLQueue', 'Arn'] },
                    FilterPolicy: {
                        countryISO: ['CL'],
                    },
                    RawMessageDelivery: true,
                },
            }

        }
    }
};

export default serverlessConfiguration;
