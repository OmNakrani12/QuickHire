-- QuickHire PostgreSQL Database Schema
-- Complete database structure for the QuickHire job marketplace platform

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS & AUTHENTICATION
-- ============================================

-- User types enum
CREATE TYPE user_role AS ENUM ('worker', 'contractor', 'admin');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'pending_verification');
CREATE TYPE availability_type AS ENUM ('full-time', 'part-time', 'weekends', 'flexible');

-- Main users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    status user_status DEFAULT 'pending_verification',
    
    -- Profile information
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    location VARCHAR(255),
    bio TEXT,
    profile_photo TEXT, -- Base64 or URL to photo
    
    -- Worker-specific fields
    hourly_rate DECIMAL(10, 2),
    years_experience INTEGER,
    availability availability_type DEFAULT 'full-time',
    rating DECIMAL(3, 2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    completed_jobs_count INTEGER DEFAULT 0,
    
    -- Contractor-specific fields
    company_name VARCHAR(255),
    company_website VARCHAR(255),
    total_spent DECIMAL(12, 2) DEFAULT 0.00,
    active_projects_count INTEGER DEFAULT 0,
    total_workers_hired INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    email_verified_at TIMESTAMP,
    
    -- Indexes
    CONSTRAINT check_rating CHECK (rating >= 0 AND rating <= 5)
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_location ON users(location);

-- ============================================
-- SKILLS & CERTIFICATIONS
-- ============================================

-- Skills table
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(100), -- e.g., 'Construction', 'Plumbing', 'Electrical'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User skills (many-to-many)
CREATE TABLE user_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    proficiency_level VARCHAR(50), -- 'beginner', 'intermediate', 'expert'
    years_experience INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, skill_id)
);

CREATE INDEX idx_user_skills_user ON user_skills(user_id);
CREATE INDEX idx_user_skills_skill ON user_skills(skill_id);

-- Certifications table
CREATE TABLE certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    issuing_organization VARCHAR(255),
    issue_date DATE,
    expiry_date DATE,
    credential_id VARCHAR(255),
    credential_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_certifications_user ON certifications(user_id);

-- ============================================
-- JOBS & PROJECTS
-- ============================================

CREATE TYPE job_status AS ENUM ('draft', 'open', 'active', 'completed', 'cancelled', 'closed');
CREATE TYPE project_status AS ENUM ('planning', 'in_progress', 'on_hold', 'completed', 'cancelled');

-- Jobs posted by contractors
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contractor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Job details
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    pay_rate DECIMAL(10, 2) NOT NULL,
    pay_type VARCHAR(50) DEFAULT 'hourly', -- 'hourly', 'daily', 'fixed'
    duration VARCHAR(100), -- e.g., '2 weeks', '3 months'
    
    -- Job requirements
    required_skills TEXT[], -- Array of skill names
    min_experience INTEGER, -- Minimum years of experience
    workers_needed INTEGER DEFAULT 1,
    workers_hired INTEGER DEFAULT 0,
    
    -- Status and tracking
    status job_status DEFAULT 'open',
    applicants_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    
    -- Dates
    start_date DATE,
    end_date DATE,
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_jobs_contractor ON jobs(contractor_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_location ON jobs(location);
CREATE INDEX idx_jobs_posted_at ON jobs(posted_at DESC);

-- Projects (larger undertakings that may have multiple jobs)
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contractor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Project details
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    
    -- Budget and tracking
    budget DECIMAL(12, 2) NOT NULL,
    spent DECIMAL(12, 2) DEFAULT 0.00,
    progress INTEGER DEFAULT 0, -- 0-100 percentage
    
    -- Workers
    workers_count INTEGER DEFAULT 0,
    
    -- Status and dates
    status project_status DEFAULT 'planning',
    start_date DATE,
    deadline DATE,
    completed_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT check_progress CHECK (progress >= 0 AND progress <= 100)
);

CREATE INDEX idx_projects_contractor ON projects(contractor_id);
CREATE INDEX idx_projects_status ON projects(status);

-- Link jobs to projects
CREATE TABLE project_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(project_id, job_id)
);

-- ============================================
-- APPLICATIONS & HIRING
-- ============================================

CREATE TYPE application_status AS ENUM ('pending', 'reviewed', 'shortlisted', 'accepted', 'rejected', 'withdrawn');

