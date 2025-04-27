# 🏥 Medical Appointment Service

Aplicación backend de agendamiento de citas médicas para asegurados de Rímac, construida con **Node.js**, **TypeScript**, **Arquitectura Hexagonal**, y desplegada usando **Serverless Framework v4** sobre servicios de **AWS** como Lambda, DynamoDB, SQS, SNS y RDS.

---

## 🚀 Tecnologías y Arquitectura

- **Node.js + TypeScript**
- **Serverless Framework v4**
- **Arquitectura Hexagonal** (puertos y adaptadores)
- **AWS Lambda, API Gateway, DynamoDB, SNS, SQS, RDS, EventBridge**
- **Swagger (OpenAPI)** para documentación
- **Jest** para pruebas unitarias
- **ESBuild** para empaquetado eficiente

---

## 🧱 Estructura del Proyecto

```bash
src/
├── application/                # Casos de uso (lógica de negocio)
│   └── usecases/
├── domain/                     # Entidades y repositorios 
│   ├── entities/
│   └── repositories/
├── infrastructure/             # Adaptadores AWS (Dynamo, RDS, SQS, SNS)
│   └── database/ 
│   └── aws/
├── interfaces/
│   └── http/                   # Controladores HTTP (handlers Lambda)
│       └── docs/
│           └── components/
├── config/                     # Configuración Serverless y utilitarios
└── test/                       # Pruebas unitarias
```

## 🔌 Endpoints Disponibles

### `POST /appointments`
Crea un nuevo agendamiento médico.

**Body:**
```json
{
  "insuredId": "01234",
  "scheduleId": 100,
  "countryISO": "PE"
}

