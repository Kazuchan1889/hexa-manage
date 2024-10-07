import { configureStore } from "@reduxjs/toolkit";
import loadingSlice from './loadingSlice.js';

const store = configureStore({
  reducer: {
    loading: loadingSlice.reducer,
  },
});

export const loadingAction = loadingSlice.actions;

export default store;
