// src/components/Modal/ModalRoot.jsx
import { useDispatch, useSelector } from 'react-redux';

import { closeIngredientModal } from '@services/ingredient_detailsSlice';
import { closeOrderModal } from '@services/order_slice';

import IngredientDetails from './ingredient-details';
import Modal from './Modal';
import OrderDetails from './order-details';

export default function ModalRoot() {
  const dispatch = useDispatch();

  const { currentIngredient, isModalOpen: isIngredientModalOpen } = useSelector(
    (state) => state.ingredientDetails
  );
  const { isModalOpen: isOrderModalOpen } = useSelector((state) => state.order);

  const handleIngredientClose = () => dispatch(closeIngredientModal());
  const handleOrderClose = () => dispatch(closeOrderModal());

  if (isIngredientModalOpen && currentIngredient) {
    return (
      <Modal onClose={handleIngredientClose}>
        <IngredientDetails />
      </Modal>
    );
  }

  if (isOrderModalOpen) {
    return (
      <Modal onClose={handleOrderClose}>
        <OrderDetails />
      </Modal>
    );
  }

  return null;
}
