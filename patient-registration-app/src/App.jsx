import { useState, useEffect } from 'react';
import PatientForm from './components/PatientForm';
import SQLConsole from './components/SQLConsole';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const renderContent = () => {
    switch (currentPage) {
      case 'patient':
        return <PatientForm theme={theme} />;
      case 'sql':
        return <SQLConsole theme={theme} />;
      default:
        return (
          <div style={styles.buttonContainer}>
            <button
              style={{ ...styles.navButton, backgroundColor: theme === 'light' ? '#fff' : '#333', color: theme === 'light' ? '#000' : '#fff' }}
              onClick={() => setCurrentPage('patient')}
            >
              Register Patient
            </button>
            <button
              style={{ ...styles.navButton, backgroundColor: '#dc2626' }}
              onClick={() => setCurrentPage('sql')}
            >
              SQL Console
            </button>
          </div>
        );
    }
  };

  return (
    <div style={{ ...styles.container, backgroundColor: theme === 'light' ? '#f5f5f5' : '#1a1a1a' }}>
      <header style={styles.header}>
        <div style={styles.logo}>
          <span style={styles.icon}>H</span>
          HealthCare Portal
        </div>
        <nav style={styles.nav}>
          <button 
            style={styles.homeLink}
            onClick={() => setCurrentPage('home')}
          >
            Home
          </button>
          <button 
            style={styles.navLink}
            onClick={() => setCurrentPage('patient')}
          >
            Register Patient Form
          </button>
          <button 
            style={styles.navLink}
            onClick={() => setCurrentPage('sql')}
          >
            SQL Console Form
          </button>
          <button 
            onClick={toggleTheme} 
            style={styles.themeButton}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </nav>
      </header>

      <main style={styles.main}>
        {renderContent()}
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    transition: 'background-color 0.3s',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: 'rgba(169, 169, 169, 0.2)',
    backdropFilter: 'blur(10px)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1.5rem',
    color: '#fff',
    fontWeight: 'bold',
  },
  icon: {
    backgroundColor: '#dc2626',
    color: '#fff',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    marginRight: '8px',
  },
  nav: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center',
  },
  navLink: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '1rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
  },
  homeLink: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '1rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
  },
  themeButton: {
    background: 'none',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    color: '#fff',
    padding: '0.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1.2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    transition: 'all 0.2s',
  },
  main: {
    padding: '2rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 80px)',
  },
  buttonContainer: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButton: {
    padding: '1rem 2rem',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '2rem',
    cursor: 'pointer',
    color: '#fff',
    fontWeight: '500',
    transition: 'all 0.2s',
    minWidth: '200px',
  },
};

export default App;