import React, { useEffect, useState, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  Beaker,
  Database,
  Wand2,
  Download,
  Plus,
  X,
  TrendingUp,
  ToggleLeft,
  Scissors,
  Calculator,
} from 'lucide-react';
import useDataStore from '../stores/dataStore';
import { EmptyState } from './EmptyState';
import { exportData } from '../utils/export';

/* ─── animations ─── */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const spin = keyframes`to { transform: rotate(360deg); }`;

/* ─── layout ─── */
const Page = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: var(--space-10) var(--space-6);
`;
const Header = styled.header`
  margin-bottom: var(--space-6);
`;
const Title = styled.h1`
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 var(--space-2);
  display: flex;
  align-items: center;
  gap: var(--space-3);
`;
const Subtitle = styled.p`
  margin: 0;
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: 1.6;
  max-width: 640px;
`;

/* ─── card primitives ─── */
const Card = styled.section`
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-card);
  padding: var(--space-6);
  animation: ${fadeIn} 0.3s ease-out;
  & + & { margin-top: var(--space-5); }
`;
const CardLabel = styled.h2`
  font-size: var(--text-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-tertiary);
  margin: 0 0 var(--space-4);
`;
const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  align-items: flex-start;
`;
const Col = styled.div`
  flex: 1;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`;
const Label = styled.label`
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--text-secondary);
`;
const Hint = styled.p`
  margin: var(--space-1) 0 0;
  font-size: 11px;
  color: var(--text-tertiary);
  font-style: italic;
  line-height: 1.5;
`;

/* ─── inputs ─── */
const Select = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  background: var(--bg-surface);
  color: var(--text-primary);
  cursor: pointer;
  box-shadow: var(--shadow-xs);
  transition: border-color 0.2s, box-shadow 0.2s;
  &:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px var(--accent-primary-muted);
  }
`;
const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  background: var(--bg-surface);
  color: var(--text-primary);
  box-shadow: var(--shadow-xs);
  transition: border-color 0.2s, box-shadow 0.2s;
  &:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px var(--accent-primary-muted);
  }
  &::placeholder { color: var(--text-tertiary); }
`;
const TextArea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-family: var(--font-mono);
  line-height: 1.6;
  min-height: 72px;
  resize: vertical;
  background: var(--bg-surface);
  color: var(--text-primary);
  box-shadow: var(--shadow-xs);
  transition: border-color 0.2s, box-shadow 0.2s;
  &:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px var(--accent-primary-muted);
  }
  &::placeholder { color: var(--text-tertiary); }
`;

/* ─── buttons ─── */
const Btn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 20px;
  border: none;
  border-radius: 999px;
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
  &:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
`;
const BtnPrimary = styled(Btn)`
  background: var(--accent-primary);
  color: var(--text-inverse);
  &:hover:not(:disabled) {
    background: var(--accent-primary-hover);
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
  }
`;
const BtnSecondary = styled(Btn)`
  background: var(--border-strong);
  color: var(--text-primary);
  &:hover:not(:disabled) { background: var(--border-default); }
`;
const BtnGhost = styled(Btn)`
  background: transparent;
  color: var(--text-secondary);
  padding: 6px 12px;
  &:hover { color: var(--text-primary); background: var(--border-subtle); }
`;

/* ─── formula card ─── */
const FormulaCard = styled.div`
  position: relative;
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  padding: var(--space-4);
  animation: ${fadeIn} 0.2s ease-out;
  & + & { margin-top: var(--space-3); }
`;
const FormulaRemove = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--text-tertiary);
  padding: 4px;
  border-radius: 50%;
  transition: color 0.15s, background 0.15s;
  &:hover { color: var(--accent-error); background: var(--accent-error-muted); }
`;
const FormulaPreview = styled.div`
  margin-top: var(--space-3);
  padding: 8px 12px;
  border-radius: var(--radius-md);
  background: #020617;
  color: #bbf7d0;
  font-family: var(--font-mono);
  font-size: 11px;
  line-height: 1.6;
  white-space: pre-wrap;
`;

/* ─── quick-template chips ─── */
const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: var(--space-3);
`;
const Chip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 14px;
  border: 1px solid var(--border-default);
  border-radius: 999px;
  background: var(--bg-surface);
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition-default);
  &:hover {
    border-color: var(--accent-primary);
    color: var(--accent-primary);
    background: var(--accent-primary-muted);
  }
