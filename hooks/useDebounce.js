// ========== useDebounce Hook ==========
// Debounces a value by delaying updates until after a specified delay
// Usage: const debouncedSearch = useDebounce(searchTerm, 300);

const useDebounce = (value, delay = 200) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);
  
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
};
