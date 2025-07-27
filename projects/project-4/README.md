# Project 4: AI Fact-Checking Tool

## Vision

This project is an AI-powered fact-checking tool designed to analyze discussions, interviews, and debates from audio sources. It provides users with a chronological, verifiable breakdown of key statements, marking them as potentially true or false based on web search results. The core goal is to enhance media literacy and provide a quick, accessible way to verify information presented in audio formats.

A key feature is the ability to instantly replay the audio segment corresponding to each specific statement, allowing users to hear the original context and tone, which is often lost in simple transcripts.

## High-Level Architecture

The application is built with a modern web stack, separating the user interface from the core processing logic.

-   **Frontend:** A reactive, single-page application (SPA) built with **React and TypeScript**, using **Vite** for a fast development experience. It is responsible for all user interactions, including file uploads and displaying results.
-   **Backend:** A robust API server built with **Node.js and Express**, also using **TypeScript**. It handles the heavy lifting of the AI pipeline: audio processing, interaction with external AI services, and serving results to the frontend.

This separation ensures a scalable and maintainable system. The frontend can be updated independently of the backend, and the backend's intensive processing does not block the user's experience.

## Core Workflow

1.  **Audio Upload:** The user visits the web interface and uploads an audio file (e.g., `.mp3`, `.wav`).
2.  **Backend Processing:** The frontend sends the file to the backend, which initiates the fact-checking pipeline.
3.  **Transcription:** The audio is converted to text using a Speech-to-Text service. Timestamps for each word or phrase are preserved.
4.  **Statement Identification:** The full transcript is sent to a Large Language Model (LLM) to identify key claims or statements that are verifiable.
5.  **Fact-Checking:** For each identified statement, the backend uses a web search API to find relevant information.
6.  **Verification:** The search results are passed back to an LLM, which assesses whether the original statement is likely true or false based on the provided context.
7.  **Audio Slicing:** The original audio is sliced into small segments corresponding to each identified statement using the timestamps from the transcription phase.
8.  **Display Results:** The frontend receives the list of statements, their verdicts (true/false), and a link to the specific audio slice for each. It then displays this information to the user in a clear, chronological format.
9.  **Replay:** The user can click a "Replay" button on any statement to instantly hear the original audio for that specific claim.

## Getting Started

To run this project, you will need to run the frontend and backend servers in separate terminals.

**Prerequisites:**
- Node.js and npm installed.

**Backend Setup:**
```bash
cd backend
npm install
# Add your API keys to a .env file
npm run dev
```

**Frontend Setup:**
```bash
cd frontend
npm install
npm run dev
```
