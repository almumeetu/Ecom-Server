# NeoComerz Server

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

A modern e-commerce backend API built with NestJS, TypeScript, and PostgreSQL.

## Description

NeoComerz Server is a scalable e-commerce backend application built with:

- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **PostgreSQL** - Robust relational database
- **Prisma** - Modern database toolkit
- **Docker** - Containerized development environment

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- pnpm package manager
- Docker and Docker Compose

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd neocomerz-server
pnpm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/neocomerz"
PORT=3000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 3. Start PostgreSQL Database

```bash
# Start PostgreSQL and Adminer (database GUI)
docker-compose up -d

# To stop the database
docker-compose down
```

This will start:

- PostgreSQL on port 5432
- Adminer (database GUI) on http://localhost:8080

### 4. Database Setup

```bash
# Generate Prisma client
pnpm prisma generate

# Run database migrations
pnpm prisma migrate dev

# (Optional) Seed the database
pnpm prisma db seed
```

### 5. Run the Application

```bash
# Development mode with hot reload
pnpm run start:dev

# Production mode
pnpm run build
pnpm run start:prod
```

The API will be available at http://localhost:3000

## API Documentation

Once the application is running, you can access:

- **Swagger Documentation**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/health

## Development Scripts

```bash
# Development
pnpm run start:dev          # Start in development mode
pnpm run start:debug        # Start in debug mode

# Building
pnpm run build              # Build the application
pnpm run start:prod         # Start production build

# Testing
pnpm run test               # Run unit tests
pnpm run test:e2e           # Run e2e tests
pnpm run test:cov           # Run tests with coverage

# Database
pnpm prisma studio          # Open Prisma Studio
pnpm prisma migrate dev      # Create and run migrations
pnpm prisma generate         # Generate Prisma client
pnpm prisma db push         # Push schema to database
```

## Database Management

### Using Prisma Studio

```bash
# Open the Prisma Studio GUI
pnpm prisma studio
```

This opens a visual database browser at http://localhost:5555

### Database Migrations

```bash
# Create a new migration
pnpm prisma migrate dev --name <migration-name>

# Reset the database
pnpm prisma migrate reset

# Deploy migrations to production
pnpm prisma migrate deploy
```

## Project Structure

```
neocomerz-server/
├── src/                    # Source code
│   ├── app.module.ts      # Main application module
│   ├── main.ts            # Application entry point
│   └── ...                # Other modules and services
├── prisma/                 # Database configuration
│   ├── schema.prisma      # Prisma schema
│   ├── migrations/        # Database migrations
│   └── seed.ts           # Database seed script
├── test/                  # Test files
├── docker-compose.yml     # Docker configuration
├── .env.example          # Environment variables template
└── README.md             # This file
```

## Environment Variables

| Variable       | Description                  | Default                                                      |
| -------------- | ---------------------------- | ------------------------------------------------------------ |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres123@localhost:5432/neocomerz` |
| `PORT`         | Application port             | `3000`                                                       |
| `NODE_ENV`     | Environment                  | `development`                                                |
| `JWT_SECRET`   | JWT signing secret           | -                                                            |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:

- Create an issue in the GitHub repository
- Check the [NestJS Documentation](https://docs.nestjs.com)
- Visit the [Prisma Documentation](https://www.prisma.io/docs)
