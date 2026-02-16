import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FileSearch } from 'lucide-react';
import useDataStore from '../stores/dataStore';
import { useDuckDB } from '../hooks/useDuckDB';
import { exportData } from '../utils/export';
import { EmptyState } from './EmptyState';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: var(--space-10) var(--space-6);
`;

const PageTitle = styled.h1`
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-8);
  letter-spacing: -0.02em;
`;

const Card = styled.div`
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-card);
  padding: var(--space-8);
  margin-bottom: var(--space-6);
  box-shadow: var(--shadow-md);
`;

const CardTitle = styled.h3`
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-6);
`;

const Select = styled.select`
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  background: var(--bg-surface);
  color: var(--text-primary);
  cursor: pointer;
  width: 100%;
  max-width: 400px;
  margin-bottom: var(--space-4);

  &:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px var(--accent-primary-muted);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--space-4);
  margin-bottom: var(--space-6);
`;

const StatCard = styled.div`
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    border-color: var(--border-strong);
    box-shadow: var(--shadow-xs);
  }
`;

const StatLabel = styled.div`
  font-size: var(--text-xs);
  color: var(--text-secondary);
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.04em;
  margin-bottom: var(--space-2);
`;

const StatValue = styled.div`
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--text-primary);
`;

const TableWrapper = styled.div`
  overflow: auto;
  max-height: 440px;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: var(--text-sm);
`;

const Th = styled.th`
  padding: var(--space-3) var(--space-4);
  text-align: left;
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border-default);
  font-weight: 600;
  color: var(--text-primary);
  position: sticky;
  top: 0;
  z-index: 1;
`;

const Td = styled.td`
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--border-subtle);
  color: var(--text-primary);
`;

const Tr = styled.tr`
  transition: background 0.12s ease;

  &:nth-child(even) {
    background: rgba(255, 255, 255, 0.02);
  }

  &:hover {
    background: var(--accent-primary-muted);
  }
