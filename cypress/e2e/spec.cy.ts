describe("Main Page", () => {
  it("Visit Website on localhost", () => {
    cy.visit("/");
    cy.contains("Åzze");
    cy.get(".email-link").should("have.text", "info@ozze.eu.org");

    //cy.get('.github-corner svg').click();
    //cy.origin('https://github.com', () => {
    //  cy.url().should('include', 'github.com/jere-a/Main-website');
    //  cy.contains('turbo.json');
    //})
  });
  it("Visit from images page", () => {
    cy.visit("/images");
    cy.get("div.group > .flex > :nth-child(1) > .group").click();
    cy.url().should("include", "/");
    cy.contains("Åzze");
  });
  it("Visit from blog page", () => {
    cy.visit("/blog");
    cy.get("div.group > .flex > :nth-child(1) > .group").click();
    cy.url().should("include", "/");
    cy.contains("Åzze");
  })
});

const images = ["Aamuinen usva", "Iso Kanto.", "Sininen Taivas."];

describe("Images", () => {
  it("Navigation from home", () => {
    cy.visit("/");
    cy.get(":nth-child(2) > .group").click();
    cy.url().should("include", "/images");
  });
  it("Images page", () => {
    cy.visit("/images");
    cy.url().should("include", "/images");
    cy.contains("Kuvat");
    for (const i in images) {
      cy.contains(images[i]);
    }
  });
});

describe("Blog", () => {
  it("Navigation from home", () => {
    cy.visit("/");
    cy.get(".flex > :nth-child(3) > .animate__animated").click();
    cy.url().should("include", "/blog");
  });
  it("Visit", () => {
    cy.visit("/blog");
    cy.url().should("include", "/blog");
  });
});

describe("404", () => {
  it("check navigation"), () => {
  cy.visit("/404");
  cy.contains("Sivuun 404");
  }
});
