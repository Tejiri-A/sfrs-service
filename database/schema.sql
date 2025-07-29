-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) CHECK (role IN ('client', 'reviewer', 'approver')) NOT NULL DEFAULT 'client',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create project_proposals table
CREATE TABLE project_proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  budget DECIMAL(12, 2) NOT NULL,
  expected_start_date DATE NOT NULL,
  expected_end_date DATE NOT NULL,
  status VARCHAR(30) CHECK (status IN ('draft', 'waiting_for_review', 'sent_back_to_client', 'waiting_for_approval', 'approved', 'rejected')) NOT NULL DEFAULT 'draft',
  client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  approver_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create proposal_actions table for audit trail
CREATE TABLE proposal_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID NOT NULL REFERENCES project_proposals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action_type VARCHAR(20) CHECK (action_type IN ('submitted', 'sent_back', 'forwarded', 'approved', 'rejected', 'edited')) NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_project_proposals_client_id ON project_proposals(client_id);
CREATE INDEX idx_project_proposals_status ON project_proposals(status);
CREATE INDEX idx_project_proposals_reviewer_id ON project_proposals(reviewer_id);
CREATE INDEX idx_project_proposals_approver_id ON project_proposals(approver_id);
CREATE INDEX idx_proposal_actions_proposal_id ON proposal_actions(proposal_id);
CREATE INDEX idx_proposal_actions_user_id ON proposal_actions(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to auto-update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_proposals_updated_at BEFORE UPDATE ON project_proposals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create a function to handle user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Unknown'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'client')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- I haven't figured out how to get these RLS policies working yet

-- -- Enable Row Level Security
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE project_proposals ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE proposal_actions ENABLE ROW LEVEL SECURITY;

-- -- RLS Policies

-- -- Users can view their own profile
-- CREATE POLICY "Users can view own profile" ON users
--   FOR SELECT USING (auth.uid() = id);

-- -- Users can update their own profile (except role)
-- CREATE POLICY "Users can update own profile" ON users
--   FOR UPDATE USING (auth.uid() = id);

-- -- Project proposals policies
-- -- Clients can view their own proposals
-- CREATE POLICY "Clients can view own proposals" ON project_proposals
--   FOR SELECT USING (
--     client_id = auth.uid() OR
--     EXISTS (
--       SELECT 1 FROM users 
--       WHERE id = auth.uid() AND role IN ('reviewer', 'approver')
--     )
--   );

-- -- Clients can create proposals
-- CREATE POLICY "Clients can create proposals" ON project_proposals
--   FOR INSERT WITH CHECK (
--     client_id = auth.uid() AND
--     EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'client')
--   );

-- -- Clients can update their own proposals when status allows
-- CREATE POLICY "Clients can update own proposals" ON project_proposals
--   FOR UPDATE USING (
--     client_id = auth.uid() AND
--     status IN ('draft', 'sent_back_to_client') AND
--     EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'client')
--   );

-- -- Reviewers and approvers can update proposals
-- CREATE POLICY "Reviewers and approvers can update proposals" ON project_proposals
--   FOR UPDATE USING (
--     EXISTS (
--       SELECT 1 FROM users 
--       WHERE id = auth.uid() AND role IN ('reviewer', 'approver')
--     )
--   );

-- -- Proposal actions policies
-- -- Users can view actions for proposals they have access to
-- CREATE POLICY "Users can view proposal actions" ON proposal_actions
--   FOR SELECT USING (
--     EXISTS (
--       SELECT 1 FROM project_proposals p
--       WHERE p.id = proposal_id AND (
--         p.client_id = auth.uid() OR
--         EXISTS (
--           SELECT 1 FROM users 
--           WHERE id = auth.uid() AND role IN ('reviewer', 'approver')
--         )
--       )
--     )
--   );

-- -- Users can create actions
-- CREATE POLICY "Users can create proposal actions" ON proposal_actions
--   FOR INSERT WITH CHECK (user_id = auth.uid());
