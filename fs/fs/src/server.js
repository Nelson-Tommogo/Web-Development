// server.js
import http from 'http';
import { MongoClient } from 'mongodb';

// MongoDB connection URL from .env or default
const MONGO_URL = process.env.MONGO_URL || "mongodb+srv://2004172:evd68rqhIujleLIo@web.6dk0btn.mongodb.net/?retryWrites=true&w=majority&appName=web";

let client;
let db;

// Connect to MongoDB
async function connectMongoDB() {
  try {
    client = new MongoClient(MONGO_URL);
    await client.connect();
    db = client.db();
    console.log('✅ MongoDB Connected successfully');
    return true;
  } catch (error) {
    console.log('❌ MongoDB Connection failed:', error.message);
    return false;
  }
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    if (req.url === '/' && req.method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({ 
        message: '🚀 Server is running',
        status: 'OK',
        endpoints: {
          root: 'GET /',
          test: 'GET /test',
          mongo: 'GET /mongo-test'
        }
      }));
    } 
    else if (req.url === '/test' && req.method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({ 
        message: 'Test endpoint working',
        data: { 
          timestamp: new Date().toISOString(),
          server: 'Node.js HTTP Server'
        }
      }));
    }
    else if (req.url === '/mongo-test' && req.method === 'GET') {
      const isConnected = await connectMongoDB();
      
      if (isConnected) {
        // Test MongoDB by listing collections
        const collections = await db.listCollections().toArray();
        
        res.writeHead(200);
        res.end(JSON.stringify({ 
          success: true,
          message: '✅ MongoDB connection test successful!',
          database: db.databaseName,
          collections: collections.map(col => col.name),
          totalCollections: collections.length
        }));
      } else {
        res.writeHead(500);
        res.end(JSON.stringify({ 
          success: false,
          message: '❌ MongoDB connection failed',
          error: 'Could not connect to MongoDB'
        }));
      }
    }
    else {
      res.writeHead(404);
      res.end(JSON.stringify({ 
        error: 'Route not found',
        path: req.url,
        method: req.method
      }));
    }
  } catch (error) {
    console.error('Server error:', error);
    res.writeHead(500);
    res.end(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message
    }));
  }
});

const PORT = process.env.PORT || 5500;

// Start server
server.listen(PORT, () => {
  console.log(`🌐 Server running on http://localhost:${PORT}`);
  console.log(`✅ Test endpoints:`);
  console.log(`   - GET http://localhost:${PORT}/`);
  console.log(`   - GET http://localhost:${PORT}/test`);
  console.log(`   - GET http://localhost:${PORT}/mongo-test`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  if (client) {
    await client.close();
    console.log('✅ MongoDB connection closed');
  }
  server.close(() => {
    console.log('✅ Server stopped');
    process.exit(0);
  });
});