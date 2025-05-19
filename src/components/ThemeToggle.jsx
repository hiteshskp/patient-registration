import React, { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
      <button onClick={toggleTheme} style={{ background: 'none', border: '1px solid var(--border-color)', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}>
        Switch to {theme === 'light' ? '🌙 Dark' : '☀️ Light'} Mode
      </button>
    </div>
  );
}
