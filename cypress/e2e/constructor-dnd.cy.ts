// cypress/e2e/constructor-dnd.cy.ts
describe('Constructor Page', () => {
  it('should load page successfully', () => {
    // 1. Заходим на страницу (baseUrl уже содержит /rb123)
    cy.visit('/', { timeout: 10000 });

    // 2. Проверяем, что body загрузился
    cy.get('body').should('exist');

    // 3. Проверяем, что нет ошибки 404
    cy.contains('404').should('not.exist');

    // 4. Проверяем root-элемент React-приложения
    cy.get('#root').should('exist');
  });
});
