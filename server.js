require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const flash = require('connect-flash');
const morgan = require('morgan');
const methodOverride = require('method-override');
const path = require('path');

const app = express();


mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/petroguide_pro')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('⚠️  Running without database - some features disabled');
  });


app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Trust proxy (required for Render and other reverse proxies)
app.set('trust proxy', 1);

app.use(session({
  secret: process.env.SESSION_SECRET || 'petroguide_secret',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    mongoUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/petroguide_pro',
    touchAfter: 24 * 3600 // lazy session update (in seconds)
  }).on('error', (err) => {
    console.error('MongoStore error:', err);
  }),
  cookie: { 
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  }
}));

app.use(flash());

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});


app.set('view engine', 'html');
app.engine('html', (filePath, options, callback) => {
  const fs = require('fs');
  fs.readFile(filePath, (err, content) => {
    if (err) return callback(err);
    let rendered = content.toString();
    // Simple template variable replacement
    Object.keys(options).forEach(key => {
      if (typeof options[key] === 'string') {
        rendered = rendered.replace(new RegExp(`{{${key}}}`, 'g'), options[key]);
      }
    });
    return callback(null, rendered);
  });
});
app.set('views', path.join(__dirname, 'views'));

// ─── Routes 
app.use('/', require('./routes/index.js'));
app.use('/auth', require('./routes/auth.js'));
app.use('/learn', require('./routes/learn.js'));
app.use('/hazards', require('./routes/hazard.js'));
app.use('/careers', require('./routes/career.js'));
app.use('/api', require('./routes/api.js'));

// ─── 404 Handler ───────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// ─── Error Handler ─────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  console.error('Error message:', err.message);
  console.error('Stack:', err.stack);
  res.status(500).json({ error: err.message || 'Something went wrong!' });
});

// ─── Start Server ──────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 PetroGuide Pro running at http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
