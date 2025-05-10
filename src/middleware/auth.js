/**
 * Authentication middleware
 * Checks if the authorization header is present
 */
function checkAuth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  // In a production app, verify the token here
  // For example:
  // try {
  //   const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
  //   req.user = decoded;
  //   next();
  // } catch (error) {
  //   return res.status(401).json({ error: 'Invalid token' });
  // }

  next();
}

module.exports = { checkAuth };
