// This file initializes the database and creates the patients table if it doesn't exist.
// It uses the PGlite library to handle the database operations.

import { PGlite } from '@electric-sql/pglite';

const db = new PGlite('idb://patient-db');

await db.exec(`
  CREATE TABLE IF NOT EXISTS patients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    gender TEXT NOT NULL,
    contact TEXT,
    registeredAt TEXT NOT NULL
  );
`);

export default db;
// The database is initialized with a patients table that has the following columns:
// - id: A unique identifier for each patient (TEXT)        
// - name: The name of the patient (TEXT)
// - age: The age of the patient (INTEGER)

