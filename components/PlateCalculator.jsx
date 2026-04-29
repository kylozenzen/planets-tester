const PlateCalculator = ({ targetWeight, barWeight, onClose }) => {
      const [displayWeight, setDisplayWeight] = useState(targetWeight || barWeight || '');
