import mongoose from 'mongoose';
import { User } from '@/types';

const userSchema = new mongoose.Schema<User>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 30,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: 'users' }
);

// Create index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

export default mongoose.models.User || mongoose.model<User>('User', userSchema);
