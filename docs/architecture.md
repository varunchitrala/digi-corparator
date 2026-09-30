# Architecture Documentation — Digital Corporator Platform

## Overview
The **Digital Corporator & Smart Ward Management Platform** is a multi-tenant municipal SaaS architecture built for municipal corporations, councils, corporators, ward officers, and citizens.

## System Architecture Diagram
```
┌────────────────────────────────────────────────────────────────────────┐
│                        React.js Frontend (Vite)                        │
│            Tailwind CSS | Lucide Icons | Recharts | Leaflet            │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ HTTPS / REST JSON
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Node.js Express Backend                         │
│       JWT Auth Middleware | Tenant Isolation Guard | Zod Validator     │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ Connection Pool (mysql2/promise)
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                           MySQL Database                               │
│              Multi-Tenant Tables with Tenant & Corp Scope               │
└────────────────────────────────────────────────────────────────────────┘
```

## Multi-Tenant Hierarchy
1. **SUPER ADMIN**: Platform owner managing corporations, subscriptions, SaaS plans.
2. **CORPORATION**: Individual Municipal Corporation (e.g., Chhatrapati Sambhajinagar Municipal Corporation). Data isolated via `corporation_id` and `tenant_id`.
3. **WARD**: Individual electoral/administrative ward (e.g., Ward 24). Data scoped via `ward_id`.
4. **CORPORATOR / OFFICER**: Ward representative or departmental engineer.
5. **CITIZEN**: Public resident filing complaints or viewing ward progress.
