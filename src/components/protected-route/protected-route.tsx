import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { useAppSelector } from '../../services/store';
import {
  selectIsAuthenticated,
  selectIsInit
} from '../../slices/stellarBurgerSlice';

type ProtectedRouteProps = {
  children: React.ReactElement;
  unAuthOnly?: boolean;
  redirectPath?: string;
};

/**
 * Компонент для защиты маршрутов
 * @param children - Дочерний компонент для рендеринга
 * @param unAuthOnly - Флаг, указывающий что маршрут только для неавторизованных
 * @param redirectPath - Кастомный путь для редиректа (по умолчанию '/login' или '/')
 */
export const ProtectedRoute = ({
  children,
  unAuthOnly = false,
  redirectPath = '/'
}: ProtectedRouteProps) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isInit = useAppSelector(selectIsInit);
  const location = useLocation();

  // Показываем прелоадер пока не инициализировано приложение
  if (!isInit) {
    return <Preloader />;
  }

  // Редирект для защищенных маршрутов (только для авторизованных)
  if (!unAuthOnly && !isAuthenticated) {
    const loginPath = redirectPath || '/login';
    return <Navigate to={loginPath} replace state={{ from: location }} />;
  }

  // Редирект для маршрутов только для неавторизованных
  if (unAuthOnly && isAuthenticated) {
    const redirectTo = location.state?.from?.pathname || redirectPath;
    return <Navigate to={redirectTo} replace />;
  }

  // Если все проверки пройдены, рендерим дочерний компонент
  return children;
};
