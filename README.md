# Next Auth App

Autenticación con NextAuth.js: Google, GitHub y credenciales (bcrypt).

## Desarrollo local

```bash
npm install
cp .env.example .env
# Completa las variables en .env
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### Callbacks en local

| Proveedor | URL de callback |
|-----------|-----------------|
| Google | `http://localhost:3000/api/auth/callback/google` |
| GitHub | `http://localhost:3000/api/auth/callback/github` |

## Desplegar en Vercel

### 1. Subir el repositorio

Conecta el repo en [vercel.com/new](https://vercel.com/new). Framework: **Next.js** (detectado automáticamente).

### 2. Variables de entorno (Settings → Environment Variables)

Agrega **todas** estas variables en Vercel:

| Variable | Valor |
|----------|--------|
| `NEXTAUTH_URL` | `https://tu-dominio.vercel.app` (tu URL real de Vercel, sin `/` al final) |
| `NEXTAUTH_SECRET` | El mismo secret que usas en local |
| `AUTH_TRUST_HOST` | `true` |
| `GOOGLE_CLIENT_ID` | Client ID de Google Cloud |
| `GOOGLE_CLIENT_SECRET` | Client Secret de Google |
| `GITHUB_ID` | Client ID de GitHub OAuth |
| `GITHUB_SECRET` | Client Secret de GitHub |

**Importante:** `NEXTAUTH_URL` debe coincidir con tu dominio de Vercel (ej. `https://lab-13-web.vercel.app`).

### 3. Actualizar OAuth en Google y GitHub

En **Google Cloud Console** → Credenciales → URIs de redirección autorizados, agrega:

```
https://tu-dominio.vercel.app/api/auth/callback/google
```

En **GitHub** → Settings → Developer settings → OAuth App → Authorization callback URL:

```
https://tu-dominio.vercel.app/api/auth/callback/github
```

Puedes tener **ambas** URLs (local + Vercel) en cada proveedor.

### 4. Redesplegar

Tras cambiar variables de entorno, en Vercel: **Deployments → Redeploy**.

### Logs de build

Si el build muestra `Installing dependencies...` y `added 387 packages`, es normal. El build continúa con `next build`. Si falla, revisa el error después de esa línea en los logs.

## Scripts

```bash
npm run dev    # desarrollo
npm run build  # build de producción
npm run start  # servidor de producción
```
