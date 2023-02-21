import classes from './mainStyles/mainStyles.module.scss';
import { useEffect, useState } from 'react';
import TodoList from './components/TodoList/TodoList';
import NewTodoForm from './components/NewTodoForm/NewTodoForm';
import { addTodoAsync, fetchTodos } from './store/todoSlice';
import { Blocks } from 'react-loader-spinner';
import { fetchUsers } from './store/userSlice';
import Users from './components/Users/Users';
import { useAppDispatch } from './hooks/useAppDispatch';
import { useAppSelector } from './hooks/useAppSelector';

function App() {
  const [title, setTitle] = useState('');
  const dispatch = useAppDispatch();
  const { loading: loadingTodos, error: errorTodos } = useAppSelector((state) => state.todos);
  const {
    activeUser,
    loading: loadingUsers,
    error: errorUsers,
  } = useAppSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, []);
  useEffect(() => {
    if (activeUser !== null) {
      dispatch(fetchTodos({ activeUser }));
    }
  }, [activeUser]);

  const addTask = () => {
    if (title.trim().length !== 0) {
      dispatch(addTodoAsync({ title }));
      setTitle('');
    }
  };
  return (
    <div className={classes.wrapper}>
      <div className={classes.container}>
        {!errorUsers ? (
          <Users className={classes.content} />
        ) : (
          <div className={classes.error}>{errorUsers}</div>
        )}
        {!errorTodos && !errorUsers && (
          <NewTodoForm
            title={title}
            setTitle={setTitle}
            addTask={addTask}
            className={classes.content}
          />
        )}
        {(loadingTodos || loadingUsers) && (
          <Blocks
            visible={true}
            height="80"
            width="80"
            ariaLabel="blocks-loading"
            wrapperClass={classes.loader}
          />
        )}
        {!errorTodos ? (
          <TodoList className={classes.content} />
        ) : (
          <div className={classes.error}>{errorTodos}</div>
        )}
      </div>
    </div>
  );
}

export default App;
