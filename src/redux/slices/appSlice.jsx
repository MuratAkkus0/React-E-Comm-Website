import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isDarkTheme: false,
  isSearchbarActive: false,
  isPageLoading: true,
  isHeaderVisible: true,
  searchQuery: "",
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setIsDarkTheme: (state) => {
      state.isDarkTheme = !state.isDarkTheme;
    },
    setIsSearchbarActive: (state, val) => {
      state.isSearchbarActive = val.payload ?? !state.isSearchbarActive;
    },
    setIsPageLoading: (state, action) => {
      state.isPageLoading = action.payload;
    },
    setIsHeaderVisible: (state, action) => {
      state.isHeaderVisible = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
});

export const {
  setIsDarkTheme,
  setIsSearchbarActive,
  setIsPageLoading,
  setIsHeaderVisible,
  setSearchQuery,
} = appSlice.actions;
export default appSlice.reducer;
