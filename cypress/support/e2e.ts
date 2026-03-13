import './commands';

Cypress.on('uncaught:exception', (err) => {
  console.error('Uncaught exception:', err);

  // keep only if your app throws non-critical runtime errors during boot
  // otherwise remove this and fix the root issue
  return false;
});