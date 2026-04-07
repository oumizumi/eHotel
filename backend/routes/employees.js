const express = require('express');
const router  = express.Router();
const pool    = require('../db');

function mapEmployee(r) {
  return {
    employee_ID: r.employee_id,
    hotel_ID:    r.hotel_id,
    name:        r.name,
    address:     r.address,
    SSN:         r.ssn,
    position:    r.position,
  };
}

// GET /api/employees[?hotel_id=]
router.get('/', async (req, res) => {
  try {
    const { hotel_id } = req.query;
    let q = 'SELECT * FROM employee';
    const params = [];
    if (hotel_id) { q += ' WHERE hotel_id=$1'; params.push(hotel_id); }
    q += ' ORDER BY employee_id';
    const { rows } = await pool.query(q, params);
    res.json(rows.map(mapEmployee));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/employees
router.post('/', async (req, res) => {
  const { hotel_ID, name, address, SSN, position } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO employee (employee_id, hotel_id, name, address, ssn, position)
       VALUES ((SELECT COALESCE(MAX(employee_id), 0) + 1 FROM employee), $1, $2, $3, $4, $5)
       RETURNING *`,
      [hotel_ID, name, address, SSN, position]
    );
    res.status(201).json(mapEmployee(rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/employees/:id
router.put('/:id', async (req, res) => {
  const { hotel_ID, name, address, SSN, position } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE employee SET hotel_id=$1, name=$2, address=$3, ssn=$4, position=$5
       WHERE employee_id=$6 RETURNING *`,
      [hotel_ID, name, address, SSN, position, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Employee not found' });
    res.json(mapEmployee(rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/employees/:id
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM employee WHERE employee_id=$1', [req.params.id]);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
