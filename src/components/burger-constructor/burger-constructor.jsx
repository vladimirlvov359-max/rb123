import styles from './burger-constructor.module.css';

export const BurgerConstructor = ({ ingredients }) => {
  console.log(ingredients);

  return <section className={styles.burger_constructor}></section>;
};
