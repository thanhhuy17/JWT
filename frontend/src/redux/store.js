import { configureStore } from "@reduxjs/toolkit";
import authSliceH from "./authSlice";

export const store = configureStore({
  reducer: {
    auth: authSliceH,
  },
});
