const API_URL = Cypress.env('BURGER_API_URL');

// Константы для селекторов
const SELECTORS = {
  NO_BUN_TEXT_1: '[data-cy=no_bun_text_1]',
  NO_BUN_TEXT_2: '[data-cy=no_bun_text_2]',
  NO_INGREDIENTS_TEXT: '[data-cy=no_ingredients_text]',
  BUN: '[data-cy=bun_0] button',
  INGREDIENT: '[data-cy=ingredient_0] button',
  CONSTRUCTOR_SECTION: '[data-cy=constructor_section]',
  INGREDIENT_ELEMENT: '[data-cy=ingredient_element]',
  INGREDIENT_MODAL: '[data-cy=ingredient_modal]',
  CLOSE_MODAL_BTN: '[data-cy=close_modal_btn]',
  NEW_ORDER_TOTAL: '[data-cy=new_order_total] button',
  NEW_ORDER_NUMBER: '[data-cy=new_order_number]'
};

// Хелперы для тестов
const setupAuth = () => {
  window.localStorage.setItem('refreshToken', 'testRefreshToken');
  cy.setCookie('accessToken', 'testAccessToken');
};

const setupIntercepts = () => {
  cy.fixture('ingredients.json').then((ingredients) => {
    cy.intercept('GET', `${API_URL}/ingredients`, ingredients).as('getIngredients');
  });

  cy.fixture('orders.json').then((orders) => {
    cy.intercept('GET', `${API_URL}/orders/all`, orders).as('getOrders');
  });

  cy.fixture('user.json').then((user) => {
    cy.intercept('GET', `${API_URL}/auth/user`, user).as('getUser');
  });
};

const checkEmptyConstructor = () => {
  cy.get(SELECTORS.NO_BUN_TEXT_1).should('contain', 'Выберите булки');
  cy.get(SELECTORS.NO_BUN_TEXT_2).should('contain', 'Выберите булки');
  cy.get(SELECTORS.NO_INGREDIENTS_TEXT).should('contain', 'Выберите начинку');
};

// Тесты
describe('Burger Constructor E2E Tests', () => {
  beforeEach(() => {
    setupAuth();
    setupIntercepts();
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    cy.clearAllCookies();
    cy.clearAllLocalStorage();
  });

  it('should be available at localhost:4000', () => {
    cy.url().should('include', 'localhost:4000');
  });

  describe('Constructor Functionality', () => {
    it('should allow adding buns and ingredients', () => {
      checkEmptyConstructor();

      // Добавляем булку и ингредиенты
      cy.get(SELECTORS.BUN).click();
      cy.get(SELECTORS.INGREDIENT).click();

      // Проверяем что добавлено
      cy.get(SELECTORS.CONSTRUCTOR_SECTION).should('contain', 'булка');
      cy.get(SELECTORS.INGREDIENT_ELEMENT).should('exist');
    });

    it('should open and close ingredient modal', () => {
      cy.get(SELECTORS.BUN.replace(' button', '')).click();
      cy.get(SELECTORS.INGREDIENT_MODAL).should('be.visible');
      cy.get(SELECTORS.CLOSE_MODAL_BTN).click();
      cy.get(SELECTORS.INGREDIENT_MODAL).should('not.exist');
    });
  });

  describe('Order Creation', () => {
    it('should create new order and reset constructor', () => {
      // Добавляем ингредиенты
      cy.get(SELECTORS.BUN).click();
      cy.get(SELECTORS.INGREDIENT).click();

      // Мокаем ответ на создание заказа
      cy.fixture('newOrder.json').then((newOrder) => {
        cy.intercept('POST', `${API_URL}/orders`, newOrder).as('createOrder');

        // Создаем заказ
        cy.get(SELECTORS.NEW_ORDER_TOTAL).click();

        // Проверяем номер заказа
        cy.get(SELECTORS.NEW_ORDER_NUMBER).should('contain', newOrder.order.number);

        // Закрываем модалку
        cy.get(SELECTORS.CLOSE_MODAL_BTN).click();

        // Проверяем что конструктор очистился
        checkEmptyConstructor();
      });
    });
  });
});

// Обработка неотловленных исключений
Cypress.on('uncaught:exception', () => false);
