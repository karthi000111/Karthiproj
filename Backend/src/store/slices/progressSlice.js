import {createSlice} from '@reduxjs/toolkit';

const progressSlice = createSlice({
  name: 'progress', initialState: {completedIds: [], homeLastLoaded: null},
  reducers: {
    hydrateProgress: (state, action) => {
      state.completedIds = action.payload.completedIds || [];
    },
    recordCompletion: (state, action) => { if (!state.completedIds.includes(action.payload)) state.completedIds.push(action.payload); },
    setHomeLastLoaded: state => { state.homeLastLoaded = Date.now(); },
  },
});

export const {hydrateProgress, recordCompletion, setHomeLastLoaded} = progressSlice.actions;
export default progressSlice.reducer;
