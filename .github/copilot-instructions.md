# Copilot Instructions for Rume Chat

## Project Overview

Rume Chat is a real-time chat application built with Deno, following
Domain-Driven Design (DDD) principles. It uses a custom IoC container, Deno.KV
for persistence, and WebSockets/SSE for real-time messaging.

## Architecture & Key Patterns

### Domain-Driven Design Structure

- **Domain Layer** (`packages/domain/`): Contains domain logic,
  commands/queries, and handlers
- **Persistence Layer** (`packages/persistence/`): Deno.KV-based data access
  implementations
- **API Layer** (`apps/api/`): Hono-based REST API and WebSocket endpoints
- **Web Layer** (`apps/web/`): Vite + React frontend

### IoC Container Pattern

The project uses a custom IoC container (`packages/ioc/`) with module-based
registration:

```typescript
// Domain modules export types and IoC modules
export interface CreateRoomTypes {
  CreateRoomCommandHandler: CommandHandler<CreateRoomCommand, CreateRoomResponse>;
}

export const CreateRoomIocModule: BindableIoCModule<CreateRoomTypes> = (c) => {
  c.bind("CreateRoomCommandHandler", (c) => new CreateRoomCommandHandler(...), Lifecycle.Scoped);
};
```

### Command/Query Handler Pattern

All business operations use explicit command/query handlers:

- Commands: `CreateRoomCommand`, `CreateMessageCommand`
- Queries: `GetRoomQuery`, `GetMessagesByRoomQuery`
- Handlers implement `CommandHandler<TCommand, TResponse>` or
  `QueryHandler<TQuery, TResponse>`

### Real-time Subscriptions

Custom subscription system (`apps/api/subscriptions/`) manages WebSocket
connections:

- Session-based connection tracking
- Room-specific message subscriptions
- Feed iterator pattern for async message streaming

## Development Workflow

### Essential Commands

```bash
# Start development (uses spino for orchestration)
deno task dev

# Run specific app
deno task --filter @myty/rume-chat-web build  # Web build

# Code quality
deno task check                # Full type checking + linting
deno task fix                  # Auto-fix formatting + linting

# Testing
deno test                      # Run all tests using Deno's built-in test runner
```

### Testing Strategy

Uses Deno's standard testing libraries (`@std/testing`, `@std/assert`,
`@std/testing/mock`):

- **Unit tests**: Command handlers with mocked data access layers
- **Test structure**: Arrange-Act-Assert pattern with `setupSut()` helper
  functions
- **Mocking**: Spy-based mocking for dependency verification
- **Location**: Tests are co-located with source files (`*.test.ts`)

### Adding New Features

1. **Define domain**: Create command/query in `packages/domain/{entity}/`
2. **Implement handler**: Add command handler with data access interface
3. **Add persistence**: Implement data access in `packages/persistence/`
4. **Create controller**: Add HTTP endpoint in `apps/api/{entity}/`
5. **Register IoC**: Wire dependencies in respective IoC modules

### Key Conventions

- **File naming**: `{operation}.{type}.ts` (e.g., `create-room.command.ts`)
- **Data access**: Interface in domain, Deno.KV implementation in persistence
- **Controllers**: Use `createController` helper with dependency injection
- **Authentication**: Middleware extracts `currentUser` from session
- **Error handling**: Use `HTTPException.fromError(error)` for API errors

## Critical Integration Points

### Authentication Flow (GitHub OAuth)

1. Uses `@deno/kv-oauth` for GitHub OAuth integration
2. Session management via Deno.KV storage at `["users", "sessions", sessionId]`
3. Authentication middleware extracts user from session and injects into context
4. GitHub provider implementation in `packages/github/` fetches user data via
   GitHub API
5. Login flow: OAuth → `LoginUserByProviderCommand` → session creation → user
   resolution

### Deno.KV Key Structure

```typescript
// Keys follow hierarchical pattern
["rooms", roomId] // Room entity
  ["rooms", roomId, "messages", msgId] // Room messages
  ["users", "sessions", sessionId]; // User sessions
```

### WebSocket Message Flow

1. Client connects → `Subscriptions.connect(sessionId)`
2. Subscribe to room → `addSubscription(sessionId, "room:messages:${roomId}")`
3. New message → `publish("room:messages:${roomId}", message)`
4. Auto-broadcast to all room subscribers

### Middleware Chain (apps/api/main.ts)

1. Logging → IoC container → Authentication → Authorization
2. Scoped container per request using `using` syntax
3. Current user resolved from session and injected into context

## Project-Specific Notes

- Uses `mise.toml` for Deno version management
- Monorepo structure with workspace task filtering
- **Spino**: Custom orchestration tool (alternative to Turborepo) for managing
  multi-app development
- Real-time via WebSockets, not SSE (despite README mention)
- Custom subscription management instead of external pub/sub
- Zero external dependencies philosophy (custom IoC vs third-party)
