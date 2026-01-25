// ========== SETTINGS CONTEXT ==========
// Centralized settings and theme state management
// Eliminates prop drilling for theme/settings throughout the app

const SettingsContext = React.createContext(null);

const useSettings = () => {
  const context = React.useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

const SettingsProvider = ({ children }) => {
  // Theme state
  const [themeMode, setThemeModeState] = React.useState('light');
  const [darkVariant, setDarkVariantState] = React.useState('blue');
  
  // App settings
  const [settings, setSettings] = React.useState({
    insightsEnabled: true,
    smartSuggestionsEnabled: true,
    darkMode: false,
    darkAccent: 'purple',
    showAllExercises: false,
    pinnedExercises: [],
    workoutViewMode: 'all',
    suggestedWorkoutCollapsed: true,
    useDemoData: false
  });
  
  // Colorful exercise cards toggle
  const [colorfulExerciseCards, setColorfulExerciseCards] = React.useState(() => {
    try {
      const raw = localStorage.getItem('ps_colorfulExerciseCards');
      return raw === null ? true : Boolean(JSON.parse(raw));
    } catch {
      return true;
    }
  });

  // Load saved theme on mount
  React.useEffect(() => {
    const savedMode = storage.get(THEME_MODE_KEY, 'light');
    const storedVariant = storage.get(DARK_VARIANT_KEY, 'blue');
    setThemeModeState(savedMode);
    setDarkVariantState(storedVariant);
    
    // Apply to document
    document.documentElement.setAttribute('data-theme', savedMode);
    if (savedMode === 'dark') {
      document.documentElement.setAttribute('data-dark-variant', storedVariant);
    }
  }, []);

  // Persist settings changes
  React.useEffect(() => {
    storage.set('ps_v2_settings', settings);
  }, [settings]);

  // Persist colorful cards setting
  React.useEffect(() => {
    try {
      localStorage.setItem('ps_colorfulExerciseCards', JSON.stringify(!!colorfulExerciseCards));
    } catch {
      // Ignore storage errors
    }
    document.body.classList.toggle('exercise-colors-off', !colorfulExerciseCards);
  }, [colorfulExerciseCards]);

  // Theme mode setter with persistence
  const setThemeMode = React.useCallback((mode) => {
    setThemeModeState(mode);
    document.documentElement.setAttribute('data-theme', mode);
    storage.set(THEME_MODE_KEY, mode);
    
    if (mode === 'dark') {
      document.documentElement.setAttribute('data-dark-variant', darkVariant);
      if (!storage.get(DARK_VARIANT_KEY, null)) {
        storage.set(DARK_VARIANT_KEY, 'blue');
      }
    }
  }, [darkVariant]);

  // Dark variant setter with persistence
  const setDarkVariant = React.useCallback((variant) => {
    setDarkVariantState(variant);
    document.documentElement.setAttribute('data-dark-variant', variant);
    storage.set(DARK_VARIANT_KEY, variant);
  }, []);

  // Toggle colorful exercise cards
  const toggleColorfulExerciseCards = React.useCallback(() => {
    setColorfulExerciseCards(prev => !prev);
  }, []);

  // Update a single setting
  const updateSetting = React.useCallback((key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const value = {
    // Theme
    themeMode,
    setThemeMode,
    darkVariant,
    setDarkVariant,
    
    // Settings object
    settings,
    setSettings,
    updateSetting,
    
    // Exercise card colors
    colorfulExerciseCards,
    setColorfulExerciseCards,
    toggleColorfulExerciseCards
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
