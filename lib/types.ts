import { ObjectId } from 'mongodb'

export interface User {
  _id?: ObjectId
  email: string
  name: string
  password: string
  createdAt: Date
  updatedAt: Date
}

export interface Post {
  _id?: ObjectId
  title: string
  content: string
  authorId: ObjectId
  authorName: string
  authorEmail: string
  createdAt: Date
  updatedAt: Date
  published: boolean
}

export interface Comment {
  _id?: ObjectId
  postId: ObjectId
  authorId: ObjectId
  authorName: string
  authorEmail: string
  content: string
  createdAt: Date
  updatedAt: Date
}

export interface AuthResponse {
  success: boolean
  message: string
  user?: {
    id: string
    email: string
    name: string
  }
  token?: string
}

export interface ErrorResponse {
  error: string
}
