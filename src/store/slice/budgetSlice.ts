import { createAsyncThunk, createSlice, isAnyOf, type PayloadAction } from '@reduxjs/toolkit';

import {
  createNewBudget,
  CreateBudgetInput,
  deleteBudgetById,
  getBudgetById,
  getBudgetsByOwnerId,
  updateBudgetById,
  BUDGET_CHANGES,
  BUDGET_SELECT,
} from '@/db/budgets';
import type { RootState } from '../store';

type BudgetRow = NonNullable<Awaited<ReturnType<typeof getBudgetById>>>;

type BudgetListFilter = {
  field: 'ownerId';
  value: string;
};

interface BudgetState {
  currentBudget: BudgetRow | null;
  budgets: BudgetRow[];
  // The list represents the most recently requested owner, budget, or user.
  listFilter: BudgetListFilter | null;
  listRequestId: string | null;
  detailRequestId: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: BudgetState = {
  currentBudget: null,
  budgets: [],
  listFilter: null,
  listRequestId: null,
  detailRequestId: null,
  status: 'idle',
  error: null,
};

// loading an existing budget by ID
export const loadBudget = createAsyncThunk(
  'budget/load',
  async (id: BUDGET_SELECT['id']) => {
    return await getBudgetById(id);
  }
);

// loading lists
export const loadBudgetsByOwnerId = createAsyncThunk(
  'budget/loadByOwnerId',
  async (ownerId: BUDGET_SELECT['ownerId']) => {
    return await getBudgetsByOwnerId(ownerId);
  }
);

// adding a new budget
export const addNewBudget = createAsyncThunk(
  'budget/new',
  async (input: CreateBudgetInput) => {
    const addedBudget = await createNewBudget(input);

    if (!addedBudget) throw new Error('Unable to add new budget.');

    return addedBudget;
  }
);

// updates
type UPDATE_BUDGET_INPUT = {
  id: BUDGET_SELECT['id'];
  updates: BUDGET_CHANGES;
};

export const updateBudget = createAsyncThunk(
  'budget/update',
  async ({ id, updates }: UPDATE_BUDGET_INPUT) => {
    const updatedBudget = await updateBudgetById(id, updates);

    if (!updatedBudget) throw new Error('Unable to update budget.');

    return updatedBudget;
  }
);

// delete
export const deleteBudget = createAsyncThunk(
  'budget/delete',
  async (id: BUDGET_SELECT['id']) => {
    const deletedBudgetId = await deleteBudgetById(id);

    if (deletedBudgetId === null) throw new Error(`Unable to delete budget: ${id}.`);

    return deletedBudgetId;
  }
);

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    resetBudgetSliceState: () => ({ ...initialState, budgets: [] }),
    // Selection only; persistent changes go through the update thunk.
    setCurrentBudget: (state, action: PayloadAction<BudgetRow | null>) => {
      state.currentBudget = action.payload;
      state.detailRequestId = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadBudget.pending, (state, action) => {
        state.detailRequestId = action.meta.requestId;
        state.currentBudget = null;
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadBudget.fulfilled, (state, action) => {
        if (state.detailRequestId !== action.meta.requestId) return;

        state.currentBudget = action.payload;
        state.detailRequestId = null;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(loadBudget.rejected, (state, action) => {
        if (state.detailRequestId !== action.meta.requestId) return;

        state.detailRequestId = null;
        state.status = 'failed';
        state.error = action.error.message ?? 'Database operation failed.';
      })
      .addCase(loadBudgetsByOwnerId.pending, (state, action) => {
        if (state.listFilter?.field !== 'ownerId' || state.listFilter.value !== action.meta.arg) {
          state.budgets = [];
        }
        state.listFilter = { field: 'ownerId', value: action.meta.arg };
        state.listRequestId = action.meta.requestId;
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.budgets = state.budgets.filter((item) => item.id !== action.payload);
        if (state.currentBudget?.id === action.payload) {
          state.currentBudget = null;
        }
        state.status = 'succeeded';
        state.error = null;
      })
      .addMatcher(
        isAnyOf(loadBudgetsByOwnerId.fulfilled),
        (state, action) => {
          // An older request must not replace a newer filter's results.
          if (state.listRequestId !== action.meta.requestId) return;

          state.budgets = action.payload;
          state.listRequestId = null;
          state.status = 'succeeded';
          state.error = null;
        }
      )
      .addMatcher(
        isAnyOf(loadBudgetsByOwnerId.rejected),
        (state, action) => {
          if (state.listRequestId !== action.meta.requestId) return;

          state.listRequestId = null;
          state.status = 'failed';
          state.error = action.error.message ?? 'Database operation failed.';
        }
      )
      .addMatcher(
        isAnyOf(addNewBudget.pending, updateBudget.pending, deleteBudget.pending),
        (state) => {
          state.status = 'loading';
          state.error = null;
        }
      )
      .addMatcher(
        isAnyOf(addNewBudget.fulfilled, updateBudget.fulfilled),
        (state, action) => {
          const row = action.payload;
          state.currentBudget = row;
          state.detailRequestId = null;
          const index = state.budgets.findIndex((item) => item.id === row.id);
          const matchesFilter =
            !state.listFilter || row[state.listFilter.field] === state.listFilter.value;

          if (matchesFilter) {
            if (index === -1) state.budgets.push(row);
            else state.budgets[index] = row;
          } else if (index !== -1) {
            state.budgets.splice(index, 1);
          }
          state.status = 'succeeded';
          state.error = null;
        }
      )
      .addMatcher(
        isAnyOf(addNewBudget.rejected, updateBudget.rejected, deleteBudget.rejected),
        (state, action) => {
          state.status = 'failed';
          state.error = action.error.message ?? 'Database operation failed.';
        }
      );
  },
});

export default budgetSlice.reducer;

export const { resetBudgetSliceState, setCurrentBudget } = budgetSlice.actions;

// getters
export const getBudget = (state: RootState) => state.budgetReducer.currentBudget;
export const getBudgets = (state: RootState) => state.budgetReducer.budgets;
export const getBudgetState = (state: RootState) => state.budgetReducer;
