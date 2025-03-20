import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../reducers";

/**
 * Redux store
 */
const store = configureStore({
  reducer: rootReducer,
});

// Infer RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
