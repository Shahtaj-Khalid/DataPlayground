import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { BarChart3, RefreshCw } from 'lucide-react';
import { Line, Bar, Doughnut, Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import useDataStore from '../stores/dataStore';
import { useDuckDB } from '../hooks/useDuckDB';
import { EmptyState } from './EmptyState';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes` to { transform: rotate(360deg); }`;

const VisualizationContainer = styled.div`
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
  animation: ${fadeIn} 0.3s ease-out;
`;

const CardTitle = styled.h3`
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-6);
`;

const Controls = styled.div`
  display: flex;
  gap: var(--space-4);
  flex-wrap: wrap;
  align-items: flex-end;
`;

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
`;

const ControlLabel = styled.span`
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--text-secondary);
`;

const Select = styled.select`
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  background: var(--bg-surface);
  color: var(--text-primary);
  font-size: var(--text-sm);
  min-width: 140px;

  &:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px var(--accent-primary-muted);
  }
`;

const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  min-height: 48px;
  padding: var(--space-4) var(--space-10);
  background: var(--accent-primary);
  color: var(--text-inverse);
  border: none;
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.15s ease;

  &:hover:not(:disabled) {
    background: var(--accent-primary-hover);
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const ChartContainer = styled.div`
  position: relative;
  height: 400px;
  margin-top: var(--space-4);
`;

const LoadingWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-10);
  color: var(--text-secondary);
  font-size: var(--text-sm);
`;

const Spinner = styled.div`
  width: 28px;
  height: 28px;
  border: 2px solid var(--border-strong);
  border-top-color: var(--accent-primary);
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`;

