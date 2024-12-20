import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./reducers/user";

const store = configureStore({
  reducer: {
    [userSlice.name]: userSlice.reducer,
  },
});

export default store;
