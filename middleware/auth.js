
exports.requireAuth = (req, res, next) => {
  console.log(`ℹ️  Checking auth for ${req.path}, Session ID: ${req.sessionID}, User: ${req.session.user ? req.session.user.email : 'none'}`);
  if (!req.session.user) {
    console.log(`❌ No authentication found, redirecting to /auth/login`);
    req.flash('error', 'Please log in to access this page');
    return res.redirect('/auth/login');
  }
  console.log(`✅ User authenticated: ${req.session.user.email}`);
  next();
};

exports.requireAdmin = (req, res, next) => {
  if (!req.session.user || req.session.user.role !== 'admin') {
    req.flash('error', 'Admin access required');
    return res.redirect('/');
  }
  next();
};

exports.redirectIfAuth = (req, res, next) => {
  if (req.session.user) {
    console.log(`✅ User already authenticated (${req.session.user.email}), redirecting to /dashboard`);
    return res.redirect('/dashboard');
  }
  console.log('ℹ️  No session found, allowing access to auth page');
  next();
};
