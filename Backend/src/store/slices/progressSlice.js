import {createSlice} from '@reduxjs/toolkit';

export function getCurrentStudyStreak(activeDates = []) {
  const activeDateSet = new Set(activeDates);
  const today = new Date();
  const todayKey = today.toISOString().slice(0, 10);
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  if (!activeDateSet.has(todayKey) && !activeDateSet.has(yesterday)) return 0;

  let streak = 0;
  const cursor = new Date(`${activeDateSet.has(todayKey) ? todayKey : yesterday}T00:00:00.000Z`);
  while (activeDateSet.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}

const progressSlice = createSlice({
  name: 'progress', initialState: {completedIds: [], activeDates: [], homeLastLoaded: null},
  reducers: {
    hydrateProgress: (state, action) => {
      state.completedIds = action.payload.completedIds || [];
      state.activeDates = [...new Set(action.payload.activeDates || [])];
    },
    recordCompletion: (state, action) => {
      if (!state.completedIds.includes(action.payload)) state.completedIds.push(action.payload);
      const today = new Date().toISOString().slice(0, 10);
      if (!state.activeDates.includes(today)) state.activeDates.push(today);
    },
    recordStudyActivity: state => {
      const today = new Date().toISOString().slice(0, 10);
      if (!state.activeDates.includes(today)) state.activeDates.push(today);
    },
    setHomeLastLoaded: state => { state.homeLastLoaded = Date.now(); },
    resetProgress: state => {
      state.completedIds = [];
    },
  },
});

export const {hydrateProgress, recordCompletion, recordStudyActivity, resetProgress, setHomeLastLoaded} = progressSlice.actions;
export default progressSlice.reducer;
