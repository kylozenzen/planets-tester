// ========== useModal Hook ==========
// Consolidated modal and overlay state management
// Replaces multiple showX boolean states with a single activeModal
//
// Usage:
//   const { activeModal, openModal, closeModal, isOpen } = useModal();
//   
//   openModal('analytics');
//   isOpen('analytics'); // true
//   closeModal();

const useModal = () => {
  const [activeModal, setActiveModal] = React.useState(null);
  const [modalData, setModalData] = React.useState(null);

  // Open a modal, optionally with data
  const openModal = React.useCallback((modalName, data = null) => {
    setActiveModal(modalName);
    setModalData(data);
  }, []);

  // Close current modal
  const closeModal = React.useCallback(() => {
    setActiveModal(null);
    setModalData(null);
  }, []);

  // Check if a specific modal is open
  const isOpen = React.useCallback((modalName) => {
    return activeModal === modalName;
  }, [activeModal]);

  // Toggle a modal
  const toggleModal = React.useCallback((modalName, data = null) => {
    if (activeModal === modalName) {
      closeModal();
    } else {
      openModal(modalName, data);
    }
  }, [activeModal, openModal, closeModal]);

  return {
    activeModal,
    modalData,
    openModal,
    closeModal,
    toggleModal,
    isOpen,
    
    // Convenience booleans for common modals (backward compatibility)
    showAnalytics: activeModal === 'analytics',
    showPatterns: activeModal === 'patterns',
    showMuscleMap: activeModal === 'muscleMap',
    showPostWorkout: activeModal === 'postWorkout',
    showPostWorkoutCelebration: activeModal === 'postWorkoutCelebration',
    
    // Easter eggs
    showMatrix: activeModal === 'matrix',
    showPowerUp: activeModal === 'powerUp',
    showGlory: activeModal === 'glory',
    showSpartan: activeModal === 'spartan',
    showButDidYouDie: activeModal === 'butDidYouDie',
    showNice: activeModal === 'nice',
    showPerfectWeek: activeModal === 'perfectWeek',
    
    // Setters for backward compatibility during migration
    setShowAnalytics: (show) => show ? openModal('analytics') : closeModal(),
    setShowPatterns: (show) => show ? openModal('patterns') : closeModal(),
    setShowMuscleMap: (show) => show ? openModal('muscleMap') : closeModal(),
    setShowPostWorkout: (show) => show ? openModal('postWorkout') : closeModal(),
    setShowPostWorkoutCelebration: (show) => show ? openModal('postWorkoutCelebration') : closeModal(),
    setShowMatrix: (show) => show ? openModal('matrix') : closeModal(),
    setShowPowerUp: (show) => show ? openModal('powerUp') : closeModal(),
    setShowGlory: (show) => show ? openModal('glory') : closeModal(),
    setShowSpartan: (show) => show ? openModal('spartan') : closeModal(),
    setShowButDidYouDie: (show) => show ? openModal('butDidYouDie') : closeModal(),
    setShowNice: (show) => show ? openModal('nice') : closeModal(),
    setShowPerfectWeek: (show) => show ? openModal('perfectWeek') : closeModal()
  };
};
