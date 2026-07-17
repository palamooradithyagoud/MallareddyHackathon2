-- Insert sample users
INSERT INTO users (id, email, hashed_password, google_id)
VALUES 
('d1111111-1111-1111-1111-111111111111', 'john.doe@example.com', '$2b$12$Kj61g1F3K3r2ZpC7mUXPye1x5QYkU5Jc7lT1g2H3I4J5K6L7M8N9O', NULL),
('d2222222-2222-2222-2222-222222222222', 'alice.smith@example.com', '$2b$12$Kj61g1F3K3r2ZpC7mUXPye1x5QYkU5Jc7lT1g2H3I4J5K6L7M8N9O', NULL)
ON CONFLICT (id) DO NOTHING;

-- Insert profiles
INSERT INTO profiles (
    id, user_id, full_name, phone_number, date_of_birth, gender, location, 
    college, degree, graduation_year, cgpa, skills, experience, certifications, 
    linkedin_url, github_url, portfolio_url, about_me, avatar_url, completion_percentage
)
VALUES (
    'e1111111-1111-1111-1111-111111111111',
    'd1111111-1111-1111-1111-111111111111',
    'John Doe',
    '+1234567890',
    '2000-01-01',
    'Male',
    'New York, USA',
    'State University',
    'Bachelor of Science in Computer Science',
    2022,
    3.85,
    'React,TypeScript,Python,FastAPI,SQL',
    '[{"company": "Tech Corp", "role": "Software Engineer Intern", "duration": "3 months", "description": "Developed React features and API endpoints using FastAPI."}]'::jsonb,
    '[{"name": "AWS Certified Cloud Practitioner", "issuer": "Amazon Web Services", "year": 2023}]'::jsonb,
    'https://linkedin.com/in/johndoe',
    'https://github.com/johndoe',
    'https://johndoe.dev',
    'Passionate full stack developer seeking junior software engineering roles.',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=John',
    85
), (
    'e2222222-2222-2222-2222-222222222222',
    'd2222222-2222-2222-2222-222222222222',
    'Alice Smith',
    '+1987654321',
    '1999-05-15',
    'Female',
    'San Francisco, USA',
    'Tech Institute',
    'Master of Science in Data Science',
    2023,
    3.90,
    'Python,SQL,PyTorch,Data Analytics',
    '[{"company": "Data Insights", "role": "Data Analyst Intern", "duration": "6 months", "description": "Built analytics pipelines and dashboards."}]'::jsonb,
    '[]'::jsonb,
    'https://linkedin.com/in/alicesmith',
    'https://github.com/alicesmith',
    '',
    'Graduate data science student eager to solve real-world problems with data.',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Alice',
    70
)
ON CONFLICT (id) DO NOTHING;

-- Insert career preferences
INSERT INTO career_preferences (
    id, user_id, preferred_role, preferred_industry, preferred_location, 
    employment_type, work_mode, salary_expectation, skills_interested_in
)
VALUES (
    'f1111111-1111-1111-1111-111111111111',
    'd1111111-1111-1111-1111-111111111111',
    'Software Engineer',
    'Technology',
    'New York, NY',
    'Full-time',
    'Hybrid',
    100000,
    '["Go", "Docker", "Kubernetes"]'::jsonb
), (
    'f2222222-2222-2222-2222-222222222222',
    'd2222222-2222-2222-2222-222222222222',
    'Data Scientist',
    'Fintech',
    'San Francisco, CA',
    'Full-time',
    'Remote',
    120000,
    '["Machine Learning", "Big Data", "Spark"]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Insert user settings
INSERT INTO user_settings (
    id, user_id, theme, email_notifications, push_notifications, language, privacy_profile_public
)
VALUES (
    'c1111111-1111-1111-1111-111111111111',
    'd1111111-1111-1111-1111-111111111111',
    'dark',
    true,
    true,
    'en',
    false
), (
    'c2222222-2222-2222-2222-222222222222',
    'd2222222-2222-2222-2222-222222222222',
    'light',
    true,
    false,
    'en',
    true
)
ON CONFLICT (id) DO NOTHING;

-- Insert activity logs
INSERT INTO activity_logs (id, user_id, action, description, ip_address)
VALUES
('a1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'Account Created', 'Successfully registered account via email registration.', '127.0.0.1'),
('a2222222-2222-2222-2222-222222222222', 'd2222222-2222-2222-2222-222222222222', 'Account Created', 'Successfully registered account via email registration.', '127.0.0.1')
ON CONFLICT (id) DO NOTHING;
