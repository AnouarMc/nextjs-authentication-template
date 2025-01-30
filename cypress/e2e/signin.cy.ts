import { redirectUrl } from "../../constants";

describe("Sign-in flow", () => {
  describe("With password", () => {
    beforeEach(() => {
      cy.task("deleteTestUser").then(() => {
        cy.task("addTestUserWithPassword").then(() => {
          cy.visit("/sign-in");
        });
      });
    });

    it("should sign in a user with an email and a password", () => {
      const email = Cypress.env("testing_email");
      const password = Cypress.env("testing_password");

      cy.url().should("include", "/sign-in");
      cy.get('[data-cy="email"]').type(email);
      cy.get('[data-cy="next"]').click();

      cy.url().should("include", "/sign-in/password");
      cy.get('[data-cy="password"]').type(password);
      cy.get('[data-cy="next"]').click();

      cy.url().should("include", redirectUrl);
    });
  });

  describe("With verification code", () => {
    beforeEach(() => {
      cy.task("deleteTestUser").then(() => {
        cy.task("addTestUserWithoutPassword").then(() => {
          cy.visit("/sign-in");
        });
      });
    });

    it("should sign in a user with an email and a verification code", () => {
      const timestamp = Math.floor(Date.now() / 1000);
      const email = Cypress.env("testing_email");
      const apikey = Cypress.env("api_key");
      const namespace = Cypress.env("namespace");

      cy.get('[data-cy="email"]').type(email);
      cy.get('[data-cy="next"]').click();

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

        cy.url().should("include", "/sign-in/otp");
        cy.get('[data-cy="otp-input"]').type(verificationCode);
        cy.url().should("include", redirectUrl);
      });
    });
  });
});
