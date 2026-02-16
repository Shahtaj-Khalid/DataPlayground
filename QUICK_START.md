# Data Playground - Quick Start Guide

## Installation

```bash
cd Data Playground
npm install
```

## Development

```bash
npm run dev
```

This will start the Vite dev server at `http://localhost:3001`

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

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

## Project Structure

```
Data Playground/
├── src/
│   ├── components/      # React components
│   ├── hooks/          # Custom hooks (useDuckDB)
│   ├── stores/         # Zustand state management
│   ├── utils/          # Utility functions
│   ├── App.jsx         # Main app component
│   └── main.jsx        # Entry point
├── public/             # Static assets
├── package.json
└── vite.config.js
```

## Key Technologies

- **React 18** - UI framework
- **Vite** - Build tool
- **DuckDB-WASM** - In-browser SQL engine
- **Zustand** - State management
- **Chart.js** - Visualizations
- **PapaParse** - CSV parsing
- **SheetJS** - Excel parsing

## Notes

- All data processing happens client-side
- No backend required
- Data stays in your browser (privacy-first)
- DuckDB-WASM may take a few seconds to initialize on first load
