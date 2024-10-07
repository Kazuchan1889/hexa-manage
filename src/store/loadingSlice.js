import { createSlice } from "@reduxjs/toolkit";

const loadingSlice = createSlice({
  name: "loading",
  initialState: { isLoading: false },
  reducers: {
    startLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export default loadingSlice;
