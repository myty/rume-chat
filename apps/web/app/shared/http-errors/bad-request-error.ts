import { HttpErrorClassBuilder } from "./http-error-class-builder.ts";

export class BadRequestError extends HttpErrorClassBuilder({
  name: "BadRequestError",
  message: "Bad request",
  status: 400,
}) {
  constructor(message?: string) {
    super();
    if (message) {
      this.message = message;
    }
  }
}
