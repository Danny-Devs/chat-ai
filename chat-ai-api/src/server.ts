import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { StreamChat } from 'stream-chat';
import { v4 as uuidv4 } from 'uuid';
import { OpenAI } from 'openai';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies

// Initialize Stream Chat
const chatClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY!,
  process.env.STREAM_API_SECRET!
);

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Routes
// Register user with Stream Chat
app.post(
  '/register-user',
  async (req: Request, res: Response): Promise<any> => {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    try {
      const userId = uuidv4();

      // Check if user already exists
      const userResponse = await chatClient.queryUsers({
        id: { $eq: userId }
      });
      if (!userResponse.users.length) {
        // Add new user to stream chat
        await chatClient.upsertUser({
          id: userId,
          name,
          email,
          role: 'user'
        });
      }
      res.status(200).json({ userId, name, email });
    } catch (error) {
      res.status(500).json({ error: 'Failed to register user' });
    }
  }
);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
