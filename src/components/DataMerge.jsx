import React, { useState } from 'react';
import styled from 'styled-components';
import { Merge, Download } from 'lucide-react';
import { useDuckDB } from '../hooks/useDuckDB';
import useDataStore from '../stores/dataStore';
import { exportData } from '../utils/export';
import { EmptyState } from './EmptyState';

const MergeContainer = styled.div`
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

const MergeCard = styled.div`
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

const FileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--space-4);
  margin-bottom: var(--space-6);
`;

const FileCard = styled.div`
  padding: var(--space-4);
  border: 2px solid ${(p) => (p.$selected ? 'var(--accent-primary)' : 'var(--border-default)')};
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
  background: ${(p) => (p.$selected ? 'var(--accent-primary-muted)' : 'var(--bg-surface)')};
  min-width: 0;
  overflow: hidden;

  &:hover {
    border-color: var(--accent-primary);
    box-shadow: var(--shadow-xs);
  }
`;

const FileName = styled.div`
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const FileInfo = styled.div`
  font-size: var(--text-xs);
  color: var(--text-secondary);
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
  max-width: 320px;
  margin-bottom: var(--space-4);

  &:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px var(--accent-primary-muted);
  }
`;

const PrimaryButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  border: none;
  border-radius: var(--radius-lg);
  background: var(--accent-primary);
  color: var(--text-inverse);
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

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

const ResultsCard = styled(MergeCard)`
  margin-top: var(--space-6);
`;