-- Job applications from workers
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    worker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Application details
    cover_letter TEXT,
    proposed_rate DECIMAL(10, 2),
    availability_start DATE,
    status application_status DEFAULT 'pending',
    
    -- Contractor notes
    contractor_notes TEXT,
    reviewed_at TIMESTAMP,
    reviewed_by UUID REFERENCES users(id),
    
    -- Timestamps
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(job_id, worker_id)
);

CREATE INDEX idx_applications_job ON applications(job_id);
CREATE INDEX idx_applications_worker ON applications(worker_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_applied_at ON applications(applied_at DESC);

-- Hired workers (active work assignments)
CREATE TABLE hires (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    worker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    contractor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    application_id UUID REFERENCES applications(id),
    
    -- Work details
    agreed_rate DECIMAL(10, 2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    actual_end_date DATE,
    
    -- Payment tracking
    total_hours DECIMAL(10, 2) DEFAULT 0,
    total_paid DECIMAL(12, 2) DEFAULT 0,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Timestamps
    hired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_hires_job ON hires(job_id);
CREATE INDEX idx_hires_worker ON hires(worker_id);
CREATE INDEX idx_hires_contractor ON hires(contractor_id);
CREATE INDEX idx_hires_active ON hires(is_active);

-- ============================================
-- WORK TRACKING & TIMESHEETS
-- ============================================

CREATE TYPE timesheet_status AS ENUM ('draft', 'submitted', 'approved', 'rejected', 'paid');

-- Timesheets for tracking work hours
CREATE TABLE timesheets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hire_id UUID NOT NULL REFERENCES hires(id) ON DELETE CASCADE,
    worker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    contractor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Time tracking
    work_date DATE NOT NULL,
    hours_worked DECIMAL(5, 2) NOT NULL,
    break_hours DECIMAL(5, 2) DEFAULT 0,
    overtime_hours DECIMAL(5, 2) DEFAULT 0,
    
    -- Payment
    hourly_rate DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    
    -- Details
    description TEXT,
    status timesheet_status DEFAULT 'draft',
    
    -- Approval
    submitted_at TIMESTAMP,
    approved_at TIMESTAMP,
    approved_by UUID REFERENCES users(id),
    rejection_reason TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_timesheets_hire ON timesheets(hire_id);
CREATE INDEX idx_timesheets_worker ON timesheets(worker_id);
CREATE INDEX idx_timesheets_contractor ON timesheets(contractor_id);
CREATE INDEX idx_timesheets_status ON timesheets(status);

-- ============================================
-- PAYMENTS & TRANSACTIONS
-- ============================================

CREATE TYPE transaction_type AS ENUM ('payment', 'refund', 'bonus', 'penalty', 'deposit');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled');

-- Payment transactions
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Parties involved
    from_user_id UUID REFERENCES users(id),
    to_user_id UUID REFERENCES users(id),
    
    -- Related entities
    hire_id UUID REFERENCES hires(id),
    timesheet_id UUID REFERENCES timesheets(id),
    job_id UUID REFERENCES jobs(id),
    
    -- Transaction details
    type transaction_type NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    description TEXT,
    
    -- Payment processing
    status payment_status DEFAULT 'pending',
    payment_method VARCHAR(50), -- 'credit_card', 'bank_transfer', 'paypal', etc.
    payment_reference VARCHAR(255), -- External payment gateway reference
    
    -- Timestamps
    processed_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_from_user ON transactions(from_user_id);
CREATE INDEX idx_transactions_to_user ON transactions(to_user_id);
CREATE INDEX idx_transactions_hire ON transactions(hire_id);
CREATE INDEX idx_transactions_status ON transactions(status);

-- ============================================
-- REVIEWS & RATINGS
-- ============================================

CREATE TYPE review_type AS ENUM ('worker_review', 'contractor_review', 'job_review');

-- Reviews and ratings
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Parties
    reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reviewee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Related entities
    hire_id UUID REFERENCES hires(id) ON DELETE CASCADE,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    
    -- Review content
    type review_type NOT NULL,
    rating INTEGER NOT NULL,
    title VARCHAR(255),
    comment TEXT,
    
    -- Specific ratings
    professionalism_rating INTEGER,
    communication_rating INTEGER,
    quality_rating INTEGER,
    punctuality_rating INTEGER,
    
    -- Visibility
    is_public BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    
    -- Response
    response TEXT,
    response_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT check_rating_range CHECK (rating >= 1 AND rating <= 5),
    CONSTRAINT check_specific_ratings CHECK (
        (professionalism_rating IS NULL OR (professionalism_rating >= 1 AND professionalism_rating <= 5)) AND
        (communication_rating IS NULL OR (communication_rating >= 1 AND communication_rating <= 5)) AND
        (quality_rating IS NULL OR (quality_rating >= 1 AND quality_rating <= 5)) AND
        (punctuality_rating IS NULL OR (punctuality_rating >= 1 AND punctuality_rating <= 5))
    )
);

CREATE INDEX idx_reviews_reviewer ON reviews(reviewer_id);
CREATE INDEX idx_reviews_reviewee ON reviews(reviewee_id);
CREATE INDEX idx_reviews_hire ON reviews(hire_id);
CREATE INDEX idx_reviews_job ON reviews(job_id);

-- ============================================
-- MESSAGING SYSTEM
-- ============================================

CREATE TYPE message_status AS ENUM ('sent', 'delivered', 'read');

-- Conversations between users
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Participants
    user1_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user2_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Related context
    job_id UUID REFERENCES jobs(id),
    application_id UUID REFERENCES applications(id),
    hire_id UUID REFERENCES hires(id),
    
    -- Last message info
    last_message_at TIMESTAMP,
    last_message_preview TEXT,
    
    -- Unread counts
    user1_unread_count INTEGER DEFAULT 0,
    user2_unread_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user1_id, user2_id, job_id)
);

