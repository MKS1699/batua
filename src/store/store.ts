import { configureStore } from '@reduxjs/toolkit';
import {
  budgetMembershipReducer,
  budgetReducer,
  transactionReducer,
  userPreferenceReducer,
  userReducer,
} from './slice';

export const store = configureStore({
  reducer: {
    budgetReducer,
    budgetMembershipReducer,
    transactionReducer,
    userPreferenceReducer,
    userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
