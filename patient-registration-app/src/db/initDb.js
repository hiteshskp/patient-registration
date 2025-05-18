// This file initializes the database and creates the patients table if it doesn't exist.
// It uses the PGlite library to handle the database operations.

import { PGlite } from '@electric-sql/pglite';

const db = new PGlite('idb://patient-db');

await db.exec(`
  CREATE TABLE IF NOT EXISTS patients (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    age INTEGER NOT NULL, 
    gender TEXT NOT NULL,
    contact TEXT,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

export const broadcast = new BroadcastChannel('patient-sync');

export default db;