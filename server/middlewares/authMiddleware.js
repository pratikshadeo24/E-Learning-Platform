const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, 'SECRET_KEY'); // same secret as login
    req.user = decoded; // attach user info (userId, role) to request
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

exports.isTeacher = (req, res, next) => {
  if (req.user.role === 'TEACHER' || req.user.role === 'ADMIN') {
    next();
  } else {
    return res.status(403).json({ error: 'Requires TEACHER or ADMIN role' });
  }
};

exports.isTeacherOrAdmin = (req, res, next) => {
  if (req.user.role === 'TEACHER' || req.user.role === 'ADMIN') {
    return next();
  }
  return res.status(403).json({ error: 'Access denied. Only teachers or admins allowed.' });
};
