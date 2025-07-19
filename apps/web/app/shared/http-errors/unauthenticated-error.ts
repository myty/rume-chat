import { HttpErrorClassBuilder } from "./http-error-class-builder.ts";

interface UnauthenticatedErrorParams {
  requestHeaders?: Headers;
}

export class UnauthenticatedError extends HttpErrorClassBuilder({
  name: "UnauthenticatedError",
  message: "User is not authenticated",
  status: 401,
}) {
  /**
   * Optional headers that can be included with the error.
   *
   * @type {Headers}
   * @memberof UnauthenticatedError
   */
  readonly requestHeaders?: Headers;

  constructor(params?: UnauthenticatedErrorParams) {
    super();
    if (params?.requestHeaders) {
      this.requestHeaders = params.requestHeaders;
    }
  }
}
