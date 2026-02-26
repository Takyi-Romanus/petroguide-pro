
exports.requireAuth = (req, res, next) => {
  if (req.session.register) return next();
  req.flash('error', 'Please complete signup to proceed');
  res.redirect('../auth/register');
};

exports.requireAuth = (req, res, next) => {
  if (req.session.user) return next();
  req.flash('error', 'Please log in to access this page');
  res.redirect('../auth/login');
};

exports.requireAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') return next();
  req.flash('error', 'Admin access required');
  res.redirect('/');
};

exports.redirectIfAuth = (req, res, next) => {
  if (req.session.user) return res.redirect('../dashboard');
  next();
};
