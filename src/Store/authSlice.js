import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  uid: localStorage.getItem('uid') || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUid: (state, action) => {
      state.uid = action.payload;
      localStorage.setItem('uid', action.payload);
    },
    clearUid: (state) => {
      state.uid = null;
      localStorage.removeItem('uid');
    },
  },
});

export const { setUid, clearUid } = authSlice.actions;
export default authSlice.reducer;
