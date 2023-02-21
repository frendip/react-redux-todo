import React, { FC, useState } from 'react';
import classes from './Users.module.scss';
import clsx from 'clsx';
import { changeActiveUser } from '../../store/userSlice';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';

interface UsersProps {
  className: string;
}

const Users: FC<UsersProps> = ({ className }) => {
  const [isOpenPopup, setIsOpenPopup] = useState(false);

  const { activeUser, users, loading } = useAppSelector((state) => state.users);
  const dispatch = useAppDispatch();

  const activeUserName =
    !loading && users
      ? users.find((val) => String(val.id) === String(activeUser))?.name
      : 'Please, wait...';

  const onClickUser = (id: string) => {
    dispatch(changeActiveUser({ id }));
    setIsOpenPopup(!isOpenPopup);
  };

  return (
    <div className={clsx(className, classes.users)}>
      <div className={classes.users__title} onClick={() => setIsOpenPopup(!isOpenPopup)}>
        Выбран пользователь: <span>{activeUserName}</span>
      </div>
      {isOpenPopup && (
        <div className={classes.popup}>
          <ul className={classes.popup__list}>
            {users.map((user) => (
              <li
                key={user.id}
                onClick={() => onClickUser(user.id)}
                className={clsx(
                  classes.popup__item,
                  user.id === activeUser && classes.popup__activeItem,
                )}>
                {user.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Users;
