# Emergency Response Platform

This is a platform for managing emergency responses, tracking responders, and coordinating emergency operations.

## Live Demo
You can go to this app on: [this link](https://emergency-platform-frontend.onrender.com/)

## Overview

This application enables emergency service providers to:
- Track and manage active emergencies on a map.
- Coordinate responder locations and assignments.
- Monitor emergency status.
- Assign different types of responders (medical, fire, etc.) to emergencies

## Project Structure

The project is split into two main parts:

### Frontend
- Built with React 19 + TypeScript
- Uses Leaflet for interactive maps
- Tailwind CSS and Shadcn for UI styling
- React Router for navigation

### Backend
- Node.js with Express
- TypeScript
- SQLite database with Drizzle ORM
- RESTful API for emergency and responder data


## Getting Started

### Installation

#### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables (edit the .env file)

4. Seed the database:
   ```
   npm run seed
   ```

5. Start the development server:
   ```
   npm run dev
   ```

#### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and visit the local development server URL (typically http://localhost:5173)

## Development

### Building for Production
- Backend: `npm run build`
- Frontend: `npm run build`


