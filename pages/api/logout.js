// pages/api/logout.js
import cookie from 'cookie';

export default function handler(req, res) {
  res.setHeader('Set-Cookie', cookie.serialize('loggedIn', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0, // expire immediately
  }));
  return res.status(200).json({ success: true });
}
