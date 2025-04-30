# W&L Major Tracker

A comprehensive tool for tracking major requirements at Washington & Lee University. This application helps students visualize and track their progress through their chosen major's requirements.

## Features

- Interactive roadmap visualization of major requirements
- Progress tracking for completed courses
- Detailed breakdown of major requirements
- Support for multiple majors
- Persistent storage of progress using localStorage
- Modern, responsive UI with Material-UI components
- Particle effects background for enhanced visual appeal

## Project Structure

The project is organized into two main components:

- `src/frontend`: React-based web application with TypeScript
  - Interactive roadmap visualization
  - Progress tracking interface
  - Modern UI components
  - Local storage integration

- `src/backend`: Node.js/Express API service
  - RESTful API for major data
  - MongoDB integration
  - TypeScript support
  - Error handling middleware

## Tech Stack

### Frontend
- React 19
- TypeScript
- Material-UI
- React TSParticles
- CSS Modules

### Backend
- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/SlsabilHassan/WLU_Major_Tracker.git
cd WLU_Major_Tracker
```

2. Install dependencies:
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd src/backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:
Create a `.env` file in the backend directory with:
```
PORT=8080
MONGODB_URI=mongodb://localhost:27017/major-tracker
```

### Running the Application

1. Start the backend server:
```bash
cd src/backend
npm run dev
```

2. Start the frontend development server:
```bash
cd src/frontend
npm start
```

3. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080

## API Endpoints

- `GET /api/majors` - Get all majors
- `GET /api/majors/:major` - Get specific major details
- `POST /api/majors` - Create a new major
- `PUT /api/majors/:major` - Update a major
- `DELETE /api/majors/:major` - Delete a major

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
