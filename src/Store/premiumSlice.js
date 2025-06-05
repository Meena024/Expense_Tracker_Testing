import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isPremium: false,
  isDarkMode: false,
};

const premSlice = createSlice({
  name: 'premium',
  initialState,
  reducers: {
    buyPremium: (state) => {
      state.isPremium = true;
    },

    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
  },
});

export const { buyPremium, toggleDarkMode } = premSlice.actions;
export default premSlice.reducer;