`;

/* ─── results ─── */
const ResultsCard = styled(Card)``;
const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
`;
const ResultsTitle = styled.h3`
  font-size: var(--text-md);
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
`;
const ResultsMeta = styled.span`
  font-size: var(--text-sm);
  color: var(--text-secondary);
`;
const TableWrap = styled.div`
  overflow: auto;
  max-height: 480px;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: var(--text-sm);
`;
const Th = styled.th`
  padding: 8px 12px;
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
  padding: 8px 12px;
  border-bottom: 1px solid var(--border-subtle);
  color: var(--text-primary);
`;
const Tr = styled.tr`
  &:nth-child(even) { background: rgba(255,255,255,0.02); }
`;
const Spinner = styled.div`
  width: 18px; height: 18px;
  border-radius: 50%;
  border: 2px solid var(--border-strong);
  border-top-color: var(--accent-primary);
  animation: ${spin} 0.7s linear infinite;
`;
const ErrorMsg = styled.p`
  margin: var(--space-3) 0 0;
  font-size: var(--text-xs);
  color: var(--accent-error);
`;
const ActionsBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-5);
  padding-top: var(--space-4);
  border-top: 1px solid var(--border-subtle);
`;

/* ─── formula type definitions ─── */
const FORMULA_TYPES = [
  {
    id: 'sellthrough',
    label: 'Sell-through rate',
    icon: TrendingUp,
    description: 'sold / (available + sold)',
    defaultName: 'SellThroughRate',
    fields: [
      { key: 'soldCol', label: 'Sold quantity column', heuristic: /sold|order|qty/i },
      { key: 'availCol', label: 'Available / inventory column', heuristic: /avail|stock|inventory|on.hand/i },
    ],
  },
  {
    id: 'negate',
    label: 'Negate (flip yes/no)',
    icon: ToggleLeft,
    description: 'Flips yes↔no, true↔false, 1↔0',
    defaultName: 'Negated',
    fields: [
      { key: 'col', label: 'Column to negate' },
    ],
  },
  {
    id: 'split',
    label: 'Split text',
    icon: Scissors,
    description: 'Extract first or last part by delimiter',
    defaultName: 'SplitResult',
    fields: [
      { key: 'col', label: 'Column to split' },
      { key: 'delimiter', label: 'Delimiter', inputType: 'text', placeholder: 'e.g. space or comma', defaultValue: ' ' },
      { key: 'part', label: 'Extract', inputType: 'select', options: [{ value: 'first', label: 'First part' }, { value: 'last', label: 'Last part' }], defaultValue: 'last' },
    ],
  },
  {
    id: 'percentage',
    label: 'Percentage (A / B × 100)',
    icon: Calculator,
    description: 'Compute (A / B) × 100',
    defaultName: 'Percentage',
    fields: [
      { key: 'colA', label: 'Numerator column' },
      { key: 'colB', label: 'Denominator column' },
    ],
  },
  {
    id: 'difference',
    label: 'Difference (A − B)',
    icon: Calculator,
    description: 'Subtract column B from column A',
    defaultName: 'Difference',
    fields: [
      { key: 'colA', label: 'Column A' },
      { key: 'colB', label: 'Column B' },
    ],
  },
  {
    id: 'custom',
    label: 'Custom expression',
    icon: Wand2,
    description: 'Write your own using [Column Name] syntax',
    defaultName: 'Calculated',
    fields: [
      { key: 'expr', label: 'Expression', inputType: 'textarea', placeholder: '= [Net items sold] / ([Available] + [Net items sold])' },
    ],
  },
];

/* ─── helpers ─── */
const getColumns = (ds) => {
  if (!ds) return [];
  if (Array.isArray(ds.columns) && ds.columns.length) return ds.columns;
  if (Array.isArray(ds.data) && ds.data.length) return Object.keys(ds.data[0]);
  return [];
};

const num = (v) => {
  if (v === null || v === undefined || v === '') return 0;
  const n = Number(v);
  return Number.isNaN(n) ? 0 : n;
};

const buildEvaluator = (formula, allCols) => {
  const type = FORMULA_TYPES.find((t) => t.id === formula.type);
  if (!type) return () => null;

  const cfg = formula.config;

  switch (formula.type) {
    case 'sellthrough': {
      const sold = cfg.soldCol;
      const avail = cfg.availCol;
      return (row) => {
        const s = num(row[sold]);
        const a = num(row[avail]);
        return a + s === 0 ? null : s / (a + s);
      };
    }
    case 'negate': {
      const col = cfg.col;
      return (row) => {
        const v = String(row[col] ?? '').trim().toLowerCase();
        if (v === 'yes') return 'no';
        if (v === 'no') return 'yes';
        if (v === 'true') return 'false';
        if (v === 'false') return 'true';
        if (v === '1') return '0';
        if (v === '0') return '1';
        if (v === 'contains') return 'free';
        if (v === 'free') return 'contains';
        return v ? `NOT ${row[col]}` : '';
      };
    }
    case 'split': {
      const col = cfg.col;
      const delim = cfg.delimiter || ' ';
      const part = cfg.part || 'last';
      return (row) => {
        const v = String(row[col] ?? '');
        const parts = v.split(delim);
        return part === 'first' ? parts[0] : parts[parts.length - 1];
      };
    }
    case 'percentage': {
      const a = cfg.colA;
      const b = cfg.colB;
      return (row) => {
        const denom = num(row[b]);
        return denom === 0 ? null : (num(row[a]) / denom) * 100;
      };
    }
    case 'difference': {
      const a = cfg.colA;
      const b = cfg.colB;
      return (row) => num(row[a]) - num(row[b]);
    }
    case 'custom': {
      let expr = (cfg.expr || '').trim();
      if (expr.startsWith('=')) expr = expr.slice(1);
      if (!expr) return () => null;
      const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      let jsExpr = expr;
      allCols.forEach((col) => {
        jsExpr = jsExpr.replace(
          new RegExp(`\\[${esc(col)}\\]`, 'g'),
          `_v("${col.replace(/"/g, '\\"')}")`
        );
      });
      try {
        const fn = new Function('_v', 'row', `return ${jsExpr};`);
        return (row) => {
          try {
            return fn((name) => num(row[name]), row);
          } catch {
            return null;
          }
        };
      } catch {
        return () => null;
      }
    }
    default:
      return () => null;
  }
};

