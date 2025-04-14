# Chat AI

A real-time chat application built with Vue 3, TypeScript, and Vite that integrates with OpenAI's GPT models. Users can register with their name and email to start conversations with an AI assistant.

## Features

- User registration with name and email
- Persistent chat history across sessions
- Real-time AI responses using OpenAI's GPT models
- Modern responsive UI with Tailwind CSS

## Tech Stack

- Frontend: Vue 3, TypeScript, Pinia, Tailwind CSS
- Backend: Express, Stream Chat API, OpenAI API
- Database: SQL with Drizzle ORM

## Site Architecture

### Routes & Views

- **/** - Landing Page
  - App introduction and features
  - "Get Started" button for new users → `/register`
  - "Sign In" button for existing users → `/login`
- **/register** - User Registration

  - Registration form (name, email, password)
  - Link to login for existing users
  - Redirects to `/chat` on successful registration

- **/login** - User Authentication

  - Login form (email, password)
  - "Forgot Password" option (future implementation)
  - Link to registration for new users
  - Redirects to `/chat` on successful login

- **/chat** - Main Chat Interface (Protected)

  - Chat history display
  - Message input area
  - User profile information
  - Settings/options menu

- **/profile** - User Profile (Protected, Future)
  - Account settings
  - Preferences
  - Password change

### API Endpoints

- **/api/register-user** - Create new user account
- **/api/login** - Authenticate user and issue JWT
- **/api/verify-token** - Validate JWT token
- **/api/chat** - Send message to AI and get response
- **/api/get-messages** - Retrieve chat history

### Components Hierarchy

- **App.vue** - Root component with router view
  - **Header.vue** - Navigation and user info
  - **Landing.vue** - Home page content
  - **RegisterForm.vue** - User registration
  - **LoginForm.vue** - User authentication
  - **ChatView.vue** - Main chat interface
    - **MessageList.vue** - Display messages
    - **MessageInput.vue** - Send new messages
  - **ProfileView.vue** - User settings (future)

## TODO

- [ ] Add proper authentication with JWT
- [ ] Implement user password protection
- [ ] Add message typing indicators
- [ ] Create user settings page
- [ ] Add ability to clear chat history
- [ ] Implement chat export functionality

## JWT Authentication Implementation Plan

### Backend (Express)

1. **Install dependencies**

   ```bash
   cd chat-ai-api
   npm install jsonwebtoken bcrypt @types/jsonwebtoken @types/bcrypt
   ```

2. **Create auth middleware**

   - Create `src/middleware/auth.ts` to validate tokens
   - Implement token verification logic
   - Add environment variables for JWT_SECRET in .env

3. **Update user schema**

   - Add password field to users table in Drizzle schema
   - Create migration to update database
   - Add password validation rules

4. **Create auth endpoints**

   - Implement `/login` endpoint with password comparison
   - Update `/register-user` to accept and hash passwords
   - Add `/verify-token` endpoint for token validation
   - Create password reset flow (optional)

5. **Secure existing endpoints**

   - Apply auth middleware to `/chat` and `/get-messages`
   - Return 401 for unauthorized requests
   - Update error handling to differentiate auth errors

6. **Handle token expiration**
   - Set appropriate token expiration time
   - Implement token refresh mechanism
   - Add token blacklisting for logout (optional)

### Frontend (Vue)

1. **Install JWT handling package**

   ```bash
   cd chat-ai-ui
   npm install jwt-decode axios-auth-refresh
   ```

2. **Update Pinia store**

   - Add token storage to user store
   - Implement login/logout actions
   - Add automatic token refreshing
   - Add isAuthenticated computed property

3. **Update UI components**

   - Modify HomeView to be a landing page with two options:
     - "Register" button for new users
     - "Sign In" button for existing users
   - Create separate RegisterView component for new user registration
   - Create LoginView component for existing user authentication
   - Add password fields to both forms with appropriate validation
   - Implement form toggle functionality for better UX
   - Add "Forgot password" option (optional)

4. **Create auth components**

   - Update forms to include password fields
   - Create login form component
   - Add form validation
   - Add password visibility toggle
   - Create loading states for auth actions

5. **Update API requests**

   - Create axios interceptor to include token in headers
   - Handle 401 responses by redirecting to login
   - Add logic for token refresh
   - Create central API service with auth headers

6. **Add protected routes**

   - Configure Vue Router with:
     - Public routes: '/', '/register', '/login'
     - Protected routes: '/chat', '/profile', etc.
   - Implement navigation guards to check auth state
   - Redirect unauthenticated users to login
   - Preserve intended destination after login

7. **Update existing components**
   - Update Header component to show logged-in state
   - Add logout button to UI
   - Add user profile dropdown (optional)

### Testing & Deployment

1. **Test authentication flow**

   - Verify registration process
   - Test login/logout functionality
   - Ensure protected routes are secure
   - Test token refresh mechanism
   - Verify error handling

2. **Security audit**
   - Check for token expiration handling
   - Verify CORS configuration
   - Ensure passwords are properly hashed
   - Check for XSS vulnerabilities
   - Implement rate limiting on auth endpoints
