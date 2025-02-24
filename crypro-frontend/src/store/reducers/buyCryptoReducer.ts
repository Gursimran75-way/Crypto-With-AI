// src/store/portfolioSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Purchase {
  symbol: string;
  amount: number;
  price: number;
  id: number;
  name: string;
  purchasedAt: string;
}

interface PortfolioState {
  purchases: Purchase[];
}

const initialState: PortfolioState = {
  purchases: [],
};

const portfolioSlice = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    buyCrypto: (state, action: PayloadAction<Purchase>) => {
      state.purchases.push(action.payload);
    },
    sellCrypto: (
      state,
      action: PayloadAction<{ name: string; purchasedAt: string }>
    ) => {
      state.purchases = state.purchases.filter(
        (purchase) =>
          !(
            purchase.name === action.payload.name &&
            purchase.purchasedAt === action.payload.purchasedAt
          )
      );
    },
  },
});

export const { buyCrypto, sellCrypto } = portfolioSlice.actions;
export default portfolioSlice.reducer;
