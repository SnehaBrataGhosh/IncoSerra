/**
 * Optional seed: creates demo rows for NIHARIKA and PADMINI if they do not exist.
 * Run: npm run seed (from beta/server)
 */
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import pool from './db.js';

dotenv.config();

const DEMO_PASSWORD = process.env.SEED_DEMO_PASSWORD || 'IncoSerraDemo2026';

async function main() {
  const hash = await bcrypt.hash(DEMO_PASSWORD, 12);

  const accounts = [
    {
      name: 'NIHARIKA',
      phone: '9000000001',
      aadhaar: '111122223333',
      domain: 'Food delivery',
    },
    {
      name: 'PADMINI',
      phone: '9000000002',
      aadhaar: '444455556666',
      domain: 'E-commerce',
    },
  ];

  for (const a of accounts) {
    const [existing] = await pool.query('SELECT id FROM users WHERE aadhaar = ?', [a.aadhaar]);
    if (existing.length) {
      console.log(`Skip ${a.name} (aadhaar already present)`);
      continue;
    }
    await pool.query(
      `INSERT INTO users (name, phone, aadhaar, domain, password, plan)
       VALUES (?, ?, ?, ?, ?, 'silver')`,
      [a.name, a.phone, a.aadhaar, a.domain, hash]
    );
    console.log(`Created ${a.name}`);
  }

  console.log('Seed complete. Demo password:', DEMO_PASSWORD);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
