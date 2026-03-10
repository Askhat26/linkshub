# Linkora — Complete Backend Documentation

> Build guide for Node.js + Express + MongoDB backend with JWT auth, coupon system, QR codes, analytics, and admin panel.
> All pricing in Indian Rupees (₹ INR).

---

## 1. Project Setup

```bash
mkdir linkora-backend && cd linkora-backend
npm init -y
npm install express mongoose bcryptjs jsonwebtoken cors dotenv qrcode pdfkit
npm install helmet express-rate-limit morgan express-validator
npm install -D nodemon
```

### `server.js`
```js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const app = express();
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:8080' }));
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/links', require('./routes/links'));
app.use('/api/appearance', require('./routes/appearance'));
app.use('/api/card', require('./routes/card'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/qr', require('./routes/qr'));
app.use('/api/coupons', require('./routes/coupons'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/public', require('./routes/public'));
app.use('/api/payments', require('./routes/payments'));
mongoose.connect(process.env.MONGODB_URI).then(() => {
  app.listen(process.env.PORT || 5000, () => console.log(`Server running on port ${process.env.PORT || 5000}`));
}).catch(err => console.error('MongoDB connection error:', err));
```

### `.env`
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/linkora
JWT_SECRET=your-super-secret-jwt-key-change-this
CLIENT_URL=http://localhost:5173
BASE_URL=https://linkora.in
```

### Project Structure
```
linkora-backend/
├── server.js
├── .env
├── models/
│   ├── User.js
│   ├── Link.js
│   ├── Appearance.js
│   ├── Card.js
│   ├── AnalyticsEvent.js
│   ├── Coupon.js
│   └── AppliedCoupon.js
├── middleware/
│   ├── auth.js
│   ├── admin.js
│   └── planGate.js
└── routes/
    ├── auth.js
    ├── links.js
    ├── appearance.js
    ├── card.js
    ├── analytics.js
    ├── qr.js
    ├── profile.js
    ├── coupons.js
    ├── admin.js
    └── user.js
```

---

## 2. Database Models

### `models/User.js`
```js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  username: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 30 },
  password: { type: String, required: true, minlength: 6 },
  avatar: { type: String, default: '' },
  bio: { type: String, default: '', maxlength: 300 },
  plan: { type: String, enum: ['starter', 'pro', 'premium'], default: 'starter' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isBanned: { type: Boolean, default: false },
}, { timestamps: true });
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
userSchema.methods.comparePassword = function(p) { return bcrypt.compare(p, this.password); };
module.exports = mongoose.model('User', userSchema);
```

### `models/Link.js`
```js
const mongoose = require('mongoose');
const linkSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 100 },
  url: { type: String, required: true, trim: true },
  enabled: { type: Boolean, default: true },
  clicks: { type: Number, default: 0 },
  order: { type: Number, default: 0 },
}, { timestamps: true });
module.exports = mongoose.model('Link', linkSchema);
```

### `models/Appearance.js`
```js
const mongoose = require('mongoose');
const appearanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  layout: { type: String, default: 'classic-glass' },
  theme: { type: String, default: 'neon-cyber' },
  accentColor: { type: String, default: '#7c3aed' },
  backgroundColor: { type: String, default: '#0a0a0f' },
  font: { type: String, default: 'Space Grotesk' },
  buttonStyle: { type: String, default: 'rounded' },
  animation: { type: String, default: 'fade-up' },
  avatarStyle: { type: String, default: 'circle' },
}, { timestamps: true });
module.exports = mongoose.model('Appearance', appearanceSchema);
```

### `models/Card.js`
```js
const mongoose = require('mongoose');
const cardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  name: { type: String, default: '' },
  role: { type: String, default: '' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  website: { type: String, default: '' },
  location: { type: String, default: '' },
  template: { type: String, default: 'minimal-white' },
  brandName: { type: String, default: '' },
  tagline: { type: String, default: '' },
}, { timestamps: true });
module.exports = mongoose.model('Card', cardSchema);
```

### `models/AnalyticsEvent.js`
```js
const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['profile_view', 'link_click', 'qr_scan'], required: true },
  linkId: { type: mongoose.Schema.Types.ObjectId, ref: 'Link' },
  ip: String, userAgent: String, referer: String,
}, { timestamps: true });
module.exports = mongoose.model('AnalyticsEvent', schema);
```

### `models/Coupon.js`
```js
const mongoose = require('mongoose');
const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  discountPercent: { type: Number, required: true, min: 1, max: 100 },
  maxUses: { type: Number, required: true, min: 1 },
  usedCount: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
module.exports = mongoose.model('Coupon', couponSchema);
```

### `models/AppliedCoupon.js`
```js
const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  couponId: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon', required: true },
  discountPercent: { type: Number, required: true },
}, { timestamps: true });
schema.index({ userId: 1, couponId: 1 }, { unique: true });
module.exports = mongoose.model('AppliedCoupon', schema);
```

---

## 3. Middleware

### `middleware/auth.js`
```js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
module.exports = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'No token provided' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) return res.status(401).json({ error: 'User not found' });
    if (user.isBanned) return res.status(403).json({ error: 'Account is banned' });
    req.user = user;
    next();
  } catch (err) { res.status(401).json({ error: 'Invalid token' }); }
};
```

### `middleware/admin.js`
```js
module.exports = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  next();
};
```

### `middleware/planGate.js` — Feature Gating Middleware
```js
// Plan feature limits configuration
const PLAN_LIMITS = {
  starter: {
    maxLinks: 5,
    themes: ['neon-cyber', 'glass-morph', 'minimal-creator', 'creator-dark', 'minimal-mono'], // 5 basic themes
    layouts: ['classic-glass', 'minimal', 'bordered'], // 3 basic layouts
    hasCard: false,
    hasQR: false,
    hasAdvancedAnalytics: false,
    hasCustomDomain: false,
    showBranding: true, // Linkora badge shown
  },
  pro: {
    maxLinks: Infinity,
    themes: 'all', // All 20 themes
    layouts: 'all', // All 15 layouts
    hasCard: true,
    hasQR: true,
    hasAdvancedAnalytics: true,
    hasCustomDomain: true,
    showBranding: false,
  },
  premium: {
    maxLinks: Infinity,
    themes: 'all',
    layouts: 'all',
    hasCard: true,
    hasQR: true,
    hasAdvancedAnalytics: true,
    hasCustomDomain: true,
    showBranding: false,
    hasTeamCollab: true,
    hasApiAccess: true,
    hasWhiteLabel: true,
  },
};

