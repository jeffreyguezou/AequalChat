import { configureStore } from "@reduxjs/toolkit";
import appSliceReducer from "./appSlice";
import messageSliceReducer from "./messageSlice";

const store = configureStore({
  reducer: {
    app: appSliceReducer,
    messages: messageSliceReducer,
  },
});
export default store;
