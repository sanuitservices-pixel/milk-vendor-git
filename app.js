const cors = require('cors');
const express = require('express');
const bp = require('body-parser');
const passport = require('passport');
const { connect } = require('mongoose');
const { success, error } = require('consola');
const { initScheduledJobs } = require('./scheduledJob/scheduledJob');

// Constants
const { DB } = require('./config');

const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(bp.json());
app.use(passport.initialize());

require('./middleware/passport')(passport);
// Initialize Firebase Admin
require('./config/firebase');

// Router Middleware
app.use('/api/user', require('./routes/user'));
app.use('/api/order', require('./routes/order'));
app.use('/api/customer', require('./routes/customer'));
// app.use('/api/notification', require('./routes/notification'));
app.get('/status', (req, res) => {
  res.status(200).json({ message: 'API is running', success: true });
});

// Initialize all scheduled jobs
initScheduledJobs()


// Database Connection
const startApp = async () => {
  try {
    await connect(DB);

    success({
      message: `Successfully connected to the Database \n${DB}`, badge: true
    });
    app.listen(PORT, () => {
      console.log("Server Listening on PORT:", PORT);
    });

  } catch (err) {
    error({
      message: `Unable to connect to the Database \n${err}`, badge: true
    });
    startApp();
  }
}

startApp();