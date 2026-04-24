# PropFlow

PropFlow is a small multi-tenant backend for property operations workflows. It simulates document ingestion, invoice extraction, approval flows, audit logging, and ERP sync patterns using TypeScript, Express, PostgreSQL, Prisma, and JWT-based RBAC.

The project is designed as a learning playground for SaaS architecture concepts such as tenant isolation, role-based access control, workflow state transitions, transactional consistency, integration boundaries, and production-readiness practices.

## Architecture

The API uses a pragmatic Onion Architecture:

- `domain`: business entities, enums, and domain errors
- `application`: use cases, ports, DTOs, and application services
- `infrastructure`: Express, Prisma, logging, configuration, and external adapters

Dependency direction:

```text
infrastructure → application → domain
```
