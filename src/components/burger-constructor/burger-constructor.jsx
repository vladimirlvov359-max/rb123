import {
  Button,
  ConstructorElement,
  CurrencyIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';

import { BurgerFilling } from '@components/burger-constructor/burger-filling/burger-filling.jsx';
import Modal from '@components/Modal/Modal.jsx';
import OrderDetails from '@components/Modal/order-details.jsx';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = ({ ingredients }) => {
  console.log(ingredients);
  const image = 'https://code.s3.yandex.net/react/code/bun-02.png';
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getModalOverlay = () => {
    setIsModalOpen(true);
  };

  return (
    <section className={styles.burger_constructor}>
      <div className={styles.slice}>
        <div className={styles.bunRow}>
          <div className={styles.placeholder}></div>
          <ConstructorElement
            type="top"
            isLocked={true}
            text="Краторная булка N-200i (верх)"
            price={200}
            thumbnail={image}
          />
        </div>

        <div className={styles.scrollableArea}>
          <BurgerFilling ingredients={ingredients} />
        </div>

        {/* Нижняя булка */}
        <div className={styles.bunRow}>
          <div className={styles.placeholder}></div>
          <ConstructorElement
            type="bottom"
            isLocked={true}
            text="Краторная булка N-200i (низ)"
            price={200}
            thumbnail={image}
          />
        </div>
      </div>

      <div className={styles.price_button}>
        <div className="text text_type_digits-medium">
          610 <CurrencyIcon type="primary" className={styles.largeIcon} />
        </div>
        <Button htmlType="button" type="primary" size="large" onClick={getModalOverlay}>
          оформить заказ
        </Button>
      </div>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <OrderDetails />
        </Modal>
      )}
    </section>
  );
};
