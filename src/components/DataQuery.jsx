import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Search, Download, RefreshCw, Database } from 'lucide-react';
import { useDuckDB } from '../hooks/useDuckDB';
import useDataStore from '../stores/dataStore';
import { exportData } from '../utils/export';
import { EmptyState } from './EmptyState';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
`;

const spinner = keyframes`
  to { transform: rotate(360deg); }
`;

const QueryContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: var(--space-10) var(--space-6);
`;

const PageHeader = styled.div`
  margin-bottom: var(--space-8);
`;

const PageTitle = styled.h1`
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
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

const Select = styled.select`
  width: 100%;
  max-width: 400px;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  background: var(--bg-surface);
  color: var(--text-primary);
  cursor: pointer;
  margin-bottom: var(--space-4);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px var(--accent-primary-muted);
  }
`;

const EditorWrap = styled.div`
  margin-bottom: var(--space-4);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus-within {
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px var(--accent-primary-muted);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: var(--space-4);
  border: none;
  font-size: var(--text-sm);
  font-family: var(--font-mono);
  line-height: 1.6;
  min-height: 180px;
  resize: vertical;
  background: var(--bg-surface);
  color: var(--text-primary);

  &::placeholder {
    color: var(--text-tertiary);
  }

  &:focus {
    outline: none;
  }
`;

const TableNameHint = styled.div`
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-bottom: var(--space-4);

  code {
    padding: 2px 8px;
    background: var(--border-subtle);
    border-radius: var(--radius-sm);
    font-size: var(--text-xs);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
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
  transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;

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

const SecondaryButton = styled(PrimaryButton)`
  background: var(--border-strong);
  color: var(--text-primary);

  &:hover:not(:disabled) {
    background: var(--border-default);
  }
`;

const HistorySection = styled.div`
  margin-top: var(--space-8);
  padding-top: var(--space-6);
  border-top: 1px solid var(--border-default);
`;

const HistoryTitle = styled.h4`
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: var(--space-3);
`;

const HistoryItem = styled.button`
  display: block;
  width: 100%;
  padding: var(--space-4) var(--space-6);
  background: transparent;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
  font-family: var(--font-mono);
  text-align: left;
  color: var(--text-secondary);
  cursor: pointer;
  margin-bottom: var(--space-2);
  transition: border-color 0.15s ease, background 0.15s ease, color 0.15s ease;

  &:hover {
    border-color: var(--accent-primary);
    background: var(--accent-primary-muted);
    color: var(--text-primary);
  }
`;

const ErrorBanner = styled.div`
  padding: var(--space-4);
  background: var(--accent-error-muted);
  border: 1px solid var(--accent-error);
  border-radius: var(--radius-md);
  color: var(--accent-error);
  font-size: var(--text-sm);
  margin-bottom: var(--space-6);
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
  width: 24px;
  height: 24px;
  border: 2px solid var(--border-strong);
  border-top-color: var(--accent-primary);
  border-radius: 50%;
  animation: ${spinner} 0.7s linear infinite;
`;

const ResultsCard = styled(Card)`
  margin-top: var(--space-6);
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-6);
  flex-wrap: wrap;
  gap: var(--space-4);
`;

const ResultsTitle = styled.h3`
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
`;

const ResultsMeta = styled.span`
  font-size: var(--text-sm);
  color: var(--text-secondary);
`;

const TableWrapper = styled.div`
  overflow: auto;
  max-height: 520px;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  margin-top: var(--space-4);
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
  white-space: nowrap;
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

const NullCell = styled.span`
  color: var(--text-tertiary);
  font-style: italic;
`;

const DataQuery = () => {
  const [selectedDataset, setSelectedDataset] = useState('');
  const [sqlQuery, setSqlQuery] = useState('');
  const [queryResults, setQueryResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [queryHistory, setQueryHistory] = useState([]);

  const datasets = useDataStore((state) => state.datasets);
  const activeDatasetId = useDataStore((state) => state.activeDatasetId);
  const setActiveDataset = useDataStore((state) => state.setActiveDataset);
  const { query, loading: dbLoading } = useDuckDB();

  useEffect(() => {
    if (activeDatasetId && datasets.length > 0) {
      setSelectedDataset(activeDatasetId);
      const dataset = datasets.find((d) => d.id === activeDatasetId);
      if (dataset) {
        setSqlQuery(`SELECT * FROM ${dataset.tableName} LIMIT 100;`);
      }
    } else if (datasets.length > 0) {
      setSelectedDataset(datasets[0].id);
      setSqlQuery(`SELECT * FROM ${datasets[0].tableName} LIMIT 100;`);
    }
  }, [datasets, activeDatasetId]);

  const handleDatasetChange = (datasetId) => {
    setSelectedDataset(datasetId);
    setActiveDataset(datasetId);
    const dataset = datasets.find((d) => d.id === datasetId);
    if (dataset) {
      setSqlQuery(`SELECT * FROM ${dataset.tableName} LIMIT 100;`);
    }
    setQueryResults(null);
    setError(null);
  };

  const executeQuery = async () => {
    if (!sqlQuery.trim()) {
      setError('Please enter a SQL query');
      return;
    }
    setLoading(true);
    setError(null);
    setQueryResults(null);
    try {
      const results = await query(sqlQuery);
      const formattedResults = results.map((row) => ({ ...row }));
      setQueryResults(formattedResults);
      setQueryHistory((prev) => [sqlQuery, ...prev.slice(0, 9)]);
    } catch (err) {
      console.error('Query error:', err);
      setError(err.message || 'Query failed');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!queryResults || queryResults.length === 0) return;
    const dataset = datasets.find((d) => d.id === selectedDataset);
    const filename = dataset
      ? `query_results_${dataset.name.replace(/\.[^/.]+$/, '')}`
      : 'query_results';
    exportData(queryResults, filename, 'csv');
  };

  const loadQueryFromHistory = (queryText) => {
    setSqlQuery(queryText);
  };

  const selectedDatasetObj = datasets.find((d) => d.id === selectedDataset);

  return (
    <QueryContainer>
      <PageHeader>
        <PageTitle>Query your data</PageTitle>
      </PageHeader>

      <Card>
        <CardTitle>Run SQL</CardTitle>

        {datasets.length === 0 ? (
          <EmptyState
            icon={Database}
            title="No data yet"
            description="Upload a CSV or Excel file first, then come back here to run queries."
          />
        ) : (
          <>
            <Select
              value={selectedDataset}
              onChange={(e) => handleDatasetChange(e.target.value)}
            >
              {datasets.map((dataset) => (
                <option key={dataset.id} value={dataset.id}>
                  {dataset.name} ({dataset.rowCount} rows)
                </option>
              ))}
            </Select>

            {selectedDatasetObj && (
              <TableNameHint>
                Table: <code>{selectedDatasetObj.tableName}</code>
              </TableNameHint>
            )}

            <EditorWrap>
              <TextArea
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                placeholder="SELECT * FROM ..."
                spellCheck={false}
              />
            </EditorWrap>

            <ButtonGroup>
              <PrimaryButton
                type="button"
                onClick={executeQuery}
                disabled={loading || dbLoading || !sqlQuery.trim()}
              >
                {loading ? (
                  <Spinner style={{ width: 18, height: 18, borderWidth: 2 }} />
                ) : (
                  <Search size={18} />
                )}
                {loading ? 'Running…' : 'Run query'}
              </PrimaryButton>
              {queryResults && queryResults.length > 0 && (
                <SecondaryButton type="button" onClick={handleExport}>
                  <Download size={18} />
                  Export
                </SecondaryButton>
              )}
            </ButtonGroup>

            {queryHistory.length > 0 && (
              <HistorySection>
                <HistoryTitle>Recent queries</HistoryTitle>
                {queryHistory.map((q, idx) => (
                  <HistoryItem key={idx} type="button" onClick={() => loadQueryFromHistory(q)}>
                    {q.length > 90 ? q.substring(0, 90) + '…' : q}
                  </HistoryItem>
                ))}
              </HistorySection>
            )}
          </>
        )}
      </Card>

      {error && (
        <ErrorBanner>
          <strong>Error:</strong> {error}
        </ErrorBanner>
      )}

      {loading && (
        <LoadingWrap>
          <Spinner />
          <span>Running your query…</span>
        </LoadingWrap>
      )}

      {queryResults && !loading && (
        <ResultsCard>
          <ResultsHeader>
            <ResultsTitle>Results</ResultsTitle>
            <ResultsMeta>
              {queryResults.length} row{queryResults.length !== 1 ? 's' : ''}
            </ResultsMeta>
            <SecondaryButton type="button" onClick={handleExport}>
              <Download size={18} />
              Export
            </SecondaryButton>
          </ResultsHeader>

          {queryResults.length === 0 ? (
            <EmptyState
              title="No rows returned"
              description="Your query ran successfully but returned no results. Try different filters or columns."
            />
          ) : (
            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    {Object.keys(queryResults[0]).map((key) => (
                      <Th key={key}>{key}</Th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {queryResults.map((row, idx) => (
                    <Tr key={idx}>
                      {Object.values(row).map((value, cellIdx) => (
                        <Td key={cellIdx}>
                          {value === null || value === undefined ? (
                            <NullCell>NULL</NullCell>
                          ) : (
                            String(value)
                          )}
                        </Td>
                      ))}
                    </Tr>
                  ))}
                </tbody>
              </Table>
            </TableWrapper>
          )}
        </ResultsCard>
      )}
    </QueryContainer>
  );
};

export default DataQuery;
