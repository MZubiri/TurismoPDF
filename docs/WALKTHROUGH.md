# 🏁 Walkthrough — GregroyTours Platform

## Resumen

Se construyó la plataforma completa **GregroyTours** para gestionar reservas turísticas y generar vouchers PDF bilingües. El proyecto consta de 3 componentes desplegables con Docker.

---

## Cambios Realizados

### 🔧 Backend — ASP.NET Core 9 Web API
**Ubicación:** [backend/](file:///c:/Users/Celinee/Desktop/PROYECTO/TurismoPDF/backend)

| Archivo | Descripción |
|---|---|
| [Program.cs](file:///c:/Users/Celinee/Desktop/PROYECTO/TurismoPDF/backend/Program.cs) | Configuración principal: EF Core + MySQL, JWT Auth, CORS, QuestPDF, seed data |
| [AppDbContext.cs](file:///c:/Users/Celinee/Desktop/PROYECTO/TurismoPDF/backend/Data/AppDbContext.cs) | DbContext con 6 DbSets y relaciones configuradas |
| [AuthController.cs](file:///c:/Users/Celinee/Desktop/PROYECTO/TurismoPDF/backend/Controllers/AuthController.cs) | Login, change-password, forgot-password, reset-password |
| [DestinationsController.cs](file:///c:/Users/Celinee/Desktop/PROYECTO/TurismoPDF/backend/Controllers/DestinationsController.cs) | CRUD completo de destinos |
| [ActivitiesController.cs](file:///c:/Users/Celinee/Desktop/PROYECTO/TurismoPDF/backend/Controllers/ActivitiesController.cs) | CRUD completo + filtro por destino |
| [ReservationsController.cs](file:///c:/Users/Celinee/Desktop/PROYECTO/TurismoPDF/backend/Controllers/ReservationsController.cs) | CRUD + generación/descarga PDF bilingüe |
| [PdfSettingsController.cs](file:///c:/Users/Celinee/Desktop/PROYECTO/TurismoPDF/backend/Controllers/PdfSettingsController.cs) | GET/PUT para configurar datos del pie del PDF |
| [PdfService.cs](file:///c:/Users/Celinee/Desktop/PROYECTO/TurismoPDF/backend/Services/PdfService.cs) | Generación de PDF con QuestPDF (navy/gold, folio, disclaimers) |
| [AuthService.cs](file:///c:/Users/Celinee/Desktop/PROYECTO/TurismoPDF/backend/Services/AuthService.cs) | Hash BCrypt + generación JWT |
| [EmailService.cs](file:///c:/Users/Celinee/Desktop/PROYECTO/TurismoPDF/backend/Services/EmailService.cs) | Envío de email con MailKit |

**Modelos:** User, Destination, Activity, Reservation, PdfSettings, PasswordResetToken

---

### 🎨 Frontend — Angular 18+ con Material
**Ubicación:** [frontend/src/app/](file:///c:/Users/Celinee/Desktop/PROYECTO/TurismoPDF/frontend/src/app)

| Componente | Descripción |
|---|---|
| **Login** | Pantalla con glassmorphism sobre fondo navy, campos de email/contraseña |
| **Forgot/Reset Password** | Flujo completo de recuperación por email |
| **Main Layout** | Sidebar navy con links + toolbar con logout |
| **Dashboard** | 3 cards con estadísticas (reservas, destinos, actividades) |
| **Destinos CRUD** | Tabla con toggle activo + formulario create/edit |
| **Actividades CRUD** | Tabla con filtro por destino + formulario con select dependiente |
| **Reservas CRUD** | Tabla completa + botones descarga PDF 🇪🇸/🇬🇧 |
| **Formulario Reserva** | Radio buttons destino → select actividad filtrada, datepicker, pasajeros |
| **Datos PDF** | Formulario para teléfono, correo y web del pie del PDF |
| **Cambiar Contraseña** | Contraseña actual + nueva + confirmar |

**Servicios:** AuthService, DestinationService, ActivityService, ReservationService, PdfSettingsService
**Guards:** AuthGuard (CanActivateFn)
**Interceptors:** Auth (Bearer token), Error (401 redirect)

---

### 🐳 Docker & Deploy
**Ubicación:** Raíz del proyecto

| Archivo | Descripción |
|---|---|
| [docker-compose.yml](file:///c:/Users/Celinee/Desktop/PROYECTO/TurismoPDF/docker-compose.yml) | 3 servicios: MySQL, API, Frontend con healthchecks y volúmenes |
| [backend/Dockerfile](file:///c:/Users/Celinee/Desktop/PROYECTO/TurismoPDF/backend/Dockerfile) | Multi-stage .NET 9 (SDK → runtime) |
| [frontend/Dockerfile](file:///c:/Users/Celinee/Desktop/PROYECTO/TurismoPDF/frontend/Dockerfile) | Multi-stage Node → Nginx |
| [frontend/nginx.conf](file:///c:/Users/Celinee/Desktop/PROYECTO/TurismoPDF/frontend/nginx.conf) | SPA routing + reverse proxy a /api/ |
| [.env.example](file:///c:/Users/Celinee/Desktop/PROYECTO/TurismoPDF/.env.example) | Template de variables de entorno |

---

## Verificación

### Build Backend
```
dotnet build → Compilación correcta. 0 Advertencia(s). 0 Errores.
```

### Build Frontend
```
npx ng build → Application bundle generation complete. [2.874 seconds]
main-X2Y24ILP.js   | 797.47 kB | 143.71 kB (gzipped)
styles-OFC5DIIB.css |  11.55 kB |    939 B  (gzipped)
```

### Pendiente de verificar manualmente
- [ ] Levantar MySQL y probar login con admin@gregroytours.com / Admin123!
- [ ] Crear un destino → crear una actividad → crear una reserva → descargar PDF
- [ ] Probar recuperación de contraseña (requiere configurar SMTP real)
- [ ] Deploy con `docker compose up -d` en Coolify

---

## Próximos Pasos Sugeridos
1. Configurar variables de entorno reales en `.env`
2. Probar flujo completo con MySQL corriendo
3. Agregar logo de GREGROYTOURS.COM cuando esté disponible
4. Personalizar colores del PDF si es necesario
5. Deploy en Coolify con `docker compose up -d --build`
