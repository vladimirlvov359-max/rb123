import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch } from 'react-redux';

import { closeIngredientModal } from '@services/ingredient_detailsSlice.js';
import { closeOrderModal } from '@services/order_slice.js';

import styles from './modal-overlay.module.css';

export default function ModalOverlay({ children, type = 'ingredient' }) {
  const modalRef = useRef(null);
  const dispatch = useDispatch();

  const closeModal = () => {
    if (type === 'ingredient') {
      dispatch(closeIngredientModal());
    } else if (type === 'order') {
      dispatch(closeOrderModal());
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dispatch, type]);

  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeModal();
    }
  };

  const modalsContainer = document.getElementById('modals');

  if (!modalsContainer) {
    return null;
  }

  return createPortal(
    <div className={styles.main} onClick={handleOverlayClick}>
      <div className={styles.modalContent} ref={modalRef}>
        {children}
        <button className={styles.closeButton} onClick={closeModal}>
          ×
        </button>
      </div>
    </div>,
    modalsContainer
  );
}
