import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import expenseReducer from './expenseSlice';
import premReducer from './premiumSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    expenses: expenseReducer,
    premium: premReducer,
  },
});

export default store;
