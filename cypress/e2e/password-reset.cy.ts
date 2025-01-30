import { redirectUrl } from "../../constants";

describe("Password reset flow", () => {
  before(() => {
    cy.task("deleteTestUser").then(() => {
      cy.task("addTestUserWithPassword").then(() => {
        cy.visit("/sign-in");
      });
    });
  });

  it("should reset the user password and sign in", () => {
    const timestamp = Math.floor(Date.now() / 1000);
    const email = Cypress.env("testing_email");
    const apikey = Cypress.env("api_key");
    const namespace = Cypress.env("namespace");

    cy.get('[data-cy="email"]').type(email);
    cy.get('[data-cy="next"]').click();

    cy.get('[data-cy="forgot-password"]').click();
    cy.get('[data-cy="reset-password"]').click();

    cy.request({
      method: "GET",
      url: "https://api.testmail.app/api/json",
      qs: {
        apikey,
        namespace,
        livequery: "true",
        timestamp_from: timestamp,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.emails).to.have.length.greaterThan(0);

      const subject = response.body.emails[0].subject;
      expect(subject).to.include("is your verification code");
      const verificationCode = subject.split(" ")[0];

      cy.url().should("include", "/sign-in/password-reset");
      cy.get('[data-cy="otp-input"]').type(verificationCode);

      const testPassword = "TestPass987";
      cy.get('[data-cy="password"]').type(testPassword);
      cy.get('[data-cy="confirm-password"]').type(testPassword);
      cy.get('[data-cy="next"]').click();

      cy.url().should("include", "/sign-in");
      cy.get('[data-cy="email"]').type(email);
      cy.get('[data-cy="next"]').click();

      cy.url().should("include", "/sign-in/password");
      cy.get('[data-cy="password"]').type(testPassword);
      cy.get('[data-cy="next"]').click();

      cy.url().should("include", redirectUrl);
    });
  });
});
