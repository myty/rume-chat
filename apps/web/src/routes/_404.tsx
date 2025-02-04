import { define } from "../utils.ts";

export default define.page(({ url }) => {
  return <p>404 not found: {url.pathname}</p>;
});
