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
    <div style={{ padding: 20 }}>
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        rows={4}
        placeholder="Write your SQL query here..."
        className="sql-input"
        style={{ width: '100%', fontFamily: 'monospace', fontSize: 14, padding: 10, borderRadius: 6, border: '1px solid #ccc', boxSizing: 'border-box' }}
      />
      <button onClick={runQuery} style={{ marginTop: 10, padding: '8px 16px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }} disabled={loading}>
        {loading ? 'Running...' : 'Run SQL'}
      </button>
      {error && <div className="error" style={{ marginTop: 10, color: '#900', backgroundColor: '#fdd', border: '1px solid #f99', borderRadius: 6, padding: 10 }}>Error: {error}</div>}

      {results && results.length > 0 && (
        <div className="results" style={{ marginTop: 20 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {Object.keys(results[0] || {}).map((key) => (
                  <th key={key} style={{ border: '1px solid #ccc', padding: 8, backgroundColor: '#f7f7f7' }}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((row, i) => (
                <tr key={i}>
                  {Object.values(row).map((val, j) => (
                    <td key={j} style={{ border: '1px solid #ccc', padding: 8 }}>{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {results && results.length === 0 && !error && (
        <div style={{ marginTop: 10, color: '#555' }}>No results to display.</div>
      )}
    </div>
  );
}