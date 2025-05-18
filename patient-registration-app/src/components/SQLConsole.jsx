import React, { useState, useEffect } from 'react';
import db from '../db/initDb';

const formatValue = (value) => {
  if (value === null) return 'NULL';
  if (value instanceof Date) return value.toLocaleString();
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};

export default function SQLConsole({ theme, dbChannel }) {
  const [query, setQuery] = useState('SELECT * FROM patients ORDER BY id DESC;');
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [queryHistory, setQueryHistory] = useState([]);
  const [lastSync, setLastSync] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Listen for database changes from other tabs
    dbChannel.onmessage = (event) => {
      const { type } = event.data;
      if (type === 'PATIENT_ADDED' || type === 'PATIENTS_UPDATED') {
        setLastSync(new Date().toLocaleTimeString());
        setNotification('🔄 Database updated in another tab');
        setTimeout(() => setNotification(null), 3000);
        
        // Automatically refresh the results
        executeQuery(query);
      }
    };

    // Initial load
    executeQuery(query);
  }, []);

  const executeQuery = async (sqlQuery) => {
    setLoading(true);
    setError(null);
    
    // Prevent destructive queries
    const lowerQuery = sqlQuery.toLowerCase();
    if (lowerQuery.includes('drop') || lowerQuery.includes('delete') || lowerQuery.includes('truncate')) {
      setError('Destructive operations are not allowed');
      setLoading(false);
      return;
    }

    try {
      console.log('Executing query:', sqlQuery);
      const result = await db.query(sqlQuery);
      console.log('Query result:', result);
      
      if (result && result.rows) {
        setResults(result);
        // Add to query history if it's a new query
        if (!queryHistory.includes(sqlQuery)) {
          setQueryHistory(prev => [sqlQuery, ...prev].slice(0, 5));
        }
      } else {
        throw new Error('No results returned from query');
      }
    } catch (error) {
      console.error('Error executing query:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExecute = () => {
    if (!query.trim()) return;
    executeQuery(query);
  };

  const exportToCSV = () => {
    if (!results?.rows || results.rows.length === 0) {
      setNotification('⚠️ No data to export');
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    try {
      // Get headers from the first row
      const headers = Object.keys(results.rows[0]);
      
      // Convert data to CSV format
      const csvContent = [
        headers.join(','), // Header row
        ...results.rows.map(row => 
          headers.map(header => {
            // Handle values that might contain commas or quotes
            const value = row[header]?.toString() || '';
            if (value.includes(',') || value.includes('"') || value.includes('\n')) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          }).join(',')
        )
      ].join('\n');

      // Create blob and download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      // Create filename from query
      const queryName = query.trim().toLowerCase()
        .replace(/select|from|where|order by|group by|;/g, '')
        .replace(/\s+/g, '_')
        .slice(0, 30);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `query_results_${queryName}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setNotification('✅ CSV exported successfully!');
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      setNotification('❌ Error exporting CSV');
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div style={styles.container}>
      {notification && <div style={styles.notification}>{notification}</div>}
      
      <div style={styles.header}>
        <h2 style={{...styles.title, color: theme === 'light' ? '#000' : '#fff'}}>SQL Console</h2>
        <div style={styles.headerControls}>
          <div style={{...styles.stats, color: theme === 'light' ? '#000' : '#fff'}}>
            {results && <span>Records: {results.rows?.length || 0}</span>}
            {lastSync && <span>Last Sync: {lastSync}</span>}
          </div>
          {results?.rows?.length > 0 && (
            <button
              onClick={exportToCSV}
              style={{
                ...styles.exportButton,
                backgroundColor: theme === 'light' ? '#fff' : '#333',
                color: theme === 'light' ? '#000' : '#fff',
              }}
            >
              📥 Export CSV
            </button>
          )}
        </div>
      </div>

      <div style={styles.consoleContainer}>
        <div style={styles.queryHistoryContainer}>
          <h3 style={{...styles.historyTitle, color: theme === 'light' ? '#000' : '#fff'}}>Recent Queries</h3>
          {queryHistory.map((historyQuery, index) => (
            <button
              key={index}
              onClick={() => setQuery(historyQuery)}
              style={{
                ...styles.historyItem,
                backgroundColor: theme === 'light' ? '#f5f5f5' : '#333',
                color: theme === 'light' ? '#000' : '#fff',
              }}
            >
              {historyQuery}
            </button>
          ))}
        </div>

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
          onClick={handleExecute} 
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

        {results && results.rows && results.rows.length > 0 && (
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
                  {Object.keys(results.rows[0] || {}).map((key) => (
                    <th key={key} style={{
                      ...styles.th,
                      backgroundColor: theme === 'light' ? '#f5f5f5' : '#333',
                      color: theme === 'light' ? '#000' : '#fff',
                    }}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.rows.map((row, i) => (
                  <tr key={i}>
                    {Object.values(row).map((val, j) => (
                      <td key={j} style={{
                        ...styles.td,
                        color: theme === 'light' ? '#000' : '#fff',
                        borderBottom: `1px solid ${theme === 'light' ? '#eee' : '#333'}`,
                      }}>{formatValue(val)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {results && results.rows && results.rows.length === 0 && !error && (
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  stats: {
    display: 'flex',
    gap: '20px',
    fontSize: '14px',
    opacity: 0.8,
  },
  notification: {
    backgroundColor: '#444',
    color: '#fff',
    padding: '15px 30px',
    borderRadius: '8px',
    marginBottom: '30px',
    textAlign: 'center',
    fontSize: '16px',
  },
  queryHistoryContainer: {
    marginBottom: '20px',
  },
  historyTitle: {
    fontSize: '16px',
    marginBottom: '10px',
  },
  historyItem: {
    display: 'block',
    width: '100%',
    padding: '10px',
    marginBottom: '5px',
    border: 'none',
    borderRadius: '4px',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '14px',
    fontFamily: 'monospace',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  headerControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  exportButton: {
    padding: '8px 16px',
    borderRadius: '4px',
    border: '1px solid rgba(169, 169, 169, 0.2)',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s',
  },
};