// src/components/Modal/ModalRoot.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  closeIngredientModal,
  openIngredientModal,
} from '@services/ingredient_detailsSlice';
import { closeOrderModal } from '@services/order_slice';

import IngredientDetails from './ingredient-details';
import Modal from './modal.jsx';
import OrderDetails from './order-details';

export default function ModalRoot() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { currentIngredient, isModalOpen: isIngredientModalOpen } = useSelector(
    (state) => state.ingredientDetails
  );
  const { isModalOpen: isOrderModalOpen } = useSelector((state) => state.order);

  useEffect(() => {
    if (!isIngredientModalOpen) {
      const storedData = sessionStorage.getItem('ingredientModalData');
      if (storedData) {
        const ingredient = JSON.parse(storedData);

        dispatch(openIngredientModal(ingredient));
      }
    }
  }, [dispatch, isIngredientModalOpen]);

  const handleIngredientClose = () => {
    sessionStorage.removeItem('ingredientModalData');
    if (location.state?.background) {
      navigate(location.state.background, { replace: true });
    } else {
      navigate(-1, { replace: true });
    }
    dispatch(closeIngredientModal());
  };

  const handleOrderClose = () => {
    dispatch(closeOrderModal());
  };

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
