# W&L Major Tracker

A comprehensive tool for tracking major requirements at Washington & Lee University. This application helps students visualize and track their progress through their chosen major's requirements.

## Features

- Interactive roadmap visualization of major requirements
- Progress tracking for completed courses
- Detailed breakdown of major requirements
- Support for all W&L majors
- Persistent storage of progress using localStorage
- Modern, responsive UI with elegant animations
- Beautiful particle effects background
- Real-time progress updates
- Course requirement validation
- Support for multiple requirement types (all, n_of, credits, etc.)

## Project Structure

The project is organized as a modern React application:

- `src/frontend/src/`:
  - `components/`: React components for the UI
    - `Roadmap.tsx`: Main roadmap visualization component
    - `CircularProgress.tsx`: Progress indicator component
    - `LoadingSpinner.tsx`: Loading state component
    - `ErrorMessage.tsx`: Error handling component
    - `Celebration.tsx`: Success animation component
  - `data/`: JSON data files
    - `majors.json`: Complete major requirements data
  - `types/`: TypeScript type definitions
  - `services/`: API and data services
  - `App.tsx`: Main application component
  - `App.css`: Global styles

## Tech Stack

### Frontend
- React 18
- TypeScript
- CSS Modules
- React TSParticles
- Local Storage API

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/SlsabilHassan/WLU_Major_Tracker.git
cd WLU_Major_Tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Access the application:
- Frontend: http://localhost:3000

## Features in Detail

### Major Requirements
- Comprehensive coverage of all W&L majors
- Support for various requirement types:
  - Required courses (all)
  - Choice-based requirements (n_of)
  - Credit-based requirements
  - Subject-specific requirements
  - Level-specific requirements

### Progress Tracking
- Real-time progress updates
- Visual progress indicators
- Course completion tracking
- Requirement validation
- Persistent storage of progress

### User Interface
- Elegant roadmap visualization
- Responsive design
- Beautiful animations
- Interactive course selection
- Clear requirement breakdowns
- Progress celebration effects

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Washington & Lee University for providing the major requirements data
- The React and TypeScript communities for their excellent documentation and tools
