import { AuthError } from "next-auth";

export class ExpiredToken extends AuthError {
  static type = "ExpiredToken";
}
export class InvalidToken extends AuthError {
  static type = "InvalidToken";
}
export class InvalidJWT extends AuthError {
  static type = "InvalidJWT";
}
export class TooManyRequests extends AuthError {
  static type = "TooManyRequests";
}

export interface AccountCustomProps {
  email: string;
  provider: string;
  isPrimary: boolean;
}
