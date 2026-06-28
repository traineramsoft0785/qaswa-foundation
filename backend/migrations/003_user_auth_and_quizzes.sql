    -- Create users table for public user accounts (separate from admin_users)
    CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        school VARCHAR(255),
        class_name VARCHAR(50),
        date_of_birth DATE,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- Create quizzes table (replaces notices with is_quiz flag)
    CREATE TABLE IF NOT EXISTS quizzes (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        exam_date DATE NOT NULL,
        exam_time TIME,
        venue VARCHAR(255),
        duration_minutes INTEGER,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- Create quiz_enrollments table (links users to quizzes)
    CREATE TABLE IF NOT EXISTS quiz_enrollments (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
        roll_number VARCHAR(30) NOT NULL,
        enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(user_id, quiz_id),
        UNIQUE(roll_number)
    );

    -- Indexes
    CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
    CREATE INDEX IF NOT EXISTS idx_quizzes_active ON quizzes (is_active, exam_date);
    CREATE INDEX IF NOT EXISTS idx_enrollments_user ON quiz_enrollments (user_id);
    CREATE INDEX IF NOT EXISTS idx_enrollments_quiz ON quiz_enrollments (quiz_id);
    CREATE INDEX IF NOT EXISTS idx_enrollments_roll ON quiz_enrollments (roll_number);

    -- Triggers for updated_at
    CREATE TRIGGER update_users_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    CREATE TRIGGER update_quizzes_updated_at
        BEFORE UPDATE ON quizzes
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

    -- Clean up old quiz system
    DROP TABLE IF EXISTS quiz_registrations;
    ALTER TABLE notices DROP COLUMN IF EXISTS is_quiz;
