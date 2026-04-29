    const TabBar = ({ currentTab, setTab, onWorkoutTripleTap }) => {
      const tapCountRef = React.useRef(0);
      const tapTimerRef = React.useRef(null);

      const handleWorkoutTap = () => {
        if (currentTab === 'workout') {
          tapCountRef.current += 1;
          if (tapCountRef.current === 3) {
            tapCountRef.current = 0;
            if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
            onWorkoutTripleTap?.();
            return;
          }
          if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
          tapTimerRef.current = setTimeout(() => { tapCountRef.current = 0; }, 1000);
        } else {
          tapCountRef.current = 0;
          if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
        }
        setTab('workout');
      };

      React.useEffect(() => {
        return () => { if (tapTimerRef.current) clearTimeout(tapTimerRef.current); };
      }, []);

      return (
        <div className="fixed bottom-0 left-0 right-0 tabbar z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <div className="flex justify-around items-center h-16 px-2">
            {[
              { id: 'home', label: 'Home', icon: 'Home' },
              { id: 'workout', label: 'Workout', icon: 'Dumbbell' }
            ].map(t => (
              <button 
                key={t.id} 
                onClick={t.id === 'workout' ? handleWorkoutTap : () => setTab(t.id)}
                className={`flex flex-col items-center gap-1 w-full h-full justify-center transition-colors ${
                  currentTab === t.id 
                    ? 'tab-active' 
                    : 'text-gray-400'
                }`}
              >
                <Icon name={t.icon} className="w-6 h-6" />
                <span className="text-xs font-semibold">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      );
    };

    const ToggleRow = ({ icon, title, subtitle, enabled, onToggle }) => (
      <button
        onClick={() => onToggle(!enabled)}
        className="w-full flex items-center justify-between py-2"
      >
        <div className="flex items-center gap-3 text-left">
          <Icon name={icon} className="w-5 h-5 text-purple-600" />
          <div>
            <div className="font-semibold text-gray-900 text-sm">{title}</div>
            {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
          </div>
        </div>
        <div className={`w-12 h-6 rounded-full transition-colors ${enabled ? 'bg-purple-600' : 'bg-gray-300'}`}>
          <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform m-0.5 ${enabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
        </div>
      </button>
    );

    // ========== ONBOARDING ==========
// Intro + onboarding flow
// ONBOARDING COMPONENTS → moved to components/onboarding.js

    // ========== CALCULATIONS ==========
    const getBestForEquipment = (sessions = []) => {
      let best = 0;
      sessions.forEach(s => {
        (Array.isArray(s.sets) ? s.sets : []).forEach(set => { if (set.weight > best) best = set.weight; });
      });
      return best || null;
    };

    const getStrongWeightForEquipment = (_profile, equipId, sessions = []) => {
      const best = getBestForEquipment(sessions);
      if (best) return best;
      const eq = EQUIPMENT_DB[equipId];
      const starter = eq?.tags?.includes('Legs') ? 45 : 15;
      return clampTo5(starter);
    };

    const getNextTarget = (_profile, equipId, best) => {
      const eq = EQUIPMENT_DB[equipId];
      const increment = eq?.tags?.includes('Legs') ? 10 : 5;
      return clampTo5((best || getStrongWeightForEquipment({}, equipId, [])) + increment);
    };
