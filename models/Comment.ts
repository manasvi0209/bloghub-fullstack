import mongoose from 'mongoose';
import { Comment } from '@/types';

const commentSchema = new mongoose.Schema<Comment>(
  {
    content: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 1000,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: 'comments' }
);

// Create indexes for faster queries
commentSchema.index({ postId: 1, createdAt: -1 });
commentSchema.index({ authorId: 1 });
commentSchema.index({ parentCommentId: 1 });

export default mongoose.models.Comment || mongoose.model<Comment>('Comment', commentSchema);