CREATE INDEX idx_conversations_user1 ON conversations(user1_id);
CREATE INDEX idx_conversations_user2 ON conversations(user2_id);
CREATE INDEX idx_conversations_job ON conversations(job_id);

-- Messages within conversations
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    
    -- Message details
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    content TEXT NOT NULL,
    attachments TEXT[], -- Array of file URLs
    
    -- Status
    status message_status DEFAULT 'sent',
    read_at TIMESTAMP,
    
    -- Timestamps
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_messages_sent_at ON messages(sent_at DESC);

-- ============================================
-- NOTIFICATIONS
-- ============================================

CREATE TYPE notification_type AS ENUM (
    'new_application',
    'application_accepted',
    'application_rejected',
    'new_message',
    'job_posted',
    'job_updated',
    'hire_confirmed',
    'timesheet_submitted',
    'timesheet_approved',
    'payment_received',
    'review_received',
    'system_alert'
);

-- User notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Notification details
    type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    -- Related entities
    related_user_id UUID REFERENCES users(id),
    related_job_id UUID REFERENCES jobs(id),
    related_application_id UUID REFERENCES applications(id),
    related_message_id UUID REFERENCES messages(id),
    
    -- Action link
    action_url TEXT,
    
    -- Status
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- ============================================
-- SAVED ITEMS & FAVORITES
-- ============================================

-- Workers can save jobs they're interested in
CREATE TABLE saved_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    worker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(worker_id, job_id)
);

CREATE INDEX idx_saved_jobs_worker ON saved_jobs(worker_id);

-- Contractors can save/favorite workers
CREATE TABLE saved_workers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contractor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    worker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(contractor_id, worker_id)
);

CREATE INDEX idx_saved_workers_contractor ON saved_workers(contractor_id);

-- ============================================
-- ACTIVITY LOGS & AUDIT TRAIL
-- ============================================

CREATE TYPE activity_type AS ENUM (
    'user_login',
    'user_logout',
    'profile_updated',
    'job_created',
    'job_updated',
    'job_deleted',
    'application_submitted',
    'application_updated',
    'worker_hired',
    'timesheet_created',
    'payment_made',
    'review_posted',
    'message_sent'
);

