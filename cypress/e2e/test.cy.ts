const API_URL = Cypress.env('BURGER_API_URL');

Cypress.on('uncaught:exception', () => false);

beforeEach(() => {
  // Очистка хранилища и установка токенов
  cy.clearAllCookies();
  cy.clearAllLocalStorage();
  window.localStorage.setItem('refreshToken', 'testRefreshToken');
  cy.setCookie('accessToken', 'testAccessToken');

  // Перехват запросов
  cy.fixture('ingredients.json').then((ingredients) => {
    cy.intercept('GET', `${API_URL}/ingredients`, ingredients).as(
      'getIngredients'
    );
  });

  cy.fixture('orders.json').then((orders) => {
    cy.intercept('GET', `${API_URL}/orders/all`, orders).as('getOrders');
  });

  cy.fixture('user.json').then((user) => {
    cy.intercept('GET', `${API_URL}/auth/user`, user).as('getUser');
  });

  cy.visit('http://localhost:4000');
  cy.wait('@getIngredients');
});

describe('Проверка работоспособности приложения', () => {
  it('сервис должен быть доступен по адресу localhost:4000', () => {
    cy.url().should('include', 'localhost:4000');
  });

  it('есть возможность добавлять булку и ингридиенты', () => {
    cy.get('[data-cy=no_bun_text_1]').should('contain', 'Выберите булки');
    cy.get('[data-cy=no_bun_text_2]').should('contain', 'Выберите булки');
    cy.get('[data-cy=no_ingredients_text]').should(
      'contain',
      'Выберите начинку'
    );

    cy.get('[data-cy=bun_0] button').click();
    cy.get('[data-cy=ingredient_0] button').click({ multiple: true });

    cy.get('[data-cy=constructor_section]').should('contain', 'булка');
    cy.get('[data-cy=ingredient_element]').should('exist');
  });

  it('проверка открытия и закрытия модального окна ингридиента', () => {
    cy.get('[data-cy=bun_0]').click();
    cy.get('[data-cy=ingredient_modal]').should('exist');
    cy.get('[data-cy=close_modal_btn]').click();
    cy.get('[data-cy=ingredient_modal]').should('not.exist');
  });

  it('проверка нового заказа', () => {
    cy.get('[data-cy=bun_0] button').click();
    cy.get('[data-cy=ingredient_0] button').click({ multiple: true });

    cy.fixture('newOrder.json').then((newOrder) => {
      cy.intercept('POST', `${API_URL}/orders`, newOrder).as('newOrder');

      cy.get('[data-cy=new_order_total] button').click();
      cy.wait('@newOrder');

      cy.get('[data-cy=new_order_number]').should(
        'contain',
        newOrder.order.number
      );
      cy.get('[data-cy=close_modal_btn]').click();

      cy.get('[data-cy=no_bun_text_1]').should('contain', 'Выберите булки');
      cy.get('[data-cy=no_bun_text_2]').should('contain', 'Выберите булки');
      cy.get('[data-cy=no_ingredients_text]').should(
        'contain',
        'Выберите начинку'
      );
    });
  });
});
