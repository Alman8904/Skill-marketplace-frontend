/**
 * Decode JWT token to extract payload information
 * @param {string} token - JWT token
 * @returns {object|null} - Decoded payload or null if invalid
 */
export const decodeJWT = (token) => {
  try {
    if (!token || typeof token !== "string") return null;

    const parts = token.split(".");
    if (parts.length !== 3) return null;

    // Decode the payload (second part)
    const payload = parts[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (err) {
    console.error("Failed to decode JWT:", err);
    return null;
  }
};

/**
 * Extract role from JWT token
 * @param {string} token - JWT token
 * @returns {string|null} - Role extracted from token or null if not found
 */
export const extractRoleFromToken = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded) return null;

  // Try different common role field names
  return decoded.role || decoded.userType || decoded.type || null;
};
