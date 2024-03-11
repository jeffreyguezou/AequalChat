import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
};

const AppSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
});
export default AppSlice.reducer;
export const AppSliceActions = AppSlice.actions;
