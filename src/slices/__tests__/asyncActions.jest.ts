import { expect, test, describe } from '@jest/globals';
import stellarBurgerSlice, {
  fetchFeed,
  fetchIngredients,
  fetchLoginUser,
  fetchLogout,
  fetchNewOrder,
  fetchRegisterUser,
  fetchUpdateUser,
  fetchUserOrders,
  getUserThunk,
  initialState
} from '../stellarBurgerSlice';

describe('stellarBurgerSlice async actions', () => {
  describe('getUserThunk', () => {
    test('should set loading to true on pending', () => {
      const state = stellarBurgerSlice(initialState, getUserThunk.pending(''));
      expect(state.loading).toBe(true);
    });

    test('should set user data on fulfilled', () => {
      const mockUser = { name: 'user', email: 'user@mail.ru' };
      const state = stellarBurgerSlice(
        initialState,
        getUserThunk.fulfilled({ success: true, user: mockUser }, '')
      );
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.loading).toBe(false);
    });

    test('should reset user data on rejected', () => {
      const error = new Error('Failed to fetch user');
      const state = stellarBurgerSlice(initialState, getUserThunk.rejected(error, ''));
      expect(state.user).toEqual({ name: '', email: '' });
      expect(state.isAuthenticated).toBe(false);
      expect(state.loading).toBe(false);
    });
  });

  describe('fetchIngredients', () => {
    test('should set loading to true on pending', () => {
      const state = stellarBurgerSlice(initialState, fetchIngredients.pending(''));
      expect(state.loading).toBe(true);
    });

    test('should set ingredients on fulfilled', () => {
      const mockIngredients = [{
        _id: '643d69a5c3f7b9001cfa093c',
        name: 'Краторная булка N-200i',
        type: 'bun',
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: 'https://code.s3.yandex.net/react/code/bun-02.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
      }];
      const state = stellarBurgerSlice(
        initialState,
        fetchIngredients.fulfilled(mockIngredients, '')
      );
      expect(state.ingredients).toEqual(mockIngredients);
      expect(state.loading).toBe(false);
    });

    test('should handle error on rejected', () => {
      const error = new Error('Failed to fetch ingredients');
      const state = stellarBurgerSlice(initialState, fetchIngredients.rejected(error, ''));
      expect(state.loading).toBe(false);
    });
  });

  describe('fetchNewOrder', () => {
    test('should set orderRequest to true on pending', () => {
      const state = stellarBurgerSlice(
        initialState,
        fetchNewOrder.pending('', ['testid1', 'testid2', 'testid3'])
      );
      expect(state.orderRequest).toBe(true);
    });

    test('should set order data on fulfilled', () => {
      const mockOrderResponse = {
        success: true,
        name: 'Флюоресцентный люминесцентный бургер',
        order: {
          _id: '664e927097ede0001d06bdb9',
          ingredients: [
            '643d69a5c3f7b9001cfa093d',
            '643d69a5c3f7b9001cfa093e',
            '643d69a5c3f7b9001cfa093d'
          ],
          status: 'done',
          name: 'Флюоресцентный люминесцентный бургер',
          createdAt: '2024-05-23T00:48:48.039Z',
          updatedAt: '2024-05-23T00:48:48.410Z',
          number: 40680
        }
      };

      const state = stellarBurgerSlice(
        initialState,
        fetchNewOrder.fulfilled(mockOrderResponse, '', [''])
      );

      expect(state.orderModalData).toEqual(mockOrderResponse.order);
      expect(state.orderRequest).toBe(false);
    });

    test('should reset orderRequest on rejected', () => {
      const error = new Error('Failed to create order');
      const state = stellarBurgerSlice(initialState, fetchNewOrder.rejected(error, '', ['']));
      expect(state.orderRequest).toBe(false);
    });
  });

  describe('fetchLoginUser', () => {
  test('should set loading to true on pending', () => {
    const state = stellarBurgerSlice(
      initialState,
      fetchLoginUser.pending('', { email: 'test@mail.ru', password: 'test' })
    );
    expect(state.loading).toBe(true);
  });

  test('should set user data and auth status on fulfilled', () => {
    const mockUser = { name: 'testuser', email: 'testuser@mail.ru' };
    const mockResponse = {
      success: true,
      user: mockUser,
      accessToken: 'test-token',
      refreshToken: 'refresh-token'
    };
    
    const state = stellarBurgerSlice(
      initialState,
      fetchLoginUser.fulfilled(mockResponse, '', { email: 'test@mail.ru', password: 'test' })
    );

    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.loading).toBe(false);
  });

  test('should set error on rejected', () => {
    const error = new Error('Login failed');
    const state = stellarBurgerSlice(
      initialState,
      fetchLoginUser.rejected(error, '', { email: 'test@mail.ru', password: 'test' })
    );
    expect(state.loading).toBe(false);
    expect(state.errorText).toBe('Login failed');
  });
});


  describe('fetchRegisterUser', () => {
  test('should set loading to true on pending', () => {
    const state = stellarBurgerSlice(
      initialState,
      fetchRegisterUser.pending('', { name: 'user', email: 'test@mail.ru', password: 'test' })
    );
    expect(state.loading).toBe(true);
  });

  test('should set user data and auth status on fulfilled', () => {
    const mockUser = { name: 'newuser', email: 'newuser@mail.ru' };
    const mockResponse = {
      success: true,
      user: mockUser,
      accessToken: 'test-token',
      refreshToken: 'refresh-token'
    };
    
    const state = stellarBurgerSlice(
      initialState,
      fetchRegisterUser.fulfilled(
        mockResponse,
        '',
        { name: 'user', email: 'test@mail.ru', password: 'test' }
      )
    );

    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.loading).toBe(false);
  });

  test('should set error on rejected', () => {
    const error = new Error('Registration failed');
    const state = stellarBurgerSlice(
      initialState,
      fetchRegisterUser.rejected(error, '', { name: 'user', email: 'test@mail.ru', password: 'test' })
    );
    expect(state.loading).toBe(false);
    expect(state.errorText).toBe('Registration failed');
  });
});

  describe('fetchLogout', () => {
    test('should set loading to true on pending', () => {
      const state = stellarBurgerSlice(initialState, fetchLogout.pending(''));
      expect(state.loading).toBe(true);
    });

    test('should reset user data on fulfilled', () => {
      const state = stellarBurgerSlice(
        initialState,
        fetchLogout.fulfilled({ success: true }, '')
      );
      expect(state.user).toEqual({ name: '', email: '' });
      expect(state.isAuthenticated).toBe(false);
      expect(state.loading).toBe(false);
    });

    test('should handle error on rejected', () => {
      const error = new Error('Logout failed');
      const state = stellarBurgerSlice(initialState, fetchLogout.rejected(error, ''));
      expect(state.loading).toBe(false);
    });
  });

  describe('fetchUpdateUser', () => {
    test('should set loading to true on pending', () => {
      const state = stellarBurgerSlice(
        initialState,
        fetchUpdateUser.pending('', { name: 'updated', email: 'updated@mail.ru' })
      );
      expect(state.loading).toBe(true);
    });

    test('should update user data on fulfilled', () => {
      const updatedUser = { name: 'updated', email: 'updated@mail.ru' };
      const state = stellarBurgerSlice(
        initialState,
        fetchUpdateUser.fulfilled(
          { success: true, user: updatedUser },
          '',
          updatedUser
        )
      );
      expect(state.user).toEqual(updatedUser);
      expect(state.loading).toBe(false);
    });

    test('should handle error on rejected', () => {
      const error = new Error('Update failed');
      const state = stellarBurgerSlice(
        initialState,
        fetchUpdateUser.rejected(error, '', { name: 'test', email: 'test@mail.ru' })
      );
      expect(state.loading).toBe(false);
    });
  });

  describe('fetchFeed', () => {
    test('should set loading to true on pending', () => {
      const state = stellarBurgerSlice(initialState, fetchFeed.pending(''));
      expect(state.loading).toBe(true);
    });

    test('should set feed data on fulfilled', () => {
      const mockFeed = {
        success: true,
        orders: [],
        total: 100,
        totalToday: 10
      };
      const state = stellarBurgerSlice(
        initialState,
        fetchFeed.fulfilled(mockFeed, '')
      );
      expect(state.orders).toEqual(mockFeed.orders);
      expect(state.totalOrders).toBe(mockFeed.total);
      expect(state.ordersToday).toBe(mockFeed.totalToday);
      expect(state.loading).toBe(false);
    });

    test('should handle error on rejected', () => {
      const error = new Error('Failed to fetch feed');
      const state = stellarBurgerSlice(initialState, fetchFeed.rejected(error, ''));
      expect(state.loading).toBe(false);
    });
  });

  describe('fetchUserOrders', () => {
    test('should set loading to true on pending', () => {
      const state = stellarBurgerSlice(initialState, fetchUserOrders.pending(''));
      expect(state.loading).toBe(true);
    });

    test('should set user orders on fulfilled', () => {
      const mockOrders = [{
        _id: '1',
        ingredients: [],
        status: 'done',
        name: 'Order 1',
        number: 1,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      }];
      const state = stellarBurgerSlice(
        initialState,
        fetchUserOrders.fulfilled(mockOrders, '')
      );
      expect(state.userOrders).toEqual(mockOrders);
      expect(state.loading).toBe(false);
    });

    test('should handle error on rejected', () => {
      const error = new Error('Failed to fetch user orders');
      const state = stellarBurgerSlice(initialState, fetchUserOrders.rejected(error, ''));
      expect(state.loading).toBe(false);
    });
  });
});
