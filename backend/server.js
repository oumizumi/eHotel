const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());

app.use('/api/chains',    require('./routes/chains'));
app.use('/api/hotels',    require('./routes/hotels'));
app.use('/api/rooms',     require('./routes/rooms'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/employees', require('./routes/employees'));
app.use('/api/bookings',  require('./routes/bookings'));
app.use('/api/rentings',  require('./routes/rentings'));
app.use('/api/views',     require('./routes/views'));

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
