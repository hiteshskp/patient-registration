import React, { useState, useEffect } from 'react';
import db from '../db/initDb';
import { v4 as uuidv4 } from 'uuid';

export default function PatientForm({ theme, dbChannel }) {
  const [form, setForm] = useState({ name: '', age: '', gender: '', contact: '' });
  const [toast, setToast] = useState(null);
  const [patients, setPatients] = useState([]);
  const [lastSync, setLastSync] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const value = e.target.type === 'radio' ? e.target.value : e.target.value;
    setForm(prev => ({ ...prev, [e.target.name]: value }));
  };

  useEffect(() => {
    // Listen for database changes from other tabs
    dbChannel.onmessage = (event) => {
      const { type, data } = event.data;
      if (type === 'PATIENT_ADDED') {
        setPatients(prevPatients => [...prevPatients, data]);
        setLastSync(new Date().toLocaleTimeString());
        setToast('🔄 New patient registered in another tab!');
        setTimeout(() => setToast(null), 3000);
      } else if (type === 'PATIENTS_UPDATED') {
        setPatients(data);
        setLastSync(new Date().toLocaleTimeString());
      }
    };

    // Initial load of patients
    loadPatients();

    return () => {
      // No need to close dbChannel here as it's managed by App.jsx
    };
  }, []);

  const loadPatients = async () => {
    try {
      console.log('Loading patients...');
      const result = await db.query('SELECT * FROM patients ORDER BY id DESC');
      console.log('Load result:', result);
      
      if (result && result.rows) {
        setPatients(result.rows);
        // Broadcast the updated patients list to other tabs
        dbChannel.postMessage({ 
          type: 'PATIENTS_UPDATED', 
          data: result.rows 
        });
      }
    } catch (error) {
      console.error('Error loading patients:', error);
      setToast('❌ Error loading patients');
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!form.name.trim()) {
      setToast('⚠️ Patient name is required');
      setTimeout(() => setToast(null), 3000);
      return;
    }

    if (!form.age || isNaN(form.age) || form.age < 0) {
      setToast('⚠️ Please enter a valid age');
      setTimeout(() => setToast(null), 3000);
      return;
    }

    if (!form.gender) {
      setToast('⚠️ Please select a gender');
      setTimeout(() => setToast(null), 3000);
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Submitting form:', form);
      
      // Insert new patient
      const result = await db.query(
        'INSERT INTO patients (name, age, gender, contact) VALUES ($1, $2, $3, $4) RETURNING *',
        [form.name, parseInt(form.age), form.gender, form.contact || '']
      );

      console.log('Insert result:', result);

      if (result && result.rows && result.rows[0]) {
        // Broadcast the new patient to other tabs
        dbChannel.postMessage({ 
          type: 'PATIENT_ADDED', 
          data: result.rows[0] 
        });
        
        // Update local state
        setPatients(prevPatients => [...prevPatients, result.rows[0]]);
        
        // Reset form
        setForm({ name: '', age: '', gender: '', contact: '' });
        
        setToast('✅ Patient registered successfully!');
        setTimeout(() => setToast(null), 3000);

        // Reload patients to ensure consistency
        await loadPatients();
      } else {
        throw new Error('Failed to get inserted patient data');
      }
    } catch (error) {
      console.error('Error registering patient:', error);
      setToast('❌ Error registering patient');
      setTimeout(() => setToast(null), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const exportToCSV = () => {
    if (patients.length === 0) {
      setToast('⚠️ No data to export');
      setTimeout(() => setToast(null), 3000);
      return;
    }

    try {
      // Get headers from the first patient object
      const headers = Object.keys(patients[0]);
      
      // Convert data to CSV format
      const csvContent = [
        headers.join(','), // Header row
        ...patients.map(patient => 
          headers.map(header => {
            // Handle values that might contain commas or quotes
            const value = patient[header]?.toString() || '';
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
      
      link.setAttribute('href', url);
      link.setAttribute('download', `patients_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setToast('✅ CSV exported successfully!');
      setTimeout(() => setToast(null), 3000);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      setToast('❌ Error exporting CSV');
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div style={styles.container}>
      {toast && <div style={styles.toast}>{toast}</div>}
      <div style={styles.header}>
        <h2 style={{...styles.title, color: theme === 'light' ? '#000' : '#fff'}}>Register Patient</h2>
        <div style={styles.headerControls}>
          <div style={{...styles.stats, color: theme === 'light' ? '#000' : '#fff'}}>
            <span>Total Records: {patients.length}</span>
            {lastSync && <span>Last Sync: {lastSync}</span>}
          </div>
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
        </div>
      </div>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={{...styles.label, color: theme === 'light' ? '#000' : '#fff'}}>Patient Name</label>
          <input
            name="name"
            style={{
              ...styles.input,
              backgroundColor: theme === 'light' ? '#fff' : '#333',
              color: theme === 'light' ? '#000' : '#fff',
            }}
            placeholder="Enter patient's name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={{...styles.label, color: theme === 'light' ? '#000' : '#fff'}}>Age</label>
          <input
            name="age"
            type="number"
            min="0"
            style={{
              ...styles.input,
              backgroundColor: theme === 'light' ? '#fff' : '#333',
              color: theme === 'light' ? '#000' : '#fff',
            }}
            placeholder="Enter patient's age"
            value={form.age}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={{...styles.label, color: theme === 'light' ? '#000' : '#fff'}}>Gender</label>
          <div style={styles.radioGroup}>
            <label style={{...styles.radioLabel, color: theme === 'light' ? '#000' : '#fff'}}>
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={form.gender === 'Male'}
                onChange={handleChange}
                style={styles.radioInput}
                required
              />
              Male
            </label>
            <label style={{...styles.radioLabel, color: theme === 'light' ? '#000' : '#fff'}}>
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={form.gender === 'Female'}
                onChange={handleChange}
                style={styles.radioInput}
                required
              />
              Female
            </label>
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={{...styles.label, color: theme === 'light' ? '#000' : '#fff'}}>Contact Details</label>
          <input
            name="contact"
            style={{
              ...styles.input,
              backgroundColor: theme === 'light' ? '#fff' : '#333',
              color: theme === 'light' ? '#000' : '#fff',
            }}
            placeholder="Enter contact details"
            value={form.contact}
            onChange={handleChange}
          />
        </div>

        <button 
          type="submit" 
          style={{
            ...styles.submitButton,
            opacity: isSubmitting ? 0.7 : 1,
            cursor: isSubmitting ? 'not-allowed' : 'pointer'
          }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Registering...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    width: '50%',
    minWidth: '600px',
    margin: '0 auto',
    padding: '20px',
  },
  title: {
    fontSize: '32px',
    color: '#fff',
    marginBottom: '30px',
    textAlign: 'center',
  },
  form: {
    backgroundColor: 'rgba(169, 169, 169, 0.5)',
    padding: '40px',
    borderRadius: '15px',
    backdropFilter: 'blur(10px)',
  },
  formGroup: {
    marginBottom: '25px',
  },
  label: {
    display: 'block',
    marginBottom: '10px',
    color: '#fff',
    fontSize: '18px',
  },
  input: {
    width: '100%',
    padding: '15px',
    fontSize: '16px',
    backgroundColor: '#333',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    boxSizing: 'border-box',
  },
  radioGroup: {
    display: 'flex',
    gap: '40px',
    marginTop: '10px',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '16px',
  },
  radioInput: {
    marginRight: '12px',
    cursor: 'pointer',
    accentColor: '#dc2626',
    width: '20px',
    height: '20px',
  },
  submitButton: {
    width: '100%',
    padding: '15px',
    fontSize: '18px',
    backgroundColor: '#dc2626',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '20px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  },
  toast: {
    backgroundColor: '#444',
    color: '#fff',
    padding: '15px 30px',
    borderRadius: '8px',
    marginBottom: '30px',
    textAlign: 'center',
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
