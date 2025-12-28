// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";



// Fail on uncaught JS errors (except known browser noise)
Cypress.on('uncaught:exception', (err) => {
  const ignored = [
    'ResizeObserver loop limit exceeded',
    'Script error.'
  ]

  if (ignored.some(msg => err.message.includes(msg))) {
    return false
  }

  throw err
})

// Track console errors & warnings
beforeEach(() => {
  cy.window({ log: false }).then((win) => {
    cy.stub(win.console, 'error').as('consoleError')
    cy.stub(win.console, 'warn').as('consoleWarn')
  })
})

// Fail if console.error was called
afterEach(() => {
  cy.get('@consoleError').should('not.have.been.called')
})

