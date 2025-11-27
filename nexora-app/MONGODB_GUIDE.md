# MongoDB Atlas Integration Guide

## 📌 Your MongoDB Credentials

Based on the screenshot you provided:

- **Username:** `nexorawolf_db_user`
- **Password:** `5OIEiJzDHDIt9YEjT`
- **IP Address:** `200.92.177.164` (already whitelisted)

---

## 🤔 Do You Need MongoDB?

You currently have **Supabase (PostgreSQL)** configured and working. Here's when you'd want MongoDB:

### Use Supabase (Current Setup) ✅
- Relational data (users, transactions, credits)
- SQL queries
- Row Level Security
- Built-in auth integration
- **Recommended for this project**

### Use MongoDB
- Document-based storage
- Flexible schemas
- Large unstructured data
- High write throughput

### Use Both (Hybrid)
- Supabase for structured data (payments, users)
- MongoDB for logs, analytics, or large JSON documents

---

## 🚀 If You Want to Add MongoDB

### Step 1: Get Connection String

1. In MongoDB Atlas, click **Connect**
2. Choose **Connect your application**
3. Copy the connection string:
```
mongodb+srv://nexorawolf_db_user:5OIEiJzDHDIt9YEjT@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Step 2: Install MongoDB Driver

```bash
npm install mongodb mongoose
```

### Step 3: Create MongoDB Client

**File:** `utils/mongodb/client.ts`
```typescript
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
    throw new Error('Please add your MongoDB URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
    let globalWithMongo = global as typeof globalThis & {
        _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
        client = new MongoClient(uri, options);
        globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
} else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

export default clientPromise;
```

### Step 4: Add to Environment Variables

```bash
MONGODB_URI=mongodb+srv://nexorawolf_db_user:5OIEiJzDHDIt9YEjT@cluster0.xxxxx.mongodb.net/nexora?retryWrites=true&w=majority
```

### Step 5: Example Usage

```typescript
import clientPromise from '@/utils/mongodb/client';

export async function POST(request: Request) {
    const client = await clientPromise;
    const db = client.db('nexora');
    
    // Insert document
    await db.collection('logs').insertOne({
        timestamp: new Date(),
        action: 'user_login',
        userId: 'user123'
    });
    
    return Response.json({ success: true });
}
```

---

## 💡 Recommendation

**For Nexora App, stick with Supabase only.** 

Adding MongoDB would be overkill unless you have specific needs like:
- Real-time analytics logs
- Large-scale event tracking
- Flexible document storage

Your current Supabase setup handles everything you need:
- ✅ User credits
- ✅ Transactions
- ✅ Newsletter subscribers
- ✅ Generated images
- ✅ Affiliate tracking

---

## ❓ When to Revisit MongoDB

Consider MongoDB later if you need:
1. **Analytics Dashboard** - Store millions of events
2. **User Activity Logs** - Track every click/action
3. **A/B Testing Data** - Flexible experiment schemas
4. **Real-time Metrics** - High-frequency writes

---

**Current Status:** MongoDB credentials saved, but **not needed** for current implementation.

**Recommendation:** ✅ Continue with Supabase only
