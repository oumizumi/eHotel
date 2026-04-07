const express = require('express');
const router  = express.Router();
const pool    = require('../db');

const ROOM_SELECT = `
  SELECT r.*,
    COALESCE(array_agg(ra.amenity) FILTER (WHERE ra.amenity IS NOT NULL), '{}') AS amenities
  FROM room r
  LEFT JOIN roomamenity ra ON r.room_id = ra.room_id
`;

function mapRoom(r) {
  return {
    room_ID:    r.room_id,
    hotel_ID:   r.hotel_id,
    room_num:   r.room_num,
    price:      parseFloat(r.price),
    capacity:   r.capacity,
    view_type:  r.view_type,
    damaged:    r.damaged,
    extendable: r.extendable,
    damage_des: r.damage_des,
    amenities:  r.amenities || [],
  };
}

// GET /api/rooms[?hotel_id=]
router.get('/', async (req, res) => {
  try {
    const { hotel_id } = req.query;
    let q = ROOM_SELECT;
    const params = [];
    if (hotel_id) { q += ' WHERE r.hotel_id=$1'; params.push(hotel_id); }
    q += ' GROUP BY r.room_id ORDER BY r.room_id';
    const { rows } = await pool.query(q, params);
    res.json(rows.map(mapRoom));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/rooms/search
router.get('/search', async (req, res) => {
  try {
    const { start_date, end_date, capacity, area, chain_id, star_cat, min_rooms, max_price } = req.query;

    const conditions = ['r.damaged = FALSE'];
    const params = [];
    let p = 1;

    if (start_date && end_date) {
      conditions.push(
        `r.room_id NOT IN (
          SELECT rf.room_id FROM reservedfor rf
          JOIN booking b ON rf.booking_id = b.booking_id
          WHERE b.status = 'active' AND b."start" < $${p + 1} AND b."end" > $${p}
        )`
      );
      params.push(start_date, end_date);
      p += 2;
      conditions.push(
        `r.room_id NOT IN (
          SELECT room_id FROM renting
          WHERE "start" < $${p + 1} AND "end" > $${p}
        )`
      );
      params.push(start_date, end_date);
      p += 2;
    }

    if (capacity)  { conditions.push(`r.capacity = $${p++}`);                              params.push(capacity); }
    if (max_price) { conditions.push(`r.price <= $${p++}`);                                params.push(max_price); }
    if (area)      { conditions.push(`TRIM(SPLIT_PART(h.address, ',', 2)) = $${p++}`);     params.push(area); }
    if (chain_id)  { conditions.push(`hc.chain_id = $${p++}`);                             params.push(chain_id); }
    if (star_cat)  { conditions.push(`h.star_cat = $${p++}`);                              params.push(star_cat); }
    if (min_rooms) { conditions.push(`h.num_rooms >= $${p++}`);                            params.push(min_rooms); }

    const where = 'WHERE ' + conditions.join(' AND ');

    const { rows } = await pool.query(`
      SELECT r.room_id, r.hotel_id, r.room_num, r.price, r.capacity, r.view_type,
        r.damaged, r.extendable, r.damage_des,
        COALESCE(array_agg(DISTINCT ra.amenity) FILTER (WHERE ra.amenity IS NOT NULL), '{}') AS amenities,
        h.name AS hotel_name,
        TRIM(SPLIT_PART(h.address, ',', 2)) AS hotel_area,
        hc.name AS chain_name,
        hc.chain_id,
        h.star_cat,
        h.num_rooms AS hotel_num_rooms
      FROM room r
      JOIN hotel h       ON r.hotel_id  = h.hotel_id
      JOIN hotelchain hc ON h.chain_id  = hc.chain_id
      LEFT JOIN roomamenity ra ON r.room_id = ra.room_id
      ${where}
      GROUP BY r.room_id, h.hotel_id, hc.chain_id
      ORDER BY r.price
    `, params);

    res.json(rows.map(r => ({
      ...mapRoom(r),
      hotel_name:     r.hotel_name,
      hotel_area:     r.hotel_area,
      chain_name:     r.chain_name,
      chain_ID:       r.chain_id,
      star_cat:       r.star_cat,
      hotel_num_rooms: r.hotel_num_rooms,
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/rooms
router.post('/', async (req, res) => {
  const { hotel_ID, room_num, price, capacity, view_type = 'none', damaged = false, extendable = false, damage_des = null, amenities = [] } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query(
      `INSERT INTO room (room_id, hotel_id, room_num, price, capacity, view_type, damaged, extendable, damage_des)
       VALUES ((SELECT COALESCE(MAX(room_id), 0) + 1 FROM room), $1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING room_id`,
      [hotel_ID, room_num, price, capacity, view_type, damaged, extendable, damage_des]
    );
    const id = rows[0].room_id;
    for (const a of amenities) await client.query('INSERT INTO roomamenity VALUES ($1,$2)', [id, a]);
    await client.query('COMMIT');
    const { rows: full } = await pool.query(ROOM_SELECT + ' WHERE r.room_id=$1 GROUP BY r.room_id', [id]);
    res.status(201).json(mapRoom(full[0]));
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// PUT /api/rooms/:id
router.put('/:id', async (req, res) => {
  const { hotel_ID, room_num, price, capacity, view_type, damaged, extendable, damage_des, amenities } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query(
      `UPDATE room SET hotel_id=$1, room_num=$2, price=$3, capacity=$4, view_type=$5, damaged=$6, extendable=$7, damage_des=$8
       WHERE room_id=$9 RETURNING room_id`,
      [hotel_ID, room_num, price, capacity, view_type, damaged, extendable, damage_des, req.params.id]
    );
    if (!rows[0]) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'Room not found' }); }
    const id = rows[0].room_id;
    if (amenities !== undefined) {
      await client.query('DELETE FROM roomamenity WHERE room_id=$1', [id]);
      for (const a of amenities) await client.query('INSERT INTO roomamenity VALUES ($1,$2)', [id, a]);
    }
    await client.query('COMMIT');
    const { rows: full } = await pool.query(ROOM_SELECT + ' WHERE r.room_id=$1 GROUP BY r.room_id', [id]);
    res.json(mapRoom(full[0]));
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// DELETE /api/rooms/:id
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM room WHERE room_id=$1', [req.params.id]);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
