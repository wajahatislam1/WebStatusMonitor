import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as userAPI from "../../api/users/users.api";
import { message } from "antd";

// Create a thunk to sign in a user
export const userSignIn = createAsyncThunk("users/signIn", async (user, thunkAPI) => {
  const response = await userAPI.userSignIn(user);
  if (response.ok) {
    const data = await response.json();

    return data;
  }
  return thunkAPI.rejectWithValue(await response.json());
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    jwtToken: localStorage.getItem("token") || null, // Load the token from localStorage
    error: null,
    message: null,
  },
  reducers: {
    setToken(state, action) {
      state.jwtToken = action.payload;
      localStorage.setItem("token", action.payload); // Store the token in localStorage
    },
  },

  extraReducers(builder) {
    builder.addCase(userSignIn.fulfilled, (state, action) => {
      state.jwtToken = action.payload.token;
      localStorage.setItem("token", action.payload.token); // Store the token in localStorage
      state.error = null;
    });

    builder.addCase(userSignIn.rejected, (state, action) => {
      state.error = action.payload.message;
      message.error(action.payload.message);
    });
  },
});

export const { setToken } = userSlice.actions;

export default userSlice.reducer;
