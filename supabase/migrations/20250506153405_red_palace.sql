/*
  # Fix Profile RLS Policies

  1. Changes
    - Drop and recreate RLS policies for profiles table
    - Ensure no conflicts with existing policies
    - Add proper error handling for existing policies
    
  2. Security
    - Enable RLS on profiles table
    - Add policies for profile creation and updates
    - Add policy for public read access
*/

DO $$ 
BEGIN
  -- Ensure RLS is enabled
  ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

  -- Drop existing policies if they exist
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Public profiles are viewable by everyone'
  ) THEN
    DROP POLICY "Public profiles are viewable by everyone" ON profiles;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can update own profile'
  ) THEN
    DROP POLICY "Users can update own profile" ON profiles;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Allow users to create their own profile'
  ) THEN
    DROP POLICY "Allow users to create their own profile" ON profiles;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Allow users to update their own profile'
  ) THEN
    DROP POLICY "Allow users to update their own profile" ON profiles;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Allow public read access to profiles'
  ) THEN
    DROP POLICY "Allow public read access to profiles" ON profiles;
  END IF;
END $$;

-- Create comprehensive RLS policies
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