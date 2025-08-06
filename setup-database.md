# Database Setup Instructions

## Step 1: Set up Supabase Database

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Open your project: `rbvlzmstfuftbavjjzrx`
3. Navigate to **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste the entire contents of `supabase-schema.sql` into the editor
6. Click **Run** to execute the SQL

## Step 2: Verify Tables Created

After running the SQL, you should see:
- `conversations` table
- `chat_messages` table
- Indexes for performance
- Row Level Security (RLS) policies

## Step 3: Test the Application

1. Get your Google Gemini API key from: https://aistudio.google.com/
2. Add it to your `.env.local` file:
   ```
   GOOGLE_GEMINI_API_KEY='your-actual-gemini-api-key'
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:3000 in your browser

## Step 4: Auth0 Configuration

Make sure your Auth0 application has these settings:

**Allowed Callback URLs:**
- `http://localhost:3000/api/auth/callback`

**Allowed Logout URLs:**
- `http://localhost:3000`

**Allowed Web Origins:**
- `http://localhost:3000`

## Troubleshooting

If you encounter issues:

1. **Database connection errors**: Check your Supabase credentials in `.env.local`
2. **Auth0 errors**: Verify your Auth0 application settings
3. **Gemini API errors**: Ensure your API key is valid and has proper permissions
4. **Build errors**: Run `npm install` to ensure all dependencies are installed 