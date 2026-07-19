# Solar Generator Monitoring System - Project Instructions

## Project Overview
Full-stack application for monitoring and controlling intelligent solar generators with real-time data tracking, GPS location, and alert system.

### Tech Stack
- **Frontend**: Angular 20 with Material Design, Bootstrap, Chart.js, Leaflet
- **Backend**: NestJS with Express.js, PostgreSQL
- **Database**: PostgreSQL with 6 main tables (usuarios, dispositivos, ubicaciones, mediciones, alertas, configuracion)

## Setup Progress

- [x] Verify copilot-instructions.md setup
- [x] Scaffold NestJS backend project
- [x] Scaffold Angular frontend project
- [x] Create PostgreSQL database schema
- [x] Install dependencies and compile projects
- [x] Create and run dev tasks
- [x] Finalize documentation

## Key Features
- Real-time solar panel monitoring
- GPS tracking with Leaflet maps
- Automated alert system
- Historical data with charts (voltage, current, power, temperature)
- Device configuration management
- User authentication

## Project Structure

```
├── backend/              # NestJS backend
│   ├── src/
│   │   ├── auth/         # Authentication module
│   │   ├── usuarios/     # Users module
│   │   ├── dispositivos/ # Devices module
│   │   ├── mediciones/   # Measurements module
│   │   ├── ubicaciones/  # GPS locations module
│   │   ├── alertas/      # Alerts module
│   │   ├── configuracion/# Configuration module
│   │   └── database/     # Database setup
│   ├── main.ts           # Entry point
│   ├── app.module.ts     # Root module
│   └── database.sql      # Database schema
├── frontend/             # Angular 20 frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── historial/
│   │   │   │   ├── mapa/
│   │   │   │   ├── alertas/
│   │   │   │   ├── configuracion/
│   │   │   │   ├── inicio/
│   │   │   │   └── navbar/
│   │   │   ├── services/
│   │   │   ├── models/
│   │   │   └── app.routes.ts
│   │   ├── assets/
│   │   ├── environments/
│   │   └── main.ts
│   └── index.html
└── .github/              # GitHub configuration
    └── copilot-instructions.md
```

## ESP32 Data Format
```json
{
  "idDispositivo": 1,
  "voltaje": 12.75,
  "corriente": 2.15,
  "potencia": 27.3,
  "porcentajeBateria": 88,
  "latitud": -2.903,
  "longitud": -79.005,
  "temperatura": 30,
  "fecha": "2026-07-17T18:30:00"
}
```

## API Endpoints
- POST /api/login
- POST /api/mediciones
- GET /api/mediciones
- GET /api/dashboard
- GET /api/gps
- GET /api/alertas

## Database Tables
- usuarios (id, nombre, correo, password)
- dispositivos (id, nombre, serie, estado)
- mediciones (id, voltaje, corriente, potencia, temperatura, porcentajeBateria, fecha, idDispositivo)
- ubicaciones (id, latitud, longitud, fecha, idDispositivo)
- alertas (alert system data)
- configuracion (device configuration)

## Getting Started

1. **Database Setup**: Run `backend/database.sql` in PostgreSQL
2. **Backend**: `cd backend && npm run start:dev`
3. **Frontend**: `cd frontend && npm start`
4. **Access**: 
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:3000
   - API Docs: http://localhost:3000/api (when Swagger is implemented)

## Next Steps for Development

1. Implement TypeORM entities for all modules
2. Create NestJS controllers and services
3. Add JWT authentication strategy
4. Implement API endpoints
5. Create Angular services for API communication
6. Build component UI with Material Design
7. Add real-time data subscriptions
8. Implement error handling and validation
9. Add unit and integration tests
10. Deploy to production

## Environment Configuration

### Backend (.env)
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=solar_generator
JWT_SECRET=your_secret_key
JWT_EXPIRATION=604800
NODE_ENV=development
```

### Frontend (environment.ts)
```
apiUrl: 'http://localhost:3000/api'
```
