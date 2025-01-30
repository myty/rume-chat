import { define } from "../utils.ts";

export default define.page(({ error }) => {
  return <p>500 internal error: {(error as Error).message}</p>;
});
