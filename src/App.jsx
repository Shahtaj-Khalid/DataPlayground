import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { GlobalStyle } from './components/GlobalStyle';
import AppLayout from './components/AppLayout';
import Home from './components/Home';
import FileUpload from './components/FileUpload';
import DataVisualization from './components/DataVisualization';
import DataQuery from './components/DataQuery';
import DataMerge from './components/DataMerge';
import AnalyzeData from './components/AnalyzeData';
import FormulasProduct from './components/FormulasProduct';

function App() {
  return (
    <Router>
      <GlobalStyle />
      <Analytics />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<AppLayout />}>
          <Route path="/upload" element={<FileUpload />} />
          <Route path="/visualize" element={<DataVisualization />} />
          <Route path="/query" element={<DataQuery />} />
          <Route path="/merge" element={<DataMerge />} />
          <Route path="/analyze" element={<AnalyzeData />} />
          <Route path="/formulas" element={<FormulasProduct />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
