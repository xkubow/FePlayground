describe('Vozidlo Edit page', () => {
  beforeEach(() => {
    cy.login();
  });

  it('opens edit page for specific vehicle', () => {
    cy.visit('/Vozidlo/Edit/3456789');

    cy.location('pathname').should('eq', '/Vozidlo/Edit/3456789');
    cy.getByCy('vozidlo-edit-page').should('be.visible');
  });
});

