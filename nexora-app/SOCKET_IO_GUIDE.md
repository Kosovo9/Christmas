# Socket.IO Server Deployment Guide

## 🎯 Why Separate Socket.IO Server?

Vercel's serverless functions don't support persistent WebSocket connections. For real-time features, we need a dedicated Node.js server.

---

## 🚀 Option 1: Railway (Recommended)

### Why Railway?
- ✅ Easy deployment from GitHub
- ✅ WebSocket support out of the box
- ✅ Free tier ($5 credit/month)
- ✅ Auto-scaling
- ✅ Simple environment variables

### Step-by-Step:

1. **Create Socket.IO Server**

**File:** `socket-server/index.js`
```javascript
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || 'https://nexora-iw4zmodf4-neils-projects-8becf3f7.vercel.app',
        methods: ['GET', 'POST']
    }
});

app.use(cors());

app.get('/health', (req, res) => {
    res.json({ status: 'ok', connections: io.engine.clientsCount });
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Image generation progress
    socket.on('generate:start', (data) => {
        console.log('Generation started:', data);
        socket.emit('generate:progress', { progress: 0 });
    });

    // Broadcast to all users
    socket.on('user:activity', (data) => {
        socket.broadcast.emit('activity:update', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`Socket.IO server running on port ${PORT}`);
});
```

**File:** `socket-server/package.json`
```json
{
  "name": "nexora-socket-server",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "socket.io": "^4.8.1",
    "cors": "^2.8.5"
  }
}
```

2. **Deploy to Railway**

```bash
# Create new directory
mkdir socket-server
cd socket-server

# Initialize git
git init
git add .
git commit -m "Initial commit"

# Push to GitHub
gh repo create nexora-socket-server --public
git push origin main
```

3. **Railway Dashboard**
- Go to: https://railway.app
- Click **New Project**
- Select **Deploy from GitHub repo**
- Choose `nexora-socket-server`
- Add environment variable: `FRONTEND_URL=https://nexora-iw4zmodf4-neils-projects-8becf3f7.vercel.app`
- Deploy!

4. **Get Socket.IO URL**
- Railway will give you a URL like: `https://nexora-socket-server.up.railway.app`
- Add to Vercel env vars: `NEXT_PUBLIC_SOCKET_URL=https://nexora-socket-server.up.railway.app`

---

## 🚀 Option 2: Render

### Step-by-Step:

1. Use same `socket-server` code from above
2. Go to: https://render.com
3. Click **New Web Service**
4. Connect GitHub repo
5. Settings:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node
6. Add env var: `FRONTEND_URL`
7. Deploy!

---

## 🚀 Option 3: Fly.io

```bash
# Install flyctl
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"

# Login
flyctl auth login

# Create app
cd socket-server
flyctl launch

# Deploy
flyctl deploy
```

---

## 🔌 Frontend Integration

### Install Socket.IO Client (Already Installed ✅)

```bash
npm install socket.io-client
```

### Create Socket Hook

**File:** `app/hooks/useSocket.ts`
```typescript
'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export function useSocket() {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
        
        if (!socketUrl) {
            console.warn('Socket URL not configured');
            return;
        }

        const newSocket = io(socketUrl, {
            transports: ['websocket', 'polling']
        });

        newSocket.on('connect', () => {
            console.log('Socket connected');
            setConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log('Socket disconnected');
            setConnected(false);
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);

    return { socket, connected };
}
```

### Use in Component

```typescript
'use client';

import { useSocket } from '@/app/hooks/useSocket';
import { useEffect } from 'react';

export default function ImageGenerator() {
    const { socket, connected } = useSocket();

    useEffect(() => {
        if (!socket) return;

        socket.on('generate:progress', (data) => {
            console.log('Progress:', data.progress);
            // Update UI with progress
        });

        return () => {
            socket.off('generate:progress');
        };
    }, [socket]);

    const handleGenerate = () => {
        if (socket) {
            socket.emit('generate:start', { userId: 'user123' });
        }
    };

    return (
        <div>
            <p>Socket: {connected ? '🟢 Connected' : '🔴 Disconnected'}</p>
            <button onClick={handleGenerate}>Generate Image</button>
        </div>
    );
}
```

---

## 📊 Features You Can Add

1. **Real-time Generation Progress**
   - Show live progress bar during AI image generation
   - Estimated time remaining

2. **User Presence**
   - Show how many users are online
   - Live activity feed

3. **Notifications**
   - Payment confirmations
   - Generation complete alerts

4. **Live Chat** (Optional)
   - Customer support
   - Community chat

---

## 💰 Cost Comparison

| Platform | Free Tier | Paid |
|----------|-----------|------|
| Railway | $5 credit/month | $5/month |
| Render | 750 hours/month | $7/month |
| Fly.io | 3 VMs free | $1.94/month |

**Recommendation:** Start with Railway (easiest setup)

---

## ✅ Deployment Checklist

- [ ] Create `socket-server` directory
- [ ] Add `index.js` and `package.json`
- [ ] Push to GitHub
- [ ] Deploy to Railway/Render/Fly.io
- [ ] Get Socket.IO server URL
- [ ] Add `NEXT_PUBLIC_SOCKET_URL` to Vercel
- [ ] Create `useSocket` hook
- [ ] Test connection
- [ ] Implement real-time features

---

**Status:** ⏳ Ready to deploy when needed

**Priority:** Medium (not critical for MVP, but great for UX)
