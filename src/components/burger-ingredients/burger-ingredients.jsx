import { Tab } from '@krgaa/react-developer-burger-ui-components';

import { BurgerCard } from '@components/burger-ingredients/burger-card/burger-card.jsx';

import styles from './burger-ingredients.module.css';

export const BurgerIngredients = ({ ingredients }) => {
  console.log(ingredients);

  if (ingredients.length === 0) {
    return <div>загрузка</div>;
  }

  return (
    <div className={`pl-1 pr-1 pb-1 pt-1 ${styles.verticalBlock}`}>
      <section className={styles.burger_ingredients}>
        <nav>
          <ul className={styles.menu}>
            <Tab
              value="bun"
              active={true}
              onClick={() => {
                console.log('bun click');
              }}
            >
              Булки
            </Tab>
            <Tab
              value="main"
              active={false}
              onClick={() => {
                console.log('bun click');
              }}
            >
              Начинки
            </Tab>
            <Tab
              value="sauce"
              active={false}
              onClick={() => {
                console.log('bun click');
              }}
            >
              Соусы
            </Tab>
          </ul>
        </nav>
      </section>
      <BurgerCard ingredients={ingredients} />
    </div>
  );
};
