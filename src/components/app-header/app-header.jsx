import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { Link, useLocation } from 'react-router-dom';

import styles from './app-header.module.css';

export const AppHeader = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const isActiveStartsWith = (path) => location.pathname.startsWith(path);

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <Link
            to="/"
            className={`${styles.link} ${isActive('/') ? styles.link_active : ''}`}
          >
            <BurgerIcon type={isActive('/') ? 'primary' : 'secondary'} />
            <p className="text text_type_main-default ml-2">Конструктор</p>
          </Link>

          <Link
            to="/feed"
            className={`${styles.link} ml-10 ${isActive('/feed') ? styles.link_active : ''}`}
          >
            <ListIcon type={isActive('/feed') ? 'primary' : 'secondary'} />
            <p className="text text_type_main-default ml-2">Лента заказов</p>
          </Link>
        </div>

        <div className={styles.logo}>
          <Logo />
        </div>

        <Link
          to="/profile"
          className={`${styles.link} ${styles.link_position_last} ${
            isActiveStartsWith('/profile') ? styles.link_active : ''
          }`}
        >
          <ProfileIcon type={isActiveStartsWith('/profile') ? 'primary' : 'secondary'} />
          <p className="text text_type_main-default ml-2">Личный кабинет</p>
        </Link>
      </nav>
    </header>
  );
};
