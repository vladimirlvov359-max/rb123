// src/pages/ingredient_page.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';

import IngredientDetails from '@components/Modal/ingredient-details';
import { setCurrentIngredient } from '@services/ingredient_detailsSlice.js';
import { fetchIngredients } from '@services/ingredients_slice.js';

import styles from './ingredient_page.module.css';

export default function Ingredient_page() {
  const location = useLocation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const {
    items: ingredients,
    loading,
    error,
  } = useSelector((state) => state.ingredients);
  const ingredient = ingredients?.find((ing) => ing._id === id) || null;

  useEffect(() => {
    dispatch(setCurrentIngredient(ingredient));
  }, [dispatch, ingredient]);

  useEffect(() => {
    if (
      !ingredients ||
      ingredients.length === 0 ||
      !ingredients.some((ing) => ing._id === id)
    ) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients, id]);

  if (location.state?.background) {
    return null;
  }

  if (loading) return <div className={styles.center}>Загрузка...</div>;
  if (error)
    return <div className={styles.center + ' ' + styles.error}>Ошибка: {error}</div>;
  if (!ingredient)
    return (
      <div className={styles.center + ' ' + styles.error}>Ингредиент не найден</div>
    );

  return (
    <div className={styles.container}>
      <IngredientDetails />
    </div>
  );
}
