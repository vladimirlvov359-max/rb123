import { Preloader, Tab } from '@krgaa/react-developer-burger-ui-components';
import { useRef, useState } from 'react';

import { BurgerCard } from '@components/burger-ingredients/burger-card/burger-card.jsx';

import styles from './burger-ingredients.module.css';

export const BurgerIngredients = ({ ingredients }) => {
  console.log(ingredients);

  const bunRef = useRef(null);
  const sauceRef = useRef(null);
  const mainRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const [activeTab, setActiveTab] = useState('bun');

  const scrollToSection = (sectionRef, tabValue) => {
    setActiveTab(tabValue);
    if (sectionRef.current && scrollContainerRef.current) {
      const sectionTop = sectionRef.current.offsetTop;
      const containerTop = scrollContainerRef.current.offsetTop;

      scrollContainerRef.current.scrollTo({
        top: sectionTop - containerTop,
        behavior: 'smooth',
      });
    }
  };

  if (ingredients.length === 0) {
    return <Preloader />;
  }

  return (
    <div className={`pl-1 pr-1 pb-1 pt-1 ${styles.verticalBlock}`}>
      <section className={styles.burger_ingredients}>
        <nav>
          <ul className={styles.menu}>
            <Tab
              value="bun"
              active={activeTab === 'bun'}
              onClick={() => scrollToSection(bunRef, 'bun')}
            >
              Булки
            </Tab>

            <Tab
              active={activeTab === 'sauce'}
              value="sauce"
              onClick={() => scrollToSection(sauceRef, 'sauce')}
            >
              Соусы
            </Tab>
            <Tab
              active={activeTab === 'main'}
              value="main"
              onClick={() => scrollToSection(mainRef, 'main')}
            >
              Начинки
            </Tab>
          </ul>
        </nav>
      </section>
      <BurgerCard
        ingredients={ingredients}
        bunRef={bunRef}
        sauceRef={sauceRef}
        mainRef={mainRef}
        scrollContainerRef={scrollContainerRef}
      />
    </div>
  );
};
