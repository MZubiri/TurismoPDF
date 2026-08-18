# 🌴 GregroyTours — Plataforma de Reservas Turísticas

Plataforma fullstack para registrar reservas turísticas, gestionar destinos y actividades, y generar vouchers PDF descargables en español e inglés.

## 🛠️ Tech Stack

| Componente | Tecnología |
|---|---|
| **Frontend** | Angular 18+ · Angular Material · SCSS |
| **Backend** | ASP.NET Core 9 · Entity Framework Core · C# |
| **Base de Datos** | MySQL 8.0 |
| **PDF** | QuestPDF (Community License) |
| **Email** | MailKit |
| **Auth** | JWT Bearer · BCrypt |
| **Deploy** | Docker Compose · Coolify |

## 🚀 Inicio Rápido (Desarrollo Local)

### Prerrequisitos
- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)
- [MySQL 8.0](https://dev.mysql.com/downloads/) o Docker

### 1. Clonar y configurar

```bash
git clone <tu-repo>
cd TurismoPDF
cp .env.example .env
# Editar .env con tus credenciales reales
```

### 2. Base de datos

Opción A — MySQL local:
```bash
mysql -u root -p -e "CREATE DATABASE gregroytours;"
```

Opción B — Docker (solo MySQL):
```bash
docker compose up db -d
```

### 3. Backend

```bash
cd backend
dotnet restore
dotnet run
```
API disponible en: `http://localhost:5141`
Swagger UI: `http://localhost:5141/swagger`

### 4. Frontend

```bash
cd frontend
npm install
npx ng serve
```
App disponible en: `http://localhost:4200`

### 5. Credenciales por defecto

| Campo | Valor |
|---|---|
| Email | `admin@gregroytours.com` |
| Password | `Admin123!` |

## 🐳 Deploy con Docker (Coolify)

```bash
cp .env.example .env
# Editar .env con credenciales de producción
docker compose up -d --build
```

La app estará disponible en:
- **Frontend**: `http://localhost` (puerto 80)
- **API**: `http://localhost:5141` (puerto 5141)
- **MySQL**: `localhost:3306`

### Volúmenes persistentes
- `mysql_data` — Datos de MySQL
- `pdf_storage` — PDFs generados

## 📋 Funcionalidades

- ✅ Login con contraseña encriptada (BCrypt + JWT)
- ✅ Cambio y recuperación de contraseña por email
- ✅ CRUD de Destinos turísticos
- ✅ CRUD de Actividades (enlazadas a destinos)
- ✅ CRUD de Reservas con formulario completo
- ✅ Filtrado dinámico: Destino → Actividades
- ✅ Generación de PDF bilingüe (Español/Inglés)
- ✅ Re-descarga de PDFs existentes
- ✅ Vista "Datos PDF" para configurar contacto al pie del voucher
- ✅ Diseño premium con paleta navy/gold

## 📁 Estructura del Proyecto

```
TurismoPDF/
├── docker-compose.yml      # Orquestación de contenedores
├── .env.example             # Template de variables de entorno
├── README.md
│
├── backend/                 # ASP.NET Core 9 Web API
│   ├── Dockerfile
│   ├── Program.cs
│   ├── Controllers/         # Auth, Destinations, Activities, Reservations, PdfSettings
│   ├── Models/              # User, Destination, Activity, Reservation, PdfSettings
│   ├── DTOs/                # Request/Response DTOs
│   ├── Services/            # AuthService, PdfService, EmailService
│   ├── Data/                # AppDbContext (EF Core)
│   └── Middleware/          # ExceptionMiddleware
│
├── frontend/                # Angular 18+ con Material
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src/app/
│       ├── services/        # Auth, Destination, Activity, Reservation, PdfSettings
│       ├── guards/          # AuthGuard
│       ├── interceptors/    # Auth, Error
│       ├── layout/          # MainLayout (sidebar + toolbar)
│       └── pages/           # Login, Dashboard, CRUDs, PDF Settings, etc.
│
└── docs/                    # Documentación del proyecto
```

## ⚙️ Variables de Entorno

Ver [`.env.example`](.env.example) para la lista completa.

| Variable | Descripción |
|---|---|
| `MYSQL_*` | Credenciales de MySQL |
| `ConnectionStrings__DefaultConnection` | Connection string de la BD |
| `Jwt__Secret` | Clave secreta para JWT (mín. 32 caracteres) |
| `SMTP_*` | Configuración del servidor SMTP |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Credenciales del admin inicial |

## 📄 Licencia

Proyecto privado — GregroyTours.com
