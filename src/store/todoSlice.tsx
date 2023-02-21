import { AnyAction, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

interface TodoState {
  todos: Todo[];
  error: null | string;
  loading: boolean;
}

export const fetchTodos = createAsyncThunk<Todo[], { activeUser: string }, { rejectValue: string }>(
  'todos/fetchTodos',
  async function ({ activeUser }, { rejectWithValue }) {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos?userId=${activeUser}`,
      );

      if (!response.ok) {
        throw new Error('Server Error! (Todos)');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

export const removeTodoAsync = createAsyncThunk<void, { id: string }, { rejectValue: string }>(
  'todos/removeTodoAsync',
  async function ({ id }, { rejectWithValue, dispatch }) {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Server Error!');
      }

      dispatch(removeTodo({ id }));
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

export const toggleTodoCompleteAsync = createAsyncThunk<
  void,
  { id: string },
  { rejectValue: string; state: RootState }
>(
  'todos/toggleTodoCompleteAsync',
  async function ({ id }, { rejectWithValue, dispatch, getState }) {
    const currentTodo = getState()['todos'].todos.find((todo) => todo.id === id);

    if (currentTodo) {
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            complete: !currentTodo.completed,
          }),
        });
        if (!response.ok) {
          throw new Error('Server Error!');
        }

        dispatch(toggleTodoComplete({ id }));
      } catch (error) {
        return rejectWithValue((error as Error).message);
      }
    }
  },
);

export const addTodoAsync = createAsyncThunk<void, { title: string }, { rejectValue: string }>(
  'todos/addTodoAsync',
  async function ({ title }, { rejectWithValue, dispatch }) {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 1,
          id: new Date().toISOString(),
          title: title,
          completed: false,
        }),
      });

      if (!response.ok) {
        throw new Error('Server Error!');
      }

      const data = await response.json();

      dispatch(addTodo(data));
      dispatch(fixJsonPlaceholderIdBug());
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

const initialState: TodoState = {
  todos: [],
  error: null,
  loading: false,
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo(state, action: PayloadAction<Todo>) {
      state.todos.unshift(action.payload);
    },
    toggleTodoComplete(state, action: PayloadAction<{ id: string }>) {
      const toggledTodo = state.todos.find((todo) => todo.id === action.payload.id);
      if (toggledTodo) {
        toggledTodo.completed = !toggledTodo.completed;
      }
    },
    removeTodo(state, action: PayloadAction<{ id: string }>) {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload.id);
    },
    fixJsonPlaceholderIdBug(state) {
      const todo = state.todos.find((todo) => todo.id === '201');
      if (todo) {
        todo.id = String(state.todos.length + 190);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.todos = action.payload;
      })
      .addMatcher(isPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(isFulfilled, (state) => {
        state.loading = false;
      })
      .addMatcher(isError, (state, action: AnyAction) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

const isPending = (action: AnyAction) => {
  return action.type.endsWith('pending');
};

const isFulfilled = (action: AnyAction) => {
  return action.type.endsWith('fulfilled');
};

const isError = (action: AnyAction) => {
  return action.type.endsWith('rejected');
};

export const { addTodo, toggleTodoComplete, removeTodo, fixJsonPlaceholderIdBug } =
  todoSlice.actions;

export default todoSlice.reducer;
