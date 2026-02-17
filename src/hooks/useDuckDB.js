import { useState, useEffect, useCallback } from 'react';
import * as duckdb from '@duckdb/duckdb-wasm';
// Vite-friendly bundles so worker and WASM are served correctly in dev
import duckdb_wasm_mvp from '@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url';
import mvp_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url';
import duckdb_wasm_eh from '@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url';
import eh_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url';

const MANUAL_BUNDLES = {
  mvp: { mainModule: duckdb_wasm_mvp, mainWorker: mvp_worker },
  eh: { mainModule: duckdb_wasm_eh, mainWorker: eh_worker },
};

let dbInstance = null;
let connectionInstance = null;

export const useDuckDB = () => {
  const [db, setDb] = useState(null);
  const [connection, setConnection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initDuckDB = async () => {
      try {
        // If already initialized, reuse
        if (connectionInstance) {
          setConnection(connectionInstance);
          setDb(dbInstance);
          setLoading(false);
          return;
        }

        setLoading(true);
        setError(null);

        const bundle = await duckdb.selectBundle(MANUAL_BUNDLES);
        const worker = new Worker(bundle.mainWorker);
        const logger = new duckdb.ConsoleLogger();

        dbInstance = new duckdb.AsyncDuckDB(logger, worker);
        await dbInstance.instantiate(bundle.mainModule, bundle.pthreadWorker);

        connectionInstance = await dbInstance.connect();

        setDb(dbInstance);
        setConnection(connectionInstance);
        setLoading(false);
      } catch (err) {
        console.error('Failed to initialize DuckDB:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    initDuckDB();
  }, []);

  const query = useCallback(async (sql) => {
    const conn = connection || connectionInstance;
    if (!conn) {
      throw new Error('DuckDB connection not initialized');
    }

    try {
      const result = await conn.query(sql);
      return result.toArray();
    } catch (err) {
      console.error('Query error:', err);
      throw err;
    }
  }, [connection]);

  const registerTable = useCallback(async (tableName, data) => {
    const conn = connection || connectionInstance;
    const dbRef = db || dbInstance;
    if (!conn || !dbRef) {
      throw new Error('DuckDB connection not initialized');
    }

    try {
      if (data.length === 0) {
        throw new Error('Cannot register empty table');
      }

      const columns = Object.keys(data[0]);
      
      // Drop table if exists
      try {
        await conn.query(`DROP TABLE IF EXISTS ${tableName}`);
      } catch (e) {
        // Ignore if table doesn't exist
      }

      // Create CSV string from data
      const escapeCSVValue = (value) => {
        if (value === null || value === undefined) {
          return '';
        }
        const str = String(value);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      };

      // Build CSV content
      const csvRows = [
        columns.join(','), // Header
        ...data.map(row => columns.map(col => escapeCSVValue(row[col])).join(','))
      ];
      const csvContent = csvRows.join('\n');

      // Register CSV as a file in DuckDB
      const csvFileName = `${tableName}.csv`;
      await dbRef.registerFileText(csvFileName, csvContent);

      // Create table from CSV. We generate the CSV ourselves (comma-delimited, double-quoted),
      // so we can use read_csv with an explicit dialect instead of auto-detection.
      await conn.query(`
        CREATE TABLE ${tableName} AS 
        SELECT * FROM read_csv(
          '${csvFileName}',
          header=true,
          delim=',',
          quote='"',
          escape='"',
          parallel=false
        )
      `);

      return true;
      } catch (err) {
      console.error('Failed to register table with CSV method:', err);
      // Fallback: SQL INSERT approach
      try {
          const columns = Object.keys(data[0]);
          const escapedColumns = columns.map((col) => `"${String(col).replace(/"/g, '""')}"`);

          // Fallback path: keep it simple and robust.
          // When the CSV helper fails, we create a fully-flexible table where
          // every column is stored as text. This avoids numeric overflows and
          // other type-cast issues for messy real-world data.
          const columnDefs = escapedColumns
            .map((escaped) => `${escaped} VARCHAR`)
            .join(', ');

          await conn.query(`CREATE TABLE ${tableName} (${columnDefs})`);

          // Insert in smaller batches
          const batchSize = 500;
          for (let i = 0; i < data.length; i += batchSize) {
            const batch = data.slice(i, i + batchSize);
            const values = batch.map((row) => {
              const rowValues = columns.map((col) => {
                const value = row[col];
                if (value === null || value === undefined) {
                  return 'NULL';
                }
                if (typeof value === 'string') {
                  return `'${String(value).replace(/'/g, "''")}'`;
                }
                return String(value);
              });
              return `(${rowValues.join(', ')})`;
            });

            await conn.query(
              `INSERT INTO ${tableName} (${escapedColumns.join(', ')}) VALUES ${values.join(', ')}`
            );
          }
          return true;
      } catch (fallbackErr) {
        console.error('Fallback registration also failed:', fallbackErr);
        throw fallbackErr;
      }
    }
  }, [connection, db]);

  const getTableInfo = useCallback(async (tableName) => {
    const conn = connection || connectionInstance;
    if (!conn) {
      throw new Error('DuckDB connection not initialized');
    }

    try {
      const result = await conn.query(`DESCRIBE ${tableName}`);
      return result.toArray();
    } catch (err) {
      console.error('Failed to get table info:', err);
      throw err;
    }
  }, [connection]);

  return {
    db,
    connection,
    loading,
    error,
    query,
    registerTable,
    getTableInfo
  };
};
