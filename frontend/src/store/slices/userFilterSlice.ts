import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../index";

interface UserFilterState {
  searchQuery: string;
}

const initialState: UserFilterState = {
  searchQuery: "",
};

const userFilterSlice = createSlice({
  name: "userFilter",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearSearchQuery: (state) => {
      state.searchQuery = "";
    },
  },
});

// Export actions
export const { setSearchQuery, clearSearchQuery } = userFilterSlice.actions;

// Export selectors
export const selectSearchQuery = (state: RootState) =>
  state.userFilter.searchQuery;

// Export reducer
export default userFilterSlice.reducer;
