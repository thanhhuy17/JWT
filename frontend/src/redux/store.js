// import { configureStore } from "@reduxjs/toolkit";
// import authSliceH from "./authSlice";
// import usersSlice from "./userSlice";

// export const store = configureStore({
//   reducer: {
//     auth: authSliceH,
//     users: usersSlice,
//   },
// });

// Redux persist
import { combineReducers, configureStore} from "@reduxjs/toolkit";
import authSliceH from "./authSlice";
import usersSlice from "./userSlice";
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  auth: authSliceH,
  users: usersSlice,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);



export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware)=> getDefaultMiddleware({
    serializableCheck:{
      ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
    }
  })
});
export let persistor = persistStore(store)