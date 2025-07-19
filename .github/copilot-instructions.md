# Copilot Instructions for Rume Chat

## Project Overview

Rume Chat is a real-time chat application built with Deno 2.x, following
Domain-Driven Design (DDD) principles. It features a monorepo workspace
structure with separate API and web apps, using a custom IoC container, Deno.KV
for persistence, and server-sent events (SSE) for real-time messaging.

## Architecture & Key Patterns

### Monorepo Workspace Structure

- **Apps**: `apps/api/` (Hono-based API), `apps/web/` (React Router + Vite)
- **Packages**: Domain logic, persistence, IoC container, and integrations
- **Development**: Uses workspace tasks (`deno task dev` runs both API and web
  concurrently)

### Domain-Driven Design with CQRS

Every business operation follows strict CQRS pattern:

```typescript
// Domain modules export interfaces and IoC bindings
export interface CreateRoomTypes {
  CreateRoomCommandHandler: CommandHandler<
    CreateRoomCommand,
    CreateRoomResponse
  >;
}

export const CreateRoomIocModule: BindableIoCModule<CreateRoomTypes> = (c) => {
  c.bind(
    "CreateRoomCommandHandler",
    (c) => new CreateRoomCommandHandler(c.resolve("CreateRoomDataAccess")),
    Lifecycle.Scoped,
  );
};
```

**Critical**: Data access interfaces are defined in domain, implemented in
persistence layer. Never directly import persistence from domain.

### Custom IoC Container Pattern

- **Registration**: Module-based with lifecycle management (`Lifecycle.Scoped`,
  `Lifecycle.Singleton`)
- **Resolution**: Type-safe container resolution in controllers via
  `c.var.container.resolve("ServiceName")`
- **Middleware**: IoC container is configured in `apps/api/middleware/ioc/` and
  injected as Hono variable

### Controller Pattern

Use `createController` helper for all endpoints:

```typescript
export const createRoomController = createController("/rooms", async (c) => {
  const commandHandler = c.var.container.resolve("CreateRoomCommandHandler");
  const { id, name } = await c.req.json();
  const command = new CreateRoomCommand(id, name, c.var.currentUser.handle);
  return c.json(await commandHandler.execute(command));
});
```

**Critical**: Always use `HTTPException.fromError(error)` for error handling,
access current user via `c.var.currentUser`.

### Deno.KV Persistence Patterns

Hierarchical key structure defined in `packages/persistence/keys.ts`:

```typescript
export const roomKey = (roomId: string) => ["rooms", roomId] as const;
export const messageKey = (roomId: string, messageId: string) =>
  ["rooms", roomId, "messages", messageId] as const;
```

**Critical**: All keys are typed and centralized. Use atomic operations for
consistency.

## Development Workflow

### Essential Commands

```bash
deno task dev          # Start both API (8000) and web (5173) in development
deno task build        # Build web app for production
deno test             # Run all tests (uses Deno's built-in test runner)
```

### Testing Conventions

- **Pattern**: Arrange-Act-Assert with `setupSut()` helper functions
- **Location**: Co-located with source files (`*.test.ts`)
- **Mocking**: Use `@std/testing/mock` for spy-based mocking
- **Structure**: BDD-style with `describe`/`it` from `@std/testing/bdd`

### Adding New Features

1. **Domain**: Define command/query in `packages/domain/{entity}/{operation}/`
2. **Handler**: Implement with data access interface dependency
3. **Persistence**: Create Deno.KV implementation in
   `packages/persistence/{entity}/`
4. **IoC Module**: Wire dependencies in domain's index.ts
5. **Controller**: Add endpoint using `createController` pattern
6. **Routes**: Register controller in `apps/api/{entity}/index.ts`

### Key Conventions

- **File naming**: `{operation}.{type}.ts` (e.g., `create-room.command.ts`)
- **Imports**: Use workspace package names (`@myty/rume-chat-domain`)
- **Authentication**: GitHub OAuth with session-based authentication middleware
- **Types**: Domain types exported from each operation's index.ts

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

### Middleware Chain (apps/api/main.ts)

1. Logging → IoC container → Authentication → Authorization
2. Scoped container per request using `using` syntax
3. Current user resolved from session and injected into context

## Project-Specific Notes

- Uses `mise.toml` for Deno version management
- Monorepo structure with workspace task filtering
- Zero external dependencies philosophy (custom IoC vs third-party)
