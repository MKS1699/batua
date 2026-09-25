import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice/userSlice';
import budgetReducer from './slice/budgetSlice';
import budgetMembershipReducer from './slice/budgetMembershipSlice';
import transactionReducer from './slice/transactionSlice';

export const store = configureStore({
  reducer: {
    userReducer,
    budgetReducer,
    budgetMembershipReducer,
    transactionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