// Middleware to check feature access
function requirePlan(...allowedPlans) {
  return (req, res, next) => {
    if (!allowedPlans.includes(req.user.plan)) {
      return res.status(403).json({
        error: 'Upgrade required',
        requiredPlan: allowedPlans[0],
        currentPlan: req.user.plan,
      });
    }
    next();
  };
}

function requireFeature(feature) {
  return (req, res, next) => {
    const limits = PLAN_LIMITS[req.user.plan];
    if (!limits || !limits[feature]) {
      return res.status(403).json({
        error: `Feature "${feature}" requires a plan upgrade`,
        currentPlan: req.user.plan,
      });
    }
    next();
  };
}

function getLimits(plan) {
  return PLAN_LIMITS[plan] || PLAN_LIMITS.starter;
}

module.exports = { requirePlan, requireFeature, getLimits, PLAN_LIMITS };
```

---

## 4. API Routes

### `routes/auth.js`
```js
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Appearance = require('../models/Appearance');
const auth = require('../middleware/auth');

router.post('/register', async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    if (!name || !email || !username || !password) return res.status(400).json({ error: 'All fields required' });
    if (password.length < 6) return res.status(400).json({ error: 'Password min 6 chars' });
    if (!/^[a-z0-9_]+$/.test(username)) return res.status(400).json({ error: 'Username: lowercase alphanumeric only' });
    if (await User.findOne({ email: email.toLowerCase() })) return res.status(400).json({ error: 'Email taken' });
    if (await User.findOne({ username: username.toLowerCase() })) return res.status(400).json({ error: 'Username taken' });
    const user = await User.create({ name, email, username: username.toLowerCase(), password });
    await Appearance.create({ userId: user._id });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.status(201).json({ token, user: { _id: user._id, name: user.name, email: user.email, username: user.username, plan: user.plan, role: user.role } });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || user.isBanned) return res.status(400).json({ error: 'Invalid credentials' });
    if (!(await user.comparePassword(password))) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, user: { _id: user._id, name: user.name, email: user.email, username: user.username, avatar: user.avatar, bio: user.bio, plan: user.plan, role: user.role } });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

router.get('/me', auth, (req, res) => res.json({ user: req.user }));
module.exports = router;
```

### `routes/links.js` — With Plan Gating
```js
const router = require('express').Router();
const Link = require('../models/Link');
const auth = require('../middleware/auth');
const { getLimits } = require('../middleware/planGate');

router.get('/', auth, async (req, res) => {
  const links = await Link.find({ userId: req.user._id }).sort('order');
  res.json({ links });
});

router.post('/', auth, async (req, res) => {
  const { title, url } = req.body;
  if (!title || !url) return res.status(400).json({ error: 'Title and URL required' });

  // Plan-based link limit
  const limits = getLimits(req.user.plan);
  const count = await Link.countDocuments({ userId: req.user._id });
  if (count >= limits.maxLinks) {
    return res.status(403).json({
      error: `${req.user.plan} plan allows max ${limits.maxLinks} links. Upgrade to add more.`,
      currentPlan: req.user.plan,
    });
  }

  const highest = await Link.findOne({ userId: req.user._id }).sort('-order');
  const link = await Link.create({ userId: req.user._id, title, url, order: highest ? highest.order + 1 : 0 });
  res.status(201).json({ link });
});

router.put('/:id', auth, async (req, res) => {
  const link = await Link.findOne({ _id: req.params.id, userId: req.user._id });
  if (!link) return res.status(404).json({ error: 'Not found' });
  const { title, url, enabled } = req.body;
  if (title !== undefined) link.title = title;
  if (url !== undefined) link.url = url;
  if (enabled !== undefined) link.enabled = enabled;
  await link.save();
  res.json({ link });
});

router.put('/reorder/batch', auth, async (req, res) => {
  const { orderedIds } = req.body;
  if (!Array.isArray(orderedIds)) return res.status(400).json({ error: 'orderedIds array required' });
  await Link.bulkWrite(orderedIds.map((id, i) => ({ updateOne: { filter: { _id: id, userId: req.user._id }, update: { order: i } } })));
  res.json({ success: true });
});

router.delete('/:id', auth, async (req, res) => {
  await Link.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  res.json({ success: true });
});

module.exports = router;
```

### `routes/appearance.js` — With Theme/Layout Gating
```js
const router = require('express').Router();
const Appearance = require('../models/Appearance');
const auth = require('../middleware/auth');
const { getLimits } = require('../middleware/planGate');

// Allowed themes/layouts for starter plan
const STARTER_THEMES = ['neon-cyber', 'glass-morph', 'minimal-creator', 'creator-dark', 'minimal-mono'];
const STARTER_LAYOUTS = ['classic-glass', 'minimal', 'bordered'];

router.get('/', auth, async (req, res) => {
  let a = await Appearance.findOne({ userId: req.user._id });
  if (!a) a = await Appearance.create({ userId: req.user._id });
  res.json({ appearance: a });
});

