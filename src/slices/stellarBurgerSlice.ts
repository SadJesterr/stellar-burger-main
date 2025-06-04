import {
  TLoginData,
  TRegisterData,
  getFeedsApi,
  getIngredientsApi,
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  orderBurgerApi,
  registerUserApi,
  updateUserApi
} from '../utils/burger-api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  TConstructorItems,
  TIngredient,
  TIngredientUnique,
  TOrder,
  TUser
} from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

// Типы и интерфейсы
type TInitialState = {
  ingredients: TIngredient[];
  loading: boolean;
  orderModalData: TOrder | null;
  constructorItems: TConstructorItems;
  orderRequest: boolean;
  user: TUser;
  orders: TOrder[];
  totalOrders: number;
  ordersToday: number;
  userOrders: TOrder[] | null;
  isAuthenticated: boolean;
  isInit: boolean;
  isModalOpened: boolean;
  errorText: string;
};

// Начальное состояние
export const initialState: TInitialState = {
  ingredients: [],
  loading: false,
  orderModalData: null,
  constructorItems: {
    bun: { price: 0 },
    ingredients: []
  },
  orderRequest: false,
  user: { name: '', email: '' },
  orders: [],
  totalOrders: 0,
  ordersToday: 0,
  userOrders: null,
  isAuthenticated: false,
  isInit: false,
  isModalOpened: false,
  errorText: ''
};

// Асинхронные действия
export const fetchIngredients = createAsyncThunk(
  'ingredients/getAll',
  getIngredientsApi
);

export const fetchNewOrder = createAsyncThunk(
  'orders/newOrder',
  orderBurgerApi
);

export const fetchLoginUser = createAsyncThunk(
  'user/login',
  loginUserApi
);

export const fetchRegisterUser = createAsyncThunk(
  'user/register',
  registerUserApi
);

export const getUserThunk = createAsyncThunk('user/get', getUserApi);
export const fetchFeed = createAsyncThunk('user/feed', getFeedsApi);
export const fetchUserOrders = createAsyncThunk('user/orders', getOrdersApi);
export const fetchLogout = createAsyncThunk('user/logout', logoutApi);

export const fetchUpdateUser = createAsyncThunk(
  'user/update',
  updateUserApi
);

