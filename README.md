# Solar Generator Monitoring System

Full-stack application for monitoring and controlling intelligent solar generators with real-time data tracking, GPS location, and alert system.

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
│   └── app.module.ts     # Root module
├── frontend/             # Angular 20 frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── historial/
│   │   │   │   ├── mapa/
│   │   │   │   ├── alertas/
│   │   │   │   ├── configuracion/
│   │   │   │   └── inicio/
│   │   │   ├── services/
│   │   │   ├── models/
│   │   │   └── app.component.ts
│   │   ├── assets/
│   │   ├── environments/
│   │   └── main.ts
│   └── index.html
└── .github/              # GitHub configuration
    └── copilot-instructions.md
```

## Technology Stack

### Backend
- **Framework**: NestJS
- **Database**: PostgreSQL
- **Authentication**: JWT with Passport
- **ORM**: TypeORM

### Frontend
- **Framework**: Angular 20
- **UI Libraries**: Material Design, Bootstrap
- **Charts**: Chart.js (ng2-charts)
- **Maps**: Leaflet
- **Styling**: SCSS

## Database Schema

### Tables
1. **usuarios** - User accounts
2. **dispositivos** - Solar generator devices
3. **mediciones** - Sensor measurements
4. **ubicaciones** - GPS coordinates
5. **alertas** - System alerts
6. **configuracion** - Device configurations

## API Endpoints

- `POST /api/login` - User authentication
- `POST /api/mediciones` - Submit measurements
- `GET /api/mediciones` - Get measurements
- `GET /api/dashboard` - Get dashboard data
- `GET /api/gps` - Get GPS locations
- `GET /api/alertas` - Get system alerts

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
npm start:dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

Backend runs on `http://localhost:3000`
Frontend runs on `http://localhost:4200`

## Features

- Real-time solar panel monitoring
- GPS tracking with interactive maps
- Automated alert system
- Historical data visualization
- Device configuration management
- User authentication

## ESP32 Data Format

The solar generator device (ESP32) sends data in this format:

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

## License

ISC
