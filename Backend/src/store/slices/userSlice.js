import {createSlice} from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {name: 'Karthi', email: 'karthi@example.com'},
  reducers: {updateUser: (state, action) => ({...state, ...action.payload})},
});

export const {updateUser} = userSlice.actions;
export default userSlice.reducer;
