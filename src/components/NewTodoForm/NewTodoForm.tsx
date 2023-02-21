import React, { FC } from 'react';
import clsx from 'clsx';
import classes from './NewTodoForm.module.scss';

interface NewTodoFormProps {
  title: string;
  setTitle: React.ComponentState;
  addTask: () => void;
  className: string;
}

const NewTodoForm: FC<NewTodoFormProps> = ({ title, setTitle, addTask, className }) => {
  return (
    <div className={clsx(classes.inputField, className)}>
      <input
        className={classes.inputField__input}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={'Введите цель...'}
        onKeyDown={(e) => e.key === 'Enter' && addTask()}
      />
      <button onClick={addTask} className={classes.inputField__button}>
        Создать
      </button>
    </div>
  );
};

export default NewTodoForm;
