-- Board of Trustees table
CREATE TABLE IF NOT EXISTS board_trustees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    designation VARCHAR(255) NOT NULL,
    bio TEXT,
    image_url TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_board_trustees_active ON board_trustees (is_active, sort_order);

DROP TRIGGER IF EXISTS update_board_trustees_updated_at ON board_trustees;
CREATE TRIGGER update_board_trustees_updated_at
    BEFORE UPDATE ON board_trustees
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
