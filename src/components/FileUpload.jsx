import React, { useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import { parseFile, detectColumnTypes, getDatasetStats } from '../utils/fileParser';
import { useDuckDB } from '../hooks/useDuckDB';
import useDataStore from '../stores/dataStore';
import { EmptyState } from './EmptyState';

const pulseBorder = keyframes`
  0%, 100% { border-color: var(--border-default); opacity: 1; }
  50% { border-color: var(--accent-primary); opacity: 0.8; }
`;

const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
`;

const UploadContainer = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: var(--space-10) var(--space-6);
`;

const Card = styled.div`
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-card);
  padding: var(--space-10);
  box-shadow: var(--shadow-md);
  animation: ${scaleIn} 0.35s ease-out;
`;

const PageTitle = styled.h1`
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--space-2);
  letter-spacing: -0.02em;
`;

const PageSubtitle = styled.p`
  font-size: var(--text-md);
  color: var(--text-secondary);
  margin-bottom: var(--space-8);
  line-height: 1.5;
`;

const DbLoading = styled.div`
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background: var(--accent-primary-muted);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  color: var(--accent-primary);
  margin-bottom: var(--space-6);
`;

const DbError = styled.div`
  padding: var(--space-4);
  background: var(--accent-error-muted);
  border: 1px solid var(--accent-error);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  color: var(--accent-error);
  margin-bottom: var(--space-6);
  text-align: left;
`;

const Dropzone = styled.div`
  border: 2px dashed ${(p) => (p.$active ? 'var(--accent-primary)' : 'var(--border-strong)')};
  border-radius: var(--radius-xl);
  padding: var(--space-12) var(--space-10);
  background: ${(p) => (p.$active ? 'var(--accent-primary-muted)' : 'transparent')};
  cursor: pointer;
  transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;
  margin-bottom: var(--space-8);

  ${(p) =>
    p.$active &&
    `
    transform: scale(1.01);
    box-shadow: var(--shadow-sm);
  `}

  &:hover {
    border-color: var(--accent-primary);
    background: var(--accent-primary-muted);
  }
`;

const DropzoneContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
`;

const DropzoneIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: var(--radius-xl);
  background: var(--accent-primary-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-primary);
  transition: transform 0.2s ease;
  ${Dropzone}:hover & { transform: scale(1.05); }
  ${Dropzone}[$active="true"] & { transform: scale(1.08); }
`;

const DropzoneTitle = styled.div`
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-primary);
`;

const DropzoneHint = styled.div`
  font-size: var(--text-sm);
  color: var(--text-secondary);
`;

const BadgeRow = styled.div`
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
  justify-content: center;
  margin-top: var(--space-2);
`;

const Badge = styled.span`
  font-size: var(--text-xs);
  font-weight: 500;
  padding: var(--space-1) var(--space-3);
  background: var(--border-subtle);
  border-radius: var(--radius-full);
  color: var(--text-secondary);
`;

const FileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4);
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  animation: ${scaleIn} 0.25s ease-out;

  &:hover {
    border-color: var(--border-strong);
    box-shadow: var(--shadow-xs);
  }
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-4);
  min-width: 0;
`;

const FileIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${(p) =>
    p.$status === 'success'
      ? 'var(--accent-success-muted)'
      : p.$status === 'error'
      ? 'var(--accent-error-muted)'
      : 'var(--border-subtle)'};
  color: ${(p) =>
    p.$status === 'success'
      ? 'var(--accent-success)'
      : p.$status === 'error'
      ? 'var(--accent-error)'
      : 'var(--text-tertiary)'};
`;

const FileDetails = styled.div`
  min-width: 0;
`;

const FileName = styled.div`
  font-weight: 600;
  font-size: var(--text-md);
  color: var(--text-primary);
  margin-bottom: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const FileMeta = styled.div`
  font-size: var(--text-sm);
  color: var(--text-secondary);
`;

const FileStatus = styled.span`
  font-size: var(--text-sm);
  font-weight: 500;
  color: ${(p) =>
    p.$status === 'success' ? 'var(--accent-success)' : 'var(--accent-error)'};
