import { createSlice } from "@reduxjs/toolkit";

const AppSlice = createSlice({
  name: "user",
  initialState: [],
  reducers: {
    setUser: (state, action) => {
      state.push(action.payload);
    },
    updateProfile: (state, action) => {
      state[0].profile = action.payload;
    },
    updateBio: (state, action) => {
      state[0].bio = action.payload;
    },
  },
});
export default AppSlice.reducer;
export const AppSliceActions = AppSlice.actions;
