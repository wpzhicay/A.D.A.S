# Solar Generator Frontend

Angular 20 frontend para el sistema de monitoreo de generador solar.

## Setup

```bash
npm install
```

## Development

```bash
npm start
```

Frontend runs on `http://localhost:4200`

## Build

```bash
npm run build
```

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── dashboard/     # Main dashboard
│   │   ├── historial/     # Historical charts
│   │   ├── mapa/          # Map view
│   │   ├── alertas/       # Alerts
│   │   ├── configuracion/ # Settings
│   │   ├── inicio/        # Home page
│   │   └── navbar/        # Navigation
│   ├── services/
│   │   └── api.service.ts # API communication
│   ├── models/
│   │   └── models.ts      # Data interfaces
│   └── app.routes.ts      # Routes configuration
├── assets/                # Static files
├── environments/          # Environment config
└── styles.scss            # Global styles
```

## Dependencies

- **UI**: Material Design, Bootstrap
- **Charts**: Chart.js (ng2-charts)
- **Maps**: Leaflet
- **HTTP**: HttpClient

## Features

- Real-time data monitoring
- Historical data charts
- GPS location map
- System alerts
- Device configuration
- Responsive design