`;

const RemoveBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--text-tertiary);
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;

  &:hover {
    background: var(--accent-error-muted);
    color: var(--accent-error);
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
  font-size: var(--text-md);
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
  box-shadow: var(--shadow-sm);

  &:hover:not(:disabled) {
    background: var(--accent-primary-hover);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const spinner = keyframes`
  to { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: ${spinner} 0.7s linear infinite;
`;

const ResultMessages = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-top: var(--space-6);
`;

const ResultMessage = styled.div`
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  text-align: left;
  background: ${(p) =>
    p.$success ? 'var(--accent-success-muted)' : 'var(--accent-error-muted)'};
  color: ${(p) => (p.$success ? 'var(--accent-success)' : 'var(--accent-error)')};
  border: 1px solid ${(p) => (p.$success ? 'var(--accent-success)' : 'var(--accent-error)')};
`;

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState([]);

  const { registerTable, loading: dbLoading, error: dbError } = useDuckDB();
  const addDataset = useDataStore((state) => state.addDataset);

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      id: Math.random().toString(36).slice(2, 9),
      status: 'pending',
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    multiple: true,
  });

  const removeFile = (fileId) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    setUploadResults((prev) => prev.filter((r) => r.id !== fileId));
  };

  const uploadFiles = async () => {
    if (files.length === 0 || dbLoading || dbError) return;
    setUploading(true);
    const results = [];

    for (const fileItem of files) {
      try {
        const parseResult = await parseFile(fileItem.file);
        const { data, errors } = parseResult;
        if (errors.length > 0 && errors.some((e) => e.type === 'Quotes')) {
          console.warn('File parsing warnings:', errors);
        }
        if (!data || data.length === 0) {
          throw new Error('File is empty or could not be parsed');
        }
        const columnTypes = detectColumnTypes(data);
        const stats = getDatasetStats(data);
        const columns = Object.keys(data[0]);
        const tableName = `table_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        await registerTable(tableName, data);
        const datasetId = addDataset({
          name: fileItem.file.name,
          columns,
          rowCount: data.length,
          tableName,
          data,
          fileType: fileItem.file.name.endsWith('.csv') ? 'csv' : 'excel',
        });
        results.push({
          id: fileItem.id,
          status: 'success',
          message: `Uploaded ${fileItem.file.name} (${data.length} rows)`,
          datasetId,
        });
      } catch (error) {
        console.error('Upload error:', error);
        results.push({
          id: fileItem.id,
          status: 'error',
          message: `Failed to upload ${fileItem.file.name}: ${error.message}`,
        });
      }
    }

    setUploadResults(results);
    setUploading(false);

    const successfulUploads = results.filter((r) => r.status === 'success');
    if (successfulUploads.length > 0) {
      setTimeout(() => {
        setFiles([]);
        setUploadResults([]);
      }, 2000);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileStatus = (fileId) => {
    const result = uploadResults.find((r) => r.id === fileId);
    return result ? result.status : 'pending';
  };

  return (
    <UploadContainer>
      <Card>
        <PageTitle>Upload your data</PageTitle>
        <PageSubtitle>
          Drop CSV or Excel files here. Everything runs in your browser — nothing is sent to a server.
        </PageSubtitle>

        {dbLoading && (
          <DbLoading>Preparing your workspace…</DbLoading>
        )}

        {dbError && (
          <DbError>
            Something went wrong loading the database. Try refreshing the page — {dbError}
          </DbError>
        )}

        <Dropzone {...getRootProps()} $active={isDragActive}>
          <input {...getInputProps()} />
          <DropzoneContent>
            <DropzoneIcon>
              <Upload size={28} strokeWidth={1.8} />
            </DropzoneIcon>
            <div>
              <DropzoneTitle>
                {isDragActive ? 'Drop to add files' : 'Drag files here'}
              </DropzoneTitle>
              <DropzoneHint>or click to browse</DropzoneHint>
            </div>
            <BadgeRow>
              <Badge>CSV</Badge>
              <Badge>XLS</Badge>
              <Badge>XLSX</Badge>
            </BadgeRow>
          </DropzoneContent>
        </Dropzone>

        {files.length > 0 && (
          <FileList>
            {files.map((fileItem) => (
              <FileItem key={fileItem.id}>
                <FileInfo>
                  <FileIcon $status={getFileStatus(fileItem.id)}>
                    {getFileStatus(fileItem.id) === 'success' ? (
                      <CheckCircle size={22} />
                    ) : getFileStatus(fileItem.id) === 'error' ? (
                      <AlertCircle size={22} />
                    ) : (
                      <FileText size={22} />
                    )}
                  </FileIcon>
                  <FileDetails>
                    <FileName>{fileItem.file.name}</FileName>
                    <FileMeta>{formatFileSize(fileItem.file.size)}</FileMeta>
                  </FileDetails>
                </FileInfo>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {getFileStatus(fileItem.id) !== 'pending' && (
                    <FileStatus $status={getFileStatus(fileItem.id)}>
                      {getFileStatus(fileItem.id) === 'success' ? 'Done' : 'Failed'}
                    </FileStatus>
                  )}
                  <RemoveBtn type="button" onClick={() => removeFile(fileItem.id)} aria-label="Remove file">
                    <X size={18} />
                  </RemoveBtn>
                </div>
              </FileItem>
            ))}
          </FileList>
        )}

        {files.length > 0 && (
          <PrimaryButton
            type="button"
            onClick={uploadFiles}
            disabled={uploading || dbLoading || !!dbError}
          >
            {uploading ? (
              <>
                <Spinner />
                Uploading…
              </>
            ) : (
              <>
                <Upload size={20} strokeWidth={2} />
                Upload {files.length} file{files.length !== 1 ? 's' : ''}
              </>
            )}
          </PrimaryButton>
        )}

        {uploadResults.length > 0 && (
          <ResultMessages>
            {uploadResults.map((result) => (
              <ResultMessage key={result.id} $success={result.status === 'success'}>
                {result.message}
              </ResultMessage>
            ))}
          </ResultMessages>
        )}
      </Card>
    </UploadContainer>
  );
};

export default FileUpload;
