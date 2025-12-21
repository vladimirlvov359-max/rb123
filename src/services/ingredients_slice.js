import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { BASE_URL } from '../utils/api';

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/ingredients`);

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error('Ошибка API');
      }

      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  bun: [],
  sauce: [],
  main: [],
  loading: false,
  error: null,
  success: false,
};

const privateReducers = {
  setItems: (state, action) => {
    state.items = action.payload;
  },
  setBun: (state, action) => {
    state.bun = action.payload;
  },
  setSauce: (state, action) => {
    state.sauce = action.payload;
  },
  setMain: (state, action) => {
    state.main = action.payload;
  },
  setLoading: (state, action) => {
    state.loading = action.payload;
  },
  setError: (state, action) => {
    state.error = action.payload;
  },
  setSuccess: (state, action) => {
    state.success = action.payload;
  },
};

const ingredients_slice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setIngredients: {
      reducer: (state, action) => {
        const items = action.payload;
        privateReducers.setItems(state, { payload: items });
        privateReducers.setBun(state, {
          payload: items.filter((i) => i.type === 'bun'),
        });
        privateReducers.setSauce(state, {
          payload: items.filter((i) => i.type === 'sauce'),
        });
        privateReducers.setMain(state, {
          payload: items.filter((i) => i.type === 'main'),
        });
        privateReducers.setLoading(state, { payload: false });
        privateReducers.setError(state, { payload: null });
        privateReducers.setSuccess(state, { payload: true });
      },

      prepare: (payload) => ({ payload }),
    },

    clearIngredientsError: {
      reducer: (state) => {
        privateReducers.setError(state, { payload: null });
      },
      prepare: () => ({}),
    },

    resetIngredients: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        privateReducers.setLoading(state, { payload: true });
        privateReducers.setError(state, { payload: null });
        privateReducers.setSuccess(state, { payload: false });
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        ingredients_slice.caseReducers.setIngredients(state, {
          payload: action.payload,
        });
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        privateReducers.setLoading(state, { payload: false });
        privateReducers.setError(state, { payload: action.payload });
        privateReducers.setSuccess(state, { payload: false });
      });
  },
});

export const { setIngredients, clearIngredientsError, resetIngredients } =
  ingredients_slice.actions;

export default ingredients_slice.reducer;
