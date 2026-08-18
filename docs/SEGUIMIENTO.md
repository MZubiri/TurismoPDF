# 📋 SEGUIMIENTO — GregroyTours Plataforma de Reservas PDF

> Documento vivo de seguimiento del proyecto. Se actualiza conforme avanza el desarrollo.

---

## Estado General

| Indicador | Valor |
|---|---|
| **Inicio** | 2026-08-08 |
| **Fase Actual** | 🟡 Planificación |
| **Stack** | Angular 18+ · ASP.NET Core 8 · MySQL 8 · Docker |
| **Deploy Target** | Coolify |

---

## Progreso por Fase

| Fase | Descripción | Estado | Notas |
|---|---|---|---|
| 1 | Fundación (Backend + Frontend + Docker) | ⬜ Pendiente | — |
| 2 | Autenticación (JWT + Password + Recovery) | ⬜ Pendiente | — |
| 3 | CRUDs (Destinos + Actividades + Reservas) | ⬜ Pendiente | — |
| 4 | Generación de PDF (QuestPDF + QR) | ⬜ Pendiente | — |
| 5 | Docker y Deploy (Coolify) | ⬜ Pendiente | — |
| 6 | Pulido y QA | ⬜ Pendiente | — |

**Leyenda:** ⬜ Pendiente · 🟡 En Progreso · ✅ Completado · 🔴 Bloqueado

---

## Log de Decisiones Técnicas

| Fecha | Decisión | Razón |
|---|---|---|
| 2026-08-08 | QuestPDF para generación de PDF | Cross-platform, funciona en Docker Linux, API declarativa fluida |
| 2026-08-08 | Pomelo.EntityFrameworkCore.MySql | Provider estándar de la comunidad para EF Core + MySQL |
| 2026-08-08 | MailKit para envío de correos | SmtpClient de .NET está deprecated; MailKit es la recomendación oficial |
| 2026-08-08 | JWT con refresh token en cookie HttpOnly | Previene XSS; más seguro que almacenar token en localStorage |
| 2026-08-08 | IPasswordHasher nativo de ASP.NET Core | PBKDF2 con HMAC-SHA512, 100k+ iteraciones, sin dependencias extra |

---

## Decisiones Pendientes (Esperando respuesta del usuario)

- [ ] ¿Angular Material o PrimeNG?
- [ ] ¿Un solo usuario (admin) o múltiples usuarios con roles?
- [ ] ¿Se tiene logo de GREGROYTOURS.COM?
- [ ] ¿Incluir precio en el PDF?
- [ ] ¿Reservas con estados (pendiente, confirmada, cancelada)?
- [ ] ¿Dashboard con estadísticas?
- [ ] ¿Campo de hora de recogida en la reserva?
- [ ] ¿Múltiples actividades por reserva?

---

## Issues Conocidos

| # | Descripción | Severidad | Estado |
|---|---|---|---|
| — | Sin issues reportados aún | — | — |

---

## Registro de Cambios

| Fecha | Cambio | Archivos Afectados |
|---|---|---|
| 2026-08-08 | Creación del plan de implementación y documento de seguimiento | `implementation_plan.md`, `SEGUIMIENTO.md` |

---

## Notas Técnicas

### Puertos por Defecto
- **Frontend (Angular/Nginx):** 4200 (dev) / 80 (Docker)
- **Backend (ASP.NET):** 5000 (dev) / 8080 (Docker)
- **MySQL:** 3306

### Comandos Útiles
```bash
# Levantar todo el stack
docker compose up -d

# Ver logs
docker compose logs -f api
docker compose logs -f frontend
docker compose logs -f db

# Rebuild después de cambios
docker compose up -d --build

# Ejecutar migraciones
dotnet ef database update

# Generar nueva migración
dotnet ef migrations add NombreDeMigracion
```