router.put('/', auth, async (req, res) => {
  const { layout, theme, accentColor, backgroundColor, font, buttonStyle, animation, avatarStyle } = req.body;
  const limits = getLimits(req.user.plan);

  // Validate theme access
  if (limits.themes !== 'all' && theme && !STARTER_THEMES.includes(theme)) {
    return res.status(403).json({ error: 'This theme requires Pro plan or higher', currentPlan: req.user.plan });
  }

  // Validate layout access
  if (limits.layouts !== 'all' && layout && !STARTER_LAYOUTS.includes(layout)) {
    return res.status(403).json({ error: 'This layout requires Pro plan or higher', currentPlan: req.user.plan });
  }

  const a = await Appearance.findOneAndUpdate(
    { userId: req.user._id },
    { layout, theme, accentColor, backgroundColor, font, buttonStyle, animation, avatarStyle },
    { new: true, upsert: true }
  );
  res.json({ appearance: a });
});

module.exports = router;
```

### `routes/card.js` — With Plan Gating
```js
const router = require('express').Router();
const Card = require('../models/Card');
const auth = require('../middleware/auth');
const { requireFeature } = require('../middleware/planGate');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');

// Card requires Pro or Premium plan
router.get('/', auth, requireFeature('hasCard'), async (req, res) => {
  let card = await Card.findOne({ userId: req.user._id });
  if (!card) card = await Card.create({ userId: req.user._id, name: req.user.name, email: req.user.email });
  res.json({ card });
});

router.put('/', auth, requireFeature('hasCard'), async (req, res) => {
  const { name, role, phone, email, website, location, template, brandName, tagline } = req.body;
  const card = await Card.findOneAndUpdate(
    { userId: req.user._id },
    { name, role, phone, email, website, location, template, brandName, tagline },
    { new: true, upsert: true }
  );
  res.json({ card });
});

