// src/store/reducers/thresholdSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Threshold {
  upper?: number;
  lower?: number;
}

interface ThresholdState {
  thresholds: { [coinName: string]: Threshold };
}

const initialState: ThresholdState = {
  thresholds: {},
};

const thresholdSlice = createSlice({
  name: "thresholds",
  initialState,
  reducers: {
    setThreshold: (
      state,
      action: PayloadAction<{
        coinName: string;
        upper?: number;
        lower?: number;
      }>
    ) => {
      state.thresholds[action.payload.coinName.toLowerCase()] = {
        upper: action.payload.upper,
        lower: action.payload.lower,
      };
    },
    removeThreshold: (state, action: PayloadAction<string>) => {
      delete state.thresholds[action.payload];
    },
  },
});

export const { setThreshold, removeThreshold } = thresholdSlice.actions;
export default thresholdSlice.reducer;
