import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchMsgs = createAsyncThunk(
  "messages/fetchMsgs",
  async (payload: { current: string; other: string }) => {
    let qParams = {
      current: payload.current,
      other: payload.other,
    };
    const params = new URLSearchParams(qParams);
    const res = await axios.get(`/messages/getMessages/${params}`);
    if (res) {
      return { data: res.data, other: payload.other };
    }
  }
);

const messageSlice = createSlice({
  name: "messages",
  initialState: {},
  reducers: {
    setUserMsgs: (state, action) => {},
  },
  extraReducers(builder) {
    builder.addCase(fetchMsgs.fulfilled, (state, action) => {
      state[action.payload.other] = action.payload?.data;
    });
  },
});

export default messageSlice.reducer;

export const messageSlicaActions = messageSlice.actions;
