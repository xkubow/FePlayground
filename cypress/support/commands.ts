/* eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/naming-convention */

declare global {
  namespace Cypress {
    interface Chainable {
      login(): Chainable<void>;
      loginAs(username: string, password: string): Chainable<void>;
      getByCy(value: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}

Cypress.Commands.add('getByCy', (value: string) => {
  return cy.get(`[data-cy="${value}"]`);
});

Cypress.Commands.add('login', () => {
  cy.session('mock-user', () => {
    cy.visit('/');

    cy.get('#login-name-input', { timeout: 10000 }).should('be.visible').type('test');
    cy.get('input[type="password"]').should('be.visible').type('test');
    cy.get('#login-button').should('be.visible').click();
  });
});

Cypress.Commands.add('loginAs', (username: string, password: string) => {
  cy.session(`user-${username}`, () => {
    cy.visit('/');

    cy.get('#login-name-input', { timeout: 10000 }).should('be.visible').type(username);
    cy.get('input[type="password"]').should('be.visible').type(password);
    cy.get('#login-button').should('be.visible').click();
  });
});

export {};
