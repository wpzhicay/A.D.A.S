# Setup Guide - Solar Generator Monitoring System

## Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

### Step 1: Setup Database

First, create the PostgreSQL database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Run the schema script
\i backend/database.sql
```

Or using command line:

```bash
psql -U postgres -d postgres -f backend/database.sql
```

### Step 2: Configure Environment

1. **Backend** - Update `.env` file in `backend/`:
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=solar_generator
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=604800
NODE_ENV=development
```

2. **Frontend** - No configuration needed (uses default environment.ts)

### Step 3: Install Dependencies

Option A - Using VS Code Tasks (Recommended):
1. Press `Ctrl+Shift+B` to open Build menu
2. Select "Backend: Install Dependencies"
3. Then "Frontend: Install Dependencies"

Option B - Manual Installation:
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install --legacy-peer-deps
```

### Step 4: Start Development

**Using VS Code Tasks:**
1. Press `Ctrl+Shift+D` to open debug menu
2. Select "Backend: Start Development" or "Frontend: Start Development"
3. Or select "Full Stack: Start All Services" to start both

**Manual Start:**

Terminal 1 - Backend:
```bash
cd backend
npm run start:dev
# Backend will run on http://localhost:3000
```

Terminal 2 - Frontend:
```bash
cd frontend
npm start
# Frontend will run on http://localhost:4200
```

## Project Structure

```
solar-generator/
├── backend/              # NestJS backend API
│   ├── src/
│   │   ├── auth/         # Authentication
│   │   ├── usuarios/     # User management
│   │   ├── dispositivos/ # Device management
│   │   ├── mediciones/   # Measurements
│   │   ├── ubicaciones/  # GPS locations
│   │   ├── alertas/      # Alert system
│   │   ├── configuracion/# Configuration
│   │   └── database/     # Database setup
│   ├── package.json      # Backend dependencies
│   └── database.sql      # Database schema
├── frontend/             # Angular 20 frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/ # UI components
│   │   │   ├── services/   # API services
│   │   │   └── models/     # Data models
│   │   ├── assets/         # Static files
│   │   └── main.ts         # Entry point
│   └── package.json        # Frontend dependencies
├── .vscode/               # VS Code config
│   ├── tasks.json        # Build tasks
│   ├── launch.json       # Debug configurations
│   ├── settings.json     # Editor settings
│   └── extensions.json   # Recommended extensions
└── README.md             # Project documentation
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/login | User authentication |
| POST | /api/mediciones | Submit measurements |
| GET | /api/mediciones | Get measurements |
| GET | /api/dashboard | Get dashboard data |
| GET | /api/gps | Get GPS locations |
| GET | /api/alertas | Get system alerts |

## Frontend Routes

| Route | Component | Description |
|-------|-----------|-------------|
| / | Inicio | Home page with main stats |
| /dashboard | Dashboard | Real-time monitoring |
| /historial | Historial | Historical charts |
| /mapa | Mapa | GPS tracking map |
| /alertas | Alertas | System alerts |
| /configuracion | Configuracion | Device settings |

## Available Scripts

### Backend
```bash
npm run start         # Production start
npm run start:dev     # Development with watch
npm run start:debug   # Debug mode
npm run build         # Build for production
npm run lint          # Run ESLint
```

### Frontend
```bash
npm start             # Development server
npm run build         # Production build
npm run watch         # Watch mode
npm test              # Run tests
npm run lint          # Run linter
```

## Troubleshooting

### Database Connection Error
- Verify PostgreSQL is running
- Check DB credentials in `.env`
- Ensure database `solar_generator` exists

### Backend Won't Start
- Check port 3000 is not in use: `netstat -an | findstr :3000`
- Run `npm run build` first
- Check Node.js version: `node --version` (need 18+)

### Frontend Build Error
- Delete `node_modules` folder
- Run `npm install --legacy-peer-deps`
- Clear Angular cache: `ng cache clean`

### Port Already in Use
- Backend (port 3000): `taskkill /PID <process_id> /F`
- Frontend (port 4200): Change in `angular.json`

## Next Steps

1. **Implement Entities**: Create TypeORM entities for each module
2. **Create Controllers**: Add API endpoints in NestJS
3. **Design Services**: Build business logic services
4. **Add Components**: Complete Angular component implementations
5. **Connect API**: Wire frontend to backend API calls
6. **Add Testing**: Implement unit and integration tests
7. **Deploy**: Setup Docker containers and deployment

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Angular Documentation](https://angular.io/docs)
- [TypeORM Documentation](https://typeorm.io)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)

## Support

For issues or questions:
1. Check the README files in each folder
2. Review error logs in the console
3. Check VS Code problems panel
4. Review database logs
