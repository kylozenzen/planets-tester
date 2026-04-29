    const computeStreak = (history, cardioHistory = {}, restDays = [], dayEntries = null) => {

    const computeStrengthScore = (_profile, history) => {

    const computeAchievements = ({ history, cardioHistory = {}, strengthScoreObj, streakObj }) => {

    const buildMuscleDistribution = (history = {}, rangeDays = 30) => {

    const buildPatternsFromHistory = (history = {}, cardioHistory = {}) => {

    const buildLastSessionSummary = (history, lastWorkoutLabel) => {
      if (!history || !lastWorkoutLabel) return null;
