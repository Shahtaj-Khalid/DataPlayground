# Data Playground

A local-first, browser-based data exploration tool that runs entirely client-side. No backend, no authentication, no cloud services—just pure browser-based data manipulation.

> NOTE: This repo is built to help some friends and colleagues with everyday sheet tasks. Making it public for anyone to use. Please feel free to add feature / changes requests, I'll try to add them and maintain the repo.

## Features

### 1. Upload Files
- Supports CSV, XLS, and XLSX files
- Drag & drop or click to browse
- Files are parsed client-side and loaded into DuckDB

### 2. SQL Queries
- Full SQL support via DuckDB-WASM
- Query your uploaded datasets
- Query history for easy access

### 3. Visualizations
- Create charts from your data
- Supports Bar, Line, Doughnut, and Scatter charts
- Powered by Chart.js

### 4. Merge Datasets
- Join multiple datasets using SQL JOINs
- Supports INNER, LEFT, RIGHT, and FULL OUTER joins
- Select common columns for joining

### 5. Data Analysis
- Statistical analysis of your datasets
- Column-level statistics
- Overview metrics

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001). To build for production: `npm run build` (output in `dist/`).

## Project Structure

```
src/
├── components/   # React components
├── hooks/       # Custom hooks (e.g. useDuckDB)
├── stores/      # Zustand state
├── utils/       # Utilities
├── App.jsx
└── main.jsx
```

## Tech Stack

React 18 · Vite · DuckDB-WASM · Zustand · Chart.js & Plotly.js · PapaParse · SheetJS · Styled Components

## Notes

- All processing is client-side; data never leaves your browser.
- DuckDB-WASM may take a few seconds to load on first use.

## License

MIT
