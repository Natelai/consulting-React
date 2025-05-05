export function getUserIdFromToken() {
    const token = localStorage.getItem('authToken');
    if (!token) return null;
  
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.nameid || null;  
    } catch (e) {
      console.error('Invalid token:', e);
      return null;
    }
  }
  