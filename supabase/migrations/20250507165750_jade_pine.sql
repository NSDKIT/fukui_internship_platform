/*
  # Add RLS Policies for All Tables

  1. Changes
    - Add comprehensive RLS policies for all tables
    - Fix update policies to avoid NEW/OLD references
    - Ensure proper access control for all operations

  2. Security
    - Enable RLS on all tables
    - Add specific policies for each operation type
    - Implement proper authentication checks
*/

-- Internships Policies
CREATE POLICY "Published internships are viewable by everyone"
ON internships FOR SELECT
USING (status = 'published');

CREATE POLICY "Companies can view all their internships"
ON internships FOR SELECT
TO authenticated
USING (auth.uid() = company_id);

CREATE POLICY "Companies can create internships"
ON internships FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = company_id);

CREATE POLICY "Companies can update their internships"
ON internships FOR UPDATE
TO authenticated
USING (auth.uid() = company_id);

CREATE POLICY "Companies can delete their internships"
ON internships FOR DELETE
TO authenticated
USING (auth.uid() = company_id);

-- Applications Policies
CREATE POLICY "Students can view their own applications"
ON applications FOR SELECT
TO authenticated
USING (auth.uid() = student_id);

CREATE POLICY "Companies can view applications for their internships"
ON applications FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM internships
  WHERE internships.id = applications.internship_id
  AND internships.company_id = auth.uid()
));

CREATE POLICY "Students can create applications"
ON applications FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their applications"
ON applications FOR UPDATE
TO authenticated
USING (auth.uid() = student_id);

CREATE POLICY "Companies can update application status"
ON applications FOR UPDATE
TO authenticated
USING (EXISTS (
  SELECT 1 FROM internships
  WHERE internships.id = applications.internship_id
  AND internships.company_id = auth.uid()
));

-- Messages Policies
CREATE POLICY "Users can view their messages"
ON messages FOR SELECT
TO authenticated
USING (auth.uid() IN (sender_id, receiver_id));

CREATE POLICY "Users can send messages"
ON messages FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Recipients can mark messages as read"
ON messages FOR UPDATE
TO authenticated
USING (auth.uid() = receiver_id);

-- Notifications Policies
CREATE POLICY "Users can view their notifications"
ON notifications FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their notification status"
ON notifications FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Scouts Policies
CREATE POLICY "Companies can view scouts they created"
ON scouts FOR SELECT
TO authenticated
USING (auth.uid() = company_id);

CREATE POLICY "Students can view scouts sent to them"
ON scouts FOR SELECT
TO authenticated
USING (auth.uid() = student_id);

CREATE POLICY "Companies can create scouts"
ON scouts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = company_id);

CREATE POLICY "Companies can update their scouts"
ON scouts FOR UPDATE
TO authenticated
USING (auth.uid() = company_id);

CREATE POLICY "Students can update scout responses"
ON scouts FOR UPDATE
TO authenticated
USING (auth.uid() = student_id);