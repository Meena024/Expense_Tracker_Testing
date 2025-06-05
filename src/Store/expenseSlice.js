import { createSlice } from "@reduxjs/toolkit";

const expenseSlice = createSlice({
  name: "expenses",
  initialState: { expenses: {}, totalAmount: 0, loading: false, error: null },
  reducers: {
  
    setExpenses: (state, action) => {
      state.expenses = action.payload;
    },

    setTotalExpenses: (state, action) => {
      state.totalAmount = action.payload;
    }
  },
});


export const { setExpenses, setTotalExpenses } = expenseSlice.actions;

export default expenseSlice.reducer;
