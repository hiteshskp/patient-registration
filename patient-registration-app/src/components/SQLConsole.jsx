import React, { useState } from 'react';
import db from '../db/initDb';

export default function SQLConsole() {
  const [query, setQuery] = useState('SELECT * FROM patients;');
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const runQuery = async () => {
    setLoading(true);
    setError(null);
    try {
      // Optional basic protection: restrict DDL/DML if needed
      const lowerQuery = query.trim().toLowerCase();
      if (
        lowerQuery.startsWith('drop') ||
        lowerQuery.startsWith('delete') ||
        lowerQuery.startsWith('update')
      ) {
        throw new Error('Destructive SQL commands are not allowed.');
      }
      const res = await db.query(query);
      setResults(res.rows);
    } catch (e) {
      setError(e.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>SQL Console</h2>
      <div style={styles.consoleContainer}>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          rows={8}
          placeholder="Enter SQL commands here..."
          style={styles.textarea}
        />
        <button 
          onClick={runQuery} 
          style={styles.executeButton} 
          disabled={loading}
        >
          {loading ? 'Running...' : 'Execute'}
        </button>
        
        {error && (
          <div style={styles.error}>
            Error: {error}
          </div>
        )}

        {results && results.length > 0 && (
          <div style={styles.resultsContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {Object.keys(results[0] || {}).map((key) => (
                    <th key={key} style={styles.th}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map((row, i) => (
                  <tr key={i}>
                    {Object.values(row).map((val, j) => (
                      <td key={j} style={styles.td}>{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {results && results.length === 0 && !error && (
          <div style={styles.noResults}>No results to display.</div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  },
  title: {
    fontSize: '24px',
    color: '#fff',
    marginBottom: '20px',
  },
  consoleContainer: {
    backgroundColor: 'rgba(169, 169, 169, 0.5)',
    borderRadius: '10px',
    padding: '30px',
    backdropFilter: 'blur(10px)',
  },
  textarea: {
    width: '100%',
    minHeight: '200px',
    padding: '15px',
    fontSize: '14px',
    fontFamily: 'monospace',
    backgroundColor: '#1a1a1a',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    resize: 'vertical',
    marginBottom: '20px',
    boxSizing: 'border-box',
  },
  executeButton: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#dc2626',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '20px',
  },
  error: {
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    color: '#dc2626',
    padding: '12px',
    borderRadius: '5px',
    marginBottom: '20px',
    border: '1px solid #dc2626',
  },
  resultsContainer: {
    overflowX: 'auto',
    marginTop: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#1a1a1a',
    borderRadius: '5px',
    overflow: 'hidden',
  },
  th: {
    textAlign: 'left',
    padding: '12px',
    backgroundColor: '#333',
    color: '#fff',
    fontWeight: 'normal',
    borderBottom: '1px solid #444',
  },
  td: {
    padding: '12px',
    color: '#fff',
    borderBottom: '1px solid #333',
  },
  noResults: {
    color: '#fff',
    textAlign: 'center',
    padding: '20px',
  },
};