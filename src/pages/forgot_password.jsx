// src/pages/forgot_password.jsx
import { Button, EmailInput } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { request } from '../utils/api';

import styles from './forgot_password.module.css';

export default function Forgot_password() {
  const [email, setEmail] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await request('/password-reset', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      setRequestSent(true);
    } catch (err) {
      setError(err.message || 'Ошибка сервера');
    }
  };

  if (requestSent) {
    return (
      <div className={styles.container}>
        <div>
          <h2 className={styles.title}>Проверьте почту</h2>
          <p className={styles.message}>Мы отправили инструкцию на адрес:</p>
          <p className={styles.email}>{email}</p>

          <Link to="/reset-password" className={styles.backLink}>
            ← Перейти к вводу кода
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div>
        <h2 className={styles.title}>Восстановление пароля</h2>
        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <EmailInput
              name="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isIcon={false}
            />
          </div>
          <div className={styles.buttonContainer}>
            <Button htmlType="submit" size="medium" type="primary">
              Восстановить
            </Button>
          </div>
        </form>

        <div className={styles.links}>
          <p>
            Вспомнили пароль? <Link to="/login">Войти</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
