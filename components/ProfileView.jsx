    const ProfileView = ({ settings, setSettings, colorfulExerciseCards, onToggleColorfulExerciseCards, onViewAnalytics, onViewPatterns, onViewMuscleMap, onExportData, onImportData, onResetApp, onResetOnboarding, onBack }) => {
      const [workoutOpen, setWorkoutOpen] = useState(false);
      const [appearanceOpen, setAppearanceOpen] = useState(false);
      const [analyticsOpen, setAnalyticsOpen] = useState(false);
      const [learnOpen, setLearnOpen] = useState(false);
      const [aboutOpen, setAboutOpen] = useState(false);
      const [dataToolsOpen, setDataToolsOpen] = useState(false);
      const [devTapCount, setDevTapCount] = useState(0);

    const MuscleMapScreen = ({ history, onClose }) => {
      const [rangeDays, setRangeDays] = useState(30);

      // Adjust time ranges or add muscle groups by editing these lists.

    const PatternsScreen = ({ history, cardioHistory, onClose }) => {
