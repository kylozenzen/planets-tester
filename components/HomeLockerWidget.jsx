    const HomeLockerWidget = () => {
      const [combo, setCombo] = usePersistedState('ps_locker_combo', '');
      const [gymCardImg, setGymCardImg] = usePersistedState('ps_locker_gymcard', '');
      const [expanded, setExpanded] = React.useState(false);
      const [showCombo, setShowCombo] = React.useState(false);
      const [activePanel, setActivePanel] = React.useState(null);
      const [tempCombo, setTempCombo] = React.useState('');
      const [cardFullscreen, setCardFullscreen] = React.useState(false);
