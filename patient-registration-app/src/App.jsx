import React from 'react';
import PatientForm from './components/PatientForm';
import SQLConsole from './components/SQLConsole';
import ThemeToggle from './components/ThemeToggle';

function App() {
  return (
    <div className="app">
      <ThemeToggle />
      <h1>Patient Registration App</h1>
      <PatientForm />
      <SQLConsole />
    </div>
  );
}

export default App;
