const { User } = require('../models');

// Check if user is authenticated
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    req.session.error = 'Anda harus login untuk mengakses halaman ini';
    return res.redirect('/auth/login');
  }
  next();
};

// Check if user is guest (not authenticated)
const requireGuest = (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  next();
};

// Check user role
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.session.user) {
      req.session.error = 'Anda harus login untuk mengakses halaman ini';
      return res.redirect('/auth/login');
    }

    if (!roles.includes(req.session.user.role)) {
      req.session.error = 'Anda tidak memiliki akses ke halaman ini';
      return res.redirect('/dashboard');
    }

    next();
  };
};

// Check ownership or role
const requireOwnershipOrRole = (model, paramKey = 'id', roles = ['admin']) => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[paramKey];
      const userId = req.session.user.id;
      const userRole = req.session.user.role;

      // Admin can access anything
      if (roles.includes(userRole)) {
        return next();
      }

      // Check ownership
      const resource = await model.findByPk(resourceId);
      if (!resource) {
        req.session.error = 'Resource tidak ditemukan';
        return res.redirect('back');
      }

      const ownerField = model.name === 'User' ? 'id' : `${model.name.toLowerCase()}Id`;
      if (resource[ownerField] === userId) {
        return next();
      }

      req.session.error = 'Anda tidak memiliki akses ke resource ini';
      res.redirect('back');
    } catch (error) {
      console.error('Ownership check error:', error);
      req.session.error = 'Terjadi kesalahan saat memverifikasi akses';
      res.redirect('back');
    }
  };
};

// Update last login middleware
const updateLastLogin = async (req, res, next) => {
  if (req.session.user) {
    try {
      const user = await User.findByPk(req.session.user.id);
      if (user) {
        await user.updateLastLogin();
      }
    } catch (error) {
      console.error('Error updating last login:', error);
    }
  }
  next();
};

module.exports = {
  requireAuth,
  requireGuest,
  requireRole,
  requireOwnershipOrRole,
  updateLastLogin
};