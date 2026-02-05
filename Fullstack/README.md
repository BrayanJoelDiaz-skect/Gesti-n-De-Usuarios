# Gestión de Usuarios - Fullstack App

Este proyecto incluye autenticación con JWT, roles (admin/user), CRUD de usuarios y una interfaz web sencilla.

## Requisitos

- Node.js 20+
- Docker (opcional para PostgreSQL)

## Configuración rápida

### 1) Levantar con Docker

```bash
docker compose up --build
```

La API quedará disponible en `http://localhost:4000` y el frontend estático en la misma URL.

### 2) Desarrollo local

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

## Variables de entorno

Revisa el archivo `.env.example` para configurar:

- `DATABASE_URL`
- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

El usuario admin se crea automáticamente al iniciar la API.

## Endpoints principales

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users/me`
- `GET /api/users` (admin)
- `POST /api/users` (admin)
- `PUT /api/users/:id` (admin)
- `DELETE /api/users/:id` (admin)

## Tests

```bash
cd backend
npm test
```
