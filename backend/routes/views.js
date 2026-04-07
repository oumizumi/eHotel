const express = require('express');
const router  = express.Router();
const pool    = require('../db');

// GET /api/views/available-rooms-per-area
router.get('/available-rooms-per-area', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT area, available_rooms::int FROM availableroomsperarea');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/views/hotel-capacities
router.get('/hotel-capacities', async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        h.hotel_id,
        h.name       AS hotel_name,
        hc.name      AS chain_name,
        h.star_cat,
        COUNT(r.room_id)::int AS room_count,
        COALESCE(SUM(CASE
          WHEN r.capacity = 'single'                 THEN 1
          WHEN r.capacity = 'double'                 THEN 2
          WHEN r.capacity = 'triple'                 THEN 3
          WHEN r.capacity IN ('quad', 'king')        THEN 4
          WHEN r.capacity IN ('suite', 'penthouse')  THEN 6
          ELSE 1
        END), 0)::int AS total_capacity
      FROM hotel h
      JOIN hotelchain hc ON h.chain_id = hc.chain_id
      LEFT JOIN room r   ON h.hotel_id = r.hotel_id
      GROUP BY h.hotel_id, h.name, hc.name, h.star_cat
      ORDER BY total_capacity DESC
    `);
    res.json(rows.map(r => ({
      hotel_ID:       r.hotel_id,
      hotel_name:     r.hotel_name,
      chain_name:     r.chain_name,
      star_cat:       r.star_cat,
      room_count:     r.room_count,
      total_capacity: r.total_capacity,
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