const formulaPreviewText = (formula) => {
  const cfg = formula.config;
  switch (formula.type) {
    case 'sellthrough':
      return `[${cfg.soldCol || '?'}] / ([${cfg.availCol || '?'}] + [${cfg.soldCol || '?'}])`;
    case 'negate':
      return `negate([${cfg.col || '?'}])  →  yes↔no, true↔false, 1↔0`;
    case 'split':
      return `split([${cfg.col || '?'}], "${cfg.delimiter || ' '}", ${cfg.part || 'last'})`;
    case 'percentage':
      return `([${cfg.colA || '?'}] / [${cfg.colB || '?'}]) × 100`;
    case 'difference':
      return `[${cfg.colA || '?'}] − [${cfg.colB || '?'}]`;
    case 'custom':
      return cfg.expr || '(no expression)';
    default:
      return '';
  }
};

const joinDatasets = (dsA, dsB, keyA, keyB) => {
  const dataA = dsA.data || [];
  const dataB = dsB.data || [];
  const colsA = getColumns(dsA);
  const colsB = getColumns(dsB);

  const overlap = new Set(colsA.filter((c) => colsB.includes(c) && c !== keyA && c !== keyB));

  const prefixRow = (row, cols, prefix) => {
    const out = {};
    cols.forEach((c) => {
      const key = overlap.has(c) ? `${prefix}_${c}` : c;
      out[key] = row[c];
    });
    return out;
  };

  const mapB = new Map();
  dataB.forEach((row) => {
    const k = String(row[keyB] ?? '').trim();
    if (!mapB.has(k)) mapB.set(k, []);
    mapB.get(k).push(row);
  });

  const usedB = new Set();
  const merged = [];

  dataA.forEach((rowA) => {
    const k = String(rowA[keyA] ?? '').trim();
    const matchesB = mapB.get(k);
    if (matchesB && matchesB.length) {
      matchesB.forEach((rowB) => {
        usedB.add(rowB);
        merged.push({
          ...prefixRow(rowA, colsA, dsA.name?.replace(/\.[^/.]+$/, '')),
          ...prefixRow(rowB, colsB, dsB.name?.replace(/\.[^/.]+$/, '')),
        });
      });
    } else {
      const emptyB = {};
      colsB.forEach((c) => {
        const key = overlap.has(c) ? `${dsB.name?.replace(/\.[^/.]+$/, '')}_${c}` : c;
        emptyB[key] = null;
      });
      merged.push({ ...prefixRow(rowA, colsA, dsA.name?.replace(/\.[^/.]+$/, '')), ...emptyB });
    }
  });

  dataB.forEach((rowB) => {
    if (!usedB.has(rowB)) {
      const emptyA = {};
      colsA.forEach((c) => {
        const key = overlap.has(c) ? `${dsA.name?.replace(/\.[^/.]+$/, '')}_${c}` : c;
        emptyA[key] = null;
      });
      merged.push({ ...emptyA, ...prefixRow(rowB, colsB, dsB.name?.replace(/\.[^/.]+$/, '')) });
    }
  });

  return merged;
};

