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
# Arranque directo del servidor (rápido). Los cambios de esquema se aplican
# aparte con "prisma db push", no en cada arranque del contenedor.
CMD ["node", "dist/index.js"]
