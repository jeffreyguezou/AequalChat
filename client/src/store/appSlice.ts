import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const updateReadMsg = createAsyncThunk(
  "user/updateMsgsRead",
  async (payload: { viewedBy: string; viewedWhose: string }, { dispatch }) => {
    const unreadUpdated = await axios.post("/user/markRead", {
      viewedBy: payload.viewedBy,
      viewedID: payload.viewedWhose,
    });
    if (unreadUpdated) {
      const currentUser = await axios.post("/user/getUserDetails", {
        userName: state[0].username,
      });
      if (currentUser) {
        dispatch(AppSliceActions.updateUser(currentUser.data));
      }
    }
  }
);

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
    sentRequest: (state, action) => {
      if (!state[0].sentRequests.includes(action.payload)) {
        state[0].sentRequests = [...state[0].sentRequests, action.payload];
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
    unfriendUser: (state, action) => {
      if (state[0].friends.includes(action.payload)) {
        let filteredFriends: string[] = [];
        state[0].friends.forEach((friend: string) => {
          if (friend !== action.payload) {
            filteredFriends.push(action.payload);
          }
        });
        state[0].friends = filteredFriends;
      }
    },
    updateUser: (state, action) => {
      if (state[0]) {
        state[0] = action.payload;
      }
    },
    newMessage: (state, action) => {
      state[0].unreadMessages = [action.payload];
    },
    markRead: (state, action) => {
      state[0].unreadMessages = [];
    },
  },
});
export default AppSlice.reducer;
export const AppSliceActions = AppSlice.actions;
