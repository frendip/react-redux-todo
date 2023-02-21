import React, { FC } from 'react';
import classes from './TodoItem.module.scss';
import { removeTodoAsync, toggleTodoCompleteAsync } from '../../store/todoSlice';
import { useAppDispatch } from '../../hooks/useAppDispatch';

interface TodoItemProps {
  id: string;
  title: string;
  completed: boolean;
}

const TodoItem: FC<TodoItemProps> = ({ id, title, completed }) => {
  const dispatch = useAppDispatch();

  return (
    <li key={id} className={classes.todoItem}>
      <input
        className={classes.todoItem__input}
        type="checkbox"
        checked={completed}
        onChange={() => dispatch(toggleTodoCompleteAsync({ id }))}
      />
      <div className={classes.todoItem__text}>{title} </div>
      <button
        onClick={() => dispatch(removeTodoAsync({ id }))}
        className={classes.todoItem__button}>
        &times;
      </button>
    </li>
  );
};

export default TodoItem;
