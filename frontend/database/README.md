# QuickHire Database Documentation

## Overview
This PostgreSQL database schema supports the complete QuickHire job marketplace platform, enabling contractors to post jobs and hire workers, while workers can browse jobs, apply, track work hours, and receive payments.

## Database Structure

### Core Tables

#### 1. **Users** (`users`)
Stores both workers and contractors with role-based fields.

**Key Fields:**
- `role`: 'worker', 'contractor', or 'admin'
- `email`, `password_hash`: Authentication
- `name`, `phone`, `location`, `bio`, `profile_photo`: Profile info
- Worker-specific: `hourly_rate`, `years_experience`, `availability`, `rating`
- Contractor-specific: `company_name`, `total_spent`, `active_projects_count`

#### 2. **Skills & Certifications**
- `skills`: Master list of available skills
- `user_skills`: Links users to their skills (many-to-many)
- `certifications`: User certifications and licenses

#### 3. **Jobs** (`jobs`)
Job postings created by contractors.

**Key Fields:**
- `title`, `description`, `location`
- `pay_rate`, `pay_type`, `duration`
- `required_skills`, `min_experience`
- `status`: 'draft', 'open', 'active', 'completed', 'cancelled'
- `applicants_count`, `workers_hired`

#### 4. **Projects** (`projects`)
Larger undertakings that may contain multiple jobs.

**Key Fields:**
- `name`, `description`, `budget`, `spent`
- `progress`: 0-100 percentage
- `workers_count`, `deadline`

#### 5. **Applications** (`applications`)
Worker applications to jobs.

**Key Fields:**
- `job_id`, `worker_id`
- `cover_letter`, `proposed_rate`
- `status`: 'pending', 'reviewed', 'shortlisted', 'accepted', 'rejected'

#### 6. **Hires** (`hires`)
Active work assignments when workers are hired.

**Key Fields:**
- `job_id`, `worker_id`, `contractor_id`
- `agreed_rate`, `start_date`, `end_date`
- `total_hours`, `total_paid`
- `is_active`: Boolean for active status

#### 7. **Timesheets** (`timesheets`)
Track work hours for payment.

**Key Fields:**
- `hire_id`, `work_date`, `hours_worked`
- `hourly_rate`, `total_amount`
- `status`: 'draft', 'submitted', 'approved', 'rejected', 'paid'

#### 8. **Transactions** (`transactions`)
Payment and financial transactions.

**Key Fields:**
- `from_user_id`, `to_user_id`
- `type`: 'payment', 'refund', 'bonus', 'penalty'
- `amount`, `currency`
- `status`: 'pending', 'processing', 'completed', 'failed'

#### 9. **Reviews** (`reviews`)
Ratings and reviews between users.

**Key Fields:**
- `reviewer_id`, `reviewee_id`
- `rating`: 1-5 stars
- `professionalism_rating`, `communication_rating`, `quality_rating`

#### 10. **Messages & Conversations**
- `conversations`: Chat threads between users
- `messages`: Individual messages within conversations

#### 11. **Notifications** (`notifications`)
System notifications for users.

**Types:**
- New applications, accepted/rejected applications
- New messages, job updates
- Timesheet approvals, payments received
- Reviews received

## Setup Instructions

### 1. Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE quickhire;

# Connect to the database
\c quickhire
```

### 2. Run Schema
```bash
# Execute the schema file
psql -U postgres -d quickhire -f database/schema.sql
```

### 3. Verify Installation
```sql
-- Check tables
\dt

-- Check views
\dv

-- Check functions
\df
```

## Common Queries

### Get All Active Jobs
```sql
SELECT * FROM active_jobs_view
WHERE location LIKE '%New York%'
ORDER BY posted_at DESC;
```

### Get Worker Profile with Skills
```sql
SELECT * FROM worker_profiles_view
WHERE id = 'worker-uuid-here';
```

### Get Contractor Dashboard Stats
```sql
SELECT * FROM contractor_stats_view
WHERE contractor_id = 'contractor-uuid-here';
```

### Get Pending Applications for a Job
```sql
SELECT
    a.*,
    u.name as worker_name,
    u.rating as worker_rating,
    u.completed_jobs_count
FROM applications a
JOIN users u ON a.worker_id = u.id
WHERE a.job_id = 'job-uuid-here'
    AND a.status = 'pending'
ORDER BY a.applied_at DESC;
```

### Get Worker's Active Jobs
```sql
SELECT
    h.*,
    j.title as job_title,
    j.location,
    u.name as contractor_name
