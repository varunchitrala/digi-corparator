# Tenant Isolation Specification

## Principle
Every corporation's data is strictly isolated. Under no circumstances can a user belonging to Corporation A query, read, or modify records belonging to Corporation B.

## Multi-Tenant Security Rules
1. Every query executed in backend services includes `tenant_id` AND `corporation_id` in SQL `WHERE` clauses.
2. Tenant context is extracted directly from the verified JWT payload (`req.user.tenant_id`, `req.user.corporation_id`).
3. Frontend request headers cannot override tenant context established by the authenticated user JWT.
