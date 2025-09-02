# GoalGrid

## Overview

GoalGrid is an interactive social skills improvement platform that gamifies personal development. The application helps users build confidence and social skills through AI-guided daily missions, progress tracking, and gamified experiences. Users receive personalized challenges (like "smile at 3 people"), track their progress on an interactive map-like interface, and get AI coaching support for real-life social interactions.

The platform is built as a modern full-stack web application with React frontend, Express backend, and PostgreSQL database, designed to provide a Duolingo-like experience for social skills development.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Shadcn/ui component library with Radix UI primitives for consistent, accessible design
- **Styling**: Tailwind CSS with custom design tokens and dark mode support
- **State Management**: TanStack Query for server state management and caching
- **Forms**: React Hook Form with Zod validation for robust form handling
- **Animations**: Framer Motion for smooth UI transitions and interactions

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for full-stack type safety
- **Development**: TSX for fast development server with hot reloading
- **Build System**: esbuild for fast production builds
- **Session Management**: Express sessions with PostgreSQL store via connect-pg-simple

### Database Design
- **Database**: PostgreSQL with Neon serverless hosting
- **ORM**: Drizzle ORM for type-safe database operations
- **Migrations**: Drizzle Kit for schema management and migrations
- **Schema**: Currently includes users table with username/password authentication
- **Validation**: Drizzle-zod integration for runtime schema validation

### Authentication System
- **Primary Method**: Firebase Authentication supporting Google OAuth and email/password
- **Session Storage**: PostgreSQL-backed sessions for server-side state
- **Frontend Integration**: Firebase SDK with redirect-based OAuth flow
- **Security**: Form validation with zod schemas and proper error handling

### Development Environment
- **Build Tool**: Vite for fast development and hot module replacement
- **Deployment**: Replit-optimized with runtime error overlay and cartographer plugin
- **Code Quality**: TypeScript strict mode with comprehensive type checking
- **Asset Management**: Static asset serving with organized directory structure

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Hook Form for frontend development
- **Backend**: Express.js, Node.js built-ins for server functionality
- **Database**: Neon PostgreSQL, Drizzle ORM, connect-pg-simple for data persistence

### Authentication Services
- **Firebase**: Complete authentication solution with Google OAuth integration
- **Session Management**: Server-side sessions with PostgreSQL backing store

### UI and Design System
- **Component Library**: Radix UI primitives for accessible base components
- **Styling**: Tailwind CSS with PostCSS processing
- **Icons**: Lucide React for consistent iconography
- **Animations**: Framer Motion for smooth user interactions

### Development and Build Tools
- **TypeScript**: Full-stack type safety and development experience
- **Vite**: Fast development server with hot module replacement
- **esbuild**: Production build optimization
- **TSX**: Development runtime for TypeScript execution

### Data and State Management
- **TanStack Query**: Server state management, caching, and synchronization
- **Zod**: Runtime schema validation and type inference
- **date-fns**: Date manipulation and formatting utilities

### Replit Integration
- **Development**: Replit-specific plugins for enhanced development experience
- **Runtime**: Error overlay and debugging tools for Replit environment