FROM hires h
JOIN jobs j ON h.job_id = j.id
JOIN users u ON h.contractor_id = u.id
WHERE h.worker_id = 'worker-uuid-here'
    AND h.is_active = true;
```

### Get Unread Messages Count
```sql
SELECT 
    CASE 
        WHEN user1_id = 'user-uuid' THEN user1_unread_count
        WHEN user2_id = 'user-uuid' THEN user2_unread_count
    END as unread_count
FROM conversations
WHERE user1_id = 'user-uuid' OR user2_id = 'user-uuid';
```

## Database Features

### Automatic Triggers
1. **Updated At**: Automatically updates `updated_at` timestamp on record changes
2. **Rating Calculation**: Recalculates user rating when new reviews are added
3. **Applicant Count**: Increments job applicant count when applications are submitted

### Indexes
Optimized indexes on:
- User lookups (email, role, location)
- Job searches (status, location, posted date)
- Application tracking (job, worker, status)
- Message retrieval (conversation, sent date)
- Transaction history (users, status)

### Data Integrity
- Foreign key constraints ensure referential integrity
- Check constraints validate ratings (1-5), progress (0-100)
- Unique constraints prevent duplicate applications
- Cascade deletes maintain data consistency

## Integration with Frontend

### User Authentication
```javascript
// Register new user
INSERT INTO users (email, password_hash, role, name)
VALUES ($1, $2, $3, $4)
RETURNING id, email, name, role;

// Login
SELECT id, email, name, role, profile_photo
FROM users
WHERE email = $1 AND password_hash = $2;
```

### Job Posting
```javascript
// Create new job
INSERT INTO jobs (
    contractor_id, title, description, location,
    pay_rate, duration, required_skills, workers_needed
) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING *;
```

### Apply to Job
```javascript
// Submit application
INSERT INTO applications (
    job_id, worker_id, cover_letter, proposed_rate
) VALUES ($1, $2, $3, $4)
RETURNING *;
```

### Update Profile
```javascript
// Update user profile
UPDATE users
SET 
    name = $1,
    phone = $2,
    location = $3,
    bio = $4,
    profile_photo = $5,
    hourly_rate = $6,
    years_experience = $7,
    availability = $8,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $9
RETURNING *;
```

### Add Skills
```javascript
// Add skill to user
INSERT INTO user_skills (user_id, skill_id, proficiency_level)
SELECT $1, id, $3
FROM skills
WHERE name = $2
ON CONFLICT (user_id, skill_id) DO NOTHING;
```

## Environment Variables

Create a `.env` file with database connection details:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=quickhire
DB_USER=postgres
DB_PASSWORD=your_password
DB_SSL=false

# Connection pool settings
DB_POOL_MIN=2
DB_POOL_MAX=10
```

## Migration Strategy

For future schema changes, use migration tools like:
- **node-pg-migrate**
- **Knex.js migrations**
- **Sequelize migrations**

Example migration structure:
```
database/
  ├── schema.sql (initial schema)
  └── migrations/
      ├── 001_initial_schema.sql
      ├── 002_add_notifications.sql
      └── 003_add_saved_items.sql
```

## Backup & Maintenance

### Backup Database
```bash
pg_dump -U postgres quickhire > backup_$(date +%Y%m%d).sql
```

### Restore Database
```bash
psql -U postgres quickhire < backup_20260209.sql
```

### Vacuum & Analyze
```sql
-- Optimize database performance
VACUUM ANALYZE;

-- Reindex all tables
REINDEX DATABASE quickhire;
```

## Security Considerations

1. **Password Hashing**: Use bcrypt or Argon2 for password hashing
2. **SQL Injection**: Always use parameterized queries
3. **Access Control**: Implement row-level security (RLS) if needed
4. **Sensitive Data**: Encrypt sensitive fields like payment info
5. **Audit Logging**: Use `activity_logs` table for compliance

## Performance Tips

1. Use prepared statements for frequently executed queries
2. Implement connection pooling (pg-pool)
3. Add indexes for frequently queried columns
4. Use views for complex, repeated queries
5. Partition large tables (timesheets, messages) by date
6. Monitor slow queries with `pg_stat_statements`

## Next Steps

1. Set up database connection in your backend
2. Create API endpoints for each major operation
3. Implement authentication middleware
4. Add data validation layers
5. Set up automated backups
6. Configure monitoring and alerting
