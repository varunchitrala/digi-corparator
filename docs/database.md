# Database Specification — Digital Corporator Platform

## Database Engine
- **Engine**: MySQL 8.0+ / MariaDB (XAMPP default)
- **Database Name**: `digital_corporator`
- **Charset**: `utf8mb4_unicode_ci`

## Key Entity Relationships
- `tenants` (1) ───< `corporations` (N)
- `corporations` (1) ───< `wards` (N)
- `corporations` (1) ───< `departments` (N)
- `corporations` (1) ───< `users` (N)
- `wards` (1) ───< `complaints` (N)
- `wards` (1) ───< `works` (N)
- `corporations` (1) ───< `budgets` (N)
- `roles` (N) ───< `role_permissions` >─── (N) `permissions`

## Seeding & Development Setup
Execute `database/schema.sql` followed by `database/seed.sql` in phpMyAdmin or MySQL CLI.
