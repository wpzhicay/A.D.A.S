# 🚀 Guía de Deployment a Railway

## Requisitos Previos

- Cuenta en [Railway.app](https://railway.app)
- Git instalado
- Repositorio GitHub sincronizado

## Paso 1: Preparar el Proyecto

✅ **Ya está listo:**
- ✅ Procfile configurado
- ✅ Backend con script `start:prod`
- ✅ Frontend buildeable
- ✅ PostgreSQL schema en `backend/database.sql`

## Paso 2: Variables de Entorno en Railway

En Railway, configurar las siguientes variables:

```
DB_HOST=postgresql-db
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=<generada por Railway>
DB_NAME=solar_generator
JWT_SECRET=<generar una clave segura>
JWT_EXPIRATION=604800
NODE_ENV=production
FRONTEND_URL=https://tu-frontend.vercel.app
```

## Paso 3: Setup Automatizado en Railway

### 3.1 Conectar GitHub
1. En [Railway.app](https://railway.app), hacer login
2. Click en "New Project" → "GitHub Repo"
3. Autorizar GitHub y seleccionar repositorio

### 3.2 Railway detectará automáticamente:
- ✅ Procfile → ejecutará backend
- ✅ Node.js → instalará dependencias

## Paso 4: Base de Datos PostgreSQL

### 4.1 Agregar Base de Datos
1. En Railway, click "Add Service"
2. Seleccionar "PostgreSQL"
3. Railway asignará automáticamente:
   - `DB_HOST`
   - `DB_PORT`
   - `DB_USERNAME`
   - `DB_PASSWORD`
   - `POSTGRES_URL` (conexión string)

### 4.2 Ejecutar Schema
Una vez la BD esté corriendo:

1. Conectar con Railway CLI:
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link proyecto
railway link

# Conectar a BD
railway postgresql shell
```

2. Ejecutar el script:
```sql
\i backend/database.sql
```

O usar psql directamente:
```bash
psql postgresql://usuario:password@host:5432/solar_generator < backend/database.sql
```

## Paso 5: Frontend (Vercel o Railway)

### Opción A: Vercel (RECOMENDADO)
```bash
npm install -g vercel
cd frontend
vercel
```

### Opción B: Railway
1. Crear otro proyecto en Railway
2. Usar framework: Angular
3. Build command: `npm run build`
4. Start command: `npx http-server dist/solar-generator-frontend`

## Paso 6: Configurar Variables del Frontend

En `frontend/src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://tu-backend-railway.up.railway.app/api'
};
```

## 🔧 Troubleshooting

### Error: "Cannot find module"
```bash
npm install
npm run build
```

### Error: "Connection refused" (BD)
- Verificar que PostgreSQL service esté running en Railway
- Verificar variables de entorno correctas
- Esperar 30 segundos a que Railway inicie todo

### Error: CORS
En `backend/main.ts`, verificar que está:
```typescript
app.enableCors({
  origin: 'https://tu-frontend-domain.com'
});
```

### Backend no inicia
```bash
# Ver logs en Railway
railway logs --service backend
```

## 📊 URLs Finales

Después de deployar:
- **Backend API**: `https://tu-backend-railway.up.railway.app/api`
- **Frontend**: `https://tu-frontend-vercel.vercel.app`
- **API Docs**: `https://tu-backend-railway.up.railway.app/api` (cuando Swagger esté implementado)

## 🔐 Seguridad

**⚠️ Cambiar en producción:**
- [ ] JWT_SECRET (generar clave segura de 32+ caracteres)
- [ ] DB_PASSWORD (usar contraseña fuerte)
- [ ] FRONTEND_URL (configurar dominio real)
- [ ] Habilitar HTTPS (Railway lo hace automáticamente)
- [ ] Considerar agregar rate limiting
- [ ] Validar CORS apropiadamente

## 📝 Comandos Útiles

```bash
# Ver logs del backend
railway logs --service backend

# Ver logs de BD
railway logs --service postgres

# Rebuild
railway redeploy

# Conectar a BD remota
railway postgresql shell

# Ver variables
railway variables
```

## ✅ Checklist Final

- [ ] Procfile existe
- [ ] Backend compila: `npm run build` ✓
- [ ] Frontend compila: `npm run build` ✓
- [ ] .env.example existe ✓
- [ ] GitHub repo sincronizado
- [ ] Railway account creada
- [ ] PostgreSQL addon agregado a Railway
- [ ] Variables de entorno configuradas en Railway
- [ ] BD schema importado
- [ ] Frontend URL configurada en backend CORS
- [ ] Backend URL configurada en frontend environment

---

**¡Listo para deployar!** 🚀

Para más info: [Railway Docs](https://railway.app/docs)
