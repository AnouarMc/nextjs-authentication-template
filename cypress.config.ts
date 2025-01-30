import { defineConfig } from "cypress";
import {
  deleteTestUser,
  addTestUserWithPassword,
  addTestUserWithoutPassword,
} from "./cypress/support/user";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      on("task", {
        async deleteTestUser() {
          const email = config.env["testing_email"];
          return await deleteTestUser(email);
        },

        async addTestUserWithPassword() {
          const email = config.env["testing_email"];
          const password = config.env["testing_password"];
          return await addTestUserWithPassword(email, password);
        },

        async addTestUserWithoutPassword() {
          const email = config.env["testing_email"];
          return await addTestUserWithoutPassword(email);
        },
      });
    },
  },
});
