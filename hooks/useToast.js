// ========== useToast Hook ==========
// Consolidated toast and message management
// Replaces: inlineMessage, toastMessage, undoToast, sessionStartNotice
// And their associated timer refs

const useToast = () => {
  const [toasts, setToasts] = React.useState({
    inline: null,      // Inline message (longer, informational)
    toast: null,       // Quick toast (short feedback)
    undo: null,        // Undo action toast
    session: null      // Session start notice
  });
  
  const timersRef = React.useRef({
    inline: null,
    toast: null,
    undo: null,
    session: null
  });
  
  const undoActionRef = React.useRef(null);

  // Clear a specific toast type
  const clearToast = React.useCallback((type) => {
    if (timersRef.current[type]) {
      clearTimeout(timersRef.current[type]);
      timersRef.current[type] = null;
    }
    setToasts(prev => ({ ...prev, [type]: null }));
    
    if (type === 'undo') {
      undoActionRef.current = null;
    }
  }, []);

  // Show inline message (3.2s default)
  const showInline = React.useCallback((message, duration = 3200) => {
    if (timersRef.current.inline) clearTimeout(timersRef.current.inline);
    setToasts(prev => ({ ...prev, inline: message }));
    timersRef.current.inline = setTimeout(() => {
      setToasts(prev => ({ ...prev, inline: null }));
    }, duration);
  }, []);

  // Show quick toast (1.5s default)
  const showToast = React.useCallback((message, duration = 1500) => {
    if (timersRef.current.toast) clearTimeout(timersRef.current.toast);
    setToasts(prev => ({ ...prev, toast: message }));
    timersRef.current.toast = setTimeout(() => {
      setToasts(prev => ({ ...prev, toast: null }));
    }, duration);
  }, []);

  // Show undo toast with action callback
  const showUndo = React.useCallback((message, onUndo, duration = 4000) => {
    if (timersRef.current.undo) clearTimeout(timersRef.current.undo);
    undoActionRef.current = onUndo;
    setToasts(prev => ({ ...prev, undo: message }));
    timersRef.current.undo = setTimeout(() => {
      setToasts(prev => ({ ...prev, undo: null }));
      undoActionRef.current = null;
    }, duration);
  }, []);

  // Execute undo action
  const executeUndo = React.useCallback(() => {
    if (undoActionRef.current) {
      undoActionRef.current();
      clearToast('undo');
    }
  }, [clearToast]);

  // Show session start notice (4s default)
  const showSessionNotice = React.useCallback((message, duration = 4000) => {
    if (timersRef.current.session) clearTimeout(timersRef.current.session);
    setToasts(prev => ({ ...prev, session: message }));
    timersRef.current.session = setTimeout(() => {
      setToasts(prev => ({ ...prev, session: null }));
    }, duration);
  }, []);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach(timer => {
        if (timer) clearTimeout(timer);
      });
    };
  }, []);

  return {
    // Current toast states
    inlineMessage: toasts.inline,
    toastMessage: toasts.toast,
    undoToast: toasts.undo,
    sessionStartNotice: toasts.session,
    
    // Actions
    showInline,
    showToast,
    showUndo,
    showSessionNotice,
    executeUndo,
    clearToast,
    
    // For undo functionality in UI
    hasUndoAction: !!undoActionRef.current
  };
};
