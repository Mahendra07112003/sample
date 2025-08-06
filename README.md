# MiniGPT - Mobile ChatGPT Clone

A mobile-first ChatGPT clone built with Next.js, tRPC, Bootstrap UI, Supabase, Auth0, and Google Gemini API.

## Features

- 📱 **Mobile-First Design** - Optimized for mobile devices
- 🔐 **Authentication** - Secure login with Auth0
- 💬 **Real-time Chat** - Powered by Google Gemini AI
- 🎨 **Image Generation** - Generate images with AI
- 💾 **Persistence** - Store conversations in Supabase
- ⚡ **Type Safety** - Full TypeScript with tRPC
- 🎨 **Modern UI** - Bootstrap components with custom styling

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Bootstrap
- **Backend**: tRPC, Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Auth0
- **AI**: Google Gemini API
- **Styling**: Bootstrap + Custom CSS

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Auth0 account
- Google AI Studio account

## Setup Instructions

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd minigpt
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Auth0 Configuration
AUTH0_SECRET='your-auth0-secret-here'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://your-domain.auth0.com'
AUTH0_CLIENT_ID='your-auth0-client-id'
AUTH0_CLIENT_SECRET='your-auth0-client-secret'

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL='your-supabase-project-url'
NEXT_PUBLIC_SUPABASE_ANON_KEY='your-supabase-anon-key'
SUPABASE_SERVICE_ROLE_KEY='your-supabase-service-role-key'

# Google Gemini API
GOOGLE_GEMINI_API_KEY='your-gemini-api-key'

# App Configuration
NEXTAUTH_URL='http://localhost:3000'
NEXTAUTH_SECRET='your-nextauth-secret'
```

### 3. Database Setup

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Run the contents of `supabase-schema.sql`

### 4. Auth0 Configuration

1. Create a new application in Auth0
2. Set application type to "Single Page Application"
3. Add callback URLs: `http://localhost:3000/api/auth/callback`
4. Add logout URLs: `http://localhost:3000`
5. Copy the credentials to your `.env.local`

### 5. Google Gemini API

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create an API key
3. Add it to your `.env.local`

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Render

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set start command: `npm start`
4. Add environment variables
5. Deploy!

## Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API routes
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── Chat.tsx        # Main chat interface
│   └── UserMenu.tsx    # User menu component
└── lib/               # Utility libraries
    ├── auth0.ts       # Auth0 configuration
    ├── gemini.ts      # Google Gemini API
    ├── supabase.ts    # Supabase client
    └── trpc.ts        # tRPC configuration
```

## API Routes

- `/api/auth/*` - Auth0 authentication
- `/api/chat` - Chat message processing
- `/api/trpc/*` - tRPC API endpoints

## Database Schema

### Conversations Table
- `id` - UUID primary key
- `user_id` - User identifier
- `title` - Conversation title
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Chat Messages Table
- `id` - UUID primary key
- `user_id` - User identifier
- `conversation_id` - Foreign key to conversations
- `content` - Message content
- `role` - 'user' or 'assistant'
- `created_at` - Creation timestamp

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, please open an issue on GitHub or contact the maintainers.
