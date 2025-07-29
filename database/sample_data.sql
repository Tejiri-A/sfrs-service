-- Sample data for testing (optional)
-- Note: You should run the schema.sql first before running this

-- Insert sample users (these will be created automatically when users sign up)
-- This is just for reference of the structure

-- Sample proposal data for testing
-- You can uncomment and modify these after users are created

/*
-- Sample client user (replace with actual UUID after signup)
INSERT INTO project_proposals (
  title,
  description,
  budget,
  expected_start_date,
  expected_end_date,
  status,
  client_id
) VALUES (
  'E-commerce Website Development',
  'Develop a modern e-commerce website with payment integration, user authentication, and admin dashboard. Should support multiple product categories and have responsive design.',
  25000.00,
  '2025-02-01',
  '2025-05-01',
  'waiting_for_review',
  'client-user-uuid-here'
),
(
  'Mobile App for Food Delivery',
  'Create a cross-platform mobile application for food delivery service. Should include features like GPS tracking, payment integration, and real-time notifications.',
  40000.00,
  '2025-03-01',
  '2025-07-01',
  'waiting_for_review',
  'client-user-uuid-here'
),
(
  'Data Analytics Dashboard',
  'Build a comprehensive data analytics dashboard with interactive charts, real-time data updates, and customizable reporting features.',
  15000.00,
  '2025-02-15',
  '2025-04-15',
  'sent_back_to_client',
  'client-user-uuid-here'
);
*/

-- Create indexes for better performance (if not already created in schema.sql)
-- These are included in schema.sql, but adding here for reference
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_project_proposals_client_status ON project_proposals(client_id, status);
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_project_proposals_created_at ON project_proposals(created_at DESC);
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_proposal_actions_created_at ON proposal_actions(created_at DESC);
