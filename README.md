# Gorar Parser

Compress any codebase into a ZIP file and transform it into a prompt-friendly text format optimized for Large Language Models (LLMs).

## Overview

Gorar Parser is a full-stack application that allows you to upload a ZIP archive of your codebase and parse it into a clean, LLM-friendly text format. With customizable filtering options, you can remove comments, empty lines, unnecessary files, and more to create concise prompts for AI assistants.

## Features

- 📦 **ZIP File Processing** - Upload and parse ZIP archives of your codebases
- 🎛️ **Customizable Filters**:
  - Remove comments (`//`, `#`, `##`)
  - Remove empty lines
  - Remove directory structure
  - Remove README files
  - Remove dot files (`.gitignore`, `.env`, etc.)
  - Remove files from `.gitignore`
- 💾 **Local Storage** - Persist your filter preferences between sessions
- 🌓 **Dark Mode** - Toggle between light and dark themes
- 📥 **Download Results** - Export parsed content as text files
- 🎨 **Responsive Design** - Works seamlessly on all screen sizes

## Tech Stack

### Frontend
- **TypeScript** - Type-safe JavaScript
- **Vite** - Lightning-fast build tool
- **CSS with Cascade Layers** - Organized and maintainable styling
- **Bun** - JavaScript runtime and package manager

### Backend
- **Go 1.26.3** - High-performance backend server
- **Standard Library** - No external dependencies

## Getting Started

### Prerequisites
- Node.js/Bun (for frontend)
- Go 1.26.3+ (for backend)

### Deploy

Docker:
```bash
docker run -d -p 4747:4747 --name gorar-parser docker.io/brunopoiano/gorar-parser:latest
```

### Development

**Terminal 1 - Frontend (Development Server)**:
```bash
cd frontend
npm run dev
# Server runs on http://localhost:5173
```

**Terminal 2 - Backend (API Server)**:
```bash
cd backend
go run main.go
# Server runs on http://localhost:4747
```

### Production Build

**Frontend**:
```bash
cd frontend
npm run build
# Creates optimized build in dist/
```

**Backend**:
```bash
cd backend
go build -o main main.go
./main
```

## Usage

1. Open the application in your browser (http://localhost:4747)
2. Select or drag-and-drop a ZIP file containing your codebase
3. Configure your preferred filters using the toggle switches
4. The parsed content appears in the code preview area
5. Click "Download" to save the parsed content as a text file

## API Endpoints

### POST `/parse`
Parses a ZIP file with optional filtering options.

**Request**:
- `Content-Type: multipart/form-data`
- **Fields**:
  - `file` (File): ZIP archive
  - `remove_comments` (boolean)
  - `remove_empty_lines` (boolean)
  - `remove_directory` (boolean)
  - `remove_readme` (boolean)
  - `remove_dot_files` (boolean)
  - `remove_gitignore_files` (boolean)

**Response**:
- `Content-Type: text/plain`
- Returns parsed file content as text



