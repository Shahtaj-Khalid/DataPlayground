import Papa from 'papaparse';
import * as XLSX from 'xlsx';

/**
 * Parse CSV file
 */
export const parseCSV = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          console.warn('CSV parsing warnings:', results.errors);
        }
        resolve({
          data: results.data,
          errors: results.errors
        });
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

/**
 * Parse Excel file (XLS/XLSX)
 */
export const parseExcel = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          defval: null,
          raw: false
        });
        
        resolve({
          data: jsonData,
          sheetNames: workbook.SheetNames,
          errors: []
        });
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Detect file type and parse accordingly
 */
export const parseFile = async (file) => {
  const fileName = file.name.toLowerCase();
  const fileType = fileName.endsWith('.csv') 
    ? 'csv' 
    : fileName.endsWith('.xlsx') || fileName.endsWith('.xls')
    ? 'excel'
    : null;

  if (!fileType) {
    throw new Error('Unsupported file type. Please upload CSV or Excel files.');
  }

  if (fileType === 'csv') {
    return await parseCSV(file);
  } else {
    return await parseExcel(file);
  }
};

/**
 * Detect column types from data
 */
export const detectColumnTypes = (data) => {
  if (!data || data.length === 0) {
    return {};
  }

  const columns = Object.keys(data[0]);
  const types = {};

  columns.forEach(column => {
    const sampleSize = Math.min(100, data.length);
    const samples = data.slice(0, sampleSize).map(row => row[column]);
    
    let detectedType = 'string';
    let numberCount = 0;
    let dateCount = 0;
    let nullCount = 0;

    samples.forEach(value => {
      if (value === null || value === undefined || value === '') {
        nullCount++;
      } else if (typeof value === 'number') {
        numberCount++;
      } else if (value instanceof Date) {
        dateCount++;
      } else if (typeof value === 'string') {
        // Try to parse as date
        const date = new Date(value);
        if (!isNaN(date.getTime()) && value.length > 8) {
          dateCount++;
        }
        // Try to parse as number
        if (!isNaN(parseFloat(value)) && isFinite(value)) {
          numberCount++;
        }
      }
    });

    const nonNullCount = sampleSize - nullCount;
    
    if (nonNullCount === 0) {
      detectedType = 'string';
    } else if (dateCount / nonNullCount > 0.5) {
      detectedType = 'date';
    } else if (numberCount / nonNullCount > 0.7) {
      detectedType = 'number';
    } else {
      detectedType = 'string';
    }

    types[column] = detectedType;
  });

  return types;
};

/**
 * Get basic statistics for a dataset
 */
export const getDatasetStats = (data) => {
  if (!data || data.length === 0) {
    return {
      rowCount: 0,
      columnCount: 0,
      columns: []
    };
  }

  const columns = Object.keys(data[0]);
  const columnStats = columns.map(col => {
    const values = data.map(row => row[col]).filter(v => v !== null && v !== undefined && v !== '');
    const nullCount = data.length - values.length;
    
    return {
      name: col,
      nullCount,
      nullPercentage: (nullCount / data.length) * 100,
      uniqueCount: new Set(values).size
    };
  });

  return {
    rowCount: data.length,
    columnCount: columns.length,
    columns: columnStats
  };
};
