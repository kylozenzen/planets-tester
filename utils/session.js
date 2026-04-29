    const toDayKey = (date = new Date()) => {

    const normalizeHistory = (obj) => {

    const normalizeCardioHistory = (obj) => {

    const normalizeDayEntries = (obj, history, cardioHistory, restDays) => {
      if (!obj || typeof obj !== 'object') {
        return buildDayEntriesFromHistory(history, cardioHistory, restDays);
      }

    const buildDayEntriesFromHistory = (history = {}, cardioHistory = {}, restDays = []) => {

    const getEffectiveData = (realData, demoEnabled) => {

    const generateDemoData = (days = 30) => {
