import React, { FC } from 'react';
import clsx from 'clsx';
import classes from './TodoList.module.scss';
import TodoItem from '../TodoItem/TodoItem';
import { useAppSelector } from '../../hooks/useAppSelector';

interface TodoListProps {
  className: string;
}

const TodoList: FC<TodoListProps> = ({ className }) => {
  const todos = useAppSelector((state) => state.todos.todos);
  return (
    <ul className={clsx(classes.todoList, className)}>
      {todos.map((todo) => (
        <TodoItem key={todo.id} {...todo} />
      ))}
    </ul>
  );
};

export default TodoList;
