import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { StreamChat } from 'stream-chat';
import { v4 as uuidv4 } from 'uuid';
import { OpenAI } from 'openai';
import { db } from './config/database.js';
import { chats, users } from './db/schema.js';
import { eq } from 'drizzle-orm';

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
  apiKey: process.env.OPENAI_API_KEY
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
      // First check if user with this email already exists in database
      const existingUserByEmail = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

      // If user exists, return their data
      if (existingUserByEmail.length > 0) {
        const user = existingUserByEmail[0];
        // TODO: Add isExistingUser flag to reponse for optimizing chat history retrieval
        return res.status(200).json({
          userId: user.userId,
          name: user.name,
          email: user.email
        });
      }

      // If no existing user, create a new one
      const userId = uuidv4();

      // Add new user to stream chat
      await chatClient.upsertUser({
        id: userId,
        name,
        email,
        role: 'user'
      });

      // Add to database
      await db.insert(users).values({
        userId,
        name,
        email
      });

      res.status(200).json({ userId, name, email });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Failed to register user' });
    }
  }
);

// Send message to OpenAI
app.post('/chat', async (req: Request, res: Response): Promise<any> => {
  const { message, userId } = req.body;

  if (!message || !userId) {
    return res.status(400).json({ error: 'Message and userId are required.' });
  }

  try {
    // verify user exists
    const userResponse = await chatClient.queryUsers({
      id: { $eq: userId }
    });
    if (!userResponse.users.length) {
      return res
        .status(404)
        .json({ error: 'User does not exist. Please register.' });
    }

    // check user in database
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.userId, userId));
    if (!existingUser.length) {
      return res
        .status(404)
        .json({ error: 'User not found in database. Please register.' });
    }

    // send message to OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant that can answer questions and help with tasks.'
        },
        {
          role: 'user',
          content: message
        }
      ]
    });
    const aiMessage: string =
      response.choices[0].message?.content ?? 'No response from chatGPT';

    // save message to database
    await db.insert(chats).values({
      userId,
      message,
      reply: aiMessage
    });

    // Create or get channel and send message to Stream Chat
    const channel = chatClient.channel('messaging', `chat-${userId}`, {
      name: 'AI Chat',
      created_by_id: 'ai_bot'
    });
    await channel.create();
    await channel.sendMessage({
      text: aiMessage,
      user_id: 'ai_bot'
    });

    res.status(200).json({ reply: aiMessage });
  } catch (error) {
    console.log('Error generating AI response:', error);
    return res
      .status(500)
      .json({ error: 'Failed to send message. Internal server error.' });
  }
});

// Get chat history for a user
app.post('/get-messages', async (req: Request, res: Response): Promise<any> => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required.' });
  }

  try {
    // get messages from database
    const chatHistory = await db
      .select()
      .from(chats)
      .where(eq(chats.userId, userId));

    res.status(200).json({ messagse: chatHistory });
  } catch (error) {
    console.log('Error fetching chat history:', error);
    return res
      .status(500)
      .json({ error: 'Failed to fetch chat history. Internal server error.' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
