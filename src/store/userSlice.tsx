import { AnyAction, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
}

interface UserState {
  users: User[];
  activeUser: null | string;
  error: null | string;
  loading: boolean;
}

export const fetchUsers = createAsyncThunk<User[], void, { rejectValue: string }>(
  'users/fetchUsers',
  async function (_, { rejectWithValue }) {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');

      if (!response.ok) {
        throw new Error('Server Error! (Users)');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

const initialState: UserState = {
  users: [],
  activeUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    changeActiveUser(state, action: PayloadAction<{ id: string }>) {
      state.activeUser = action.payload.id;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;
        state.activeUser = '1';
      })
      .addMatcher(isError, (state, action: AnyAction) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
const isError = (action: AnyAction) => {
  return action.type.endsWith('rejected');
};

export const { changeActiveUser } = userSlice.actions;
export default userSlice.reducer;
