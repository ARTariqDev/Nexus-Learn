import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

/**
 * Verify JWT token and extract user information
 * @param {string} token - JWT token from request
 * @returns {Object|null} - Decoded token payload or null if invalid
 */
export function verifyToken(token) {
  try {
    if (!token) return null;
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return null;
  }
}

/**
 * Check if user has admin role
 * @param {string} userId - User ID to check
 * @returns {Promise<boolean>} - True if user is admin, false otherwise
 */
export async function isAdmin(userId) {
  try {
    await dbConnect();
    const user = await User.findById(userId);
    return user && user.role === 'admin' && user.isActive;
  } catch (error) {
    console.error('Admin check failed:', error.message);
    return false;
  }
}

/**
 * Middleware to protect routes - requires authentication
 * Use this for routes that require any logged-in user
 */
export async function requireAuth(request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  
  const decoded = verifyToken(token);
  if (!decoded) {
    return {
      success: false,
      status: 401,
      message: 'Authentication required'
    };
  }
  
  // Verify user still exists and is active
  await dbConnect();
  const user = await User.findById(decoded.userId);
  if (!user || !user.isActive) {
    return {
      success: false,
      status: 401,
      message: 'Invalid or inactive user'
    };
  }
  
  return {
    success: true,
    user: {
      userId: user._id.toString(),
      username: user.username,
      role: user.role
    }
  };
}

/**
 * Middleware to protect admin routes - requires admin role
 * Use this for routes that only admins should access
 */
export async function requireAdmin(request) {
  const authResult = await requireAuth(request);
  
  if (!authResult.success) {
    return authResult;
  }
  
  const userIsAdmin = await isAdmin(authResult.user.userId);
  if (!userIsAdmin) {
    return {
      success: false,
      status: 403,
      message: 'Admin access required'
    };
  }
  
  return {
    success: true,
    user: authResult.user
  };
}

/**
 * Extract user from request without requiring authentication
 * Useful for optional auth scenarios
 */
export function getOptionalUser(request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  return verifyToken(token);
}
