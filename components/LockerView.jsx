    const LockerView = () => {
      const [combo, setCombo] = usePersistedState('ps_locker_combo', '');
      const [barcode, setBarcode] = usePersistedState('ps_locker_barcode', '');
      const [gymApp, setGymApp] = usePersistedState('ps_locker_gymapp', '');
      const [gymAppUrl, setGymAppUrl] = usePersistedState('ps_locker_gymappurl', '');
      const [showCombo, setShowCombo] = React.useState(false);
      const [editingCombo, setEditingCombo] = React.useState(false);
      const [editingBarcode, setEditingBarcode] = React.useState(false);
      const [editingGymApp, setEditingGymApp] = React.useState(false);
      const [barcodeFullscreen, setBarcodeFullscreen] = React.useState(false);
      const [tempCombo, setTempCombo] = React.useState('');
      const [tempBarcode, setTempBarcode] = React.useState('');
      const [tempGymApp, setTempGymApp] = React.useState('');
      const [tempGymAppUrl, setTempGymAppUrl] = React.useState('');
