const express = require('express');
const router  = express.Router();
const pool    = require('../db');

const BOOKING_SELECT = `
  SELECT b.booking_id, b.customer_id, b.status,
    b."start" AS start_date, b."end" AS end_date,
    rf.room_id, r.hotel_id, r.room_num,
    h.name AS hotel_name,
    c.name AS customer_name
  FROM booking b
  LEFT JOIN reservedfor rf ON b.booking_id = rf.booking_id
  LEFT JOIN room r         ON rf.room_id   = r.room_id
  LEFT JOIN hotel h        ON r.hotel_id   = h.hotel_id
  LEFT JOIN customer c     ON b.customer_id = c.customer_id
`;

function mapBooking(r) {
  return {
    booking_ID:    r.booking_id,
    customer_ID:   r.customer_id,
    room_ID:       r.room_id,
    hotel_ID:      r.hotel_id,
    start_date:    r.start_date,
    end_date:      r.end_date,
    status:        r.status,
    customer_name: r.customer_name,
    room_num:      r.room_num,
    hotel_name:    r.hotel_name,
  };
}

// GET /api/bookings[?customer_id=&active=true]
router.get('/', async (req, res) => {
  try {
    const { customer_id, active } = req.query;
    const conditions = [];
    const params = [];
    let p = 1;
    if (customer_id) { conditions.push(`b.customer_id=$${p++}`); params.push(customer_id); }
    if (active === 'true') { conditions.push(`b.status='active'`); }
    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
    const { rows } = await pool.query(BOOKING_SELECT + where + ' ORDER BY b.booking_id', params);
    res.json(rows.map(mapBooking));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/bookings
router.post('/', async (req, res) => {
  const { customer_ID, room_ID, start_date, end_date } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query(
      `INSERT INTO booking (booking_id, customer_id, booking_date, status, "start", "end")
       VALUES ((SELECT COALESCE(MAX(booking_id), 0) + 1 FROM booking), $1, CURRENT_DATE, 'active', $2, $3)
       RETURNING booking_id`,
      [customer_ID, start_date, end_date]
    );
    const id = rows[0].booking_id;
    await client.query('INSERT INTO reservedfor VALUES ($1,$2)', [room_ID, id]);
    await client.query('COMMIT');
    const { rows: full } = await pool.query(BOOKING_SELECT + 'WHERE b.booking_id=$1', [id]);
    res.status(201).json(mapBooking(full[0]));
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// PUT /api/bookings/:id/cancel
router.put('/:id/cancel', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `UPDATE booking SET status='cancelled' WHERE booking_id=$1 RETURNING booking_id`,
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Booking not found' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
