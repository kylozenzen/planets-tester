    const Progress = ({
      profile,
      history,
      strengthScoreObj,
      cardioHistory,
      initialAnalyticsTab = 'overview'
    }) => {
      const [selectedEquipment, setSelectedEquipment] = useState(null);
      const [analyticsTab, setAnalyticsTab] = useState(initialAnalyticsTab);
      const [exerciseHistoryQuery, setExerciseHistoryQuery] = useState('');
      const [exerciseHistoryExpanded, setExerciseHistoryExpanded] = useState(null);
      useEffect(() => {
        if (initialAnalyticsTab && initialAnalyticsTab !== analyticsTab) {
          setAnalyticsTab(initialAnalyticsTab);
          setSelectedEquipment(null);
        }
      }, [initialAnalyticsTab]);
