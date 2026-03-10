# Supabase Storage Setup Guide

This guide will help you set up image storage in Supabase for your portfolio website.

## Prerequisites

- Your Supabase project is created
- You have admin access to your Supabase project

## Step 1: Create Storage Bucket in Supabase

1. Go to your Supabase project dashboard
2. Click on **Storage** in the left sidebar
3. Click **Create a new bucket** (or the "+" button)
4. Name the bucket: `portfolio`
5. **Important**: Make sure to toggle **"Public bucket"** ON
6. Click **Create bucket**

## Step 2: Configure Bucket Access (RLS Policies)

After creating the bucket, you need to set up access policies:

1. Click on the `portfolio` bucket you just created
2. Go to the **Policies** tab
3. Click **New Policy** and select **Create a policy from template**

### For Public Read Access:

- Template: `Enable read access for all users`
- Target role: `authenticated` and `anon`
- Click **Review** → **Save**

### For Authenticated Upload:

- Template: `Enable write access for authenticated users only`
- Target role: `authenticated`
- Click **Review** → **Save**

Alternatively, you can create custom policies. See below for examples.

## Step 3: Custom Policy SQL (If Needed)

Go to **Storage** → **Policies** tab and click **SQL** to write custom policies:

### Allow public read access:

```sql
CREATE POLICY "Allow public read"
ON storage.objects
FOR SELECT
USING (bucket_id = 'portfolio');
```

### Allow authenticated upload:

```sql
CREATE POLICY "Allow authenticated upload"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'portfolio'
  AND auth.role() = 'authenticated'
);
```

### Allow authenticated delete:

```sql
CREATE POLICY "Allow authenticated delete"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'portfolio'
  AND auth.role() = 'authenticated'
);
```

## Step 4: Verify Setup

1. Go to your portfolio admin panel
2. Navigate to **Admin → About section**
3. Try uploading a profile photo
4. You should see a success message

## Troubleshooting

### "Failed to upload image" Error

**Possible causes:**

1. **Bucket doesn't exist**
   - Solution: Follow Step 1 above to create the `portfolio` bucket

2. **Bucket is not public**
   - Solution: In Supabase Storage, select the `portfolio` bucket and toggle "Public bucket" ON

3. **Missing storage policies**
   - Solution: Follow Step 2 to configure access policies

4. **Wrong Supabase credentials**
   - Solution: Verify your `.env.local` has correct:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `SUPABASE_SERVICE_ROLE_KEY`

5. **File size too large**
   - Solution: Ensure your image is under 5MB

### Check Browser Console

Open your browser's Developer Tools (F12) and check the Console tab for detailed error messages. They might show:

- `Server configuration error: Missing Supabase credentials`
- `Upload failed: [specific Supabase error]`
- `Failed to generate public URL`

### Check Server Logs

When running `npm run dev`, check the terminal for error messages from the server console logs.

## Environment Variables Required

Make sure your `.env.local` contains:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

The service role key is especially important for server-side uploads. You can find it in:

- Supabase Dashboard → Project Settings → API → Service Role Key

## Testing the Upload

1. Admin panel: `/admin/about`
2. Click on the "Click to upload profile photo" area
3. Select an image file (PNG, JPG, GIF)
4. You should see:
   - File preview appears
   - Success toast message
   - "Uploading..." state shows briefly

## Using Uploaded Images

After successfully uploading:

- The image URL is automatically saved to your database
- It appears on your public `/about` page
- You can replace it anytime by uploading a new image

## More Information

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Supabase RLS Policies](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Storage Best Practices](https://supabase.com/docs/guides/storage/best-practices)
