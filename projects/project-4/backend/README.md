## Backend

This directory contains the backend code for the AI Fact-Checking Tool. It is a Node.js application using Express.js for the web server and various libraries for interacting with AI services.

### Directory Structure

-   `src/`: Contains the main source code.
    -   `api/`: Handles API routing and request/response logic.
    -   `controllers/`: Contains the business logic for handling requests.
    -   `services/`: Interacts with external AI services.
    -   `utils/`: Contains utility functions.
-   `test/`: Contains tests for the backend.
    -   `e2e/`: End-to-end tests.
    -   `integration/`: Integration tests.
    -   `unit/`: Unit tests.

### Getting Started

1.  Install dependencies: `npm install`
2.  Create a `.env` file with your API keys.
3.  Run the development server: `npm run dev`
