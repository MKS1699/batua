import { createAsyncThunk, createSlice, isAnyOf, type PayloadAction } from '@reduxjs/toolkit';

import {
  createNewBudgetMembership,
  CreateBudgetMembershipInput,
  deleteBudgetMembershipById,
  getBudgetMembershipById,
  getBudgetMembershipsByBudgetId,
  getBudgetMembershipsByUserId,
  updateBudgetMembershipById,
  BUDGET_MEMBERSHIP_CHANGES,
  BUDGET_MEMBERSHIP_SELECT,
} from '@/db/budgetMemberships';
import type { RootState } from '../store';

type BudgetMembershipRow = NonNullable<Awaited<ReturnType<typeof getBudgetMembershipById>>>;

type BudgetMembershipListFilter = {
  field: 'budgetId' | 'userId';
  value: string;
};

interface BudgetMembershipState {
  currentBudgetMembership: BudgetMembershipRow | null;
  budgetMemberships: BudgetMembershipRow[];
  // The list represents the most recently requested owner, budget, or user.
  listFilter: BudgetMembershipListFilter | null;
  listRequestId: string | null;
  detailRequestId: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: BudgetMembershipState = {
  currentBudgetMembership: null,
  budgetMemberships: [],
  listFilter: null,
  listRequestId: null,
  detailRequestId: null,
  status: 'idle',
  error: null,
};

// loading an existing budgetMembership by ID
export const loadBudgetMembership = createAsyncThunk(
  'budgetMembership/load',
  async (id: BUDGET_MEMBERSHIP_SELECT['id']) => {
    return await getBudgetMembershipById(id);
  }
);

// loading lists
export const loadBudgetMembershipsByBudgetId = createAsyncThunk(
  'budgetMembership/loadByBudgetId',
  async (budgetId: BUDGET_MEMBERSHIP_SELECT['budgetId']) => {
    return await getBudgetMembershipsByBudgetId(budgetId);
  }
);

export const loadBudgetMembershipsByUserId = createAsyncThunk(
  'budgetMembership/loadByUserId',
  async (userId: BUDGET_MEMBERSHIP_SELECT['userId']) => {
    return await getBudgetMembershipsByUserId(userId);
  }
);

// adding a new budgetMembership
export const addNewBudgetMembership = createAsyncThunk(
  'budgetMembership/new',
  async (input: CreateBudgetMembershipInput) => {
    const addedBudgetMembership = await createNewBudgetMembership(input);

    if (!addedBudgetMembership) throw new Error('Unable to add new budgetMembership.');

    return addedBudgetMembership;
  }
);

// updates
type UPDATE_BUDGET_MEMBERSHIP_INPUT = {
  id: BUDGET_MEMBERSHIP_SELECT['id'];
  updates: BUDGET_MEMBERSHIP_CHANGES;
};

export const updateBudgetMembership = createAsyncThunk(
  'budgetMembership/update',
  async ({ id, updates }: UPDATE_BUDGET_MEMBERSHIP_INPUT) => {
    const updatedBudgetMembership = await updateBudgetMembershipById(id, updates);

    if (!updatedBudgetMembership) throw new Error('Unable to update budgetMembership.');

    return updatedBudgetMembership;
  }
);

// delete
export const deleteBudgetMembership = createAsyncThunk(
  'budgetMembership/delete',
  async (id: BUDGET_MEMBERSHIP_SELECT['id']) => {
    const deletedBudgetMembershipId = await deleteBudgetMembershipById(id);

    if (deletedBudgetMembershipId === null) throw new Error(`Unable to delete budgetMembership: ${id}.`);

    return deletedBudgetMembershipId;
  }
);

const budgetMembershipSlice = createSlice({
  name: 'budgetMembership',
  initialState,
  reducers: {
    resetBudgetMembershipSliceState: () => ({ ...initialState, budgetMemberships: [] }),
    // Selection only; persistent changes go through the update thunk.
    setCurrentBudgetMembership: (state, action: PayloadAction<BudgetMembershipRow | null>) => {
      state.currentBudgetMembership = action.payload;
      state.detailRequestId = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadBudgetMembership.pending, (state, action) => {
        state.detailRequestId = action.meta.requestId;
        state.currentBudgetMembership = null;
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadBudgetMembership.fulfilled, (state, action) => {
        if (state.detailRequestId !== action.meta.requestId) return;

        state.currentBudgetMembership = action.payload;
        state.detailRequestId = null;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(loadBudgetMembership.rejected, (state, action) => {
        if (state.detailRequestId !== action.meta.requestId) return;

        state.detailRequestId = null;
        state.status = 'failed';
        state.error = action.error.message ?? 'Database operation failed.';
      })
      .addCase(loadBudgetMembershipsByBudgetId.pending, (state, action) => {
        if (state.listFilter?.field !== 'budgetId' || state.listFilter.value !== action.meta.arg) {
          state.budgetMemberships = [];
        }
        state.listFilter = { field: 'budgetId', value: action.meta.arg };
        state.listRequestId = action.meta.requestId;
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadBudgetMembershipsByUserId.pending, (state, action) => {
        if (state.listFilter?.field !== 'userId' || state.listFilter.value !== action.meta.arg) {
          state.budgetMemberships = [];
        }
        state.listFilter = { field: 'userId', value: action.meta.arg };
        state.listRequestId = action.meta.requestId;
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteBudgetMembership.fulfilled, (state, action) => {
        state.budgetMemberships = state.budgetMemberships.filter((item) => item.id !== action.payload);
        if (state.currentBudgetMembership?.id === action.payload) {
          state.currentBudgetMembership = null;
        }
        state.status = 'succeeded';
        state.error = null;
      })
      .addMatcher(
        isAnyOf(loadBudgetMembershipsByBudgetId.fulfilled, loadBudgetMembershipsByUserId.fulfilled),
        (state, action) => {
          // An older request must not replace a newer filter's results.
          if (state.listRequestId !== action.meta.requestId) return;

          state.budgetMemberships = action.payload;
          state.listRequestId = null;
          state.status = 'succeeded';
          state.error = null;
        }
      )
      .addMatcher(
        isAnyOf(loadBudgetMembershipsByBudgetId.rejected, loadBudgetMembershipsByUserId.rejected),
        (state, action) => {
          if (state.listRequestId !== action.meta.requestId) return;

          state.listRequestId = null;
          state.status = 'failed';
          state.error = action.error.message ?? 'Database operation failed.';
        }
      )
      .addMatcher(
        isAnyOf(addNewBudgetMembership.pending, updateBudgetMembership.pending, deleteBudgetMembership.pending),
        (state) => {
          state.status = 'loading';
          state.error = null;
        }
      )
      .addMatcher(
        isAnyOf(addNewBudgetMembership.fulfilled, updateBudgetMembership.fulfilled),
        (state, action) => {
          const row = action.payload;
          state.currentBudgetMembership = row;
          state.detailRequestId = null;
          const index = state.budgetMemberships.findIndex((item) => item.id === row.id);
          const matchesFilter =
            !state.listFilter || row[state.listFilter.field] === state.listFilter.value;

          if (matchesFilter) {
            if (index === -1) state.budgetMemberships.push(row);
            else state.budgetMemberships[index] = row;
          } else if (index !== -1) {
            state.budgetMemberships.splice(index, 1);
          }
          state.status = 'succeeded';
          state.error = null;
        }
      )
      .addMatcher(
        isAnyOf(addNewBudgetMembership.rejected, updateBudgetMembership.rejected, deleteBudgetMembership.rejected),
        (state, action) => {
          state.status = 'failed';
          state.error = action.error.message ?? 'Database operation failed.';
        }
      );
  },
});

export default budgetMembershipSlice.reducer;

export const { resetBudgetMembershipSliceState, setCurrentBudgetMembership } = budgetMembershipSlice.actions;

// getters
export const getBudgetMembership = (state: RootState) => state.budgetMembershipReducer.currentBudgetMembership;
export const getBudgetMemberships = (state: RootState) => state.budgetMembershipReducer.budgetMemberships;
export const getBudgetMembershipState = (state: RootState) => state.budgetMembershipReducer;
