import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { BASE_URL } from '../utils/api';

export const createOrder = createAsyncThunk(
  'order/create',
  async (ingredientIds, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: ingredientIds }),
      });

      if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
      const data = await response.json();
      if (!data.success) throw new Error('Ошибка API');

      return data.order;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  currentOrder: null,
  orderNumber: null,
  loading: false,
  error: null,
  success: false,
  isModalOpen: false,
};

const privateReducers = {
  setCurrentOrder: (state, action) => {
    state.currentOrder = action.payload;
  },
  setOrderNumber: (state, action) => {
    state.orderNumber = action.payload;
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
  setIsModalOpen: (state, action) => {
    state.isModalOpen = action.payload;
  },
};

const order_slice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: {
      reducer: (state) => {
        privateReducers.setCurrentOrder(state, { payload: null });
        privateReducers.setOrderNumber(state, { payload: null });
        privateReducers.setError(state, { payload: null });
        privateReducers.setSuccess(state, { payload: false });
      },
      prepare: () => ({}),
    },

    openOrderModal: {
      reducer: (state) => {
        privateReducers.setIsModalOpen(state, { payload: true });
      },
      prepare: () => ({}),
    },

    closeOrderModal: {
      reducer: (state) => {
        privateReducers.setIsModalOpen(state, { payload: false });
      },
      prepare: () => ({}),
    },

    clearOrderError: {
      reducer: (state) => {
        privateReducers.setError(state, { payload: null });
      },
      prepare: () => ({}),
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        privateReducers.setLoading(state, { payload: true });
        privateReducers.setError(state, { payload: null });
        privateReducers.setSuccess(state, { payload: false });
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        privateReducers.setLoading(state, { payload: false });
        privateReducers.setCurrentOrder(state, { payload: action.payload });
        privateReducers.setOrderNumber(state, { payload: action.payload.number });
        privateReducers.setSuccess(state, { payload: true });

        privateReducers.setIsModalOpen(state, { payload: true });
      })
      .addCase(createOrder.rejected, (state, action) => {
        privateReducers.setLoading(state, { payload: false });
        privateReducers.setError(state, { payload: action.payload });
        privateReducers.setSuccess(state, { payload: false });
      });
  },
});

export const { clearOrder, openOrderModal, closeOrderModal, clearOrderError } =
  order_slice.actions;

export default order_slice.reducer;
