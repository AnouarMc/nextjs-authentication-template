import { redirectUrl } from "../../constants";

describe("Sign-up flow", () => {
  before(() => {
    cy.task("deleteTestUser").then(() => {
      cy.visit("/sign-up");
    });
  });

  it("should sign up a new user", () => {
    const timestamp = Date.now();
    const email = Cypress.env("testing_email");
    const password = Cypress.env("testing_password");
    const apikey = Cypress.env("api_key");
    const testing_namespace = Cypress.env("testing_namespace");

    cy.get('[data-cy="email"]').type(email);
    cy.get('[data-cy="password"]').type(password);
    cy.get('[data-cy="signup-button"]').click();

    cy.request({
      method: "GET",
      url: "https://api.testmail.app/api/json",
      qs: {
        apikey,
        namespace: testing_namespace,
        livequery: "true",
        timestamp_from: timestamp,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.emails).to.have.length.greaterThan(0);

      const subject = response.body.emails[0].subject;
      expect(subject).to.include("is your verification code");
      const verificationCode = subject.split(" ")[0];

      cy.url().should("include", "/verify-email-address");
      cy.get('[data-cy="otp-input"]').type(verificationCode);
      cy.url().should("include", redirectUrl);
    });
  });
});
