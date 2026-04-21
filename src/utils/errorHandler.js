/**
 * Extract error message from Axios error response
 * Handles different Spring Boot error response formats:
 * - Plain text errors
 * - JSON with { message: "..." }
 * - JSON with { error: "..." }
 * - JSON with field-level errors
 */
export function getErrorMessage(error) {
  if (!error.response) {
    const msg = error.message || 'An error occurred';
    if (msg === 'Network Error' && import.meta.env.DEV) {
      return 'Cannot reach server. Make sure the backend is running on port 8080.';
    }
    return msg;
  }

  const { data, status } = error.response;

  // Handle plain text responses
  if (typeof data === 'string') {
    return data;
  }

  // Handle JSON error responses
  if (typeof data === 'object' && data !== null) {
    // Check for message field
    if (data.message) {
      return data.message;
    }
    
    // Check for error field
    if (data.error) {
      return data.error;
    }
    
    // Check for validation errors (field-level)
    if (data.errors && Array.isArray(data.errors)) {
      return data.errors.map(err => err.defaultMessage || err.message).join(', ');
    }
    
    // Check for field-level errors object
    if (typeof data === 'object') {
      const fieldErrors = Object.values(data).filter(val => typeof val === 'string');
      if (fieldErrors.length > 0) {
        return fieldErrors.join(', ');
      }
    }
    
    // Fallback: stringify the error object
    return JSON.stringify(data);
  }

  // Fallback to status text or generic message
  return error.response.statusText || `Error ${status}: Request failed`;
}
