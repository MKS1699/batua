import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';

import {
  createNewUser,
  CreateUserInput,
  deleteUserById,
  getLocalUser,
  getUserById,
  updateUserById,
  USER_CHANGES,
  USER_SELECT,
} from '@/db/users';
import { randomUser } from '@/utils/utils';
import type { RootState } from '../store';

type UserRow = NonNullable<Awaited<ReturnType<typeof getUserById>>>;

interface UserState {
  currentUser: UserRow | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  status: 'idle',
  error: null,
};

// loading the first-created local user without needing an ID
export const loadLocalUser = createAsyncThunk('user/loadLocal', async () => {
  return await getLocalUser();
});

// loading existing user by user id
export const loadUser = createAsyncThunk('user/load', async (id: USER_SELECT['id']) => {
  return await getUserById(id);
});

// adding new user
export const addNewUser = createAsyncThunk('user/new', async (user: CreateUserInput) => {
  const addedUser = await createNewUser(user);

  if (!addedUser) throw new Error('Unable to add new user.');

  return addedUser;
});

// loading local user and if no user then creating one
export const loadOrCreateUser = createAsyncThunk('user/loadOrCreate', async () => {
  const existingUser = await getLocalUser();
  if (existingUser) return existingUser;

  const newUser = await createNewUser(randomUser());
  if (!newUser) throw new Error('Unable to create default user.');

  return newUser;
});

// updates
// updating user
export type UPDATE_USER_INPUT = {
  id: USER_SELECT['id'];
  updates: USER_CHANGES;
};
export const updateUser = createAsyncThunk(
  'user/update',
  async ({ id, updates }: UPDATE_USER_INPUT) => {
    const updatedUser = await updateUserById(id, updates);

    if (!updatedUser) throw new Error('Unable to update user.');

    return updatedUser;
  }
);

// delete
export const deleteUser = createAsyncThunk('user/delete', async (id: USER_SELECT['id']) => {
  const deletedUserId = await deleteUserById(id);

  if (deletedUserId === null) throw new Error(`Unable to delete user : ${id}.`);

  return deletedUserId;
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUserSliceState: (state) => {
      state.currentUser = null;
      state.error = null;
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteUser.fulfilled, (state, action) => {
        if (state.currentUser?.id === action.payload) {
          return { ...initialState };
        }

        state.status = 'succeeded';
        state.error = null;
      })
      .addMatcher(
        isAnyOf(
          loadUser.pending,
          loadLocalUser.pending,
          loadOrCreateUser.pending,
          addNewUser.pending,
          updateUser.pending,
          deleteUser.pending
        ),
        (state) => {
          state.status = 'loading';
          state.error = null;
        }
      )
      .addMatcher(
        isAnyOf(
          loadUser.fulfilled,
          loadLocalUser.fulfilled,
          loadOrCreateUser.fulfilled,
          addNewUser.fulfilled,
          updateUser.fulfilled
        ),
        (state, action) => {
          state.currentUser = action.payload;
          state.status = 'succeeded';
        }
      )
      .addMatcher(
        isAnyOf(
          loadUser.rejected,
          loadLocalUser.rejected,
          loadOrCreateUser.rejected,
          addNewUser.rejected,
          updateUser.rejected,
          deleteUser.rejected
        ),
        (state, action) => {
          state.status = 'failed';
          state.error = action.error.message ?? 'Database operation failed.';
        }
      );
  },
});

export default userSlice.reducer;

export const { resetUserSliceState } = userSlice.actions;

// getters
export const getUser = (state: RootState) => state.userReducer.currentUser;
export const getUserState = (state: RootState) => state.userReducer;
