import { expect, test, describe } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import stellarBurgerSlice, {
  addIngredient,
  closeModal,
  closeOrderRequest,
  deleteIngredient,
  init,
  moveIngredientDown,
  moveIngredientUp,
  openModal,
  removeErrorText,
  removeOrders,
  removeUserOrders,
  setErrorText
} from '../stellarBurgerSlice';
import { mockStore, mockIngredient, mockBun } from '../mockData';

const setupTestStore = () => {
  return configureStore({
    reducer: {
      stellarBurger: stellarBurgerSlice
    },
    preloadedState: {
      stellarBurger: mockStore
    }
  });
};

describe('stellarBurgerSlice root reducer tests', () => {
  test('should return initial state when no action is provided', () => {
    const initialState = mockStore;
    const emptyAction = { type: '' };
    const result = stellarBurgerSlice(initialState, emptyAction);
    expect(result).toEqual(initialState);
  });

  test('should not mutate state when unknown action is dispatched', () => {
    const initialState = mockStore;
    const result = stellarBurgerSlice(initialState, { type: 'UNKNOWN_ACTION' });
    expect(result).toBe(initialState);
  });
});

describe('stellarBurgerSlice actions', () => {
  let store: ReturnType<typeof setupTestStore>;

  beforeEach(() => {
    store = setupTestStore();
  });

  describe('ingredient actions', () => {
    test('addIngredient should add ingredient to constructor', () => {
      const initialCount = store.getState().stellarBurger.constructorItems.ingredients.length;
      store.dispatch(addIngredient(mockIngredient));
      const newCount = store.getState().stellarBurger.constructorItems.ingredients.length;
      expect(newCount).toBe(initialCount + 1);
    });

    test('deleteIngredient should remove ingredient from constructor', () => {
      const initialCount = store.getState().stellarBurger.constructorItems.ingredients.length;
      store.dispatch(deleteIngredient(mockIngredient));
      const newCount = store.getState().stellarBurger.constructorItems.ingredients.length;
      expect(newCount).toBe(initialCount - 1);
    });

    test('moveIngredientUp should move ingredient up in the list', () => {
      const ingredients = [...store.getState().stellarBurger.constructorItems.ingredients];
      const lastIngredient = ingredients[ingredients.length - 1];
      store.dispatch(moveIngredientUp(lastIngredient));
      const updatedIngredients = store.getState().stellarBurger.constructorItems.ingredients;
      expect(updatedIngredients[updatedIngredients.length - 2]).toEqual(lastIngredient);
    });

    test('moveIngredientDown should move ingredient down in the list', () => {
      const ingredients = [...store.getState().stellarBurger.constructorItems.ingredients];
      const firstIngredient = ingredients[0];
      store.dispatch(moveIngredientDown(firstIngredient));
      const updatedIngredients = store.getState().stellarBurger.constructorItems.ingredients;
      expect(updatedIngredients[1]).toEqual(firstIngredient);
    });
  });

  describe('order actions', () => {
    test('closeOrderRequest should reset order state', () => {
      store.dispatch(closeOrderRequest());
      const state = store.getState().stellarBurger;
      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toBeNull();
      expect(state.constructorItems).toEqual({
        bun: { price: 0 },
        ingredients: []
      });
    });
  });

  describe('modal actions', () => {
    test('openModal should set isModalOpened to true', () => {
      store.dispatch(openModal());
      expect(store.getState().stellarBurger.isModalOpened).toBe(true);
    });

    test('closeModal should set isModalOpened to false', () => {
      store.dispatch(closeModal());
      expect(store.getState().stellarBurger.isModalOpened).toBe(false);
    });
  });

  describe('error actions', () => {
    test('setErrorText should update error text', () => {
      const errorMessage = 'New error message';
      store.dispatch(setErrorText(errorMessage));
      expect(store.getState().stellarBurger.errorText).toBe(errorMessage);
    });

    test('removeErrorText should clear error text', () => {
      store.dispatch(removeErrorText());
      expect(store.getState().stellarBurger.errorText).toBe('');
    });
  });

  describe('data management actions', () => {
    test('init should set isInit to true', () => {
      store.dispatch(init());
      expect(store.getState().stellarBurger.isInit).toBe(true);
    });

    test('removeOrders should clear orders list', () => {
      const initialCount = store.getState().stellarBurger.orders.length;
      store.dispatch(removeOrders());
      expect(store.getState().stellarBurger.orders.length).toBe(0);
      expect(initialCount).toBeGreaterThan(0);
    });

    test('removeUserOrders should clear user orders', () => {
      store.dispatch(removeUserOrders());
      expect(store.getState().stellarBurger.userOrders).toBeNull();
    });
  });
});