/* ─── component ─── */
const FormulasProduct = () => {
  const datasets = useDataStore((s) => s.datasets);

  const [file1Id, setFile1Id] = useState('');
  const [file2Id, setFile2Id] = useState('');
  const [joinKey1, setJoinKey1] = useState('');
  const [joinKey2, setJoinKey2] = useState('');
  const [formulas, setFormulas] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const ds1 = datasets.find((d) => d.id === file1Id) || null;
  const ds2 = datasets.find((d) => d.id === file2Id) || null;
  const cols1 = useMemo(() => getColumns(ds1), [ds1]);
  const cols2 = useMemo(() => getColumns(ds2), [ds2]);

  const allCols = useMemo(() => {
    if (!ds2) return cols1;
    const overlap = new Set(cols1.filter((c) => cols2.includes(c) && c !== joinKey1 && c !== joinKey2));
    const prefixed1 = cols1.map((c) => (overlap.has(c) ? `${ds1?.name?.replace(/\.[^/.]+$/, '')}_${c}` : c));
    const prefixed2 = cols2.map((c) => (overlap.has(c) ? `${ds2?.name?.replace(/\.[^/.]+$/, '')}_${c}` : c));
    return [...new Set([...prefixed1, ...prefixed2])];
  }, [cols1, cols2, ds1, ds2, joinKey1, joinKey2]);

  useEffect(() => {
    if (!file1Id && datasets.length) setFile1Id(datasets[0].id);
  }, [datasets, file1Id]);

  useEffect(() => {
    if (cols1.length && !joinKey1) setJoinKey1(cols1[0]);
  }, [cols1, joinKey1]);

  useEffect(() => {
    if (cols2.length && !joinKey2) setJoinKey2(cols2[0]);
  }, [cols2, joinKey2]);

  const addFormula = (typeId) => {
    const typeDef = FORMULA_TYPES.find((t) => t.id === typeId) || FORMULA_TYPES[0];
    const config = {};
    typeDef.fields.forEach((f) => {
      if (f.inputType === 'text' || f.inputType === 'textarea') {
        config[f.key] = f.defaultValue || '';
      } else if (f.inputType === 'select') {
        config[f.key] = f.defaultValue || f.options?.[0]?.value || '';
      } else {
        const guess = allCols.find((c) => f.heuristic?.test(c)) || allCols[0] || '';
        config[f.key] = guess;
      }
    });
    setFormulas((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: typeId,
        name: typeDef.defaultName,
        config,
      },
    ]);
  };

  const updateFormula = (id, patch) => {
    setFormulas((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  };

  const updateFormulaConfig = (id, key, value) => {
    setFormulas((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, config: { ...f.config, [key]: value } } : f
      )
    );
  };

  const removeFormula = (id) => {
    setFormulas((prev) => prev.filter((f) => f.id !== id));
  };

  const handleApply = () => {
    if (!ds1) { setError('Please select at least one file.'); return; }
    if (formulas.length === 0) { setError('Add at least one formula.'); return; }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      let rows;
      if (ds2 && joinKey1 && joinKey2) {
        rows = joinDatasets(ds1, ds2, joinKey1, joinKey2);
      } else {
        rows = (ds1.data || []).map((r) => ({ ...r }));
      }

      const mergedCols = rows.length > 0 ? Object.keys(rows[0]) : allCols;

      formulas.forEach((formula) => {
        const evalFn = buildEvaluator(formula, mergedCols);
        rows = rows.map((row) => ({
          ...row,
          [formula.name]: evalFn(row),
        }));
        if (!mergedCols.includes(formula.name)) mergedCols.push(formula.name);
      });

      setResults(rows.slice(0, 500));
    } catch (err) {
      console.error('Formula error:', err);
      setError(err.message || 'Something went wrong applying formulas.');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!results || !results.length) return;
    const name = ds1?.name?.replace(/\.[^/.]+$/, '') || 'formula_results';
    exportData(results, `${name}_formulas`, 'csv');
  };

  /* ─── empty state ─── */
  if (!datasets.length) {
    return (
      <Page>
        <Header>
          <Title><Beaker size={24} /> Formulas (Product)</Title>
          <Subtitle>Upload a CSV or Excel file first, then come back here to apply formulas.</Subtitle>
        </Header>
        <EmptyState
          icon={Database}
          title="No data yet"
          description="Upload a file to get started with formulas like sell-through rate, negate, split, and more."
        />
      </Page>
    );
  }

  /* ─── main render ─── */
  return (
    <Page>
      <Header>
        <Title><Beaker size={24} /> Formulas (Product)</Title>
        <Subtitle>
          Apply Excel-style formulas to one or two files. Pick presets like
          sell-through or negate, or write custom expressions — no SQL needed.
        </Subtitle>
      </Header>

      {/* ── FILES ── */}
      <Card>
        <CardLabel>Files</CardLabel>
        <Row>
          <Col>
            <Label>File 1</Label>
            <Select value={file1Id} onChange={(e) => { setFile1Id(e.target.value); setResults(null); }}>
              {datasets.map((d) => (
                <option key={d.id} value={d.id}>{d.name} ({d.rowCount} rows)</option>
              ))}
            </Select>
          </Col>
          <Col>
            <Label>File 2 (optional)</Label>
            <Select value={file2Id} onChange={(e) => { setFile2Id(e.target.value); setResults(null); }}>
              <option value="">— none —</option>
              {datasets.map((d) => (
                <option key={d.id} value={d.id}>{d.name} ({d.rowCount} rows)</option>
              ))}
            </Select>
          </Col>
        </Row>

        {ds2 && (
          <>
            <Hint>When using two files we join them on a shared key (like SKU or Part No.).</Hint>
            <Row style={{ marginTop: 12 }}>
              <Col>
                <Label>Match column from {ds1?.name}</Label>
                <Select value={joinKey1} onChange={(e) => setJoinKey1(e.target.value)}>
                  {cols1.map((c) => <option key={c} value={c}>{c}</option>)}
                </Select>
              </Col>
              <Col>
                <Label>Match column from {ds2?.name}</Label>
                <Select value={joinKey2} onChange={(e) => setJoinKey2(e.target.value)}>
                  {cols2.map((c) => <option key={c} value={c}>{c}</option>)}
                </Select>
              </Col>
            </Row>
          </>
        )}
      </Card>

      {/* ── FORMULAS ── */}
      <Card>
        <CardLabel>Your formulas</CardLabel>

        {formulas.length === 0 && (
          <Hint style={{ marginBottom: 12 }}>
            No formulas yet. Use the quick templates below or click "+ Add formula" to get started.
          </Hint>
        )}

        {formulas.map((formula) => {
          const typeDef = FORMULA_TYPES.find((t) => t.id === formula.type) || FORMULA_TYPES[0];
          return (
            <FormulaCard key={formula.id}>
              <FormulaRemove type="button" onClick={() => removeFormula(formula.id)} title="Remove">
                <X size={14} />
              </FormulaRemove>

              <Row>
                <Col style={{ maxWidth: 200 }}>
                  <Label>New column</Label>
                  <Input
                    value={formula.name}
                    onChange={(e) => updateFormula(formula.id, { name: e.target.value })}
                    placeholder="Column name"
                  />
                </Col>
                <Col style={{ maxWidth: 260 }}>
                  <Label>Formula type</Label>
                  <Select
                    value={formula.type}
                    onChange={(e) => {
                      const nextType = e.target.value;
                      const nextDef = FORMULA_TYPES.find((t) => t.id === nextType);
                      const nextConfig = {};
                      (nextDef?.fields || []).forEach((f) => {
                        if (f.inputType === 'text' || f.inputType === 'textarea') {
                          nextConfig[f.key] = f.defaultValue || '';
                        } else if (f.inputType === 'select') {
                          nextConfig[f.key] = f.defaultValue || f.options?.[0]?.value || '';
                        } else {
                          nextConfig[f.key] = allCols.find((c) => f.heuristic?.test(c)) || allCols[0] || '';
                        }
                      });
                      updateFormula(formula.id, {
                        type: nextType,
                        name: formula.name || nextDef?.defaultName || 'Calculated',
                        config: nextConfig,
                      });
                    }}
                  >
                    {FORMULA_TYPES.map((t) => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </Select>
                </Col>
              </Row>

              <Row style={{ marginTop: 10 }}>
                {typeDef.fields.map((field) => {
                  if (field.inputType === 'text') {
                    return (
                      <Col key={field.key} style={{ maxWidth: 160 }}>
                        <Label>{field.label}</Label>
                        <Input
                          value={formula.config[field.key] || ''}
                          onChange={(e) => updateFormulaConfig(formula.id, field.key, e.target.value)}
                          placeholder={field.placeholder || ''}
                        />
                      </Col>
                    );
                  }
                  if (field.inputType === 'select') {
                    return (
                      <Col key={field.key} style={{ maxWidth: 160 }}>
                        <Label>{field.label}</Label>
                        <Select
                          value={formula.config[field.key] || ''}
                          onChange={(e) => updateFormulaConfig(formula.id, field.key, e.target.value)}
                        >
                          {field.options.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </Select>
                      </Col>
                    );
                  }
                  if (field.inputType === 'textarea') {
                    return (
                      <Col key={field.key} style={{ flex: '1 1 100%' }}>
                        <Label>{field.label}</Label>
                        <TextArea
                          value={formula.config[field.key] || ''}
                          onChange={(e) => updateFormulaConfig(formula.id, field.key, e.target.value)}
                          placeholder={field.placeholder || ''}
                          spellCheck={false}
                        />
                      </Col>
                    );
                  }
                  return (
                    <Col key={field.key}>
                      <Label>{field.label}</Label>
                      <Select
                        value={formula.config[field.key] || ''}
                        onChange={(e) => updateFormulaConfig(formula.id, field.key, e.target.value)}
                      >
                        {allCols.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </Select>
                    </Col>
                  );
                })}
              </Row>

              <FormulaPreview>{formulaPreviewText(formula)}</FormulaPreview>
            </FormulaCard>
          );
        })}

        <Chips>
          <Chip type="button" onClick={() => addFormula('sellthrough')}>
            <TrendingUp size={13} /> Sell-through rate
          </Chip>
          <Chip type="button" onClick={() => addFormula('negate')}>
            <ToggleLeft size={13} /> Negate
          </Chip>
          <Chip type="button" onClick={() => addFormula('split')}>
            <Scissors size={13} /> Split text
          </Chip>
          <Chip type="button" onClick={() => addFormula('percentage')}>
            <Calculator size={13} /> Percentage
          </Chip>
          <Chip type="button" onClick={() => addFormula('difference')}>
            <Calculator size={13} /> Difference
          </Chip>
          <Chip type="button" onClick={() => addFormula('custom')}>
            <Wand2 size={13} /> Custom
          </Chip>
          <BtnGhost type="button" onClick={() => addFormula('custom')}>
            <Plus size={14} /> Add formula
          </BtnGhost>
        </Chips>

        {error && <ErrorMsg>{error}</ErrorMsg>}

        <ActionsBar>
          <BtnPrimary
            type="button"
            onClick={handleApply}
            disabled={loading || formulas.length === 0}
          >
            {loading ? <Spinner /> : <Wand2 size={16} />}
            {loading ? 'Applying…' : 'Apply formulas'}
          </BtnPrimary>
          {results && results.length > 0 && (
            <BtnSecondary type="button" onClick={handleExport}>
              <Download size={16} /> Export results
            </BtnSecondary>
          )}
        </ActionsBar>
      </Card>

      {/* ── RESULTS ── */}
      {results && !loading && (
        <ResultsCard>
          <ResultsHeader>
            <ResultsTitle>Results preview</ResultsTitle>
            <ResultsMeta>{results.length} row{results.length !== 1 ? 's' : ''} (showing up to 500)</ResultsMeta>
            <BtnSecondary type="button" onClick={handleExport}>
              <Download size={14} /> Export
            </BtnSecondary>
          </ResultsHeader>

          {results.length === 0 ? (
            <Hint>No rows returned.</Hint>
          ) : (
            <TableWrap>
              <Table>
                <thead>
                  <tr>
                    {Object.keys(results[0]).map((k) => <Th key={k}>{k}</Th>)}
                  </tr>
                </thead>
                <tbody>
                  {results.map((row, i) => (
                    <Tr key={i}>
                      {Object.values(row).map((v, j) => (
                        <Td key={j}>
                          {v === null || v === undefined
                            ? 'NULL'
                            : typeof v === 'number'
                              ? Number.isInteger(v) ? v : v.toFixed(4)
                              : String(v)}
                        </Td>
                      ))}
                    </Tr>
                  ))}
                </tbody>
              </Table>
            </TableWrap>
          )}
        </ResultsCard>
      )}
    </Page>
  );
};

export default FormulasProduct;
