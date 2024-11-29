import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  isDarkTheme: false,
  isSearchbarActive: false,
  isPageLoading: true,
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
      state.isPageLoading = false;
      console.log(state.isPageLoading);
    },
  },
});

export const { setIsDarkTheme, setIsSearchbarActive, setIsPageLoading } =
  appSlice.actions;
export default appSlice.reducer;
