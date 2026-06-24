# BlogHub Deployment Guide

## Prerequisites

Before deploying, ensure you have:
- MongoDB Atlas account
- Vercel account
- GitHub repository

## Environment Variables Setup

### 1. MongoDB Atlas
- Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Create a free cluster
- Create a database user
- Whitelist your IP (or 0.0.0.0 for Vercel)
- Get your connection string

### 2. Generate JWT Secret
```bash
openssl rand -base64 32
```

### 3. Add to Vercel Environment Variables

In your Vercel project settings, add:

- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: The generated secret from step 2
- `NEXT_PUBLIC_API_URL`: `https://yourdomain.vercel.app` (production) or keep as `http://localhost:3000` for development

## Local Development

```bash
# Install dependencies
pnpm install

# Copy .env.local and update with your values
cp .env.local.example .env.local

# Start dev server
pnpm dev

# Visit http://localhost:3000
```

## Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Deploy BlogHub"
git push origin main
```

### 2. Deploy to Vercel
- Connect your GitHub repository to Vercel
- Set environment variables in Vercel project settings
- Deploy automatically on push to main

### 3. Verify Deployment
- Check MongoDB connection
- Test signup/login flow
- Create a test post
- Add a comment

## Production Checklist

- [ ] MongoDB Atlas cluster is secure (whitelist IPs)
- [ ] JWT_SECRET is strong and unique
- [ ] NEXT_PUBLIC_API_URL points to production domain
- [ ] Database backups are configured
- [ ] Error logging is set up
- [ ] HTTPS is enabled
- [ ] Rate limiting is considered

## Troubleshooting

### Database Connection Failed
- Verify MONGODB_URI format
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

### Authentication Issues
- Clear browser cookies
- Check JWT_SECRET is set
- Verify auth middleware in API routes

### CORS Errors
- Ensure NEXT_PUBLIC_API_URL is correct
- Check credentials in fetch requests

## Architecture Notes

- **Frontend**: Server-side rendered with Next.js 16
- **Backend**: API routes with MongoDB/Mongoose
- **Auth**: JWT tokens in httpOnly cookies
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Zod schemas for input validation

## Database Schema

### Users
- `_id`: ObjectId
- `email`: string (unique, lowercase)
- `username`: string (unique)
- `passwordHash`: string (bcryptjs)
- `createdAt`: Date
- `updatedAt`: Date

### Posts
- `_id`: ObjectId
- `title`: string
- `slug`: string (unique)
- `content`: string
- `authorId`: ObjectId (ref: User)
- `viewCount`: number (default: 0)
- `createdAt`: Date
- `updatedAt`: Date

### Comments
- `_id`: ObjectId
- `content`: string
- `authorId`: ObjectId (ref: User)
- `postId`: ObjectId (ref: Post)
- `parentCommentId`: ObjectId (optional, ref: Comment)
- `createdAt`: Date
- `updatedAt`: Date
