import { useState } from 'react';
import PatientForm from './components/PatientForm';
import SQLConsole from './components/SQLConsole';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const [activeTab, setActiveTab] = useState('form');
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <header className="flex justify-center items-center p-4 bg-white dark:bg-gray-800 shadow-md">
        <h1 className="text-xl font-bold">Patient Registration App</h1>
        <ThemeToggle />
      </header>

      <nav className="flex space-x-4 justify-center mt-4">
        <button
          onClick={() => setActiveTab('form')}
          className={`px-4 py-2 rounded \${activeTab === 'form' ? 'bg-blue-600 text-white' : 'bg-gray-300 dark:bg-gray-700 dark:text-white'}`}
        >
          Register Patient
        </button>
        <button
          onClick={() => setActiveTab('sql')}
          className={`px-4 py-2 rounded \${activeTab === 'sql' ? 'bg-blue-600 text-white' : 'bg-gray-300 dark:bg-gray-700 dark:text-white'}`}
        >
          SQL Console
        </button>
      </nav>

      <main className="p-4">
        {activeTab === 'form' ? <PatientForm /> : <SQLConsole />}
      </main>
    </div>
  );
}

export default App;