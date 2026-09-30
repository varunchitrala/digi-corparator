# API Endpoints Documentation — Digital Corporator Platform

## Base URL
`http://localhost:5000/api`

## Core Endpoints
- `GET /api/health` — System & MySQL connectivity health check
- `POST /api/auth/login` — User authentication & JWT issuance (Phase 2)
- `POST /api/auth/refresh` — Refresh access token (Phase 2)
- `GET /api/corporations` — List corporations (Super Admin)
- `GET /api/wards` — List ward details & metrics
- `GET /api/complaints` — Filterable complaint register
- `GET /api/works` — Development projects & progress
- `GET /api/funds` — Budget allocation & utilization
- `GET /api/meetings` — General body & ward meeting schedules
- `GET /api/proposals` — Corporator proposal pipeline
