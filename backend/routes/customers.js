const express = require('express');
const router  = express.Router();
const pool    = require('../db');

function mapCustomer(r) {
  return {
    customer_ID: r.customer_id,
    name:        r.name,
    address:     r.address,
    ID_type:     r.id_type,
    ID_num:      r.id_num,
    date:        r.date,
  };
}

// GET /api/customers
router.get('/', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM customer ORDER BY customer_id');
    res.json(rows.map(mapCustomer));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/customers/:id
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM customer WHERE customer_id=$1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Customer not found' });
    res.json(mapCustomer(rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/customers
router.post('/', async (req, res) => {
  const { name, address, ID_type, ID_num, date } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO customer (customer_id, name, address, id_type, id_num, date)
       VALUES ((SELECT COALESCE(MAX(customer_id), 0) + 1 FROM customer), $1, $2, $3, $4, $5)
       RETURNING *`,
      [name, address, ID_type, ID_num, date]
    );
    res.status(201).json(mapCustomer(rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/customers/:id
router.put('/:id', async (req, res) => {
  const { name, address, ID_type, ID_num, date } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE customer SET name=$1, address=$2, id_type=$3, id_num=$4, date=$5
       WHERE customer_id=$6 RETURNING *`,
      [name, address, ID_type, ID_num, date, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Customer not found' });
    res.json(mapCustomer(rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/customers/:id
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM customer WHERE customer_id=$1', [req.params.id]);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
