import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "messages",
  initialState: {},
  reducers: {
    addMessageSender: (state, action) => {
      let sender: string = action.payload.sender;
      if (!state[sender]) {
        state[sender] = {
          messages: [],
          unread: [action.payload._id],
        };
      } else {
        if (!state[sender].unread.includes(action.payload._id)) {
          state[sender].unread.push(action.payload._id);
        }
      }
    },
    markRead: (state, action) => {
      let sender = action.payload.sender;
      state[sender].messages = [
        ...state[sender].messages,
        ...state[sender].unread,
      ];
      state[sender].unread = [];
      delete state[sender].unread;
    },
  },
});

export default messageSlice.reducer;

export const messageSlicaActions = messageSlice.actions;
