import React, { useState } from 'react';
import db from '../db/initDb';

export default function SQLConsole() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const runQuery = async () => {
    try {
      const res = await db.query(query);
      setResults(res.rows);
    } catch (e) {
      alert('SQL Error: ' + e.message);
    }
  };

  return (
    <div className="sql-console">
      <textarea value={query} onChange={(e) => setQuery(e.target.value)} rows={4} />
      <button onClick={runQuery}>Run SQL</button>
      <pre>{JSON.stringify(results, null, 2)}</pre>
    </div>
  );
}
