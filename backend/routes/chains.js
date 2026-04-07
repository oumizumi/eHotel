const express = require('express');
const router  = express.Router();
const pool    = require('../db');

const CHAIN_SELECT = `
  SELECT hc.chain_id, hc.name, hc.num_hotels, hc.address,
    COALESCE(array_agg(DISTINCT ce.email) FILTER (WHERE ce.email IS NOT NULL), '{}') AS emails,
    COALESCE(array_agg(DISTINCT cp.phone) FILTER (WHERE cp.phone IS NOT NULL), '{}') AS phones
  FROM hotelchain hc
  LEFT JOIN chainemail ce ON hc.chain_id = ce.chain_id
  LEFT JOIN chainphone cp ON hc.chain_id = cp.chain_id
`;

function mapChain(r) {
  return {
    chain_ID:   r.chain_id,
    name:       r.name,
    num_hotels: r.num_hotels,
    address:    r.address,
    emails:     r.emails || [],
    phones:     r.phones || [],
  };
}

// GET /api/chains
router.get('/', async (_req, res) => {
  try {
    const { rows } = await pool.query(CHAIN_SELECT + ' GROUP BY hc.chain_id ORDER BY hc.chain_id');
    res.json(rows.map(mapChain));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/chains
router.post('/', async (req, res) => {
  const { name, num_hotels = 0, address, emails = [], phones = [] } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query(
      `INSERT INTO hotelchain (chain_id, name, num_hotels, address)
       VALUES ((SELECT COALESCE(MAX(chain_id), 0) + 1 FROM hotelchain), $1, $2, $3)
       RETURNING chain_id`,
      [name, num_hotels, address]
    );
    const id = rows[0].chain_id;
    for (const e of emails) await client.query('INSERT INTO chainemail VALUES ($1,$2)', [id, e]);
    for (const p of phones) await client.query('INSERT INTO chainphone VALUES ($1,$2)', [id, p]);
    await client.query('COMMIT');
    const { rows: full } = await pool.query(CHAIN_SELECT + ' WHERE hc.chain_id=$1 GROUP BY hc.chain_id', [id]);
    res.status(201).json(mapChain(full[0]));
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// PUT /api/chains/:id
router.put('/:id', async (req, res) => {
  const { name, num_hotels, address, emails, phones } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query(
      `UPDATE hotelchain SET name=$1, num_hotels=$2, address=$3 WHERE chain_id=$4 RETURNING chain_id`,
      [name, num_hotels, address, req.params.id]
    );
    if (!rows[0]) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'Chain not found' }); }
    const id = rows[0].chain_id;
    if (emails !== undefined) {
      await client.query('DELETE FROM chainemail WHERE chain_id=$1', [id]);
      for (const e of emails) await client.query('INSERT INTO chainemail VALUES ($1,$2)', [id, e]);
    }
    if (phones !== undefined) {
      await client.query('DELETE FROM chainphone WHERE chain_id=$1', [id]);
      for (const p of phones) await client.query('INSERT INTO chainphone VALUES ($1,$2)', [id, p]);
    }
    await client.query('COMMIT');
    const { rows: full } = await pool.query(CHAIN_SELECT + ' WHERE hc.chain_id=$1 GROUP BY hc.chain_id', [id]);
    res.json(mapChain(full[0]));
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// DELETE /api/chains/:id
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM hotelchain WHERE chain_id=$1', [req.params.id]);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
