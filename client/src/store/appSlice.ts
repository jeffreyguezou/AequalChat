import { createSlice } from "@reduxjs/toolkit";

const AppSlice = createSlice({
  name: "user",
  initialState: [],
  reducers: {
    setUser: (state, action) => {
      if (state.length === 0) {
        state.push(action.payload);
      }
    },
    updateProfile: (state, action) => {
      state[0].profile = action.payload;
    },
    updateBio: (state, action) => {
      state[0].bio = action.payload;
    },
    newRequest: (state, action) => {
      if (!state[0].requests.includes(action.payload)) {
        state[0].requests = [...state[0].requests, action.payload];
      }
    },
    acceptRequest: (state, action) => {
      if (state[0].requests.includes(action.payload)) {
        let filteredRequests: string[] = [];
        state[0].requests.forEach((id: string) => {
          if (id !== action.payload) {
            filteredRequests.push(action.payload);
          }
        });
        state[0].requests = filteredRequests;
      }
    },
  },
});
export default AppSlice.reducer;
export const AppSliceActions = AppSlice.actions;
