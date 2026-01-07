// src/pages/profile.jsx
import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { getUserData, logoutUser, updateUserData } from '@services/auth_slice.js';

import styles from './profile.module.css';

export default function Profile() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [initialValues, setInitialValues] = useState({
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    dispatch(getUserData());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name, email: user.email, password: '' });
      setInitialValues({ name: user.name, email: user.email, password: '' });
    }
  }, [user]);

  const isActive = (path) => location.pathname === path;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      email: form.email,
    };
    if (form.password.trim()) {
      payload.password = form.password;
    }

    try {
      await dispatch(updateUserData(payload)).unwrap();

      setInitialValues({ name: form.name, email: form.email, password: '' });
      setForm((prev) => ({ ...prev, password: '' }));
    } catch (err) {
      console.error('Ошибка обновления:', err);
    }
  };

  const handleCancel = () => {
    setForm({ ...initialValues, password: '' });
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/login');
    } catch (err) {
      console.error('Ошибка выхода:', err);
    }
  };

  if (isLoading && !user) {
    return <div className={styles.container}>Загрузка профиля...</div>;
  }

  if (error) {
    return <div className={styles.container}>Ошибка: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <nav>
        <div
          className={`${styles.navItem} ${isActive('/profile') ? styles.navItem_active : ''}`}
          onClick={() => navigate('/profile')}
        >
          Профиль
        </div>
        <div
          className={`${styles.navItem} ${isActive('/profile/orders') || location.pathname.startsWith('/profile/orders/') ? styles.navItem_active : ''}`}
          onClick={() => navigate('/profile/orders')}
        >
          История заказов
        </div>
        <div className={`${styles.navItem}  `} onClick={handleLogout}>
          Выход
        </div>
      </nav>

      <div>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <Input
              type="text"
              placeholder="Имя"
              name="name"
              value={form.name}
              onChange={handleChange}
              icon="EditIcon"
            />
          </div>
          <div className="mb-6">
            <EmailInput
              placeholder="E-mail"
              name="email"
              value={form.email}
              onChange={handleChange}
              isIcon={true}
            />
          </div>
          <div className="mb-6">
            <PasswordInput
              placeholder="Пароль"
              name="password"
              value={form.password}
              onChange={handleChange}
              icon="EditIcon"
            />
          </div>

          <div>
            <Button
              htmlType="submit"
              size="medium"
              type="primary"
              disabled={
                form.name === initialValues.name &&
                form.email === initialValues.email &&
                form.password === initialValues.password
              }
            >
              Сохранить
            </Button>
            <Button
              htmlType="button"
              size="medium"
              type="secondary"
              onClick={handleCancel}
            >
              Отмена
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
