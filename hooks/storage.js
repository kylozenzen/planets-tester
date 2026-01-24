// ========== STORAGE HELPER ==========
// Provides localStorage with iOS Safari fallback to in-memory storage
// Used throughout the app for persisting state

const memoryStorage = {};

const storage = {
  get: (key, fallback) => { 
    try { 
      const v = localStorage.getItem(key); 
      return v ? JSON.parse(v) : (memoryStorage[key] || fallback); 
    } catch { 
      return memoryStorage[key] || fallback; 
    } 
  },
  set: (key, val) => { 
    try { 
      localStorage.setItem(key, JSON.stringify(val)); 
      memoryStorage[key] = val;
    } catch {
      memoryStorage[key] = val;
    } 
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      delete memoryStorage[key];
    } catch {
      delete memoryStorage[key];
    }
  }
};
