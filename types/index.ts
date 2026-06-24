import { ObjectId } from 'mongoose';

export interface User {
  _id?: ObjectId;
  email: string;
  username: string;
  passwordHash: string;
  createdAt: Date;
}

export interface Post {
  _id?: ObjectId;
  title: string;
  slug: string;
  content: string;
  authorId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  viewCount: number;
}

export interface Comment {
  _id?: ObjectId;
  content: string;
  authorId: ObjectId;
  postId: ObjectId;
  parentCommentId?: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface JWTPayload {
  userId: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    _id: string;
    email: string;
    username: string;
  };
  token?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}
