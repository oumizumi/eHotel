const express = require('express');
const router  = express.Router();
const pool    = require('../db');

const RENTING_SELECT = `
  SELECT rt.renting_id, rt.booking_id, rt.customer_id, rt.room_id, rt.employee_id,
    rt."start" AS start_date, rt."end" AS end_date,
    r.hotel_id, r.room_num,
    h.name  AS hotel_name,
    c.name  AS customer_name,
    e.name  AS employee_name,
    p.amount AS payment
  FROM renting rt
  LEFT JOIN room r     ON rt.room_id     = r.room_id
  LEFT JOIN hotel h    ON r.hotel_id     = h.hotel_id
  LEFT JOIN customer c ON rt.customer_id = c.customer_id
  LEFT JOIN employee e ON rt.employee_id = e.employee_id
  LEFT JOIN payment p  ON rt.renting_id  = p.renting_id
`;

function mapRenting(r) {
  return {
    renting_ID:    r.renting_id,
    booking_ID:    r.booking_id,
    customer_ID:   r.customer_id,
    room_ID:       r.room_id,
    hotel_ID:      r.hotel_id,
    employee_ID:   r.employee_id,
    start_date:    r.start_date,
    end_date:      r.end_date,
    payment:       r.payment != null ? parseFloat(r.payment) : null,
    customer_name: r.customer_name,
    room_num:      r.room_num,
    hotel_name:    r.hotel_name,
    employee_name: r.employee_name,
  };
}

// GET /api/rentings[?customer_id=]
router.get('/', async (req, res) => {
  try {
    const { customer_id } = req.query;
    let q = RENTING_SELECT;
    const params = [];
    if (customer_id) { q += ' WHERE rt.customer_id=$1'; params.push(customer_id); }
    q += ' ORDER BY rt.renting_id';
    const { rows } = await pool.query(q, params);
    res.json(rows.map(mapRenting));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/rentings/from-booking  (check-in: booking → renting)
router.post('/from-booking', async (req, res) => {
  const { booking_ID, employee_ID } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Fetch the booking + its room
    const { rows: bRows } = await client.query(
      `SELECT b.*, rf.room_id FROM booking b
       LEFT JOIN reservedfor rf ON b.booking_id = rf.booking_id
       WHERE b.booking_id=$1`,
      [booking_ID]
    );
    if (!bRows[0]) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'Booking not found' }); }
    const b = bRows[0];

    const { rows } = await client.query(
      `INSERT INTO renting (renting_id, customer_id, room_id, booking_id, employee_id, renting_date, "start", "end")
       VALUES ((SELECT COALESCE(MAX(renting_id), 0) + 1 FROM renting), $1, $2, $3, $4, CURRENT_DATE, $5, $6)
       RETURNING renting_id`,
      [b.customer_id, b.room_id, booking_ID, employee_ID, b.start, b.end]
    );
    await client.query(`UPDATE booking SET status='completed' WHERE booking_id=$1`, [booking_ID]);
    await client.query('COMMIT');

    const { rows: full } = await pool.query(RENTING_SELECT + ' WHERE rt.renting_id=$1', [rows[0].renting_id]);
    res.status(201).json(mapRenting(full[0]));
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// POST /api/rentings  (walk-in)
router.post('/', async (req, res) => {
  const { customer_ID, room_ID, employee_ID, start_date, end_date } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query(
      `INSERT INTO renting (renting_id, customer_id, room_id, booking_id, employee_id, renting_date, "start", "end")
       VALUES ((SELECT COALESCE(MAX(renting_id), 0) + 1 FROM renting), $1, $2, NULL, $3, CURRENT_DATE, $4, $5)
       RETURNING renting_id`,
      [customer_ID, room_ID, employee_ID, start_date, end_date]
    );
    await client.query('COMMIT');
    const { rows: full } = await pool.query(RENTING_SELECT + ' WHERE rt.renting_id=$1', [rows[0].renting_id]);
    res.status(201).json(mapRenting(full[0]));
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// PUT /api/rentings/:id/payment
router.put('/:id/payment', async (req, res) => {
  const { amount, method = 'cash' } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(
      `INSERT INTO payment (payment_id, renting_id, amount, method, date)
       VALUES ((SELECT COALESCE(MAX(payment_id), 0) + 1 FROM payment), $1, $2, $3, CURRENT_DATE)
       ON CONFLICT (renting_id) DO UPDATE SET amount=$2, method=$3, date=CURRENT_DATE`,
      [req.params.id, amount, method]
    );
    await client.query('COMMIT');
    const { rows: full } = await pool.query(RENTING_SELECT + ' WHERE rt.renting_id=$1', [req.params.id]);
    res.json(mapRenting(full[0]));
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

module.exports = router;
