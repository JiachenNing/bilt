import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "./services/userApi";
import userFilterReducer from "./slices/userFilterSlice";
import { useDispatch, useSelector } from "react-redux";

export const makeStore = () => {
  return configureStore({
    reducer: {
      [userApi.reducerPath]: userApi.reducer,
      userFilter: userFilterReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(userApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

// Export typed hooks for convenience
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
