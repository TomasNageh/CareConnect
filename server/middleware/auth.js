import jwt from 'jsonwebtoken';

export const JWT_SECRET = 'careconnect-mock-secret-key';

export function createToken(user, profile = {}) {
  return jwt.sign(
    {
      nameid: String(user.id),
      UserId: String(user.id),
      Role: user.role,
      given_name: profile.firstName || '',
      family_name: profile.lastName || '',
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

export function authRequired(...roles) {
  return (req, res, next) => {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      return res.status(401).json('Unauthorized');
    }

    try {
      const payload = jwt.verify(header.slice(7), JWT_SECRET);
      req.auth = {
        userId: Number(payload.UserId || payload.nameid),
        role: payload.Role,
      };
    } catch {
      return res.status(401).json('Invalid or expired token');
    }

    if (roles.length > 0 && !roles.includes(req.auth.role)) {
      return res.status(403).json('Forbidden');
    }

    next();
  };
}
