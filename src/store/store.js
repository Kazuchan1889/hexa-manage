import { configureStore } from "@reduxjs/toolkit";
import loadingReducer from './loadingSlice.js';

const store = configureStore({
  reducer: {
    loading: loadingReducer,
  },
});

export default store;
