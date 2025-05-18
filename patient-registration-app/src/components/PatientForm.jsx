import React, { useState, useEffect } from 'react';
import db from '../db/initDb';
import { v4 as uuidv4 } from 'uuid';

export default function PatientForm({ theme }) {
  const [form, setForm] = useState({ name: '', age: '', gender: '', contact: '' });
  const [toast, setToast] = useState(null);
  const channel = new BroadcastChannel('patient_sync');

  const handleChange = (e) => {
    const value = e.target.type === 'radio' ? e.target.value : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = uuidv4();
    const registeredAt = new Date().toISOString();

    await db.exec(
      `INSERT INTO patients (id, name, age, gender, contact, registeredAt)
       VALUES ('${id}', '${form.name}', ${form.age}, '${form.gender}', '${form.contact}', '${registeredAt}')`
    );

    // Notify other tabs
    channel.postMessage({ type: 'new_patient', payload: { id, ...form, registeredAt } });

    setToast('✅ Patient registered!');
    setTimeout(() => setToast(null), 3000);

    setForm({ name: '', age: '', gender: '', contact: '' });
  };

  useEffect(() => {
    channel.onmessage = (event) => {
      if (event.data.type === 'new_patient') {
        setToast('🔄 Patient data updated from another tab');
        setTimeout(() => setToast(null), 3000);
      }
    };
  }, []);

  return (
    <div style={styles.container}>
      {toast && <div style={styles.toast}>{toast}</div>}
      <h2 style={{...styles.title, color: theme === 'light' ? '#000' : '#fff'}}>Register Patient</h2>
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

        <button type="submit" style={styles.submitButton}>Submit</button>
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
};
