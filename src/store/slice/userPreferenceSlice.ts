import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';

import {
  createUserPreference,
  deleteUserPreference,
  getUserPreference as getUserPreferenceByUserId,
  updateUserPreference,
  type USER_PREFERENCE_INSERT,
  type USER_PREFERENCE_SELECT,
} from '@/db/userPreferences';
import type { RootState } from '../store';

type UserPreferenceRow = NonNullable<Awaited<ReturnType<typeof getUserPreferenceByUserId>>>;

type USER_PREFERENCE_CHANGES = Partial<Pick<USER_PREFERENCE_INSERT, 'defaultBudgetId'>>;

interface UserPreferenceState {
  currentUserPreference: UserPreferenceRow | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserPreferenceState = {
  currentUserPreference: null,
  status: 'idle',
  error: null,
};

// Load user preference by user ID
export const loadUserPreference = createAsyncThunk(
  'userPreference/load',
  async (userId: USER_PREFERENCE_SELECT['userId']) => {
    return await getUserPreferenceByUserId(userId);
  }
);

// Create user preference
export const addUserPreference = createAsyncThunk(
  'userPreference/new',
  async (input: USER_PREFERENCE_INSERT) => {
    const userPreference = await createUserPreference(input);

    if (!userPreference) {
      throw new Error('Unable to create user preference.');
    }

    return userPreference;
  }
);

// Update user preference
type UPDATE_USER_PREFERENCE_INPUT = {
  userId: USER_PREFERENCE_SELECT['userId'];
  changes: USER_PREFERENCE_CHANGES;
};

export const updateUserPreferenceThunk = createAsyncThunk(
  'userPreference/update',
  async ({ userId, changes }: UPDATE_USER_PREFERENCE_INPUT) => {
    if (Object.keys(changes).length === 0) {
      throw new Error('No user preference changes provided.');
    }

    const userPreference = await updateUserPreference(userId, changes);

    if (!userPreference) {
      throw new Error(`Unable to update user preference for user: ${userId}.`);
    }

    return userPreference;
  }
);

// Delete user preference
export const deleteUserPreferenceThunk = createAsyncThunk(
  'userPreference/delete',
  async (userId: USER_PREFERENCE_SELECT['userId']) => {
    const deletedUserId = await deleteUserPreference(userId);

    if (deletedUserId === null) {
      throw new Error(`Unable to delete user preference for user: ${userId}.`);
    }

    return deletedUserId;
  }
);

const userPreferenceSlice = createSlice({
  name: 'userPreference',
  initialState,
  reducers: {
    resetUserPreferenceSliceState: () => ({ ...initialState }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteUserPreferenceThunk.fulfilled, (state) => {
        state.currentUserPreference = null;
        state.status = 'succeeded';
        state.error = null;
      })
      .addMatcher(
        isAnyOf(
          loadUserPreference.pending,
          addUserPreference.pending,
          updateUserPreferenceThunk.pending,
          deleteUserPreferenceThunk.pending
        ),
        (state) => {
          state.status = 'loading';
          state.error = null;
        }
      )
      .addMatcher(
        isAnyOf(
          loadUserPreference.fulfilled,
          addUserPreference.fulfilled,
          updateUserPreferenceThunk.fulfilled
        ),
        (state, action) => {
          state.currentUserPreference = action.payload;
          state.status = 'succeeded';
          state.error = null;
        }
      )
      .addMatcher(
        isAnyOf(
          loadUserPreference.rejected,
          addUserPreference.rejected,
          updateUserPreferenceThunk.rejected,
          deleteUserPreferenceThunk.rejected
        ),
        (state, action) => {
          state.status = 'failed';
          state.error = action.error.message ?? 'Database operation failed.';
        }
      );
  },
});

export default userPreferenceSlice.reducer;

export const { resetUserPreferenceSliceState } = userPreferenceSlice.actions;

// Selectors
export const getUserPreference = (state: RootState) =>
  state.userPreferenceReducer.currentUserPreference;

export const getUserPreferenceState = (state: RootState) => state.userPreferenceReducer;
