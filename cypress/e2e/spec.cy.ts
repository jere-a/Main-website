describe("Main Page", () => {
  it("Visit Website on localhost", () => {
    cy.visit("http://localhost:4321/");
    cy.contains("Åzze");
    cy.contains("Tekijänoikeus");
    cy.get(".email-link").should("have.text", "info@ozze.eu.org");
    cy.get(".copyright").should("include.text", new Date().getFullYear());

    //cy.get('.github-corner svg').click();
    //cy.origin('https://github.com', () => {
    //  cy.url().should('include', 'github.com/jere-a/Main-website');
    //  cy.contains('turbo.json');
    //})
  });
});

const images = ["Aamuinen usva", "Iso Kanto.", "Sininen Taivas."];

describe("Images", () => {
  it("Navigation from home", () => {
    cy.visit("http://localhost:4321/");
    cy.get(":nth-child(2) > .animate__animated").click();
    cy.url().should("include", "/images");
  });
  it("Images page", () => {
    cy.visit("http://localhost:4321/images/");
    cy.url().should("include", "/images");
    cy.contains("Kuvat");
    for (let i in images) {
      cy.contains(images[i]);
    }
  });
});

describe("Blog", () => {
  it("Navigation from home", () => {
    cy.visit("http://localhost:4321/");
    cy.get(".flex > :nth-child(3) > .animate__animated").click();
    cy.url().should("include", "/blog");
  });
  it("Visit", () => {
    cy.visit("http://localhost:4321/blog/");
    cy.url().should("include", "/blog");
  });
});
