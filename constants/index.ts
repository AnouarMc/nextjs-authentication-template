export const publicRoutes = ["/"];
export const authApiPrefix = "/api/auth/";
export const authRoutesPrefixes = ["/sign-in", "/sign-up"];
export const redirectUrl = "/dashboard/profile";

export const tokenTTLInSeconds = 5 * 60;

export const defaultError = {
  success: false,
  errors: [{ name: "root", message: "Something went wrong" }],
};

export const maxFileSize = 1000000;
export const maxFileSizeText = "1 MB";
export const acceptedImageTypes = [
  "image/png",
  "image/gif",
  "image/jpeg",
  "image/jpg",
];
