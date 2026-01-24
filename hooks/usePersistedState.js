// ========== usePersistedState Hook ==========
// Combines useState with localStorage persistence
// Handles initialization, updates, and iOS Safari fallbacks via the storage helper
//
// Usage:
//   const [theme, setTheme] = usePersistedState('ps_theme', 'light');
//   const [count, setCount] = usePersistedState('ps_count', 0, { lazy: true });
//
// Options:
//   - lazy: Use requestIdleCallback for writes (better for large data)
//   - debounceMs: Debounce writes by this many milliseconds
//
// Note: Requires the global `storage` helper from script.js to be loaded first

const usePersistedState = (key, defaultValue, options = {}) => {
  const { lazy = false, debounceMs = 0 } = options;
  
  // Track if initial load is complete
  const [isLoaded, setIsLoaded] = React.useState(false);
  
  // Initialize state - read from storage on first render only
  const [value, setValue] = React.useState(() => {
    // Only run on client
    if (typeof window === 'undefined') return defaultValue;
    
    try {
      const stored = storage.get(key, undefined);
      return stored !== undefined ? stored : defaultValue;
    } catch {
      return defaultValue;
    }
  });
  
  // Mark as loaded after first render
  React.useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  // Ref to track the latest value for debouncing
  const valueRef = React.useRef(value);
  valueRef.current = value;
  
  // Persist to storage when value changes (after initial load)
  React.useEffect(() => {
    // Don't persist until initial load is complete
    if (!isLoaded) return;
    
    const persist = () => {
      try {
        storage.set(key, valueRef.current);
      } catch (e) {
        console.warn(`usePersistedState: Failed to persist ${key}`, e);
      }
    };
    
    // Debounced writes
    if (debounceMs > 0) {
      const timeoutId = setTimeout(persist, debounceMs);
      return () => clearTimeout(timeoutId);
    }
    
    // Lazy writes using idle callback (good for large data)
    if (lazy && typeof requestIdleCallback === 'function') {
      const idleId = requestIdleCallback(persist);
      return () => cancelIdleCallback(idleId);
    }
    
    // Lazy fallback for browsers without requestIdleCallback
    if (lazy) {
      const timeoutId = setTimeout(persist, 0);
      return () => clearTimeout(timeoutId);
    }
    
    // Immediate writes (default)
    persist();
  }, [key, value, isLoaded, lazy, debounceMs]);
  
  return [value, setValue, isLoaded];
};

// ========== usePersistedReducer Hook ==========
// Like usePersistedState but for useReducer pattern
// Usage: const [state, dispatch, isLoaded] = usePersistedReducer(key, reducer, initialState);

const usePersistedReducer = (key, reducer, initialState, options = {}) => {
  const { lazy = false } = options;
  
  const [isLoaded, setIsLoaded] = React.useState(false);
  
  // Initialize with stored value or initial state
  const init = (initial) => {
    if (typeof window === 'undefined') return initial;
    try {
      const stored = storage.get(key, undefined);
      return stored !== undefined ? stored : initial;
    } catch {
      return initial;
    }
  };
  
  const [state, dispatch] = React.useReducer(reducer, initialState, init);
  
  React.useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  // Persist state changes
  React.useEffect(() => {
    if (!isLoaded) return;
    
    const persist = () => {
      try {
        storage.set(key, state);
      } catch (e) {
        console.warn(`usePersistedReducer: Failed to persist ${key}`, e);
      }
    };
    
    if (lazy && typeof requestIdleCallback === 'function') {
      const idleId = requestIdleCallback(persist);
      return () => cancelIdleCallback(idleId);
    }
    
    if (lazy) {
      const timeoutId = setTimeout(persist, 0);
      return () => clearTimeout(timeoutId);
    }
    
    persist();
  }, [key, state, isLoaded, lazy]);
  
  return [state, dispatch, isLoaded];
};
