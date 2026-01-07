import {
  Button,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { request } from '../utils/api';

import styles from './reset_password.module.css';

export default function Reset_password() {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem('resetEmail');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (password.length < 6) {
      setError('Пароль должен содержать не менее 6 символов');
      setIsLoading(false);
      return;
    }

    const trimmedToken = token.trim();
    if (!trimmedToken) {
      setError('Введите код из письма');
      setIsLoading(false);
      return;
    }

    try {
      await request('/password-reset/reset', {
        method: 'POST',
        body: JSON.stringify({
          password,
          token: trimmedToken,
        }),
      });

      setSuccess(true);
      localStorage.removeItem('resetEmail');

      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Неверный код или пароль');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.container}>
        <div>
          <h2 className={styles.title}>Пароль успешно изменён!</h2>
          <p>
            Ваш пароль был успешно обновлён. Теперь вы можете войти в систему с новым
            паролем.
          </p>
          <Link to="/login">Войти в аккаунт</Link>
          <p>Автоматический переход через 3 секунды...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div>
        <h2 className={styles.title}>Восстановление пароля</h2>

        {email && (
          <p>
            Инструкция отправлена на: <strong>{email}</strong>
          </p>
        )}

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            <PasswordInput
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              name="password"
              placeholder="Введите новый пароль"
              disabled={isLoading}
            />
          </div>

          <div>
            <Input
              type="text"
              placeholder="Введите код из письма"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className={styles.buttonContainer}>
            <Button type="primary" size="medium" htmlType="submit" disabled={isLoading}>
              {isLoading ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </div>
        </form>

        <div className={styles.links}>
          <p className={styles.linkText}>
            Вспомнили пароль?{' '}
            <Link to="/login" className={styles.link}>
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
