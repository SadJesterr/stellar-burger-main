import {
  TIngredient,
  TIngredientUnique,
  TOrder,
  TUser
} from '@utils-types';

// Базовые данные для ингредиентов
const baseIngredients: TIngredient[] = [
  {
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
  },
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  }
];

// заказы
const baseOrders: TOrder[] = [
  {
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
  },
  {
    _id: '664e85e497ede0001d06bda7',
    ingredients: [
      '643d69a5c3f7b9001cfa093d',
      '643d69a5c3f7b9001cfa093d',
      '643d69a5c3f7b9001cfa093e'
    ],
    status: 'done',
    name: 'Флюоресцентный люминесцентный бургер',
    createdAt: '2024-05-22T23:55:16.472Z',
    updatedAt: '2024-05-22T23:55:16.866Z',
    number: 40679
  }
];

// пользователь
const baseUser: TUser = {
  name: 'testUser',
  email: 'test@mail.com'
};

// Генератор уникальных ингредиентов для конструктора
const generateConstructorIngredients = (count: number): TIngredientUnique[] => {
  return Array.from({ length: count }, (_, i) => ({
    ...baseIngredients[1],
    uniqueId: `test_id_${i + 1}`
  }));
};

// Основной store
export const mockStore = {
  ingredients: baseIngredients,
  loading: false,
  orderModalData: {
    ...baseOrders[0],
    ingredients: ['testid1', 'testid2'],
    _id: '664e973297ede0001d06bdbe',
    number: 40682
  },
  constructorItems: {
    bun: baseIngredients[0],
    ingredients: generateConstructorIngredients(3)
  },
  orderRequest: false,
  user: baseUser,
  orders: baseOrders,
  totalOrders: 1000,
  ordersToday: 20,
  userOrders: [
    ...baseOrders,
    {
      ...baseOrders[0],
      _id: '6627770797ede0001d067400',
      number: 38671,
      createdAt: '2024-04-23T08:53:27.817Z',
      updatedAt: '2024-04-23T08:53:28.481Z'
    }
  ],
  isAuthenticated: true,
  isInit: false,
  isModalOpened: false,
  errorText: 'test error text'
};

// Отдельные ингредиенты для тестов
export const mockIngredient: TIngredientUnique = {
  ...baseIngredients[1],
  uniqueId: 'test_id_1'
};

export const mockBun: TIngredient = baseIngredients[0];
