# Chicho AI - Mobile Chat Application

## Overview

Chicho AI is a mobile-first conversational AI application that provides an intelligent chat interface powered by Google's Gemini 2.0 Flash model. The application focuses on delivering a clean, efficient chat experience with Material Design principles, emphasizing mobile usability and conversational clarity.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool and development server.

**UI Component System**: Shadcn/ui component library built on top of Radix UI primitives with Tailwind CSS for styling. The application uses the "new-york" style variant with neutral base colors and CSS variables for theming.

**Design Philosophy**: Material Design principles with inspiration from leading AI chat interfaces (ChatGPT, Claude, Gemini). The design prioritizes utility, efficiency, and mobile-first responsiveness. Typography uses Inter/Roboto fonts via Google Fonts for optimal readability across different screen sizes.

**Routing**: Wouter for lightweight client-side routing with a minimal route structure (main chat page at "/" and a 404 fallback).

**State Management**: TanStack Query (React Query) for server state management with custom API request utilities. The application uses optimistic updates for user messages to provide immediate feedback before server confirmation.

**Layout System**: 
- Mobile-first responsive design with Tailwind spacing primitives (2, 3, 4, 6, 8 units)
- Single-column chat layout centered with max-width of 4xl
- Full viewport height with flexbox column layout
- Message container with overflow scrolling
- Sticky input area at the bottom
- Fixed header with backdrop blur effect

### Backend Architecture

**Server Framework**: Express.js with TypeScript running in ESM mode.

**API Structure**: RESTful API endpoints:
- `POST /api/chat` - Sends user message and receives AI response
- `GET /api/messages` - Retrieves conversation history

**Data Flow**: 
1. User submits message through chat input
2. Optimistic UI update adds user message immediately
3. POST request to `/api/chat` with message content
4. Server appends user message to conversation history
5. Full conversation history sent to Gemini API
6. AI response returned and added to storage
7. Client receives AI message and updates UI

**Storage Implementation**: In-memory storage using a custom `MemStorage` class that implements the `IStorage` interface. This provides basic CRUD operations for messages (getMessages, addMessage, clearMessages). The storage is session-based and does not persist across server restarts.

**Message Schema**: Validated using Zod schemas:
- Message validation with role (user/assistant), content, timestamp, and unique ID
- Input validation with min/max length constraints (1-4000 characters)

### Data Storage Solutions

**Current Implementation**: Ephemeral in-memory storage without persistence. Messages are stored in a simple array within the `MemStorage` class instance.

**Database Configuration**: Drizzle ORM is configured with PostgreSQL support (via `@neondatabase/serverless`), indicating planned database integration. The configuration points to a schema file at `shared/schema.ts` and migration output directory, but the actual database tables are not yet defined beyond the message interface.

**Design Decision**: The in-memory approach provides zero-latency access and simplifies initial development, with the understanding that production deployment would require migrating to the configured PostgreSQL database for persistence, multi-user support, and conversation history retention.

### Authentication and Authorization

**Current State**: No authentication or authorization mechanisms are implemented. The application operates as a single-session, anonymous chat interface.

**Session Management**: Package dependency on `connect-pg-simple` suggests planned PostgreSQL-based session storage for future multi-user support.

### External Dependencies

**AI Service**: Google Gemini API (via `@google/genai` SDK)
- Model: `gemini-2.0-flash-exp`
- System prompt defines the assistant personality as "Chicho AI, a helpful and friendly AI assistant"
- Conversation history sent with each request to maintain context
- Error handling includes fallback messages for API failures

**Database Service**: Neon Postgres (via `@neondatabase/serverless`)
- Configured but not actively used in current implementation
- Connection string expected via `DATABASE_URL` environment variable
- Drizzle ORM configured for schema management and migrations

**Development Tools**:
- Replit-specific plugins for runtime error overlay, cartographer, and dev banner
- Vite plugin for enhanced development experience

**Required Environment Variables**:
- `GEMINI_API_KEY` - Google Gemini API authentication
- `DATABASE_URL` - PostgreSQL connection string (configured but optional in current implementation)

**Font Services**: Google Fonts CDN for Inter, Roboto, DM Sans, Fira Code, Geist Mono, and Architects Daughter typefaces.