const TableWrapper = styled.div`
  overflow: auto;
  max-height: 520px;
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

const DataMerge = () => {
  const [selectedDatasets, setSelectedDatasets] = useState([]);
  const [joinType, setJoinType] = useState('INNER');
  const [joinColumn, setJoinColumn] = useState('');
  const [mergeResults, setMergeResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const datasets = useDataStore((state) => state.datasets);
  const addDataset = useDataStore((state) => state.addDataset);
  const { query, loading: dbLoading } = useDuckDB();

  const handleDatasetToggle = (datasetId) => {
    setSelectedDatasets(prev => {
      if (prev.includes(datasetId)) {
        return prev.filter(id => id !== datasetId);
      } else if (prev.length < 2) {
        return [...prev, datasetId];
      }
      return prev;
    });
  };

  const getCommonColumns = () => {
    if (selectedDatasets.length < 2) return [];
    
    const cols1 = datasets.find(d => d.id === selectedDatasets[0])?.columns || [];
    const cols2 = datasets.find(d => d.id === selectedDatasets[1])?.columns || [];
    
    return cols1.filter(col => cols2.includes(col));
  };

  const executeMerge = async () => {
    if (selectedDatasets.length < 2) {
      setError('Please select 2 datasets to merge');
      return;
    }

    if (!joinColumn) {
      setError('Please select a join column');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const dataset1 = datasets.find(d => d.id === selectedDatasets[0]);
      const dataset2 = datasets.find(d => d.id === selectedDatasets[1]);

      if (!dataset1 || !dataset2) {
        throw new Error('Selected datasets not found');
      }

      // Build SQL JOIN query
      const sql = `
        SELECT *
        FROM ${dataset1.tableName} t1
        ${joinType} JOIN ${dataset2.tableName} t2
        ON t1.${joinColumn} = t2.${joinColumn}
        LIMIT 10000
      `;

      const results = await query(sql);
      
      // Convert to array of objects
      const formattedResults = results.map(row => {
        const obj = {};
        Object.keys(row).forEach(key => {
          obj[key] = row[key];
        });
        return obj;
      });

      setMergeResults(formattedResults);
    } catch (err) {
      console.error('Merge error:', err);
      setError(err.message || 'Merge failed');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!mergeResults || mergeResults.length === 0) return;
    
    const dataset1 = datasets.find(d => d.id === selectedDatasets[0]);
    const dataset2 = datasets.find(d => d.id === selectedDatasets[1]);
    const filename = `merged_${dataset1?.name.replace(/\.[^/.]+$/, '')}_${dataset2?.name.replace(/\.[^/.]+$/, '')}`;
    exportData(mergeResults, filename, 'csv');
  };

  const commonColumns = getCommonColumns();

  return (
    <MergeContainer>
      <PageTitle>Merge datasets</PageTitle>

      {datasets.length < 2 ? (
        <MergeCard>
          <EmptyState
            icon={Merge}
            title="Need at least two files"
            description="Upload two or more datasets, then come back here to combine them by a shared column."
          />
        </MergeCard>
      ) : (
        <>
          <MergeCard>
            <CardTitle>Select Datasets to Merge</CardTitle>
            <FileGrid>
              {datasets.map(dataset => (
                <FileCard
                  key={dataset.id}
                  $selected={selectedDatasets.includes(dataset.id)}
                  onClick={() => handleDatasetToggle(dataset.id)}
                >
                  <FileName title={dataset.name}>{dataset.name}</FileName>
                  <FileInfo>{dataset.rowCount} rows • {dataset.columns.length} columns</FileInfo>
                </FileCard>
              ))}
            </FileGrid>

            {selectedDatasets.length === 2 && (
              <>
                <div style={{ 
                  marginBottom: '16px', 
                  padding: '16px', 
                  background: '#f0f9ff', 
                  border: '1px solid #bae6fd', 
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#0369a1',
                  lineHeight: '1.6'
                }}>
                  <strong style={{ display: 'block', marginBottom: '8px', color: '#075985' }}>
                    💡 Understanding Join Types:
                  </strong>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    <div><strong>Inner Join:</strong> Only keeps rows that match in both files. Best when you want complete data from both sources.</div>
                    <div><strong>Left Join:</strong> Keeps all rows from the first file, adds matching data from the second file when available.</div>
                    <div><strong>Right Join:</strong> Keeps all rows from the second file, adds matching data from the first file when available.</div>
                    <div><strong>Full Outer Join:</strong> Keeps every row from both files, matching them together when possible.</div>
                  </div>
                </div>

                <Select value={joinType} onChange={(e) => setJoinType(e.target.value)}>
                  <option value="INNER">Inner Join (only matching rows)</option>
                  <option value="LEFT">Left Join (all rows from first file)</option>
                  <option value="RIGHT">Right Join (all rows from second file)</option>
                  <option value="FULL">Full Outer Join (all rows from both files)</option>
                </Select>

                <Select value={joinColumn} onChange={(e) => setJoinColumn(e.target.value)}>
                  <option value="">Select join column...</option>
                  {commonColumns.map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </Select>

                <PrimaryButton type="button" onClick={executeMerge} disabled={loading || dbLoading || !joinColumn}>
                  <Merge size={18} />
                  {loading ? 'Merging…' : 'Merge datasets'}
                </PrimaryButton>
              </>
            )}
          </MergeCard>

          {error && (
            <MergeCard>
              <div className="error">{error}</div>
            </MergeCard>
          )}

          {mergeResults && !loading && (
            <ResultsCard>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                  Merge Results
                </h3>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ color: '#64748b', fontSize: '14px' }}>
                    {mergeResults.length} rows
                  </div>
                  <PrimaryButton type="button" onClick={handleExport}>
                    <Download size={18} />
                    Export
                  </PrimaryButton>
                </div>
              </div>

              {mergeResults.length === 0 ? (
                <EmptyState
                  title="No matching rows"
                  description="The two datasets don't share any rows for the chosen column. Try a different join type or join column."
                />
              ) : (
                <TableWrapper>
                  <Table>
                    <thead>
                      <tr>
                        {Object.keys(mergeResults[0]).map((key) => (
                          <Th key={key}>{key}</Th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {mergeResults.slice(0, 100).map((row, idx) => (
                        <Tr key={idx}>
                          {Object.values(row).map((value, cellIdx) => (
                            <Td key={cellIdx}>
                              {value === null || value === undefined ? (
                                <span style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>NULL</span>
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
        </>
      )}
    </MergeContainer>
  );
};

export default DataMerge;
