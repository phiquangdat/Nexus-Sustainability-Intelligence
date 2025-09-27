# Veridi OS - Sustainability Intelligence Platform

A sustainability reporting tool for Wärtsilä power plants, built for the Wärtsilä hackathon.

## Features

- **Real-time Data Visualization**: Interactive charts showing CO2 emissions and energy output
- **Automated EU ETS Reporting**: Generate compliance reports with a single click
- **Power Plant Monitoring**: Track multiple plants with realistic mock data
- **Modern UI**: Clean, responsive interface built with React and Tailwind CSS

## Tech Stack

### Backend

- Node.js with Express.js
- CORS enabled for frontend communication
- Mock data simulation for power plant operations

### Frontend

- React with TypeScript
- Vite for fast development
- Recharts for data visualization
- Tailwind CSS for styling
- Axios for API communication

## Getting Started

### Prerequisites

- Node.js (v16 or higher) and npm (for local development)
- Docker and Docker Compose (for containerized deployment)

### Option 1: Docker Deployment (Recommended)

**Quick Start with Docker Compose:**
```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

**Development with Docker:**
```bash
# Run development services with hot reload
docker-compose --profile dev up --build

# This will start:
# - Backend on http://localhost:4001 (with nodemon)
# - Frontend on http://localhost:5173 (with Vite dev server)
```

**Stop services:**
```bash
docker-compose down
```

### Option 2: Local Development

1. **Start the Backend**

   ```bash
   cd veridi-os/backend
   npm install
   npm run dev
   ```

   Backend will run on http://localhost:4000

2. **Start the Frontend**
   ```bash
   cd veridi-os/frontend
   npm install
   npm run dev
   ```
   Frontend will run on http://localhost:5173

### API Endpoints

- `GET /` - Health check
- `GET /api/data` - Returns all power plant data
- `GET /api/reports/eu-ets` - Generates EU ETS compliance report

## Project Structure

```
veridi-os/
├── backend/
│   ├── server.js          # Express server with API endpoints
│   ├── mockData.js        # Simulated power plant data
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Header.jsx         # Application header
    │   │   ├── Dashboard.jsx      # Data visualization dashboard
    │   │   └── ReportGenerator.jsx # EU ETS report generator
    │   ├── App.tsx               # Main application component
    │   └── index.css             # Tailwind CSS imports
    └── package.json
```

## Mock Data

The application uses realistic mock data simulating:

- Two power plants (Vaasa-Plant-A, Vaasa-Plant-B)
- Multiple fuel types (Natural Gas, HFO)
- Hourly data points over several days
- Realistic CO2 emissions and energy output calculations

## Docker Configuration

The project includes comprehensive Docker setup for both development and production:

### Docker Files Structure
```
veridi-os/
├── docker-compose.yml          # Main orchestration file
├── Dockerfile.backend          # Backend production image
├── Dockerfile.frontend         # Frontend production image
├── nginx.conf                  # Nginx configuration for frontend
├── .dockerignore              # Docker ignore patterns
├── backend/
│   ├── Dockerfile             # Backend development image
│   └── .dockerignore          # Backend-specific ignore patterns
└── frontend/
    ├── Dockerfile             # Frontend development image
    ├── nginx.conf             # Frontend nginx config
    └── .dockerignore          # Frontend-specific ignore patterns
```

### Docker Features
- **Multi-stage builds** for optimized production images
- **Health checks** for service monitoring
- **Nginx reverse proxy** for frontend serving
- **Development profiles** with hot reload
- **Network isolation** between services
- **Volume mounting** for development

### Production vs Development
- **Production**: Optimized images with nginx serving static files
- **Development**: Hot reload with volume mounting for live code changes

## Development

- Backend uses nodemon for auto-restart during development
- Frontend uses Vite for fast hot-reload
- All components are built with modern React patterns
- Charts are responsive and interactive
- Docker provides consistent environment across different machines
