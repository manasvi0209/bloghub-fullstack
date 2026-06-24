# BlogHub - Modern Blog Platform

A full-stack blog platform built with Next.js, MongoDB, and modern web technologies. Create, share, and discuss blog posts with built-in authentication and commenting system.

## Features

- **User Authentication**: Secure signup/login with JWT tokens
- **Blog Posts**: Create, edit, delete, and publish blog posts
- **Comments**: Add comments to posts with nested reply support
- **User Dashboard**: Manage your posts from a dedicated dashboard
- **Post Pagination**: Browse posts with easy navigation
- **View Tracking**: See how many times each post has been viewed
- **Responsive Design**: Works seamlessly on desktop and mobile

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with httpOnly cookies, bcryptjs
- **Validation**: Zod
- **UI Components**: shadcn/ui
- **Notifications**: react-hot-toast

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- pnpm (or npm/yarn)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd bloghub
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.local.example .env.local
```

Add your values:
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Run `openssl rand -base64 32` to generate
- `NEXT_PUBLIC_API_URL`: `http://localhost:3000` for local development

4. **Start the development server**
```bash
pnpm dev
```

Visit `http://localhost:3000` to see your app.

## Project Structure

```
bloghub/
├── app/
│   ├── api/                 # API routes (auth, posts, comments)
│   ├── auth/                # Authentication pages
│   ├── dashboard/           # User dashboard
│   ├── posts/               # Post detail page
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── components/              # React components
├── hooks/                   # Custom React hooks
├── lib/                     # Utilities and helpers
├── models/                  # Mongoose schemas
├── types/                   # TypeScript types
├── DEPLOYMENT.md            # Deployment guide
└── README.md               # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Posts
- `GET /api/posts` - List posts (paginated)
- `POST /api/posts` - Create post
- `GET /api/posts/[id]` - Get single post
- `PUT /api/posts/[id]` - Update post
- `DELETE /api/posts/[id]` - Delete post

### Comments
- `GET /api/posts/[id]/comments` - Get comments
- `POST /api/posts/[id]/comments` - Create comment
- `PUT /api/comments/[id]` - Update comment
- `DELETE /api/comments/[id]` - Delete comment

## Usage

### Create an Account
1. Visit the home page
2. Click "Get Started"
3. Fill in email, username, and password
4. Click "Create Account"

### Create a Blog Post
1. Go to Dashboard
2. Click "Create New Post"
3. Add title and content (supports plain text)
4. Click "Create Post"

### Comment on Posts
1. Visit any post
2. Scroll to comments section
3. Sign in if not already
4. Add your comment
5. Click "Post Comment"

## Development

### Running Tests
```bash
pnpm test
```

### Building for Production
```bash
pnpm build
```

### Linting
```bash
pnpm lint
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to Vercel.

## Database Setup

The application uses MongoDB. Ensure your MongoDB Atlas cluster is properly configured with:
- A database named `blog`
- IP whitelist includes your deployment server
- Connection user has read/write permissions

## Security Considerations

- Passwords are hashed with bcryptjs
- Authentication uses JWT in httpOnly cookies
- All user inputs are validated with Zod
- API routes check user ownership before modifications
- CORS is properly configured

## Performance

- Server-side rendering for better SEO
- Optimized images and assets
- Pagination for better load times
- Database indexes on frequently queried fields

## Contributing

Contributions are welcome! Please feel free to submit pull requests.

## License

This project is open source and available under the MIT License.

## Support

For issues and questions, please open an GitHub issue.

---

Built with ❤️ using Next.js and MongoDB
