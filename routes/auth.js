const express = require('express');
const { User, Profile } = require('../models');
const { requireGuest, updateLastLogin } = require('../middleware/auth');
const router = express.Router();

// Login Page
router.get('/login', requireGuest, (req, res) => {
  res.render('auth/login', { 
    title: 'Login - UpworkClone',
    redirect: req.query.redirect || ''
  });
});

// Login Process
router.post('/login', requireGuest, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      req.session.error = 'Email dan password harus diisi';
      return res.redirect('/auth/login');
    }

    // Cari user by email
    const user = await User.findOne({ 
      where: { email },
      include: [{ model: Profile, as: 'profile' }]
    });

    if (!user || !(await user.correctPassword(password, user.password))) {
      req.session.error = 'Email atau password salah';
      return res.redirect('/auth/login');
    }

    if (!user.isActive) {
      req.session.error = 'Akun Anda dinonaktifkan. Silakan hubungi admin.';
      return res.redirect('/auth/login');
    }

    // Set session
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      profile: user.profile
    };

    // Update last login
    await user.updateLastLogin();

    req.session.success = `Selamat datang kembali, ${user.name}!`;

    // Redirect based on role
    const redirectPath = req.body.redirect || 
      (user.role === 'admin' ? '/admin/dashboard' : 
       user.role === 'client' ? '/client/dashboard' : 
       '/freelancer/dashboard');

    res.redirect(redirectPath);

  } catch (error) {
    console.error('Login error:', error);
    req.session.error = 'Terjadi kesalahan saat login';
    res.redirect('/auth/login');
  }
});

// Register Page
router.get('/register', requireGuest, (req, res) => {
  const role = req.query.role || 'client';
  res.render('auth/register', { 
    title: 'Daftar - UpworkClone',
    role: ['client', 'freelancer'].includes(role) ? role : 'client'
  });
});

// Register Process
router.post('/register', requireGuest, async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role, phone } = req.body;

    // Validasi input
    if (!name || !email || !password || !confirmPassword) {
      req.session.error = 'Semua field harus diisi';
      return res.redirect('/auth/register');
    }

    if (password !== confirmPassword) {
      req.session.error = 'Password dan konfirmasi password tidak cocok';
      return res.redirect('/auth/register');
    }

    if (password.length < 6) {
      req.session.error = 'Password harus minimal 6 karakter';
      return res.redirect('/auth/register');
    }

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      req.session.error = 'Email sudah terdaftar';
      return res.redirect('/auth/register');
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: ['client', 'freelancer'].includes(role) ? role : 'client',
      phone: phone || null
    });

    // Create profile based on role
    const profileData = {
      userId: user.id,
      title: role === 'freelancer' ? 'Freelancer Baru' : 'Client Baru',
      description: role === 'freelancer' ? 
        'Saya adalah freelancer yang bersemangat dan siap mengerjakan project Anda!' :
        'Saya sedang mencari freelancer untuk membantu project saya.'
    };

    if (role === 'freelancer') {
      profileData.hourlyRate = 0;
      profileData.skills = [];
    }

    await Profile.create(profileData);

    req.session.success = `Akun berhasil dibuat! Silakan login.`;
    res.redirect('/auth/login');

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      req.session.error = messages.join(', ');
    } else {
      req.session.error = 'Terjadi kesalahan saat mendaftar';
    }
    
    res.redirect('/auth/register');
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/');
  });
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/');
  });
});

module.exports = router;