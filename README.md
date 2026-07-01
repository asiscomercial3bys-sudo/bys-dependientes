# Puntos Belleza

App PWA para registro de ventas y acumulación de puntos para dependientes de tiendas de belleza.

## Requisitos

- Node.js 20+
- PostgreSQL (instancia corriendo en localhost:5432)
- Firebase CLI (`npm install -g firebase-tools`)
- Google Cloud SDK (para Cloud Run)

## Desarrollo local

### 1. Backend

```bash
cd backend
npm install

# Configurar variables de entorno (editar .env si la contraseña es diferente)
# DATABASE_URL="postgresql://postgres:1234@localhost:5432/postgres"

# Crear las tablas en Postgres
npx prisma migrate dev --name init

# Sembrar datos de ejemplo (niveles Bronce/Plata/Oro)
npm run db:seed

# Iniciar servidor de desarrollo
npm run dev
# → API corriendo en http://localhost:3000
```

### 2. Frontend

Para desarrollo local, sirve la carpeta `frontend/public` con cualquier servidor estático:

```bash
cd frontend/public
npx serve .
# → Frontend en http://localhost:3000 (o el puerto que indique)
```

El frontend apunta automáticamente a `http://localhost:3000` como API cuando corre en localhost.

### 3. Crear una tienda de prueba

```bash
# Desde psql o pgAdmin, inserta una tienda:
INSERT INTO tiendas (nit, nombre) VALUES ('900123456', 'Tienda Demo');
```

Luego abre la app, toca "Soy nueva, registrarme", usa el NIT `900123456`, y anota el código de 6 dígitos que te devuelve.

## Despliegue a producción

### Backend → Cloud Run

```bash
cd backend

# Construir imagen Docker
gcloud builds submit --tag gcr.io/TU_PROYECTO/puntos-api

# Desplegar a Cloud Run
gcloud run deploy puntos-api \
  --image gcr.io/TU_PROYECTO/puntos-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "DATABASE_URL=postgresql://USER:PASS@HOST:5432/DB,JWT_SECRET=tu-secreto-seguro"
```

### Migraciones en Postgres de producción

```bash
cd backend
DATABASE_URL="postgresql://USER:PASS@HOST:5432/DB" npx prisma migrate deploy
DATABASE_URL="postgresql://USER:PASS@HOST:5432/DB" npx tsx prisma/seed.ts
```

### Frontend → Firebase Hosting

```bash
cd frontend

# Iniciar sesión en Firebase
firebase login

# Inicializar proyecto (si no lo has hecho)
firebase init hosting
# → Selecciona "public" como directorio público
# → Configura como SPA: Sí

# Editar firebase.json: ajustar el serviceId de Cloud Run si cambia

# Desplegar
firebase deploy --only hosting
```

### Íconos PWA

Reemplaza los archivos placeholder en `frontend/public/icons/` con PNGs reales:
- `icon-192.png` — 192×192px
- `icon-512.png` — 512×512px

Usa el logo de tu marca con fondo del color primario (`#4A2342`).

## Estructura del proyecto

```
puntos-app/
├── backend/          # Express + Prisma + JWT
│   ├── prisma/       # Schema y seed
│   ├── src/
│   │   ├── routes/   # auth, inicio, productos, ventas, puntos, perfil
│   │   ├── middleware/# JWT auth
│   │   ├── services/ # Cálculo de puntos
│   │   └── utils/    # JWT, hash
│   └── Dockerfile
├── frontend/         # PWA vanilla
│   ├── public/       # Archivos servidos (HTML, CSS, JS, manifest, SW)
│   └── firebase.json
└── README.md
```

## Notas

- **Puntos por producto**: cada producto tiene un campo `puntos_por_venta` editable. El cálculo es `puntos_por_venta × cantidad`, aislado en `services/puntos.ts`.
- **Niveles de premio**: los 3 niveles (Bronce/Plata/Oro) están marcados como PENDIENTE. Edítalos en la tabla `niveles_premio` cuando definas los premios reales.
- **Autenticación**: JWT propio, sin Firebase Auth. Login con NIT + código de acceso + PIN.
- **Recuperación de PIN**: la dependiente necesita su NIT y código de acceso para cambiar el PIN.
