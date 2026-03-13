-- Migration: Make date_obtained nullable and add date_from/date_to columns
-- Run this in your Supabase SQL editor to update existing databases

-- Step 1: Add date_from and date_to columns if they don't exist
ALTER TABLE certificates
ADD COLUMN IF NOT EXISTS date_from DATE,
ADD COLUMN IF NOT EXISTS date_to DATE;

-- Step 2: Drop NOT NULL constraint on date_obtained to make it optional
ALTER TABLE certificates
ALTER COLUMN date_obtained DROP NOT NULL;

-- Verify the fix
SELECT id, title, date_obtained, date_from, date_to 
FROM certificates 
LIMIT 10;
