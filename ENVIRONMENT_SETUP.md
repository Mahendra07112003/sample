# Environment Variables Setup

Create a `.env.local` file in the root directory with the following variables:

## 1. Auth0 Configuration (Authentication)
```env
AUTH0_SECRET='your-auth0-secret-here'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://your-domain.auth0.com'
AUTH0_CLIENT_ID='your-auth0-client-id'
AUTH0_CLIENT_SECRET='your-auth0-client-secret'
```

**How to get Auth0 credentials:**
1. Go to [Auth0 Dashboard](https://manage.auth0.com/)
2. Create a new application (Single Page Application)
3. Go to Settings tab
4. Copy the Domain, Client ID, and Client Secret
5. Add `http://localhost:3000/api/auth/callback` to Allowed Callback URLs
6. Add `http://localhost:3000` to Allowed Logout URLs

## 2. Supabase Configuration (Database)
```env
NEXT_PUBLIC_SUPABASE_URL='your-supabase-project-url'
NEXT_PUBLIC_SUPABASE_ANON_KEY='your-supabase-anon-key'
SUPABASE_SERVICE_ROLE_KEY='your-supabase-service-role-key'
```

**How to get Supabase credentials:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Go to Settings > API
4. Copy the Project URL, anon/public key, and service_role key

## 3. Google Gemini API (LLM)
```env
GOOGLE_GEMINI_API_KEY='your-gemini-api-key'
```

**How to get Gemini API key:**
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Click "Get API key"
3. Create a new API key
4. Copy the API key

## 4. App Configuration
```env
NEXTAUTH_URL='http://localhost:3000'
NEXTAUTH_SECRET='your-nextauth-secret'
```

**For NEXTAUTH_SECRET:**
- Generate a random string: `openssl rand -base64 32`
- Or use any secure random string

## Complete .env.local Example:
```env
# Auth0 Configuration
AUTH0_SECRET='your-auth0-secret-here'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://your-domain.auth0.com'
AUTH0_CLIENT_ID='your-auth0-client-id'
AUTH0_CLIENT_SECRET='your-auth0-client-secret'

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL='https://your-project.supabase.co'
NEXT_PUBLIC_SUPABASE_ANON_KEY='your-supabase-anon-key'
SUPABASE_SERVICE_ROLE_KEY='your-supabase-service-role-key'

# Google Gemini API
GOOGLE_GEMINI_API_KEY='your-gemini-api-key'

# App Configuration
NEXTAUTH_URL='http://localhost:3000'
NEXTAUTH_SECRET='your-nextauth-secret'
```

## Important Notes:
- Never commit your `.env.local` file to version control
- For production deployment, set these variables in your hosting platform (Vercel/Render)
- The `NEXT_PUBLIC_` prefix makes variables available on the client side
- Keep your service role keys secure and never expose them to the client 