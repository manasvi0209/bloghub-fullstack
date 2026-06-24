import { MongoClient, Db } from 'mongodb'

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

const mongoUri = process.env.MONGODB_URI
if (!mongoUri) {
  throw new Error('Please define MONGODB_URI in your .env.local')
}

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const client = new MongoClient(mongoUri)
  await client.connect()

  const db = client.db('blog-platform')

  // Create collections if they don't exist
  const collections = await db.listCollections().toArray()
  const collectionNames = collections.map((c) => c.name)

  if (!collectionNames.includes('users')) {
    await db.createCollection('users')
    await db
      .collection('users')
      .createIndex({ email: 1 }, { unique: true })
  }

  if (!collectionNames.includes('posts')) {
    await db.createCollection('posts')
    await db
      .collection('posts')
      .createIndex({ authorId: 1, createdAt: -1 })
  }

  if (!collectionNames.includes('comments')) {
    await db.createCollection('comments')
    await db
      .collection('comments')
      .createIndex({ postId: 1, createdAt: -1 })
    await db
      .collection('comments')
      .createIndex({ authorId: 1, createdAt: -1 })
  }

  cachedClient = client
  cachedDb = db

  return { client, db }
}

export async function disconnectFromDatabase() {
  if (cachedClient) {
    await cachedClient.close()
    cachedClient = null
    cachedDb = null
  }
}
