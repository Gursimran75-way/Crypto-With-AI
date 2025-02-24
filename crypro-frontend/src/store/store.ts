import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import authReducer from "./reducers/authReducer";
import portfolioReducer from "./reducers/buyCryptoReducer";
import threshHoldReducer from "./reducers/threshHoldReducer";
import { api } from "../services/api";
import { coinsAPI } from "../services/coinApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    portfolio: portfolioReducer,
    thresholds: threshHoldReducer,
    [api.reducerPath]: api.reducer,
    [coinsAPI.reducerPath]: coinsAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware, coinsAPI.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
