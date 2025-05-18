import React, { useState } from 'react';
import db from '../db/initDb';

export default function SQLConsole({ theme }) {
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
      <h2 style={{...styles.title, color: theme === 'light' ? '#000' : '#fff'}}>SQL Console</h2>
      <div style={styles.consoleContainer}>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          rows={8}
          placeholder="Enter SQL commands here..."
          style={{
            ...styles.textarea,
            backgroundColor: theme === 'light' ? '#fff' : '#1a1a1a',
            color: theme === 'light' ? '#000' : '#fff',
          }}
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
          <div style={{
            ...styles.resultsContainer,
            backgroundColor: theme === 'light' ? '#fff' : '#1a1a1a',
          }}>
            <table style={{
              ...styles.table,
              backgroundColor: theme === 'light' ? '#fff' : '#1a1a1a',
            }}>
              <thead>
                <tr>
                  {Object.keys(results[0] || {}).map((key) => (
                    <th key={key} style={{
                      ...styles.th,
                      backgroundColor: theme === 'light' ? '#f5f5f5' : '#333',
                      color: theme === 'light' ? '#000' : '#fff',
                    }}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map((row, i) => (
                  <tr key={i}>
                    {Object.values(row).map((val, j) => (
                      <td key={j} style={{
                        ...styles.td,
                        color: theme === 'light' ? '#000' : '#fff',
                        borderBottom: `1px solid ${theme === 'light' ? '#eee' : '#333'}`,
                      }}>{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {results && results.length === 0 && !error && (
          <div style={{...styles.noResults, color: theme === 'light' ? '#000' : '#fff'}}>
            No results to display.
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: '50%',
    minWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  },
  title: {
    fontSize: '32px',
    color: '#fff',
    marginBottom: '30px',
    textAlign: 'center',
  },
  consoleContainer: {
    backgroundColor: 'rgba(169, 169, 169, 0.5)',
    borderRadius: '15px',
    padding: '40px',
    backdropFilter: 'blur(10px)',
  },
  textarea: {
    width: '100%',
    minHeight: '250px',
    padding: '20px',
    fontSize: '16px',
    fontFamily: 'monospace',
    backgroundColor: '#1a1a1a',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    resize: 'vertical',
    marginBottom: '25px',
    boxSizing: 'border-box',
    lineHeight: '1.5',
  },
  executeButton: {
    width: '100%',
    padding: '15px',
    fontSize: '18px',
    backgroundColor: '#dc2626',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '25px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  },
  error: {
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    color: '#dc2626',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '25px',
    border: '1px solid #dc2626',
    fontSize: '16px',
  },
  resultsContainer: {
    overflowX: 'auto',
    marginTop: '25px',
    borderRadius: '8px',
    backgroundColor: '#1a1a1a',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#1a1a1a',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  th: {
    textAlign: 'left',
    padding: '15px 20px',
    backgroundColor: '#333',
    color: '#fff',
    fontWeight: '500',
    borderBottom: '1px solid #444',
    fontSize: '16px',
  },
  td: {
    padding: '15px 20px',
    color: '#fff',
    borderBottom: '1px solid #333',
    fontSize: '15px',
  },
  noResults: {
    color: '#fff',
    textAlign: 'center',
    padding: '25px',
    fontSize: '16px',
  },
};