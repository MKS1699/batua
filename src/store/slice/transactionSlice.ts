import { createAsyncThunk, createSlice, isAnyOf, type PayloadAction } from '@reduxjs/toolkit';

import {
  createNewTransaction,
  CreateTransactionInput,
  deleteTransactionById,
  getTransactionById,
  getTransactionsByBudgetId,
  getTransactionsByUserId,
  updateTransactionById,
  TRANSACTION_CHANGES,
  TRANSACTION_SELECT,
} from '@/db/transactions';
import type { RootState } from '../store';

type TransactionRow = NonNullable<Awaited<ReturnType<typeof getTransactionById>>>;

type TransactionListFilter = {
  field: 'budgetId' | 'createdBy';
  value: string;
};

interface TransactionState {
  currentTransaction: TransactionRow | null;
  transactions: TransactionRow[];
  // The list represents the most recently requested owner, budget, or user.
  listFilter: TransactionListFilter | null;
  listRequestId: string | null;
  detailRequestId: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TransactionState = {
  currentTransaction: null,
  transactions: [],
  listFilter: null,
  listRequestId: null,
  detailRequestId: null,
  status: 'idle',
  error: null,
};

// loading an existing transaction by ID
export const loadTransaction = createAsyncThunk(
  'transaction/load',
  async (id: TRANSACTION_SELECT['id']) => {
    return await getTransactionById(id);
  }
);

// loading lists
export const loadTransactionsByBudgetId = createAsyncThunk(
  'transaction/loadByBudgetId',
  async (budgetId: TRANSACTION_SELECT['budgetId']) => {
    return await getTransactionsByBudgetId(budgetId);
  }
);

export const loadTransactionsByUserId = createAsyncThunk(
  'transaction/loadByUserId',
  async (userId: TRANSACTION_SELECT['createdBy']) => {
    return await getTransactionsByUserId(userId);
  }
);

// adding a new transaction
export const addNewTransaction = createAsyncThunk(
  'transaction/new',
  async (input: CreateTransactionInput) => {
    const addedTransaction = await createNewTransaction(input);

    if (!addedTransaction) throw new Error('Unable to add new transaction.');

    return addedTransaction;
  }
);

// updates
type UPDATE_TRANSACTION_INPUT = {
  id: TRANSACTION_SELECT['id'];
  updates: TRANSACTION_CHANGES;
};

export const updateTransaction = createAsyncThunk(
  'transaction/update',
  async ({ id, updates }: UPDATE_TRANSACTION_INPUT) => {
    const updatedTransaction = await updateTransactionById(id, updates);

    if (!updatedTransaction) throw new Error('Unable to update transaction.');

    return updatedTransaction;
  }
);

// delete
export const deleteTransaction = createAsyncThunk(
  'transaction/delete',
  async (id: TRANSACTION_SELECT['id']) => {
    const deletedTransactionId = await deleteTransactionById(id);

    if (deletedTransactionId === null) throw new Error(`Unable to delete transaction: ${id}.`);

    return deletedTransactionId;
  }
);

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    resetTransactionSliceState: () => ({ ...initialState, transactions: [] }),
    // Selection only; persistent changes go through the update thunk.
    setCurrentTransaction: (state, action: PayloadAction<TransactionRow | null>) => {
      state.currentTransaction = action.payload;
      state.detailRequestId = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTransaction.pending, (state, action) => {
        state.detailRequestId = action.meta.requestId;
        state.currentTransaction = null;
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadTransaction.fulfilled, (state, action) => {
        if (state.detailRequestId !== action.meta.requestId) return;

        state.currentTransaction = action.payload;
        state.detailRequestId = null;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(loadTransaction.rejected, (state, action) => {
        if (state.detailRequestId !== action.meta.requestId) return;

        state.detailRequestId = null;
        state.status = 'failed';
        state.error = action.error.message ?? 'Database operation failed.';
      })
      .addCase(loadTransactionsByBudgetId.pending, (state, action) => {
        if (state.listFilter?.field !== 'budgetId' || state.listFilter.value !== action.meta.arg) {
          state.transactions = [];
        }
        state.listFilter = { field: 'budgetId', value: action.meta.arg };
        state.listRequestId = action.meta.requestId;
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadTransactionsByUserId.pending, (state, action) => {
        if (state.listFilter?.field !== 'createdBy' || state.listFilter.value !== action.meta.arg) {
          state.transactions = [];
        }
        state.listFilter = { field: 'createdBy', value: action.meta.arg };
        state.listRequestId = action.meta.requestId;
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter((item) => item.id !== action.payload);
        if (state.currentTransaction?.id === action.payload) {
          state.currentTransaction = null;
        }
        state.status = 'succeeded';
        state.error = null;
      })
      .addMatcher(
        isAnyOf(loadTransactionsByBudgetId.fulfilled, loadTransactionsByUserId.fulfilled),
        (state, action) => {
          // An older request must not replace a newer filter's results.
          if (state.listRequestId !== action.meta.requestId) return;

          state.transactions = action.payload;
          state.listRequestId = null;
          state.status = 'succeeded';
          state.error = null;
        }
      )
      .addMatcher(
        isAnyOf(loadTransactionsByBudgetId.rejected, loadTransactionsByUserId.rejected),
        (state, action) => {
          if (state.listRequestId !== action.meta.requestId) return;

          state.listRequestId = null;
          state.status = 'failed';
          state.error = action.error.message ?? 'Database operation failed.';
        }
      )
      .addMatcher(
        isAnyOf(addNewTransaction.pending, updateTransaction.pending, deleteTransaction.pending),
        (state) => {
          state.status = 'loading';
          state.error = null;
        }
      )
      .addMatcher(
        isAnyOf(addNewTransaction.fulfilled, updateTransaction.fulfilled),
        (state, action) => {
          const row = action.payload;
          state.currentTransaction = row;
          state.detailRequestId = null;
          const index = state.transactions.findIndex((item) => item.id === row.id);
          const matchesFilter =
            !state.listFilter || row[state.listFilter.field] === state.listFilter.value;

          if (matchesFilter) {
            if (index === -1) state.transactions.push(row);
            else state.transactions[index] = row;
          } else if (index !== -1) {
            state.transactions.splice(index, 1);
          }
          state.status = 'succeeded';
          state.error = null;
        }
      )
      .addMatcher(
        isAnyOf(addNewTransaction.rejected, updateTransaction.rejected, deleteTransaction.rejected),
        (state, action) => {
          state.status = 'failed';
          state.error = action.error.message ?? 'Database operation failed.';
        }
      );
  },
});

export default transactionSlice.reducer;

export const { resetTransactionSliceState, setCurrentTransaction } = transactionSlice.actions;

// getters
export const getTransaction = (state: RootState) => state.transactionReducer.currentTransaction;
export const getTransactions = (state: RootState) => state.transactionReducer.transactions;
export const getTransactionState = (state: RootState) => state.transactionReducer;
