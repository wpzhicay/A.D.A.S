# Deploy en Vercel y Render.com

## Backend (NestJS + PostgreSQL) en Render.com

### Pasos:

1. **Ir a https://render.com**
2. **Crear cuenta** (con GitHub es más fácil)
3. **Ir a Dashboard → New → Web Service**
4. **Conectar repositorio GitHub** `wpzhicay/A.D.A.S`
5. **Configurar:**
   - Name: `solar-generator-backend`
   - Region: `Ohio` (u otro)
   - Build Command: `cd backend && npm install && npm run build`
   - Start Command: `cd backend && npm run start:prod`
   - Plan: **Free** (gratuito)

6. **Crear PostgreSQL Database:**
   - Dashboard → New → PostgreSQL
   - Name: `solar-generator-db`
   - Database: `railway`
   - User: `postgres`
   - Plan: **Free**

7. **Configurar Environment Variables** en el Web Service:
   ```
   NODE_ENV=production
   PORT=3000
   JWT_SECRET=MiProyectoSolar2026$Wilson#123
   ```
   (Las variables DB_* se sincronizarán automáticamente desde la BD)

8. **Deploy** - Render.com hará deploy automático desde GitHub

---

## Frontend (Angular) en Vercel

### Pasos:

1. **Ir a https://vercel.com**
2. **Crear cuenta** (con GitHub es más fácil)
3. **Ir a Dashboard → Add New... → Project**
4. **Conectar repositorio GitHub** `wpzhicay/A.D.A.S`
5. **Configurar:**
   - Framework: `Angular`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist/frontend`

6. **Agregar Environment Variables:**
   ```
   API_URL=https://solar-generator-backend.onrender.com/api
   ```
   (Reemplaza con tu URL real de Render)

7. **Deploy** - Vercel hará deploy automático desde GitHub

---

## Conectar Frontend ↔ Backend

Después de desplegar, actualiza en `frontend/src/environments/environment.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://solar-generator-backend.onrender.com/api'
};
```

Y en `frontend/src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://solar-generator-backend.onrender.com/api'
};
```

---

## URLs resultantes:

- **Frontend:** `https://[your-app].vercel.app`
- **Backend:** `https://solar-generator-backend.onrender.com`
- **API:** `https://solar-generator-backend.onrender.com/api`

---

## Notas importantes:

- ✅ Render.com FREE tiene 750 horas/mes (suficiente)
- ✅ Vercel FREE tiene deployments ilimitados
- ⚠️ La BD en Render FREE se duerme después de 15 min de inactividad (se reactiva automáticamente)
- ✅ Ambos sincronizados con GitHub (auto-deploy en cada push)
