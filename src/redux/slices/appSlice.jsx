import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isDarkTheme: false,
  isSearchbarActive: false,
  loading: false,
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
  },
});

export const { setIsDarkTheme, setIsSearchbarActive } = appSlice.actions;
export default appSlice.reducer;
