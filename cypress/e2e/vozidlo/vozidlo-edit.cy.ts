describe('Vozidlo Edit page', () => {
  beforeEach(() => {
    cy.login();
  });

  it('opens edit page for specific vehicle', () => {
    cy.visit('/Vozidlo/Edit/3456789');

    cy.location('pathname').should('eq', '/Vozidlo/Edit/3456789');
    cy.getByCy('vozidlo-edit-page').should('be.visible');
  });

  it('shows the edit form', () => {
    cy.visit('/Vozidlo/Edit/3456789');

    cy.getByCy('vozidlo-edit-page').should('be.visible');
    cy.getByCy('vozidlo-form').should('exist');
  });

  // When there is a concrete save button with data-cy="save-button",
  // this test can be extended to verify saving behavior.
  it('has a placeholder for save button test', () => {
    cy.visit('/Vozidlo/Edit/3456789');

    cy.getByCy('vozidlo-edit-page').should('be.visible');
  });
});