`;

const AnalyzeData = () => {
  const [selectedDataset, setSelectedDataset] = useState('');
  const [stats, setStats] = useState(null);
  const [columnStats, setColumnStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const datasets = useDataStore((state) => state.datasets);
  const activeDatasetId = useDataStore((state) => state.activeDatasetId);
  const { query, loading: dbLoading } = useDuckDB();

  useEffect(() => {
    if (activeDatasetId && datasets.length > 0) {
      setSelectedDataset(activeDatasetId);
    } else if (datasets.length > 0) {
      setSelectedDataset(datasets[0].id);
    }
  }, [datasets, activeDatasetId]);

  useEffect(() => {
    if (selectedDataset) {
      analyzeDataset();
    }
  }, [selectedDataset]);

  const analyzeDataset = async () => {
    if (!selectedDataset) return;

    setLoading(true);
    const dataset = datasets.find(d => d.id === selectedDataset);
    if (!dataset) {
      setLoading(false);
      return;
    }

    try {
      // Get basic stats
      const countResult = await query(`SELECT COUNT(*) as total FROM ${dataset.tableName}`);
      const totalRows = countResult[0]?.total || 0;

      // Get column statistics
      const numericColumns = [];
      const columnStatsData = [];

      for (const col of dataset.columns) {
        try {
          // Check if column is numeric
          const sampleQuery = `SELECT ${col} FROM ${dataset.tableName} WHERE ${col} IS NOT NULL LIMIT 1`;
          const sample = await query(sampleQuery);
          
          if (sample.length > 0 && typeof sample[0][col] === 'number') {
            numericColumns.push(col);
            
            const statsQuery = `
              SELECT 
                COUNT(*) as count,
                COUNT(DISTINCT ${col}) as distinct_count,
                MIN(${col}) as min_val,
                MAX(${col}) as max_val,
                AVG(${col}) as avg_val,
                STDDEV(${col}) as stddev_val
              FROM ${dataset.tableName}
              WHERE ${col} IS NOT NULL
            `;
            
            const colStats = await query(statsQuery);
            if (colStats.length > 0) {
              columnStatsData.push({
                column: col,
                ...colStats[0]
              });
            }
          } else {
            // For non-numeric columns, get distinct count and null count
            const textStatsQuery = `
              SELECT 
                COUNT(*) as count,
                COUNT(DISTINCT ${col}) as distinct_count,
                COUNT(*) - COUNT(${col}) as null_count
              FROM ${dataset.tableName}
            `;
            
            const textStats = await query(textStatsQuery);
            if (textStats.length > 0) {
              columnStatsData.push({
                column: col,
                ...textStats[0],
                type: 'text'
              });
            }
          }
        } catch (err) {
          console.warn(`Could not analyze column ${col}:`, err);
        }
      }

      setStats({
        totalRows,
        columnCount: dataset.columns.length,
        numericColumnCount: numericColumns.length
      });
      setColumnStats(columnStatsData);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedDatasetObj = datasets.find(d => d.id === selectedDataset);

  return (
    <Container>
      <PageTitle>Analyze</PageTitle>

      {datasets.length === 0 ? (
        <Card>
          <EmptyState
            icon={FileSearch}
            title="No data to analyze yet"
            description="Upload a CSV or Excel file first. Then you can see column stats, types, and overview metrics here."
          />
        </Card>
      ) : (
        <>
          <Card>
            <CardTitle>Select Dataset</CardTitle>
            <Select
              value={selectedDataset}
              onChange={(e) => setSelectedDataset(e.target.value)}
            >
              {datasets.map(dataset => (
                <option key={dataset.id} value={dataset.id}>
                  {dataset.name} ({dataset.rowCount} rows)
                </option>
              ))}
            </Select>
          </Card>

          {loading && (
            <Card>
              <EmptyState
                title="Crunching numbers…"
                description="Computing stats for your dataset."
              />
            </Card>
          )}

          {stats && !loading && (
            <>
              <Card>
                <CardTitle>Overview Statistics</CardTitle>
                <StatsGrid>
                  <StatCard>
                    <StatLabel>Total Rows</StatLabel>
                    <StatValue>{stats.totalRows.toLocaleString()}</StatValue>
                  </StatCard>
                  <StatCard>
                    <StatLabel>Total Columns</StatLabel>
                    <StatValue>{stats.columnCount}</StatValue>
                  </StatCard>
                  <StatCard>
                    <StatLabel>Numeric Columns</StatLabel>
                    <StatValue>{stats.numericColumnCount}</StatValue>
                  </StatCard>
                </StatsGrid>
              </Card>

              {columnStats && columnStats.length > 0 && (
                <Card>
                  <CardTitle>Column Statistics</CardTitle>
                  <TableWrapper>
                    <Table>
                      <thead>
                        <tr>
                          <Th>Column</Th>
                          <Th>Count</Th>
                          <Th>Distinct</Th>
                          {columnStats[0]?.min_val !== undefined && (
                            <>
                              <Th>Min</Th>
                              <Th>Max</Th>
                              <Th>Average</Th>
                              <Th>Std Dev</Th>
                            </>
                          )}
                          {columnStats[0]?.null_count !== undefined && (
                            <Th>Null Count</Th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {columnStats.map((stat, idx) => (
                          <Tr key={idx}>
                            <Td><strong>{stat.column}</strong></Td>
                            <Td>{stat.count?.toLocaleString()}</Td>
                            <Td>{stat.distinct_count?.toLocaleString()}</Td>
                            {stat.min_val !== undefined && (
                              <>
                                <Td>{stat.min_val?.toFixed(2)}</Td>
                                <Td>{stat.max_val?.toFixed(2)}</Td>
                                <Td>{stat.avg_val?.toFixed(2)}</Td>
                                <Td>{stat.stddev_val?.toFixed(2)}</Td>
                              </>
                            )}
                            {stat.null_count !== undefined && (
                              <Td>{stat.null_count?.toLocaleString()}</Td>
                            )}
                          </Tr>
                        ))}
                      </tbody>
                    </Table>
                  </TableWrapper>
                </Card>
              )}
            </>
          )}
        </>
      )}
    </Container>
  );
};

export default AnalyzeData;
