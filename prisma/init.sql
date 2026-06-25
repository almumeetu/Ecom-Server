-- Database initialization script for NeoComerz
-- This script runs when the PostgreSQL container starts for the first time

-- Create additional extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON DATABASE neocomerz TO postgres;
