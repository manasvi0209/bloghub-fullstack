import mongoose from 'mongoose';
import { Post } from '@/types';

const postSchema = new mongoose.Schema<Post>(
  {
    title: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 200,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: true,
      minlength: 10,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  { collection: 'posts' }
);

// Create indexes for faster queries
postSchema.index({ slug: 1 });
postSchema.index({ authorId: 1 });
postSchema.index({ createdAt: -1 });

export default mongoose.models.Post || mongoose.model<Post>('Post', postSchema);
