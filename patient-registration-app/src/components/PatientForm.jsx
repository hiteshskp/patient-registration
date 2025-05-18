import React, { useState, useEffect } from 'react';
import db from '../db/initDb';
import { v4 as uuidv4 } from 'uuid';

export default function PatientForm() {
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
      <h2 style={styles.title}>Register Patient</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Patient Name</label>
          <input
            name="name"
            style={styles.input}
            placeholder="Enter patient's name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Age</label>
          <input
            name="age"
            type="number"
            style={styles.input}
            placeholder="138"
            value={form.age}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Gender</label>
          <div style={styles.radioGroup}>
            <label style={styles.radioLabel}>
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
            <label style={styles.radioLabel}>
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
          <label style={styles.label}>Contact Details</label>
          <input
            name="contact"
            style={styles.input}
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
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
  },
  title: {
    fontSize: '24px',
    color: '#fff',
    marginBottom: '20px',
  },
  form: {
    backgroundColor: 'rgba(169, 169, 169, 0.5)',
    padding: '30px',
    borderRadius: '10px',
    backdropFilter: 'blur(10px)',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#fff',
    fontSize: '16px',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#333',
    border: 'none',
    borderRadius: '5px',
    color: '#fff',
    boxSizing: 'border-box',
  },
  radioGroup: {
    display: 'flex',
    gap: '20px',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    color: '#fff',
    cursor: 'pointer',
  },
  radioInput: {
    marginRight: '8px',
    cursor: 'pointer',
    accentColor: '#dc2626',
  },
  submitButton: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#dc2626',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  toast: {
    backgroundColor: '#444',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '5px',
    marginBottom: '20px',
    textAlign: 'center',
  },
};
