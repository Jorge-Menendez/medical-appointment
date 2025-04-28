import { env } from './env';

export const NEW_APPOINTMENTS = 'INSERT INTO appointments ( insured_id, schedule_id, country_iso, center_id, specialty_id, medic_id, date, status) VALUES (?,?,?,?,?,?,?,?)';
export const TABLE_NAME = 'Appointments';
export const TOPIC_ARM = env.sns.topicArn ;
export const DB_HOST = env.db.host;
export const DB_USER = env.db.user;
export const DB_PASSWORD = env.db.password;
export const DB_NAME = env.db.name;
export const SNS_SUBJECT = 'Nuevo agendamiento de cita';
export const AWS_REGION = env.aws.region;
