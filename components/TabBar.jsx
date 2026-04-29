    const TabBar = ({ currentTab, setTab, onWorkoutTripleTap }) => {

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
