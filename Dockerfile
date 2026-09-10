FROM node:20-slim

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY backend/package*.json ./
COPY backend/prisma ./prisma/

RUN npm ci
RUN npx prisma generate

COPY backend/ ./
RUN npm run build

COPY frontend/public ./public-frontend

ENV FRONTEND_PATH=/app/public-frontend

EXPOSE 3000
# Mantener el esquema de PostgreSQL alineado con el cliente Prisma generado.
# Sin esta sincronización una actualización de campos hace que el login falle
# con un 500 antes de validar las credenciales.
CMD ["sh", "-c", "npx prisma db push --skip-generate && node dist/index.js"]
