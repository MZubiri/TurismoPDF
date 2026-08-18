# 📋 Task List — GregroyTours

## Fase 1 — Fundación
- [x] 1.1 Crear solución ASP.NET Core 9 Web API
- [x] 1.2 Configurar EF Core + Pomelo MySQL
- [x] 1.3 Crear modelos: User, Destination, Activity, Reservation, PdfSettings, PasswordResetToken
- [x] 1.4 Migraciones iniciales + seed admin + seed PdfSettings
- [x] 1.5 Crear proyecto Angular 18+ con Angular Material
- [x] 1.6 Docker Compose (API + Angular/Nginx + MySQL)
- [x] 1.7 CORS y comunicación frontend↔backend

## Fase 2 — Autenticación
- [x] 2.1 Hash de contraseña con BCrypt
- [x] 2.2 Login con JWT (access token)
- [x] 2.3 Guard de autenticación en Angular + interceptor JWT
- [x] 2.4 Pantalla de login (glassmorphism, navy/gold)
- [x] 2.5 Endpoint y pantalla de cambio de contraseña
- [x] 2.6 Recuperación de contraseña con MailKit (token temporal)
- [x] 2.7 Pantalla de reset de contraseña

## Fase 3 — CRUDs
- [x] 3.1 CRUD Destinos — API
- [x] 3.2 CRUD Destinos — Angular (tabla + form + dialog)
- [x] 3.3 CRUD Actividades — API con filtro por destino
- [x] 3.4 CRUD Actividades — Angular con relación a destino
- [x] 3.5 CRUD Reservas — API
- [x] 3.6 Formulario de nueva reserva (radio destino → select actividad filtrada)
- [x] 3.7 Listado de reservas con PDF download ES/EN
- [x] 3.8 Vista "Datos PDF" — API + Angular

## Fase 4 — PDF Bilingüe
- [x] 4.1 Instalar y configurar QuestPDF (Community License)
- [x] 4.2 Template voucher español (navy/gold, disclaimers)
- [x] 4.3 Template voucher inglés
- [x] 4.4 Inyectar PdfSettings al pie
- [x] 4.5 Endpoint generación PDF (lang=es|en)
- [x] 4.6 Endpoint re-descarga PDF
- [x] 4.7 Botones descarga ES/EN en Angular

## Fase 5 — Docker y Deploy
- [x] 5.1 Dockerfile API (multi-stage .NET 9)
- [x] 5.2 Dockerfile Frontend (multi-stage Node + Nginx)
- [x] 5.3 Docker Compose completo (healthchecks, depends_on)
- [x] 5.4 Volumen persistente PDFs
- [x] 5.5 .env.example
- [x] 5.6 README.md

## Fase 6 — Pulido
- [x] 6.1 Validaciones frontend + backend
- [x] 6.2 Manejo de errores (interceptor 401, exception middleware)
- [x] 6.3 Responsive design (sidenav colapsable)
- [x] 6.4 Compilación verificada (0 errores backend + frontend)
