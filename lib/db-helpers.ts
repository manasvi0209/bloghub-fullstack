import User from '@/models/User';
import Post from '@/models/Post';
import Comment from '@/models/Comment';
import { connectDB } from './db';

// Helper to generate URL-friendly slug
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// Ensure unique slug by appending timestamp if needed
export async function getUniqueSlug(title: string, excludeId?: string): Promise<string> {
  await connectDB();
  let slug = generateSlug(title);
  let counter = 1;
  let finalSlug = slug;

  while (true) {
    const existingPost = await Post.findOne({
      slug: finalSlug,
      ...(excludeId && { _id: { $ne: excludeId } }),
    });

    if (!existingPost) {
      break;
    }

    finalSlug = `${slug}-${counter}`;
    counter++;
  }

  return finalSlug;
}

// User helpers
export async function getUserByEmail(email: string) {
  await connectDB();
  return User.findOne({ email: email.toLowerCase() });
}

export async function getUserById(id: string) {
  await connectDB();
  return User.findById(id);
}

// Post helpers
export async function getPostBySlug(slug: string) {
  await connectDB();
  return Post.findOne({ slug }).populate('authorId', 'username email');
}

export async function getPostById(id: string) {
  await connectDB();
  return Post.findById(id).populate('authorId', 'username email');
}

export async function getPostsByAuthor(authorId: string, limit: number = 10, skip: number = 0) {
  await connectDB();
  return Post.find({ authorId })
    .populate('authorId', 'username email')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
}

export async function getAllPosts(limit: number = 10, skip: number = 0) {
  await connectDB();
  return Post.find()
    .populate('authorId', 'username email')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
}

export async function getTotalPostCount() {
  await connectDB();
  return Post.countDocuments();
}

// Comment helpers
export async function getCommentsByPostId(postId: string) {
  await connectDB();
  return Comment.find({ postId })
    .populate('authorId', 'username email')
    .populate('parentCommentId')
    .sort({ createdAt: -1 });
}

export async function getCommentById(id: string) {
  await connectDB();
  return Comment.findById(id).populate('authorId', 'username email');
}

export async function getCommentsByAuthorId(authorId: string) {
  await connectDB();
  return Comment.find({ authorId })
    .populate('postId', 'title slug')
    .sort({ createdAt: -1 });
}
