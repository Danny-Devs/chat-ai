# Chat AI API

A Node.js backend that powers the Chat AI application. This Express-based API integrates OpenAI's GPT models with Stream Chat for real-time messaging and uses PostgreSQL with Drizzle ORM for data persistence.

## Features

- User registration and authentication
- Integration with OpenAI's GPT-4o model for AI responses
- Real-time chat functionality via Stream Chat API
- Chat history persistence with PostgreSQL database
- RESTful API endpoints for frontend communication

## Tech Stack

- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **APIs**: OpenAI API, Stream Chat API
- **Tools**: UUID generation, environment variable management

## API Endpoints

- **POST /register-user**: Register or retrieve existing user
- **POST /chat**: Send message to AI and get response
- **POST /get-messages**: Retrieve chat history for a user

## Environment Variables

- `PORT`: Server port (default: 5000)
- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY`: OpenAI API key
- `STREAM_API_KEY`: Stream Chat API key
- `STREAM_API_SECRET`: Stream Chat API secret

## Architecture Overview

While Express is a minimalist framework without built-in architectural patterns (unlike Angular or NestJS), this project follows industry best practices by implementing a layered architecture. This structure is inspired by established patterns like MVC (Model-View-Controller) but adapted for modern API development.

### Key Architectural Concepts

- **Separation of Concerns**: Each file has a single responsibility, making code easier to understand and maintain
- **Dependency Injection Pattern**: Services are "injected" into controllers, improving testability
- **Data Flow**: Client → Routes → Controllers → Services → Database/External APIs
- **Middleware Pattern**: Cross-cutting concerns like validation handled by middleware layers

## TODO: Code Refactoring

The current `server.ts` file should be refactored into smaller components following this structure:

```
src/
├── config/
│   ├── database.js (already exists)
│   └── app.ts (new - express configuration)
├── db/
│   └── schema.js (already exists)
├── controllers/
│   ├── userController.ts
│   └── chatController.ts
├── services/
│   ├── openaiService.ts
│   └── streamChatService.ts
├── middleware/
│   └── validation.ts
├── routes/
│   ├── userRoutes.ts
│   └── chatRoutes.ts
└── server.ts (simplified)
```

### Refactoring Plan with Rationale:

1. **Config Layer**

   - Create `app.ts` to configure Express and middleware
   - Separate environment configuration
   - **Why?** Centralizes configuration, makes testing easier, and allows different configurations for different environments

2. **Service Layer**

   - Extract OpenAI functionality into `openaiService.ts`
   - Move Stream Chat logic to `streamChatService.ts`
   - **Why?** Services encapsulate business logic and external API interactions, making them reusable and easier to mock for testing

3. **Controller Layer**

   - Create `userController.ts` for user registration logic
   - Build `chatController.ts` for message handling
   - **Why?** Controllers handle HTTP request/response cycle and orchestrate service calls, keeping route definitions clean

4. **Routes Layer**

   - Define user routes in `userRoutes.ts`
   - Set up chat routes in `chatRoutes.ts`
   - **Why?** Separating routes provides clear API documentation at a glance and makes authentication/middleware application more targeted

5. **Middleware**

   - Add request validation in `validation.ts`
   - **Why?** Middleware intercepts requests before they reach controllers, handling cross-cutting concerns like validation, authentication, and logging

6. **Simplified Server**
   - Update `server.ts` to use modular components
   - Focus on route registration and server startup
   - **Why?** The main file becomes a thin orchestrator that wires everything together, making the overall flow easier to understand

### Benefits for Frontend Developers Moving to Full Stack

If you're coming from a frontend background (especially React/Vue), this structure will feel familiar:

- **Services** are like global state managers or API hooks
- **Controllers** are similar to container components that coordinate logic
- **Routes** define the API surface, like how routes work in frontend frameworks
- **Middleware** is comparable to route guards or interceptors in frontend routing

This architecture also helps with:

- **Scalability**: As your app grows, new features fit into existing patterns
- **Team Collaboration**: Clear boundaries make it easier for multiple developers to work simultaneously
- **Maintainability**: When you revisit code months later, the organization makes it easier to understand
- **Testing**: Each layer can be tested in isolation with mocks for its dependencies

While more complex than a simple Express app, this structure provides a solid foundation that will scale well as your application grows.
