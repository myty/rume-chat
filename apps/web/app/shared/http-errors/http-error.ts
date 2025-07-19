export abstract class HttpError extends Error {
  abstract readonly status: number;

  static isHttpError(error: unknown): error is HttpError {
    return error instanceof HttpError;
  }
}