const DataVisualization = () => {
  const [selectedDataset, setSelectedDataset] = useState('');
  const [xColumn, setXColumn] = useState('');
  const [yColumn, setYColumn] = useState('');
  const [chartType, setChartType] = useState('bar');
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);

  const datasets = useDataStore((state) => state.datasets);
  const activeDatasetId = useDataStore((state) => state.activeDatasetId);
  const { query, loading: dbLoading } = useDuckDB();

  useEffect(() => {
    if (activeDatasetId && datasets.length > 0) {
      setSelectedDataset(activeDatasetId);
      const dataset = datasets.find(d => d.id === activeDatasetId);
      if (dataset && dataset.columns.length > 0) {
        setXColumn(dataset.columns[0]);
        if (dataset.columns.length > 1) {
          setYColumn(dataset.columns[1]);
        }
      }
    } else if (datasets.length > 0) {
      setSelectedDataset(datasets[0].id);
      if (datasets[0].columns.length > 0) {
        setXColumn(datasets[0].columns[0]);
        if (datasets[0].columns.length > 1) {
          setYColumn(datasets[0].columns[1]);
        }
      }
    }
  }, [datasets, activeDatasetId]);

  useEffect(() => {
    if (selectedDataset && xColumn && yColumn) {
      generateChart();
    }
  }, [selectedDataset, xColumn, yColumn, chartType]);

  const generateChart = async () => {
    if (!selectedDataset || !xColumn || !yColumn) return;

    setLoading(true);
    const dataset = datasets.find(d => d.id === selectedDataset);
    if (!dataset) {
      setLoading(false);
      return;
    }

    try {
      // Escape column names for SQL (DuckDB uses double quotes for identifiers)
      const xQuoted = `"${String(xColumn).replace(/"/g, '""')}"`;
      const yQuoted = `"${String(yColumn).replace(/"/g, '""')}"`;

      // For bar/line/doughnut: aggregate by X (group by X, sum Y) so we don't repeat same values
      const isAggregated = chartType === 'bar' || chartType === 'line' || chartType === 'doughnut';
      let results;

      if (isAggregated) {
        const sql = `SELECT ${xQuoted} AS x_val, SUM(CAST(${yQuoted} AS DOUBLE)) AS y_val FROM ${dataset.tableName} WHERE ${xQuoted} IS NOT NULL AND ${yQuoted} IS NOT NULL GROUP BY ${xQuoted} ORDER BY y_val DESC LIMIT 500`;
        results = await query(sql);
      } else {
        // Scatter: raw points (limit for performance)
        const sql = `SELECT ${xQuoted} AS x_val, CAST(${yQuoted} AS DOUBLE) AS y_val FROM ${dataset.tableName} WHERE ${xQuoted} IS NOT NULL AND ${yQuoted} IS NOT NULL LIMIT 1000`;
        results = await query(sql);
      }

      const labels = results.map(row => String(row.x_val ?? row[xColumn] ?? ''));
      const data = results.map(row => {
        const value = row.y_val ?? row[yColumn];
        return typeof value === 'number' ? value : parseFloat(value) || 0;
      });

      const chartConfig = {
        labels: labels,
        datasets: [
          {
            label: yColumn,
            data: data,
            backgroundColor: 'rgba(102, 126, 234, 0.6)',
            borderColor: 'rgba(102, 126, 234, 1)',
            borderWidth: 2
          }
        ]
      };

      setChartData(chartConfig);
    } catch (error) {
      console.error('Error generating chart:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedDatasetObj = datasets.find(d => d.id === selectedDataset);

  const renderChart = () => {
    if (!chartData) return null;

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: `${yColumn} by ${xColumn}`
        }
      }
    };

    switch (chartType) {
      case 'line':
        return <Line data={chartData} options={options} />;
      case 'bar':
        return <Bar data={chartData} options={options} />;
      case 'doughnut':
        return <Doughnut data={chartData} options={options} />;
      case 'scatter':
        return <Scatter data={chartData} options={options} />;
      default:
        return <Bar data={chartData} options={options} />;
    }
  };

  return (
    <VisualizationContainer>
      <PageTitle>Visualize</PageTitle>

      {datasets.length === 0 ? (
        <Card>
          <EmptyState
            icon={BarChart3}
            title="No data to chart yet"
            description="Upload a file first, then pick a dataset and columns to build your chart."
          />
        </Card>
      ) : (
        <>
          <Card>
            <CardTitle>Build a chart</CardTitle>
            <Controls>
              <ControlGroup>
                <ControlLabel>Dataset</ControlLabel>
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
              </ControlGroup>

              <ControlGroup>
                <ControlLabel>X axis (categories / labels)</ControlLabel>
                <Select
                  value={xColumn}
                  onChange={(e) => setXColumn(e.target.value)}
                  disabled={!selectedDataset}
                >
                  {selectedDatasetObj?.columns.map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </Select>
              </ControlGroup>

              <ControlGroup>
                <ControlLabel>Y axis (values)</ControlLabel>
                <Select
                  value={yColumn}
                  onChange={(e) => setYColumn(e.target.value)}
                  disabled={!selectedDataset}
                >
                  {selectedDatasetObj?.columns.map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </Select>
              </ControlGroup>

              <ControlGroup>
                <ControlLabel>Chart type</ControlLabel>
                <Select
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                >
                  <option value="bar">Bar Chart</option>
                  <option value="line">Line Chart</option>
                  <option value="doughnut">Doughnut Chart</option>
                  <option value="scatter">Scatter Plot</option>
                </Select>
              </ControlGroup>

              <PrimaryButton type="button" onClick={generateChart} disabled={loading || dbLoading || !xColumn || !yColumn}>
                <RefreshCw size={18} />
                Update chart
              </PrimaryButton>
            </Controls>
          </Card>

          {loading && (
            <Card>
              <LoadingWrap>
                <Spinner />
                <span>Building your chart…</span>
              </LoadingWrap>
            </Card>
          )}

          {chartData && !loading && (
            <Card>
              <CardTitle>Preview</CardTitle>
              <ChartContainer>
                {renderChart()}
              </ChartContainer>
            </Card>
          )}
        </>
      )}
    </VisualizationContainer>
  );
};

export default DataVisualization;
