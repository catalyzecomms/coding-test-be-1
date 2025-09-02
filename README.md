# Posts API - NestJS

A complete NestJS Posts API with CRUD operations, TypeORM, SQLite database, and Swagger documentation.

## Features

- ✅ Complete CRUD operations for Posts
- ✅ Auto-generated slugs from titles
- ✅ Soft delete functionality
- ✅ SQLite database with TypeORM
- ✅ Input validation with class-validator
- ✅ Swagger API documentation
- ✅ Clean architecture with DTOs and services
- ✅ Proper error handling

## Tech Stack

- **NestJS** - Node.js framework
- **TypeORM** - ORM for database operations
- **SQLite** - Lightweight database
- **Swagger** - API documentation
- **class-validator** - Input validation
- **class-transformer** - Data transformation

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run start:dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/posts` | Create a new post |
| GET | `/posts` | Get all active posts |
| GET | `/posts/:id` | Get post by ID |
| GET | `/posts/slug/:slug` | Get post by slug |
| PATCH | `/posts/:id` | Update post |
| DELETE | `/posts/:id` | Soft delete post |

## API Documentation

Once the server is running, visit:
- **Application**: http://localhost:3000
- **Swagger Docs**: http://localhost:3000/api

## Database

The application uses SQLite with the following Post entity fields:

- `id` - Primary key (auto increment)
- `title` - Post title (required)
- `slug` - URL-friendly slug (auto-generated from title)
- `content` - Post content (optional)
- `isActive` - Active status (default: true)
- `publishedAt` - Publication date (optional)
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

## Testing with Postman

Import the `postman-collection.json` file into Postman to test all endpoints.

## Example Usage

### Create a Post
```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Blog Post",
    "content": "This is the content of my first blog post.",
    "publishedAt": "2024-01-15T10:00:00Z"
  }'
```

### Get All Posts
```bash
curl http://localhost:3000/posts
```

### Update a Post
```bash
curl -X PATCH http://localhost:3000/posts/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Blog Post Title",
    "content": "Updated content."
  }'
```

### Delete a Post (Soft Delete)
```bash
curl -X DELETE http://localhost:3000/posts/1
```

## Project Structure

```
src/
├── posts/
│   ├── dto/
│   │   ├── create-post.dto.ts
│   │   └── update-post.dto.ts
│   ├── entities/
│   │   └── post.entity.ts
│   ├── posts.controller.ts
│   ├── posts.service.ts
│   └── posts.module.ts
├── app.module.ts
└── main.ts
```

## Development

```bash
# Development mode
npm run start:dev

# Build for production
npm run build

# Start production
npm run start:prod

# Run tests
npm run test

# Lint code
npm run lint
```

## License

This project is licensed under the UNLICENSED license.
