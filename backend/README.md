# Solar Generator Backend

NestJS backend para el sistema de monitoreo de generador solar.

## Setup

```bash
npm install
```

## Development

```bash
npm run start:dev
```

Backend runs on `http://localhost:3000`

## Database

Configure PostgreSQL en `.env` file:

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=solar_generator
```

Run the database schema with:

```bash
psql -U postgres -d solar_generator -f database.sql
```

## API Endpoints

- `POST /api/login` - User authentication
- `POST /api/mediciones` - Submit measurements
- `GET /api/mediciones` - Get measurements
- `GET /api/dashboard` - Get dashboard data
- `GET /api/gps` - Get GPS locations
- `GET /api/alertas` - Get system alerts

## Project Structure

```
src/
├── auth/          # Authentication
├── usuarios/      # Users
├── dispositivos/  # Devices
├── mediciones/    # Measurements
├── ubicaciones/   # GPS Locations
├── alertas/       # Alerts
└── configuracion/ # Configuration
```
