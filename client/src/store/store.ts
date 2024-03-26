import { configureStore } from "@reduxjs/toolkit";
import appSliceReducer from "./appSlice";
import messageSliceReducer from "./messageSlice";

const store = configureStore({
  reducer: {
    app: appSliceReducer,
    messages: messageSliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});
export default store;
export type AppDispatch = typeof store.dispatch;
export type IRootState = ReturnType<typeof store.getState>;
