import { expect, test, describe } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import stellarBurgerSlice, {
  selectConstructorItems,
  selectErrorText,
  selectIngredients,
  selectIsAuthenticated,
  selectIsInit,
  selectIsModalOpened,
  selectLoading,
  selectOrderModalData,
  selectOrderRequest,
  selectOrders,
  selectTodayOrders,
  selectTotalOrders,
  selectUser,
  selectUserOrders
} from '../stellarBurgerSlice';
import { mockStore } from '../mockData';

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

describe('stellarBurgerSlice selectors', () => {
  let store: ReturnType<typeof setupTestStore>;

  beforeEach(() => {
    store = setupTestStore();
  });

  test('selectUser should return user data', () => {
    const user = selectUser(store.getState());
    expect(user).toEqual({
      name: 'testUser',
      email: 'test@mail.com'
    });
  });

  test('selectIsAuthenticated should return authentication status', () => {
    const isAuthenticated = selectIsAuthenticated(store.getState());
    expect(isAuthenticated).toBe(true);
  });

  test('selectLoading should return loading status', () => {
    const loading = selectLoading(store.getState());
    expect(loading).toBe(false);
  });

  test('selectErrorText should return error message', () => {
    const errorText = selectErrorText(store.getState());
    expect(errorText).toBe('test error text');
  });

  test('selectIsInit should return initialization status', () => {
    const isInit = selectIsInit(store.getState());
    expect(isInit).toBe(false);
  });

  test('selectIsModalOpened should return modal status', () => {
    const isModalOpened = selectIsModalOpened(store.getState());
    expect(isModalOpened).toBe(false);
  });

  test('selectOrderRequest should return order request status', () => {
    const orderRequest = selectOrderRequest(store.getState());
    expect(orderRequest).toBe(false);
  });

  test('selectIngredients should return ingredients list', () => {
    const ingredients = selectIngredients(store.getState());
    expect(ingredients).toEqual(mockStore.ingredients);
  });

  test('selectConstructorItems should return constructor items', () => {
    const constructorItems = selectConstructorItems(store.getState());
    expect(constructorItems).toEqual(mockStore.constructorItems);
  });

  test('selectOrderModalData should return order modal data', () => {
    const orderModalData = selectOrderModalData(store.getState());
    expect(orderModalData).toEqual(mockStore.orderModalData);
  });

  test('selectOrders should return orders list', () => {
    const orders = selectOrders(store.getState());
    expect(orders).toEqual(mockStore.orders);
  });

  test('selectUserOrders should return user orders', () => {
    const userOrders = selectUserOrders(store.getState());
    expect(userOrders).toEqual(mockStore.userOrders);
  });

  test('selectTotalOrders should return total orders count', () => {
    const totalOrders = selectTotalOrders(store.getState());
    expect(totalOrders).toBe(1000);
  });

  test('selectTodayOrders should return today orders count', () => {
    const todayOrders = selectTodayOrders(store.getState());
    expect(todayOrders).toBe(20);
  });
});
