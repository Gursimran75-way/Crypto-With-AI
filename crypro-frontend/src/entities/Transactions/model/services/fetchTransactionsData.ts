import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider/config/StateSchema';
import axios from 'axios';
import { Transactions } from '../types/TransactionsSchema';

interface TransactionDataProps {
  userId: string;
  coinTicker: string;
}

export const fetchTransactionsData = createAsyncThunk<
  Transactions[],
  TransactionDataProps,
  ThunkConfig<string>
>(
  'transactions/fetchTransactionsData',
  async ({ userId, coinTicker }, thunkAPI) => {
    const { rejectWithValue } = thunkAPI;

    try {
      const response = await axios.get(
        `http://localhost:8000/transactions/ticker`,
        {
          params: {
            userId,
            ticker: coinTicker,
          },
          headers: {
            authorization: '1',
          },
        },
      );

      if (!response.data) {
        rejectWithValue('Server error');
      }

      return response.data;
    } catch (e: unknown) {
      return rejectWithValue('Error');
    }
  },
);
