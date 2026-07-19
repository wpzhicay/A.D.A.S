# Database Connection Troubleshooting

## Recent Changes (July 19, 2026)

We've improved database connection handling for Render deployment:

### 1. **DATABASE_URL Parsing** ✓
- Added `pg-connection-string` package
- Code now parses `DATABASE_URL` in production
- Falls back to individual `DB_*` variables in development

### 2. **Enhanced Error Logging** ✓
- Better AggregateError handling
- Full error messages displayed
- Configuration debug output

### 3. **SSL Configuration** ✓
- Production: `{ rejectUnauthorized: false }` for self-signed certs
- Development: SSL disabled by default
- Respects `NODE_ENV` environment variable

## Debugging Steps for Render

### Check the Logs
1. Go to Render dashboard
2. Select your backend service
3. Check "Logs" tab for detailed error messages
4. Look for lines starting with `🔧 Parsing DATABASE_URL`

### Expected Output
✓ Should see:
```
[DatabaseModule] 🔧 Parsing DATABASE_URL for production environment
[DatabaseModule] ✓ Database config: host:5432/database_name
[DatabaseService] ✅ Database connected successfully
```

### If Connection Still Fails

1. **Verify DATABASE_URL is set**
   - Check Render Environment Variables
   - Format: `postgresql://user:password@host:port/database`

2. **Check password encoding**
   - Special characters must be URL-encoded
   - Test with: `node test-db-render.ts` (locally)

3. **Verify database exists**
   - Login to Render PostgreSQL dashboard
   - Confirm database name matches URL

4. **Check network connectivity**
   - Render backend must reach database server
   - Contact hosting support if blocked

## Local Development

Run locally with:
```bash
npm install
npm run start:dev
```

Uses `.env` file with individual variables:
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=solar_generator
```

## Environment Variables Priority

1. **Production (Render)**: `DATABASE_URL` is parsed
2. **Development**: Individual `DB_*` variables used
3. **Fallbacks**:
   - `DB_HOST` → `localhost`
   - `DB_PORT` → `5432`
   - `DB_USERNAME` → `postgres`
   - `DB_NAME` → `railway`

## Files Modified

- `backend/src/database/database.module.ts` - TypeORM configuration
- `backend/src/database/database.service.ts` - Connection retry logic
- `backend/package.json` - Added `pg-connection-string`
- `backend/.env.example` - Configuration template
