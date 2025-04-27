export const env = {
    db: {
        host: process.env.DB_HOST as string,
        user: process.env.DB_USER as string,
        password: process.env.DB_PASSWORD as string,
        name: process.env.DB_NAME as string,
    },
    dynamo: {
        appointmentsTable: process.env.DB_DYNAMO_TABLE as string,
        logsTable: process.env.DB_DYNAMO_LOGS_TABLE as string,
    },
    sns: {
        topicArn: process.env.SNS_TOPIC_ARN as string,
    },
};
