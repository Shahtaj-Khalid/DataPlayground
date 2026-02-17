# Data Playground

A local-first, browser-based data exploration tool that runs entirely client-side. No backend, no authentication, no cloud services - just pure browser-based data manipulation.

**NOTE**: This repo is built to help some friends and colleagues with everyday sheet tasks. Making it public for anyone to use. Please feel free to add feature / changes requests, I'll try to add them and maintain the repo.

## Features

- 📊 **Upload & Parse**: CSV, XLS, XLSX file support
- 🔍 **SQL Queries**: Full SQL support via DuckDB-WASM
- 📈 **Visualizations**: Chart.js and Plotly.js integration
- 🔗 **Data Merging**: SQL JOIN operations
- 📉 **Statistical Analysis**: Built-in data analysis tools
- 💾 **Export**: Download transformed data as CSV/Excel

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **DuckDB-WASM** - In-browser SQL engine
- **PapaParse** - CSV parsing
- **SheetJS** - Excel parsing
- **Chart.js & Plotly.js** - Visualizations
- **Zustand** - State management
- **Styled Components** - Styling

## Project Structure

```
src/
├── components/     # React components
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
└── stores/        # Zustand stores
```

## License

MIT
# DataPlayground
