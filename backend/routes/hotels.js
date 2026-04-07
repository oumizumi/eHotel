const express = require('express');
const router  = express.Router();
const pool    = require('../db');

const HOTEL_SELECT = `
  SELECT h.hotel_id, h.chain_id, h.name, h.address,
    TRIM(SPLIT_PART(h.address, ',', 2)) AS area,
    h.star_cat, h.num_rooms, h.manager_id,
    COALESCE(array_agg(DISTINCT he.email) FILTER (WHERE he.email IS NOT NULL), '{}') AS emails,
    COALESCE(array_agg(DISTINCT hp.phone) FILTER (WHERE hp.phone IS NOT NULL), '{}') AS phones
  FROM hotel h
  LEFT JOIN hotelemail he ON h.hotel_id = he.hotel_id
  LEFT JOIN hotelphone hp ON h.hotel_id = hp.hotel_id
`;

function mapHotel(r) {
  return {
    hotel_ID:   r.hotel_id,
    chain_ID:   r.chain_id,
    name:       r.name,
    address:    r.address,
    area:       r.area || '',
    star_cat:   r.star_cat,
    num_rooms:  r.num_rooms,
    manager_ID: r.manager_id,
    emails:     r.emails || [],
    phones:     r.phones || [],
  };
}

// GET /api/hotels[?chain_id=]
router.get('/', async (req, res) => {
  try {
    const { chain_id } = req.query;
    let q = HOTEL_SELECT;
    const params = [];
    if (chain_id) { q += ' WHERE h.chain_id=$1'; params.push(chain_id); }
    q += ' GROUP BY h.hotel_id ORDER BY h.hotel_id';
    const { rows } = await pool.query(q, params);
    res.json(rows.map(mapHotel));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/hotels
router.post('/', async (req, res) => {
  const { chain_ID, name, address, star_cat, manager_ID = null, emails = [], phones = [] } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query(
      `INSERT INTO hotel (hotel_id, chain_id, name, address, star_cat, num_rooms, manager_id)
       VALUES ((SELECT COALESCE(MAX(hotel_id), 0) + 1 FROM hotel), $1, $2, $3, $4, 0, $5)
       RETURNING hotel_id`,
      [chain_ID, name, address, star_cat, manager_ID]
    );
    const id = rows[0].hotel_id;
    for (const e of emails) await client.query('INSERT INTO hotelemail VALUES ($1,$2)', [id, e]);
    for (const p of phones) await client.query('INSERT INTO hotelphone VALUES ($1,$2)', [id, p]);
    await client.query('COMMIT');
    const { rows: full } = await pool.query(HOTEL_SELECT + ' WHERE h.hotel_id=$1 GROUP BY h.hotel_id', [id]);
    res.status(201).json(mapHotel(full[0]));
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// PUT /api/hotels/:id
router.put('/:id', async (req, res) => {
  const { chain_ID, name, address, star_cat, manager_ID, emails, phones } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query(
      `UPDATE hotel SET chain_id=$1, name=$2, address=$3, star_cat=$4, manager_id=$5
       WHERE hotel_id=$6 RETURNING hotel_id`,
      [chain_ID, name, address, star_cat, manager_ID ?? null, req.params.id]
    );
    if (!rows[0]) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'Hotel not found' }); }
    const id = rows[0].hotel_id;
    if (emails !== undefined) {
      await client.query('DELETE FROM hotelemail WHERE hotel_id=$1', [id]);
      for (const e of emails) await client.query('INSERT INTO hotelemail VALUES ($1,$2)', [id, e]);
    }
    if (phones !== undefined) {
      await client.query('DELETE FROM hotelphone WHERE hotel_id=$1', [id]);
      for (const p of phones) await client.query('INSERT INTO hotelphone VALUES ($1,$2)', [id, p]);
    }
    await client.query('COMMIT');
    const { rows: full } = await pool.query(HOTEL_SELECT + ' WHERE h.hotel_id=$1 GROUP BY h.hotel_id', [id]);
    res.json(mapHotel(full[0]));
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// DELETE /api/hotels/:id
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM hotel WHERE hotel_id=$1', [req.params.id]);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
