# WLU Major Tracker Backend

Backend service for the WLU Major Tracker application.

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middleware/     # Custom middleware
├── models/         # Database models
├── routes/         # API routes
├── services/       # Business logic
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/wlu-major-tracker
NODE_ENV=development
```

3. Start the development server:
```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the project
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## API Documentation

### Majors

- `GET /api/majors` - Get all majors
- `GET /api/majors/:major` - Get a specific major
- `POST /api/majors` - Create a new major
- `PUT /api/majors/:major` - Update a major
- `DELETE /api/majors/:major` - Delete a major 