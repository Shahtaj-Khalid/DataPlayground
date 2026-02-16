import Papa from 'papaparse';
import * as XLSX from 'xlsx';

/**
 * Export data to CSV
 */
export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || data.length === 0) {
    throw new Error('No data to export');
  }

  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

/**
 * Export data to Excel
 */
export const exportToExcel = (data, filename = 'export.xlsx', sheetName = 'Sheet1') => {
  if (!data || data.length === 0) {
    throw new Error('No data to export');
  }

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  XLSX.writeFile(workbook, filename);
};

/**
 * Export data with automatic format detection
 */
export const exportData = (data, filename, format = 'csv') => {
  if (format === 'csv') {
    const csvFilename = filename.endsWith('.csv') ? filename : `${filename}.csv`;
    exportToCSV(data, csvFilename);
  } else if (format === 'excel' || format === 'xlsx') {
    const xlsxFilename = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`;
    exportToExcel(data, xlsxFilename);
  } else {
    throw new Error(`Unsupported export format: ${format}`);
  }
};