// Создание слайса
const stellarBurgerSlice = createSlice({
  name: 'stellarBurger',
  initialState,
  reducers: {
    // Конструктор бургера
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      action.payload.type === 'bun'
        ? (state.constructorItems.bun = action.payload)
        : state.constructorItems.ingredients.push({
          ...action.payload,
          uniqueId: uuidv4()
        });
    },
    deleteIngredient: (state, action: PayloadAction<TIngredientUnique>) => {
      state.constructorItems.ingredients = state.constructorItems.ingredients.filter(
        (item) => item.uniqueId !== action.payload.uniqueId
      );
    },
    moveIngredientUp: (state, action: PayloadAction<TIngredientUnique>) => {
      const index = state.constructorItems.ingredients.findIndex(
        (item) => item.uniqueId === action.payload.uniqueId
      );
      if (index > 0) {
        [state.constructorItems.ingredients[index], state.constructorItems.ingredients[index - 1]] =
          [state.constructorItems.ingredients[index - 1], state.constructorItems.ingredients[index]];
      }
    },
    moveIngredientDown: (state, action: PayloadAction<TIngredientUnique>) => {
      const index = state.constructorItems.ingredients.findIndex(
        (item) => item.uniqueId === action.payload.uniqueId
      );
      if (index < state.constructorItems.ingredients.length - 1) {
        [state.constructorItems.ingredients[index], state.constructorItems.ingredients[index + 1]] =
          [state.constructorItems.ingredients[index + 1], state.constructorItems.ingredients[index]];
      }
    },

    // Заказы
    closeOrderRequest: (state) => {
      state.orderRequest = false;
      state.orderModalData = null;
      state.constructorItems = {
        bun: { price: 0 },
        ingredients: []
      };
    },
    removeOrders: (state) => {
      state.orders = [];
    },
    removeUserOrders: (state) => {
      state.userOrders = null;
    },

    // Модальные окна
    openModal: (state) => {
      state.isModalOpened = true;
    },
    closeModal: (state) => {
      state.isModalOpened = false;
    },

    // Ошибки
    setErrorText: (state, action: PayloadAction<string>) => {
      state.errorText = action.payload;
    },
    removeErrorText: (state) => {
      state.errorText = '';
    },

    // Инициализация
    init: (state) => {
      state.isInit = true;
    }
  },
  selectors: {
    selectIngredients: (state) => state.ingredients,
    selectLoading: (state) => state.loading,
    selectOrderModalData: (state) => state.orderModalData,
    selectConstructorItems: (state) => state.constructorItems,
    selectOrderRequest: (state) => state.orderRequest,
    selectUser: (state) => state.user,
    selectOrders: (state) => state.orders,
    selectTotalOrders: (state) => state.totalOrders,
    selectTodayOrders: (state) => state.ordersToday,
    selectUserOrders: (state) => state.userOrders,
    selectIsAuthenticated: (state) => state.isAuthenticated,
    selectIsInit: (state) => state.isInit,
    selectIsModalOpened: (state) => state.isModalOpened,
    selectErrorText: (state) => state.errorText
  },
  extraReducers: (builder) => {
    builder
      // Ингредиенты
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state) => {
        state.loading = false;
      })

      // Заказы
      .addCase(fetchNewOrder.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(fetchNewOrder.fulfilled, (state, action) => {
        state.orderModalData = action.payload.order;
        state.orderRequest = false;
      })
      .addCase(fetchNewOrder.rejected, (state) => {
        state.orderRequest = false;
      })

      // Аутентификация
      .addCase(fetchLoginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLoginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.errorText = '';
      })
      .addCase(fetchLoginUser.rejected, (state, action) => {
        state.loading = false;
        state.errorText = action.error.message || 'Ошибка авторизации';
      })

      // Регистрация
      .addCase(fetchRegisterUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRegisterUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.errorText = '';
      })
      .addCase(fetchRegisterUser.rejected, (state, action) => {
        state.loading = false;
        state.errorText = action.error.message || 'Ошибка регистрации';
      })

      // Получение данных пользователя
      .addCase(getUserThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(getUserThunk.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = { name: '', email: '' };
      })

      // Лента заказов
      .addCase(fetchFeed.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.totalOrders = action.payload.total;
        state.ordersToday = action.payload.totalToday;
      })
      .addCase(fetchFeed.rejected, (state) => {
        state.loading = false;
      })

      // История заказов пользователя
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state) => {
        state.loading = false;
      })

      // Выход из системы
      .addCase(fetchLogout.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLogout.fulfilled, (state) => {
        state.loading = false;
        state.user = { name: '', email: '' };
        state.isAuthenticated = false;
      })
      .addCase(fetchLogout.rejected, (state) => {
        state.loading = false;
      })

      // Обновление данных пользователя
      .addCase(fetchUpdateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUpdateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(fetchUpdateUser.rejected, (state) => {
        state.loading = false;
      });
  }
});

export const {
  addIngredient,
  closeOrderRequest,
  removeOrders,
  removeUserOrders,
  init,
  openModal,
  closeModal,
  deleteIngredient,
  setErrorText,
  removeErrorText,
  moveIngredientUp,
  moveIngredientDown
} = stellarBurgerSlice.actions;

export const {
  selectLoading,
  selectIngredients,
  selectOrderModalData,
  selectConstructorItems,
  selectOrderRequest,
  selectUser,
  selectOrders,
  selectTotalOrders,
  selectTodayOrders,
  selectUserOrders,
  selectIsAuthenticated,
  selectIsInit,
  selectIsModalOpened,
  selectErrorText
} = stellarBurgerSlice.selectors;

export default stellarBurgerSlice.reducer;
