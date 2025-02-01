import { redirectUrl } from "../../constants";

describe("Dashboard Functionality Tests", () => {
  beforeEach(() => {
    cy.session("Sign in as test user", () => {
      cy.task("deleteTestUser").then(() => {
        cy.task("addTestUserWithPassword").then(() => {
          cy.visit("/sign-in");

          const email = Cypress.env("testing_email");
          const password = Cypress.env("testing_password");
          cy.get('[data-cy="email"]').type(email);
          cy.get('[data-cy="next"]').click();
          cy.url().should("include", "/sign-in/password");
          cy.get('[data-cy="password"]').type(password);
          cy.get('[data-cy="next"]').click();
          cy.url({ timeout: 20000 }).should("include", redirectUrl);
        });
      });
    });
  });

  it("updates the user name and reflects changes", () => {
    cy.visit("/dashboard/profile");
    cy.get('[data-cy="update-profile"]').click();
    const randomName = "John Doe";
    cy.get('[data-cy="user-name"]').type(randomName);
    cy.get('[data-cy="update-user-name"]').click();
    cy.get('[data-cy="user-name-label"]').contains(randomName);
  });

  it("uploads a new profile image and verifies the update", () => {
    cy.visit("/dashboard/profile");
    cy.get('[data-cy="update-profile"]').click();
    cy.get('[data-cy="image-input"]').selectFile(
      "cypress/fixtures/profile-image.png",
      { force: true }
    );
    cy.get('[data-cy="user-image"]', { timeout: 60000 })
      .should("have.attr", "src")
      .and("include", "cloudinary.com");
  });

  it("changes the password, signs out, and signs back in with the new password", () => {
    cy.visit("/dashboard/security");
    cy.get('[data-cy="update-password"]').click();
    const password = Cypress.env("testing_password");
    cy.get('[data-cy="current-password"]').type(password);
    const testPassword = "TestPass987";
    cy.get('[data-cy="new-password"]').type(testPassword);
    cy.get('[data-cy="confirm-password"]').type(testPassword);
    cy.get('[data-cy="next-update-password"]').click();
    cy.get('[data-cy="current-password"]').should("not.be.visible");

    cy.get('[data-cy="sidebar-user"]').click();
    cy.get('[data-cy="sign-out-button"]').click();
    cy.url().should("include", "/sign-in");

    const email = Cypress.env("testing_email");
    cy.get('[data-cy="email"]').type(email);
    cy.get('[data-cy="next"]').click();
    cy.url().should("include", "/sign-in/password");
    cy.get('[data-cy="password"]').type(testPassword);
    cy.get('[data-cy="next"]').click();
    cy.url().should("include", redirectUrl);
  });

  it("deletes the user account and redirects to the sign-in page", () => {
    cy.visit("/dashboard/security");
    cy.get('[data-cy="delete-user"]').click();
    cy.get('[data-cy="confirm-delete-input"]').type("Delete account");
    cy.get('[data-cy="confirm-delete-user"]').click();

    const email = Cypress.env("testing_email");
    cy.url().should("include", "/sign-in");
    cy.get('[data-cy="email"]').type(email);
    cy.get('[data-cy="next"]').click();
    cy.get('[data-cy="email-error"]').should(
      "contain",
      "Couldn't find your account"
    );
  });
});
