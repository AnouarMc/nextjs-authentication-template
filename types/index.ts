import { AuthError } from "next-auth";

export class ExpiredToken extends AuthError {
  static type = "ExpiredToken";
}
export class InvalidToken extends AuthError {
  static type = "InvalidToken";
}
