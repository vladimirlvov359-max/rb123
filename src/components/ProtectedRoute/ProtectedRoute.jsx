import { useSelector } from 'react-redux';
// src/components/ProtectedRoute/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';

export const ProtectedRoute = ({ children, onlyUnAuth = false }) => {
  const location = useLocation();
  const { isAuth } = useSelector((state) => state.auth);

  // Если маршрут только для НЕавторизованных (login, register, forgot-password)
  if (onlyUnAuth && isAuth) {
    // Авторизованный → редирект на главную
    return <Navigate to="/" replace />;
  }

  // Если маршрут для авторизованных (profile, orders), но пользователь не авторизован
  if (!onlyUnAuth && !isAuth) {
    // Не авторизован → редирект на /login с from=текущий_путь
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Экспортируем для удобства использования
export const OnlyAuth = ({ children }) => (
  <ProtectedRoute onlyUnAuth={false}>{children}</ProtectedRoute>
);

export const OnlyUnAuth = ({ children }) => (
  <ProtectedRoute onlyUnAuth={true}>{children}</ProtectedRoute>
);
