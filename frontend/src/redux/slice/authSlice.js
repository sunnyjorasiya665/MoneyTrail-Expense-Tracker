import { createSlice } from "@reduxjs/toolkit";
//!initial state
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("userInfo")) || null,
  },
  //reducers
  reducers: {
    loginAction: (state, action) => {
      state.user = action.payload;
    },
    //Logout action
    logoutAction: (state, action) => {
      state.user = null;
    },
  },
});

//!Generate actions
export const { loginAction, logoutAction } = authSlice.actions;

//!Genearte reducer
const authReducer = authSlice.reducer;
export default authReducer;