-- Activity logs for audit trail
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Activity details
    type activity_type NOT NULL,
    description TEXT,
    ip_address INET,
    user_agent TEXT,
    
    -- Related entities (store as JSONB for flexibility)
    metadata JSONB,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_type ON activity_logs(type);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at DESC);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hires_updated_at BEFORE UPDATE ON hires
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_certifications_updated_at BEFORE UPDATE ON certifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update user rating when a new review is added
CREATE OR REPLACE FUNCTION update_user_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE users
    SET 
        rating = (
            SELECT AVG(rating)::DECIMAL(3,2)
            FROM reviews
            WHERE reviewee_id = NEW.reviewee_id
        ),
        total_reviews = (
            SELECT COUNT(*)
            FROM reviews
            WHERE reviewee_id = NEW.reviewee_id
        )
    WHERE id = NEW.reviewee_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_rating_on_review AFTER INSERT ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_user_rating();

-- Function to increment applicants count when application is created
CREATE OR REPLACE FUNCTION increment_applicants_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE jobs
    SET applicants_count = applicants_count + 1
    WHERE id = NEW.job_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_applicants AFTER INSERT ON applications
    FOR EACH ROW EXECUTE FUNCTION increment_applicants_count();

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Insert sample skills
INSERT INTO skills (name, category) VALUES
    ('Construction', 'General'),
    ('Plumbing', 'Specialized'),
    ('Electrical', 'Specialized'),
    ('Carpentry', 'Specialized'),
    ('Painting', 'General'),
    ('Welding', 'Specialized'),
    ('Heavy Equipment', 'Specialized'),
    ('Roofing', 'Specialized'),
    ('HVAC', 'Specialized'),
    ('Landscaping', 'General');

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- View for active jobs with contractor info
CREATE OR REPLACE VIEW active_jobs_view AS
SELECT 
    j.*,
    u.name as contractor_name,
    u.company_name,
    u.rating as contractor_rating
FROM jobs j
JOIN users u ON j.contractor_id = u.id
WHERE j.status IN ('open', 'active');

-- View for worker profiles with aggregated data
CREATE OR REPLACE VIEW worker_profiles_view AS
SELECT 
    u.id,
    u.name,
    u.email,
    u.location,
    u.bio,
    u.profile_photo,
    u.hourly_rate,
    u.years_experience,
    u.availability,
    u.rating,
    u.total_reviews,
    u.completed_jobs_count,
    ARRAY_AGG(DISTINCT s.name) as skills,
    ARRAY_AGG(DISTINCT c.name) as certifications
FROM users u
LEFT JOIN user_skills us ON u.id = us.user_id
LEFT JOIN skills s ON us.skill_id = s.id
LEFT JOIN certifications c ON u.id = c.user_id
WHERE u.role = 'worker'
GROUP BY u.id;

-- View for contractor dashboard stats
CREATE OR REPLACE VIEW contractor_stats_view AS
SELECT 
    u.id as contractor_id,
    u.name,
    COUNT(DISTINCT j.id) as total_jobs_posted,
    COUNT(DISTINCT CASE WHEN j.status = 'active' THEN j.id END) as active_jobs,
    COUNT(DISTINCT h.id) as total_hires,
    COUNT(DISTINCT CASE WHEN h.is_active = true THEN h.id END) as active_hires,
    COALESCE(SUM(t.total_amount), 0) as total_spent,
    COUNT(DISTINCT p.id) as total_projects,
    AVG(r.rating) as average_rating_given
FROM users u
LEFT JOIN jobs j ON u.id = j.contractor_id
LEFT JOIN hires h ON u.id = h.contractor_id
LEFT JOIN transactions t ON u.id = t.from_user_id AND t.status = 'completed'
LEFT JOIN projects p ON u.id = p.contractor_id
LEFT JOIN reviews r ON u.id = r.reviewer_id
WHERE u.role = 'contractor'
GROUP BY u.id, u.name;

-- ============================================
-- COMMENTS & DOCUMENTATION
-- ============================================

COMMENT ON TABLE users IS 'Main users table storing both workers and contractors';
COMMENT ON TABLE jobs IS 'Job postings created by contractors';
COMMENT ON TABLE applications IS 'Worker applications to jobs';
COMMENT ON TABLE hires IS 'Active work assignments when workers are hired';
COMMENT ON TABLE timesheets IS 'Time tracking for hourly workers';
COMMENT ON TABLE transactions IS 'Payment and financial transactions';
COMMENT ON TABLE reviews IS 'Reviews and ratings between users';
COMMENT ON TABLE messages IS 'Direct messages between users';
COMMENT ON TABLE notifications IS 'System notifications for users';
