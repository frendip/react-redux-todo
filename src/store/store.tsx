import { configureStore } from '@reduxjs/toolkit';
import todoSlice from './todoSlice';
import userSlice from './userSlice';

const store = configureStore({
  reducer: {
    todos: todoSlice,
    users: userSlice,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