router.get('/pdf', auth, requireFeature('hasCard'), async (req, res) => {
  const card = await Card.findOne({ userId: req.user._id });
  if (!card) return res.status(404).json({ error: 'Card not found' });

  // Generate QR code for back side
  const profileUrl = `${process.env.BASE_URL}/${req.user.username}`;
  const qrDataUrl = await QRCode.toDataURL(profileUrl, { width: 200, margin: 1 });

  const doc = new PDFDocument({ size: [350, 200], margin: 20 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${card.name}-card.pdf`);
  doc.pipe(res);

  // Front Side
  doc.fontSize(10).font('Helvetica').text(card.brandName || '', 20, 15, { opacity: 0.6 });
  doc.fontSize(8).text(card.tagline || '', 20, 28);
  doc.fontSize(16).font('Helvetica-Bold').text(card.name, 20, 60);
  doc.fontSize(9).font('Helvetica').text(card.role, 20, 80);
  doc.fontSize(8).text(`📞 ${card.phone}`, 20, 110);
  doc.fontSize(8).text(`📧 ${card.email}`, 20, 125);
  doc.fontSize(8).text(`🌐 ${card.website}`, 20, 140);
  doc.fontSize(8).text(`📍 ${card.location}`, 20, 155);

  // Back Side (new page)
  doc.addPage({ size: [350, 200], margin: 20 });
  // Add QR code image
  const qrBuffer = Buffer.from(qrDataUrl.split(',')[1], 'base64');
  doc.image(qrBuffer, 100, 20, { width: 150, height: 150 });
  doc.fontSize(9).text('Scan to open profile', 100, 175, { width: 150, align: 'center' });
  if (card.brandName) {
    doc.fontSize(8).font('Helvetica-Bold').text(card.brandName, 100, 10, { width: 150, align: 'center', opacity: 0.5 });
  }

  doc.end();
});

module.exports = router;
```

### `routes/qr.js` — With Plan Gating
```js
const router = require('express').Router();
const QRCode = require('qrcode');
const auth = require('../middleware/auth');
const { requireFeature } = require('../middleware/planGate');

// QR Code requires Pro or Premium plan
router.get('/generate', auth, requireFeature('hasQR'), async (req, res) => {
  const url = `${process.env.BASE_URL}/${req.user.username}`;
  const buf = await QRCode.toBuffer(url, { type: 'png', width: 512, margin: 2 });
  res.setHeader('Content-Type', 'image/png');
  res.send(buf);
});

router.get('/data-url', auth, requireFeature('hasQR'), async (req, res) => {
  const url = `${process.env.BASE_URL}/${req.user.username}`;
  const dataUrl = await QRCode.toDataURL(url, { width: 512, margin: 2 });
  res.json({ dataUrl, profileUrl: url });
});

module.exports = router;
```

### `routes/analytics.js`
```js
const router = require('express').Router();
const AnalyticsEvent = require('../models/AnalyticsEvent');
const Link = require('../models/Link');
const auth = require('../middleware/auth');
const { getLimits } = require('../middleware/planGate');

router.get('/', auth, async (req, res) => {
  const limits = getLimits(req.user.plan);
  // Starter gets basic (7 days), Pro/Premium get advanced (30-90 days)
  const maxDays = limits.hasAdvancedAnalytics ? (req.query.days || 30) : 7;
  const since = new Date(Date.now() - maxDays * 86400000);
  const events = await AnalyticsEvent.find({ userId: req.user._id, createdAt: { $gte: since } }).sort('-createdAt');
  const profileViews = events.filter(e => e.type === 'profile_view').length;
  const linkClicks = events.filter(e => e.type === 'link_click').length;
  const qrScans = events.filter(e => e.type === 'qr_scan').length;
  const clickRate = profileViews > 0 ? ((linkClicks / profileViews) * 100).toFixed(1) : '0';
  const dailyData = {};
  events.forEach(e => {
    const day = e.createdAt.toISOString().split('T')[0];
    if (!dailyData[day]) dailyData[day] = { views: 0, clicks: 0, qrScans: 0 };
    if (e.type === 'profile_view') dailyData[day].views++;
    if (e.type === 'link_click') dailyData[day].clicks++;
    if (e.type === 'qr_scan') dailyData[day].qrScans++;
  });
  res.json({ stats: { profileViews, linkClicks, qrScans, clickRate: `${clickRate}%` }, dailyData, plan: req.user.plan, maxDaysAllowed: maxDays });
});

router.post('/track', async (req, res) => {
  const { userId, type, linkId } = req.body;
  if (!userId || !type) return res.status(400).json({ error: 'userId and type required' });
  await AnalyticsEvent.create({ userId, type, linkId: linkId || undefined, ip: req.ip, userAgent: req.headers['user-agent'], referer: req.headers['referer'] });
  if (type === 'link_click' && linkId) await Link.findByIdAndUpdate(linkId, { $inc: { clicks: 1 } });
  res.json({ success: true });
});

module.exports = router;
```

### `routes/profile.js`
```js
const router = require('express').Router();
const User = require('../models/User');
const Link = require('../models/Link');
const Appearance = require('../models/Appearance');
const AnalyticsEvent = require('../models/AnalyticsEvent');
const { getLimits } = require('../middleware/planGate');

router.get('/:username', async (req, res) => {
  const user = await User.findOne({ username: req.params.username, isBanned: false }).select('name username avatar bio plan');
  if (!user) return res.status(404).json({ error: 'Profile not found' });
  const links = await Link.find({ userId: user._id, enabled: true }).sort('order');
  const appearance = await Appearance.findOne({ userId: user._id });
  const limits = getLimits(user.plan);

  await AnalyticsEvent.create({ userId: user._id, type: 'profile_view', ip: req.ip, userAgent: req.headers['user-agent'] });

  res.json({
    user,
    links,
    appearance,
    showBranding: limits.showBranding, // true for starter, false for pro/premium
    showQR: limits.hasQR, // false for starter
  });
});

module.exports = router;
```

### `routes/coupons.js`
```js
const router = require('express').Router();
const Coupon = require('../models/Coupon');
const AppliedCoupon = require('../models/AppliedCoupon');
const auth = require('../middleware/auth');
const PRICES = { pro: 499, premium: 999 };

router.post('/apply', auth, async (req, res) => {
  const { code, plan } = req.body;
  if (!code || !plan) return res.status(400).json({ error: 'Code and plan required' });
  const base = PRICES[plan];
  if (!base) return res.status(400).json({ error: 'Invalid plan' });
  const coupon = await Coupon.findOne({ code: code.toUpperCase() });
  if (!coupon) return res.status(404).json({ error: 'Coupon not found' });
  if (!coupon.isActive) return res.status(400).json({ error: 'Coupon inactive' });
  if (new Date(coupon.expiresAt) < new Date()) return res.status(400).json({ error: 'Coupon expired' });
  if (coupon.usedCount >= coupon.maxUses) return res.status(400).json({ error: 'Usage limit reached' });
  const existing = await AppliedCoupon.findOne({ userId: req.user._id, couponId: coupon._id });
  if (existing) return res.status(400).json({ error: 'Already used this coupon' });
  const discount = base * (coupon.discountPercent / 100);
  coupon.usedCount += 1;
  await coupon.save();
  await AppliedCoupon.create({ userId: req.user._id, couponId: coupon._id, discountPercent: coupon.discountPercent });
  res.json({ discountPercent: coupon.discountPercent, discountAmount: discount, finalPrice: base - discount, basePrice: base });
});

module.exports = router;
```

### `routes/user.js`
```js
const router = require('express').Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

router.put('/profile', auth, async (req, res) => {
  const { name, username, bio } = req.body;
  if (username && username !== req.user.username) {
    if (await User.findOne({ username: username.toLowerCase() })) return res.status(400).json({ error: 'Username taken' });
  }
  const user = await User.findByIdAndUpdate(req.user._id, { name, username: username?.toLowerCase(), bio }, { new: true }).select('-password');
  res.json({ user });
});

router.put('/password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Both passwords required' });
  const user = await User.findById(req.user._id);
  if (!(await user.comparePassword(currentPassword))) return res.status(400).json({ error: 'Wrong current password' });
  user.password = newPassword;
  await user.save();
  res.json({ success: true });
});

router.delete('/account', auth, async (req, res) => {
  await User.findByIdAndDelete(req.user._id);
  const Link = require('../models/Link');
  await Promise.all([Link.deleteMany({ userId: req.user._id }), require('../models/Appearance').deleteOne({ userId: req.user._id }), require('../models/Card').deleteOne({ userId: req.user._id }), require('../models/AnalyticsEvent').deleteMany({ userId: req.user._id })]);
  res.json({ success: true });
});

module.exports = router;
```

### `routes/admin.js`
```js
const router = require('express').Router();
const User = require('../models/User');
const Link = require('../models/Link');
const Coupon = require('../models/Coupon');
const AnalyticsEvent = require('../models/AnalyticsEvent');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
router.use(auth, admin);

router.get('/users', async (req, res) => { res.json({ users: await User.find().select('-password').sort('-createdAt') }); });
router.patch('/users/:id/ban', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  user.isBanned = !user.isBanned; await user.save();
  res.json({ user: { _id: user._id, isBanned: user.isBanned } });
});
router.delete('/users/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  await Promise.all([Link.deleteMany({ userId: req.params.id }), require('../models/Appearance').deleteOne({ userId: req.params.id }), require('../models/Card').deleteOne({ userId: req.params.id }), AnalyticsEvent.deleteMany({ userId: req.params.id })]);
  res.json({ success: true });
});

router.get('/coupons', async (req, res) => { res.json({ coupons: await Coupon.find().sort('-createdAt') }); });
router.post('/coupons', async (req, res) => {
  const { code, discountPercent, maxUses, expiresAt } = req.body;
  if (!code || !discountPercent || !maxUses || !expiresAt) return res.status(400).json({ error: 'All fields required' });
  if (await Coupon.findOne({ code: code.toUpperCase() })) return res.status(400).json({ error: 'Code exists' });
  const coupon = await Coupon.create({ code: code.toUpperCase(), discountPercent, maxUses, expiresAt: new Date(expiresAt), createdBy: req.user._id });
  res.status(201).json({ coupon });
});
router.patch('/coupons/:id/toggle', async (req, res) => {
  const c = await Coupon.findById(req.params.id);
  if (!c) return res.status(404).json({ error: 'Not found' });
  c.isActive = !c.isActive; await c.save(); res.json({ coupon: c });
});
router.delete('/coupons/:id', async (req, res) => { await Coupon.findByIdAndDelete(req.params.id); res.json({ success: true }); });
router.get('/coupons/stats', async (req, res) => {
  const coupons = await Coupon.find();
  res.json({ total: coupons.length, totalUsage: coupons.reduce((a, c) => a + c.usedCount, 0), active: coupons.filter(c => c.isActive).length, expired: coupons.filter(c => new Date(c.expiresAt) < new Date()).length, mostUsed: coupons.reduce((a, c) => c.usedCount > (a?.usedCount || 0) ? c : a, null) });
});
router.get('/stats', async (req, res) => {
  res.json({ totalUsers: await User.countDocuments(), totalLinks: await Link.countDocuments(), totalEvents: await AnalyticsEvent.countDocuments(), totalQrScans: await AnalyticsEvent.countDocuments({ type: 'qr_scan' }) });
});

module.exports = router;
```

---

## 5. API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register |
| POST | `/api/auth/login` | No | Login |
| GET | `/api/auth/me` | JWT | Current user |
| GET | `/api/links` | JWT | Get links |
| POST | `/api/links` | JWT | Create link (plan-gated limit) |
| PUT | `/api/links/:id` | JWT | Update link |
| PUT | `/api/links/reorder/batch` | JWT | Reorder (drag & drop) |
| DELETE | `/api/links/:id` | JWT | Delete link |
| GET | `/api/appearance` | JWT | Get appearance |
| PUT | `/api/appearance` | JWT | Update appearance (plan-gated themes/layouts) |
| GET | `/api/card` | JWT | Get card (Pro/Premium only) |
| PUT | `/api/card` | JWT | Update card (Pro/Premium only) |
| GET | `/api/card/pdf` | JWT | Download PDF with QR (Pro/Premium only) |
| GET | `/api/analytics` | JWT | Get analytics (starter: 7 days, pro: 30+) |
| POST | `/api/analytics/track` | No | Track event |
| GET | `/api/qr/generate` | JWT | QR as PNG (Pro/Premium only) |
| GET | `/api/qr/data-url` | JWT | QR as data URL (Pro/Premium only) |
| GET | `/api/profile/:username` | No | Public profile |
| POST | `/api/coupons/apply` | JWT | Apply coupon |
| PUT | `/api/user/profile` | JWT | Update profile |
| PUT | `/api/user/password` | JWT | Change password |
| DELETE | `/api/user/account` | JWT | Delete account |
| GET | `/api/admin/users` | Admin | All users |
| PATCH | `/api/admin/users/:id/ban` | Admin | Ban/unban |
| DELETE | `/api/admin/users/:id` | Admin | Delete user |
| GET | `/api/admin/coupons` | Admin | All coupons |
| POST | `/api/admin/coupons` | Admin | Create coupon |
| PATCH | `/api/admin/coupons/:id/toggle` | Admin | Toggle coupon |
| DELETE | `/api/admin/coupons/:id` | Admin | Delete coupon |
| GET | `/api/admin/coupons/stats` | Admin | Coupon stats |
| GET | `/api/admin/stats` | Admin | Platform stats |

---

## 6. Feature Gating by Plan

### Plan Comparison Table

| Feature | Starter (₹0) | Pro (₹499/mo) | Premium (₹999/mo) |
|---------|:---:|:---:|:---:|
| **Links** | 5 max | Unlimited | Unlimited |
| **Themes** | 5 basic | All 20 | All 20 |
| **Layouts** | 3 basic | All 15 | All 15 |
| **Digital Business Card** | ❌ | ✅ | ✅ |
| **QR Code** | ❌ | ✅ | ✅ |
| **Analytics** | Basic (7 days) | Advanced (30+ days) | Advanced (90 days) |
| **Custom Domain** | ❌ | ✅ | ✅ |
| **Linkora Branding** | Shown | Hidden | Hidden |
| **Team Collaboration** | ❌ | ❌ | ✅ |
| **API Access** | ❌ | ❌ | ✅ |
| **White Label** | ❌ | ❌ | ✅ |
| **Priority Support** | ❌ | ✅ | ✅ |
| **Dedicated Support** | ❌ | ❌ | ✅ |
| **Custom Integrations** | ❌ | ❌ | ✅ |

### Starter Plan Allowed Themes (5)
| Theme ID | Label |
|----------|-------|
| `neon-cyber` | Neon Cyber |
| `glass-morph` | Glass Morph |
| `minimal-creator` | Minimal Creator |
| `creator-dark` | Creator Dark Mode |
| `minimal-mono` | Minimal Mono |

### Starter Plan Allowed Layouts (3)
| Layout ID | Label |
|-----------|-------|
| `classic-glass` | Classic Glass |
| `minimal` | Minimal |
| `bordered` | Bordered |

### Backend Implementation Summary

1. **Links** — `POST /api/links` checks `getLimits(plan).maxLinks` before creating
2. **Themes/Layouts** — `PUT /api/appearance` validates theme/layout against allowed lists
3. **Card** — All `/api/card` routes use `requireFeature('hasCard')` middleware
4. **QR Code** — All `/api/qr` routes use `requireFeature('hasQR')` middleware
5. **Analytics** — `GET /api/analytics` limits `maxDays` based on `hasAdvancedAnalytics`
6. **Branding** — `GET /api/profile/:username` returns `showBranding` flag
7. **Public QR** — `GET /api/profile/:username` returns `showQR` flag (QR hidden for starter)

### Frontend Implementation Notes

On the frontend, check the user's plan and:
- **Links Page**: Show "Upgrade" prompt when link count reaches 5 for starter users
- **Appearance Page**: Show lock icons on premium themes/layouts, redirect to upgrade
- **Card Page**: Show upgrade CTA instead of card editor for starter users
- **QR Page**: Show upgrade CTA for starter users
- **Analytics**: Show "Upgrade for 30-day analytics" for starter users
- **Public Profile**: Conditionally render QR code and branding based on API response

---

## 7. Frontend `src/lib/api.ts`

```typescript
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('linkora_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  register: (data: { name: string; email: string; username: string; password: string }) => api.post('/auth/register', data),
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};
export const linksAPI = {
  getAll: () => api.get('/links'),
  create: (data: { title: string; url: string }) => api.post('/links', data),
  update: (id: string, data: any) => api.put(`/links/${id}`, data),
  reorder: (orderedIds: string[]) => api.put('/links/reorder/batch', { orderedIds }),
  delete: (id: string) => api.delete(`/links/${id}`),
};
export const appearanceAPI = { get: () => api.get('/appearance'), update: (data: any) => api.put('/appearance', data) };
export const cardAPI = { get: () => api.get('/card'), update: (data: any) => api.put('/card', data), downloadPdf: () => api.get('/card/pdf', { responseType: 'blob' }) };
export const analyticsAPI = { get: (days?: number) => api.get('/analytics', { params: { days } }), track: (data: { userId: string; type: string; linkId?: string }) => api.post('/analytics/track', data) };
export const qrAPI = { getDataUrl: () => api.get('/qr/data-url'), downloadPng: () => api.get('/qr/generate', { responseType: 'blob' }) };
export const profileAPI = { get: (username: string) => api.get(`/profile/${username}`) };
export const couponAPI = { apply: (data: { code: string; plan: string }) => api.post('/coupons/apply', data) };
export const userAPI = { updateProfile: (data: any) => api.put('/user/profile', data), changePassword: (data: any) => api.put('/user/password', data), deleteAccount: () => api.delete('/user/account') };
export const adminAPI = { getUsers: () => api.get('/admin/users'), banUser: (id: string) => api.patch(`/admin/users/${id}/ban`), deleteUser: (id: string) => api.delete(`/admin/users/${id}`), getCoupons: () => api.get('/admin/coupons'), createCoupon: (data: any) => api.post('/admin/coupons', data), toggleCoupon: (id: string) => api.patch(`/admin/coupons/${id}/toggle`), deleteCoupon: (id: string) => api.delete(`/admin/coupons/${id}`), getCouponStats: () => api.get('/admin/coupons/stats'), getStats: () => api.get('/admin/stats') };
export default api;
```

---

## 8. Dependencies

### Frontend Dependencies

```bash
npm install react react-dom react-router-dom
npm install typescript @types/react @types/react-dom
npm install tailwindcss postcss autoprefixer
npm install @tailwindcss/typography
npm install framer-motion
npm install recharts
npm install axios
npm install sonner
npm install lucide-react
npm install class-variance-authority clsx tailwind-merge
npm install tailwindcss-animate
npm install @radix-ui/react-dialog @radix-ui/react-switch @radix-ui/react-select
npm install @radix-ui/react-tooltip @radix-ui/react-popover @radix-ui/react-tabs
npm install @radix-ui/react-dropdown-menu @radix-ui/react-separator
npm install @radix-ui/react-label @radix-ui/react-slot @radix-ui/react-toast
npm install @radix-ui/react-checkbox @radix-ui/react-progress
npm install @radix-ui/react-scroll-area @radix-ui/react-accordion
npm install @radix-ui/react-avatar @radix-ui/react-alert-dialog
npm install @radix-ui/react-toggle @radix-ui/react-toggle-group
npm install @tanstack/react-query
npm install react-hook-form @hookform/resolvers zod
npm install date-fns
npm install cmdk input-otp vaul
npm install embla-carousel-react react-resizable-panels react-day-picker
npm install next-themes
```

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^18.3.1 | UI framework |
| `react-dom` | ^18.3.1 | React DOM renderer |
| `react-router-dom` | ^6.30.1 | Client-side routing |
| `framer-motion` | ^12.34.3 | Animations & transitions |
| `recharts` | ^2.15.4 | Charts & analytics graphs |
| `axios` | latest | HTTP client for API calls |
| `tailwindcss` | ^3.4.17 | Utility-first CSS |
| `tailwindcss-animate` | ^1.0.7 | Animation utilities |
| `lucide-react` | ^0.462.0 | Icon library |
| `sonner` | ^1.7.4 | Toast notifications |
| `class-variance-authority` | ^0.7.1 | Component variants |
| `clsx` | ^2.1.1 | Conditional classnames |
| `tailwind-merge` | ^2.6.0 | Merge Tailwind classes |
| `@tanstack/react-query` | ^5.83.0 | Server state management |
| `react-hook-form` | ^7.61.1 | Form handling |
| `@hookform/resolvers` | ^3.10.0 | Form validation resolvers |
| `zod` | ^3.25.76 | Schema validation |
| `date-fns` | ^3.6.0 | Date utilities |
| `next-themes` | ^0.3.0 | Theme switching |
| `cmdk` | ^1.1.1 | Command palette |
| `vaul` | ^0.9.9 | Drawer component |
| `input-otp` | ^1.4.2 | OTP input |
| `embla-carousel-react` | ^8.6.0 | Carousel component |
| `react-resizable-panels` | ^2.1.9 | Resizable panels |
| `react-day-picker` | ^8.10.1 | Date picker |
| `@radix-ui/*` | various | Headless UI primitives |

### Backend Dependencies

```bash
npm install express mongoose bcryptjs jsonwebtoken cors dotenv qrcode pdfkit helmet express-rate-limit morgan express-validator
npm install -D nodemon jest
```

| Package | Version | Purpose |
|---------|---------|---------|
| `express` | ^4.18.2 | HTTP server & routing |
| `mongoose` | ^8.0.0 | MongoDB object modeling |
| `bcryptjs` | ^2.4.3 | Password hashing (12 salt rounds) |
| `jsonwebtoken` | ^9.0.2 | JWT token signing & verification |
| `cors` | ^2.8.5 | CORS middleware |
| `dotenv` | ^16.3.1 | Load `.env` variables |
| `qrcode` | ^1.5.3 | Generate QR codes (PNG/DataURL) |
| `pdfkit` | ^0.14.0 | Generate business card PDFs with QR |
| `helmet` | ^7.1.0 | Security HTTP headers |
| `express-rate-limit` | ^7.1.4 | API rate limiting |
| `morgan` | ^1.10.0 | HTTP request logger |
| `express-validator` | ^7.0.1 | Request body validation |
| `nodemon` | ^3.0.2 | Dev server auto-reload |

---

## 9. Frontend ↔ Backend Connection

The frontend is already wired to call your backend. Here's what you need:

### Environment Variable
Create a `.env` file in the frontend root:
```env
VITE_API_URL=http://localhost:5000/api
```

### API Client (`src/lib/api.ts`)
Already created with Axios. It:
- Attaches JWT from `localStorage` to every request via `Authorization: Bearer <token>`
- Redirects to `/login` on 401 responses
- Exports grouped API functions: `authApi`, `linksApi`, `appearanceApi`, `cardApi`, `analyticsApi`, `qrApi`, `couponsApi`, `adminApi`, `publicApi`, `paymentsApi`

### Auth Context (`src/contexts/AuthContext.tsx`)
- Stores user + token in `localStorage` keys: `linkora_token`, `linkora_user`
- Provides `login()`, `signup()`, `logout()`, `refreshUser()`
- All dashboard routes are wrapped in `<ProtectedRoute>`
- Admin routes use `<ProtectedRoute adminOnly>`

### React Query Hooks (`src/hooks/useApi.ts`)
Every dashboard page uses React Query hooks that call the API:

| Hook | API Endpoint | Used In |
|------|-------------|---------|
| `useLinks()` | `GET /api/links` | LinksPage, AppearancePage, DashboardPage |
| `useCreateLink()` | `POST /api/links` | LinksPage |
| `useUpdateLink()` | `PUT /api/links/:id` | LinksPage |
| `useDeleteLink()` | `DELETE /api/links/:id` | LinksPage |
| `useReorderLinks()` | `PUT /api/links/reorder` | LinksPage |
| `useAppearance()` | `GET /api/appearance` | AppearancePage |
| `useUpdateAppearance()` | `PUT /api/appearance` | AppearancePage |
| `useCard()` | `GET /api/card` | CardPage |
| `useUpdateCard()` | `PUT /api/card` | CardPage |
| `useDownloadCardPdf()` | `GET /api/card/pdf` | CardPage |
| `useAnalyticsStats()` | `GET /api/analytics/stats` | AnalyticsPage, DashboardPage |
| `useAnalyticsChart(days)` | `GET /api/analytics/chart?days=N` | AnalyticsPage, DashboardPage |
| `useQrStats()` | `GET /api/qr/stats` | QRPage |
| `useDownloadQr()` | `GET /api/qr/download` | QRPage |
| `useValidateCoupon()` | `POST /api/coupons/validate` | UpgradePage |
| `useAdminDashboard()` | `GET /api/admin/dashboard` | AdminDashboardPage |
| `useAdminUsers()` | `GET /api/admin/users` | AdminDashboardPage |
| `useAdminCoupons()` | `GET /api/admin/coupons` | AdminCouponsPage |
| `useCreateCoupon()` | `POST /api/admin/coupons` | AdminCouponsPage |
| `useToggleCoupon()` | `PUT /api/admin/coupons/:id/toggle` | AdminCouponsPage |
| `useDeleteCoupon()` | `DELETE /api/admin/coupons/:id` | AdminCouponsPage |
| `usePublicProfile(username)` | `GET /api/public/:username` | PublicProfilePage |

### Expected API Response Formats

```js
// POST /api/auth/login → { token: "jwt...", user: { _id, name, email, username, avatar, bio, plan, role, createdAt } }
// POST /api/auth/register → same as login
// GET /api/auth/me → { user: { ... } }
// GET /api/links → { links: [{ _id, userId, title, url, enabled, clicks, order }] }
// GET /api/appearance → { appearance: { layout, theme, accentColor, backgroundColor, font, buttonStyle, animation, avatarStyle } }
// GET /api/card → { card: { _id, userId, name, role, phone, email, website, location, template, brandName, tagline } }
// GET /api/analytics/stats → { totalViews, totalClicks, totalQrScans, clickRate, viewsChange, clicksChange, qrChange, rateChange }
// GET /api/analytics/chart?days=30 → { chart: [{ date, views, clicks, qrScans }] }
// GET /api/qr/stats → { total, thisWeek, today }
// GET /api/qr/download → PNG blob (responseType: blob)
// GET /api/card/pdf → PDF blob (responseType: blob)
// POST /api/coupons/validate → { discountPercent: 50, code: "LAUNCH50" }
// GET /api/public/:username → { user: {...}, links: [...], appearance: {...} }
// GET /api/admin/dashboard → { totalUsers, totalLinks, activeCoupons, totalQrScans }
// GET /api/admin/users → { users: [...] }
// GET /api/admin/coupons → { coupons: [...] }
// POST /api/payments/create-order → { orderId, amount, currency: "INR" }
```

### Required Backend Routes (Summary)

You must implement these Express routes to match the frontend API client:

```
routes/
├── auth.js         → POST /register, POST /login, GET /me, PUT /profile, PUT /password, DELETE /account
├── links.js        → GET /, POST /, PUT /:id, DELETE /:id, PUT /reorder
├── appearance.js   → GET /, PUT /
├── card.js         → GET /, PUT /, GET /pdf
├── analytics.js    → GET /stats, GET /chart, POST /track
├── qr.js           → GET /stats, GET /download
├── coupons.js      → POST /validate, POST /apply
├── public.js       → GET /:username, POST /:username/view, POST /:username/click
├── admin.js        → GET /dashboard, GET /users, PUT /users/:id/ban, DELETE /users/:id,
│                     GET /coupons, POST /coupons, PUT /coupons/:id/toggle, DELETE /coupons/:id
└── payments.js     → POST /create-order, POST /verify
```

### `routes/public.js` (New Route)
```js
const router = require('express').Router();
const User = require('../models/User');
const Link = require('../models/Link');
const Appearance = require('../models/Appearance');
const AnalyticsEvent = require('../models/AnalyticsEvent');

// GET public profile
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('-password');
    if (!user) return res.status(404).json({ message: 'Profile not found' });
    const links = await Link.find({ userId: user._id, enabled: true }).sort({ order: 1 });
    const appearance = await Appearance.findOne({ userId: user._id });
    res.json({ user, links, appearance });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Track profile view
router.post('/:username/view', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: 'User not found' });
    await AnalyticsEvent.create({ userId: user._id, type: 'profile_view' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Track link click
router.post('/:username/click', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { linkId } = req.body;
    await AnalyticsEvent.create({ userId: user._id, type: 'link_click', linkId });
    if (linkId) await Link.findByIdAndUpdate(linkId, { $inc: { clicks: 1 } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
```

### `routes/payments.js` (Razorpay Integration)
```js
const router = require('express').Router();
const Razorpay = require('razorpay');
const auth = require('../middleware/auth');
const Coupon = require('../models/Coupon');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const PLAN_PRICES = { pro: 49900, premium: 99900 }; // in paise

router.post('/create-order', auth, async (req, res) => {
  try {
    const { planId, couponCode } = req.body;
    let amount = PLAN_PRICES[planId];
    if (!amount) return res.status(400).json({ message: 'Invalid plan' });

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode, isActive: true });
      if (coupon && new Date(coupon.expiresAt) > new Date() && coupon.usedCount < coupon.maxUses) {
        amount = Math.round(amount * (1 - coupon.discountPercent / 100));
      }
    }

    const order = await razorpay.orders.create({ amount, currency: 'INR', receipt: `order_${Date.now()}` });
    res.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (err) {
    res.status(500).json({ message: 'Payment error' });
  }
});

router.post('/verify', auth, async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;
    const crypto = require('crypto');
    const generated = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(orderId + '|' + paymentId).digest('hex');
    if (generated !== signature) return res.status(400).json({ message: 'Invalid signature' });
    // Update user plan here
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Verification error' });
  }
});

module.exports = router;
```

---

## 10. Quick Start (Full Stack)

```bash
# 1. Start backend
cd linkora-backend
cp .env.example .env  # fill in MONGODB_URI, JWT_SECRET
npm install
npm run dev  # nodemon server.js

# 2. Start frontend
cd linkora-frontend
echo "VITE_API_URL=http://localhost:5000/api" > .env
npm install
npm run dev  # vite on port 8080
```

### Frontend Dependency List (Complete)

| Package | Purpose |
|---------|---------|
| `axios` | HTTP client for API calls |
| `react` + `react-dom` | UI framework |
| `react-router-dom` | Client-side routing |
| `@tanstack/react-query` | Server state + caching |
| `framer-motion` | Animations |
| `recharts` | Dashboard charts |
| `lucide-react` | Icons |
| `sonner` | Toast notifications |
| `tailwindcss` + `tailwindcss-animate` | Styling |
| `class-variance-authority` | Component variants |
| `clsx` + `tailwind-merge` | Class utilities |
| `@radix-ui/*` (17 packages) | Headless UI primitives |
| `react-hook-form` + `zod` | Form handling + validation |
| `date-fns` | Date formatting |
| `cmdk` | Command palette |
| `vaul` | Drawer |
| `embla-carousel-react` | Carousel |
| `react-resizable-panels` | Resizable panels |
| `react-day-picker` | Date picker |
| `input-otp` | OTP input |
| `next-themes` | Theme switching |

### Backend Dependency List (Complete)

| Package | Purpose |
|---------|---------|
| `express` | HTTP server |
| `mongoose` | MongoDB ODM |
| `bcryptjs` | Password hashing |
| `jsonwebtoken` | JWT auth |
| `cors` | CORS headers |
| `dotenv` | Environment variables |
| `qrcode` | QR code generation |
| `pdfkit` | PDF business cards |
| `helmet` | Security headers |
| `express-rate-limit` | Rate limiting |
| `morgan` | Request logging |
| `express-validator` | Input validation |
| `razorpay` | Payment gateway (INR) |
| `nodemon` (dev) | Auto-reload |

---

## 11. Summary

| Feature | Count |
|---------|-------|
| Layout Templates | 15 |
| Gen-Z Themes | 20 |
| Card Templates | 15 |
| API Endpoints | 35+ |
| Database Models | 7 |
| Middleware | 3 (auth, admin, planGate) |
| Pricing Plans | Starter ₹0 / Pro ₹499 / Premium ₹999 |
| Frontend Packages | 40+ (incl. axios) |
| Backend Packages | 14 |
| React Query Hooks | 22 |
