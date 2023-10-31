import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

// Define a type for the slice state
interface AuthState {
  bSuccess: boolean;
}

// Define the initial state using that type
const initialState: AuthState = {
  bSuccess: false,
};

export const authSlice = createSlice({
  name: "auth",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setResponse: (state, action: PayloadAction<boolean>) => {
      state.bSuccess = action.payload;
    },
  },
});

export const { setResponse } = authSlice.actions;

export default authSlice.reducer;
