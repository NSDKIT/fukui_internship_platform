/*
  # Initial Schema for Internship Matching Platform

  1. New Tables
    - `profiles`
      - Student and company profiles with shared and type-specific fields
      - Uses Supabase auth.users for authentication
    - `internships`
      - Internship listings created by companies
    - `applications`
      - Student applications for internships
    - `messages`
      - Direct messages between students and companies
    - `notifications`
      - System notifications for users
    - `scouts`
      - Company scouts/invitations to students

  2. Security
    - Enable RLS on all tables
    - Add policies for appropriate access control
    - Secure user data and communications
*/

-- Profiles table for both students and companies
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text NOT NULL,
  name text NOT NULL,
  user_type text NOT NULL CHECK (user_type IN ('student', 'company')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Shared fields
  location text,
  bio text,
  avatar_url text,
  website_url text,
  
  -- Student-specific fields
  university text,
  major text,
  graduation_year integer,
  skills text[],
  resume_url text,
  preferred_industries text[],
  preferred_locations text[],
  
  -- Company-specific fields
  company_name text,
  industry text,
  company_size text
);

-- Internships table
CREATE TABLE IF NOT EXISTS internships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES profiles(id),
  title text NOT NULL,
  description text NOT NULL,
  requirements text[] NOT NULL,
  responsibilities text[] NOT NULL,
  location text NOT NULL,
  is_remote boolean DEFAULT false,
  salary_amount integer NOT NULL,
  salary_period text NOT NULL CHECK (salary_period IN ('hourly', 'monthly')),
  start_date date NOT NULL,
  end_date date NOT NULL,
  hours_per_week integer NOT NULL,
  application_deadline date NOT NULL,
  industry text NOT NULL,
  skills text[] NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'closed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  internship_id uuid NOT NULL REFERENCES internships(id),
  student_id uuid NOT NULL REFERENCES profiles(id),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'interview', 'accepted', 'rejected')),
  cover_letter text,
  applied_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT unique_application UNIQUE (internship_id, student_id)
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES profiles(id),
  receiver_id uuid NOT NULL REFERENCES profiles(id),
  content text NOT NULL,
  is_read boolean DEFAULT false,
  related_to_type text CHECK (related_to_type IN ('internship', 'application', 'scout')),
  related_to_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
  related_to_type text CHECK (related_to_type IN ('internship', 'application', 'scout', 'message')),
  related_to_id uuid,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Scouts table
CREATE TABLE IF NOT EXISTS scouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES profiles(id),
  student_id uuid NOT NULL REFERENCES profiles(id),
  internship_id uuid REFERENCES internships(id),
  message text NOT NULL,
  status text NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'read', 'responded', 'accepted', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE scouts ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Allow users to create their own profile"
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow users to update their own profile"
ON profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow public read access to profiles"
ON profiles
FOR SELECT
TO public
USING (true);

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_internships_updated_at
  BEFORE UPDATE ON internships
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scouts_updated_at
  BEFORE UPDATE ON scouts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();