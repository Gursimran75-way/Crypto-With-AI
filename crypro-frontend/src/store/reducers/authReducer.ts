import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { api } from "../../services/api";
import { User } from "../../types";

// Define a type for the slice state
interface AuthState {
  accessToken: string;
  refreshToken: string;
  isLoggedIn: boolean;
  loading: boolean;
  user: User | null;
}

// Define the initial state using that type
const initialState: AuthState = {
  accessToken: localStorage.getItem("access_token") ?? "",
  refreshToken: localStorage.getItem("refresh_token") ?? "",
  // isLoggedIn: true,
  isLoggedIn: Boolean(localStorage.getItem("access_token")) || false,
  loading: false,
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<{ loading: boolean }>) => {
      state.loading = action.payload.loading;
    },
    setTokens: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isLoggedIn = true;
    },
    resetTokens: (state) => {
      state.accessToken = "";
      state.refreshToken = "";
      state.isLoggedIn = false;
    },
    setUser: (state, action: PayloadAction<{ user: User | null }>) => {
      state.user = action.payload.user;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(api.endpoints.login.matchPending, (state) => {
        state.loading = true;
        return state;
      })
      .addMatcher(api.endpoints.login.matchFulfilled, (state, action) => {
        const data = action.payload.data;
        localStorage.setItem("access_token", data.accessToken);
        localStorage.setItem("refresh_token", data.refreshToken);
        state.accessToken = data.accessToken;
        state.refreshToken = data.refreshToken;
        state.isLoggedIn = true;
        state.loading = false;
        return state;
      })
      .addMatcher(api.endpoints.login.matchRejected, (state) => {
        state.accessToken = "";
        state.refreshToken = "";
        state.isLoggedIn = false;
        state.loading = false;
        return state;
      }),
      builder.addMatcher(api.endpoints.logout.matchFulfilled, (state) => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        state.accessToken = "";
        state.refreshToken = "";
        state.isLoggedIn = false;
        state.loading = false;
        state.user = null;
        return state;
      }),
      builder.addMatcher(api.endpoints.me.matchFulfilled, (state, action) => {
        console.log("action................");
        state.user = action.payload.data;
      });
  },
});

export const { setLoading, setTokens, resetTokens, setUser } =
  authSlice.actions;

export default authSlice.reducer;
