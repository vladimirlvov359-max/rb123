// order_slice.test.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { request } from '@utils/api';

import { clearConstructor } from './constructor_slice';
import orderReducer, {
  clearOrder,
  clearOrderError,
  closeOrderModal,
  createOrder,
  openOrderModal,
} from './order_slice';

import type { Order, OrderState } from './order_slice';

// Мокаем внешние зависимости
vi.mock('@utils/api');
vi.mock('./constructor_slice');

const mockedRequest = vi.mocked(request);
const mockedClearConstructor = vi.mocked(clearConstructor);

describe('Order Slice', () => {
  // ✅ ПЕРЕНЕСЕНО СЮДА: теперь доступно во всех nested describe
  const ingredientIds = ['ing-1', 'ing-2', 'ing-3'];

  const mockOrder: Order = {
    _id: 'order-123',
    number: 12345,
    status: 'done',
    name: 'Бургер №12345',
    createdAt: '2024-01-01T12:00:00.000Z',
    updatedAt: '2024-01-01T12:05:00.000Z',
    ingredients: ['ing-1', 'ing-2'],
  };

  const initialState: OrderState = {
    currentOrder: null,
    orderNumber: null,
    loading: false,
    error: null,
    success: false,
    isModalOpen: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial state', () => {
    it('should return initial state when undefined state passed', () => {
      const result = orderReducer(undefined, { type: 'UNKNOWN' });
      expect(result).toEqual(initialState);
    });
  });

  describe('Sync reducers', () => {
    describe('clearOrder', () => {
      it('should clear order data but preserve modal state', () => {
        const stateWithData: OrderState = {
          ...initialState,
          currentOrder: mockOrder,
          orderNumber: 12345,
          success: true,
          error: 'Some error',
          isModalOpen: true,
        };

        const result = orderReducer(stateWithData, clearOrder());

        expect(result.currentOrder).toBeNull();
        expect(result.orderNumber).toBeNull();
        expect(result.error).toBeNull();
        expect(result.success).toBe(false);
        expect(result.isModalOpen).toBe(true);
        expect(result.loading).toBe(false);
      });

      it('should handle when already cleared', () => {
        const result = orderReducer(initialState, clearOrder());
        expect(result).toEqual(initialState);
      });
    });

    describe('openOrderModal / closeOrderModal', () => {
      it('should open modal', () => {
        const result = orderReducer(initialState, openOrderModal());
        expect(result.isModalOpen).toBe(true);
      });

      it('should close modal', () => {
        const stateWithOpenModal: OrderState = {
          ...initialState,
          isModalOpen: true,
        };

        const result = orderReducer(stateWithOpenModal, closeOrderModal());
        expect(result.isModalOpen).toBe(false);
      });

      it('should not affect order data', () => {
        const stateWithData: OrderState = {
          ...initialState,
          currentOrder: mockOrder,
          orderNumber: 12345,
        };

        const result = orderReducer(stateWithData, openOrderModal());
        expect(result.currentOrder).toEqual(mockOrder);
        expect(result.orderNumber).toBe(12345);
        expect(result.isModalOpen).toBe(true);
      });
    });

    describe('clearOrderError', () => {
      it('should clear error without affecting other state', () => {
        const stateWithError: OrderState = {
          ...initialState,
          error: 'Failed to create order',
          loading: true,
          currentOrder: mockOrder,
        };

        const result = orderReducer(stateWithError, clearOrderError());

        expect(result.error).toBeNull();
        expect(result.loading).toBe(true);
        expect(result.currentOrder).toEqual(mockOrder);
      });

      it('should handle when error is already null', () => {
        const result = orderReducer(initialState, clearOrderError());
        expect(result.error).toBeNull();
      });
    });
  });

  describe('createOrder async thunk', () => {
    describe('pending state', () => {
      it('should set loading true and clear error', () => {
        const action = createOrder.pending('requestId', ingredientIds);
        const result = orderReducer(initialState, action);

        expect(result.loading).toBe(true);
        expect(result.error).toBeNull();
        expect(result.success).toBe(false);
      });

      it('should preserve existing order data during loading', () => {
        const stateWithOrder: OrderState = {
          ...initialState,
          currentOrder: mockOrder,
          orderNumber: 12345,
        };

        const action = createOrder.pending('requestId', ingredientIds);
        const result = orderReducer(stateWithOrder, action);

        expect(result.loading).toBe(true);
        expect(result.currentOrder).toEqual(mockOrder);
        expect(result.orderNumber).toBe(12345);
      });
    });

    describe('fulfilled state', () => {
      it('should set order data, open modal and set success', () => {
        const action = createOrder.fulfilled(mockOrder, 'requestId', ingredientIds);
        const result = orderReducer(initialState, action);

        expect(result.loading).toBe(false);
        expect(result.currentOrder).toEqual(mockOrder);
        expect(result.orderNumber).toBe(12345);
        expect(result.success).toBe(true);
        expect(result.isModalOpen).toBe(true);
      });

      it('should replace existing order with new one', () => {
        const oldOrder: Order = { ...mockOrder, _id: 'old', number: 999 };
        const oldState: OrderState = {
          ...initialState,
          currentOrder: oldOrder,
          orderNumber: 999,
        };

        const action = createOrder.fulfilled(mockOrder, 'requestId', ingredientIds);
        const result = orderReducer(oldState, action);

        expect(result.currentOrder).toEqual(mockOrder);
        expect(result.orderNumber).toBe(12345);
      });
    });

    describe('rejected state', () => {
      it('should set error message and loading false', () => {
        const error = 'Order creation failed';
        const action = createOrder.rejected(
          new Error(error),
          'requestId',
          ingredientIds,
          error
        );
        const result = orderReducer(initialState, action);

        expect(result.loading).toBe(false);
        expect(result.error).toBe(error);
        expect(result.success).toBe(false);
      });

      it('should handle undefined error payload', () => {
        const action = createOrder.rejected(
          new Error('test'),
          'requestId',
          ingredientIds,
          undefined
        );
        const result = orderReducer(initialState, action);

        expect(result.error).toBe('Неизвестная ошибка');
      });

      it('should not open modal on error', () => {
        const action = createOrder.rejected(
          new Error('Error'),
          'requestId',
          ingredientIds,
          'Error'
        );
        const result = orderReducer(initialState, action);

        expect(result.isModalOpen).toBe(false);
      });
    });

    describe('integration with mocked dependencies', () => {
      it('should have correct thunk config (state type for auth token)', () => {
        expect(createOrder.typePrefix).toBe('order/create');
      });

      it('should return fulfilled action with order payload', () => {
        const action = createOrder.fulfilled(mockOrder, 'req', ingredientIds);

        expect(action.type).toBe('order/create/fulfilled');
        expect(action.payload).toEqual(mockOrder);
        expect(action.meta.arg).toEqual(ingredientIds);
      });

      it('should return rejected action with error payload', () => {
        const errorMsg = 'Network error';
        const action = createOrder.rejected(
          new Error(errorMsg),
          'req',
          ingredientIds,
          errorMsg
        );

        expect(action.type).toBe('order/create/rejected');
        expect(action.payload).toBe(errorMsg);
      });
    });
  });

  describe('Complex state transitions', () => {
    it('should handle full order creation flow: pending → fulfilled', () => {
      let state = initialState;

      state = orderReducer(state, createOrder.pending('req1', ingredientIds));
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();

      const fulfilledAction = createOrder.fulfilled(mockOrder, 'req1', ingredientIds);
      state = orderReducer(state, fulfilledAction);

      expect(state.loading).toBe(false);
      expect(state.currentOrder).toEqual(mockOrder);
      expect(state.orderNumber).toBe(12345);
      expect(state.success).toBe(true);
      expect(state.isModalOpen).toBe(true);
    });

    it('should handle order creation error flow', () => {
      let state = initialState;

      state = orderReducer(state, createOrder.pending('req1', ingredientIds));
      expect(state.loading).toBe(true);

      const rejectedAction = createOrder.rejected(
        new Error('Failed'),
        'req1',
        ingredientIds,
        'Failed'
      );
      state = orderReducer(state, rejectedAction);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Failed');
      expect(state.success).toBe(false);
      expect(state.isModalOpen).toBe(false);
    });

    it('should handle clearOrder after successful creation', () => {
      let state = initialState;

      state = orderReducer(
        state,
        createOrder.fulfilled(mockOrder, 'req', ingredientIds)
      );
      expect(state.success).toBe(true);
      expect(state.isModalOpen).toBe(true);

      state = orderReducer(state, clearOrder());
      expect(state.currentOrder).toBeNull();
      expect(state.success).toBe(false);
      expect(state.isModalOpen).toBe(true);
    });

    it('should handle retry after error', () => {
      let state = initialState;

      state = orderReducer(
        state,
        createOrder.rejected(new Error('Error'), 'req1', ingredientIds, 'Error')
      );
      expect(state.error).toBe('Error');

      state = orderReducer(state, createOrder.pending('req2', ingredientIds));
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();

      state = orderReducer(
        state,
        createOrder.fulfilled(mockOrder, 'req2', ingredientIds)
      );
      expect(state.success).toBe(true);
    });
  });

  describe('Edge cases', () => {
    it('should handle order with minimal fields', () => {
      const minimalOrder: Order = {
        _id: 'min',
        number: 1,
      };

      const action = createOrder.fulfilled(minimalOrder, 'req', ingredientIds);
      const result = orderReducer(initialState, action);

      expect(result.currentOrder).toEqual(minimalOrder);
      expect(result.orderNumber).toBe(1);
    });

    it('should handle order with extra fields', () => {
      const extendedOrder: Order = {
        ...mockOrder,
        customField: 'custom',
        nested: { deep: 'value' },
      };

      const action = createOrder.fulfilled(extendedOrder, 'req', ingredientIds);
      const result = orderReducer(initialState, action);

      expect(result.currentOrder).toEqual(extendedOrder);
    });

    it('should maintain immutability', () => {
      const originalState = { ...initialState };
      const action = createOrder.fulfilled(mockOrder, 'req', ingredientIds);
      const result = orderReducer(originalState, action);

      expect(result).not.toBe(originalState);
      expect(originalState.currentOrder).toBeNull();
    });

    it('should handle empty ingredientIds array', () => {
      const action = createOrder.pending('req', []);
      const result = orderReducer(initialState, action);

      expect(result.loading).toBe(true);
    });
  });

  describe('Modal state management', () => {
    it('should open modal only on fulfilled, not on pending/rejected', () => {
      let state = orderReducer(initialState, createOrder.pending('req', ingredientIds));
      expect(state.isModalOpen).toBe(false);

      state = orderReducer(
        initialState,
        createOrder.rejected(new Error('Err'), 'req', ingredientIds, 'Err')
      );
      expect(state.isModalOpen).toBe(false);

      state = orderReducer(
        initialState,
        createOrder.fulfilled(mockOrder, 'req', ingredientIds)
      );
      expect(state.isModalOpen).toBe(true);
    });

    it('should allow manual modal control via open/close actions', () => {
      let state = orderReducer(initialState, openOrderModal());
      expect(state.isModalOpen).toBe(true);

      state = orderReducer(state, closeOrderModal());
      expect(state.isModalOpen).toBe(false);
    });

    it('should preserve modal state when clearing order', () => {
      let state = orderReducer(
        initialState,
        createOrder.fulfilled(mockOrder, 'req', ingredientIds)
      );
      expect(state.isModalOpen).toBe(true);

      state = orderReducer(state, clearOrder());
      expect(state.isModalOpen).toBe(true);
    });
  });
});
