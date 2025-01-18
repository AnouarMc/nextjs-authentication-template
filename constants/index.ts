export const publicRoutes = ["/"];
export const authRoutesPrefixes = ["/sign-in", "/sign-up"];
export const redirectUrl = "/dashboard/profile";

export const tokenTTLInSeconds = 5 * 60;

export const defaultError = {
  success: false,
  errors: [{ name: "root", message: "Something went wrong" }],
};
