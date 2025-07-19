import { HttpErrorClassBuilder } from "./http-error-class-builder.ts";

interface UnauthorizedErrorParams {
  requestHeaders?: Headers;
}

export class UnauthorizedError extends HttpErrorClassBuilder({
  name: "UnauthorizedError",
  message: "User is not authorized",
  status: 403,
}) {
  /**
   * Optional headers that can be included with the error.
   *
   * @type {Headers}
   * @memberof UnauthorizedError
   */
  readonly requestHeaders?: Headers;

  constructor(params?: UnauthorizedErrorParams) {
    super();
    if (params?.requestHeaders) {
      this.requestHeaders = params.requestHeaders;
    }
  }
}
