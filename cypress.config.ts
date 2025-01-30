import { defineConfig } from "cypress";
import { deleteTestUser } from "./cypress/support/user";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      on("task", {
        async deleteTestUser() {
          const email = config.env["testing_email"];
          return await deleteTestUser(email);
        },
      });
    },
  },
});
