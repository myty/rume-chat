import { HTTPException as HTTPExceptionInternal } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export class HTTPException extends HTTPExceptionInternal {
  constructor(status: ContentfulStatusCode = 500, options?: {
    res?: Response;
    message?: string;
    cause?: unknown;
  }) {
    super(status, options);
  }

  static fromError(error: unknown): HTTPException {
    const errorObject = {
      errorCode: 500 as ContentfulStatusCode,
      message: `${error}`,
      cause: error,
    };

    if (error instanceof HTTPExceptionInternal) {
      return error;
    }

    if (error instanceof TypeError) {
      errorObject.errorCode = 400;
      errorObject.message = error.message;
    }

    return new HTTPException(errorObject.errorCode, {
      res: new Response(
        JSON.stringify({
          message: errorObject.message,
          status: errorObject.errorCode,
        }),
        {
          status: errorObject.errorCode,
          headers: { "content-type": "application/json" },
        },
      ),
      message: errorObject.message,
      cause: error,
    });
  }
}
