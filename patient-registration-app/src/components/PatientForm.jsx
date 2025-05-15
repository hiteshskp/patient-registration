import React, { useState } from 'react';
import db from '../db/initDb';
import { v4 as uuidv4 } from 'uuid';

export default function PatientForm() {
  const [form, setForm] = useState({ name: '', age: '', gender: '', contact: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = uuidv4();
    const registeredAt = new Date().toISOString();

    await db.exec(
      `INSERT INTO patients (id, name, age, gender, contact, registeredAt)
       VALUES ('${id}', '${form.name}', ${form.age}, '${form.gender}', '${form.contact}', '${registeredAt}')`
    );

    alert('Patient registered!');
    setForm({ name: '', age: '', gender: '', contact: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
      <input name="age" type="number" placeholder="Age" value={form.age} onChange={handleChange} required />
      <input name="gender" placeholder="Gender" value={form.gender} onChange={handleChange} required />
      <input name="contact" placeholder="Contact" value={form.contact} onChange={handleChange} />
      <button type="submit">Register</button>
    </form>
  );
}
