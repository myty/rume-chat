import { HttpError } from "./http-error.ts";

interface HttpErrorClassBuilderParams {
  name: string;
  message: string;
  status: number;
}

export function HttpErrorClassBuilder({
  name,
  message,
  status,
}: HttpErrorClassBuilderParams) {
  return class extends HttpError {
    readonly status = status;
    constructor() {
      super(message);
      this.name = name;
    }
  };
}
