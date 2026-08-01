import { createSlice } from "@reduxjs/toolkit";

function readStoredTheme() {
  return localStorage.getItem("theme") === "dark";
}

const initialState = {
  isDarkTheme: readStoredTheme(),
  isSearchbarActive: false,
  isHeaderVisible: true,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    themeToggled: (state) => {
      state.isDarkTheme = !state.isDarkTheme;
      localStorage.setItem("theme", state.isDarkTheme ? "dark" : "light");
    },
    searchbarActiveSet: (state, action) => {
      state.isSearchbarActive = action.payload ?? !state.isSearchbarActive;
    },
    headerVisibleSet: (state, action) => {
      state.isHeaderVisible = action.payload;
    },
  },
});

export const { themeToggled, searchbarActiveSet, headerVisibleSet } = uiSlice.actions;
export default uiSlice.reducer;
