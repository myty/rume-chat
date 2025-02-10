declare module "react" {
  // @ts-types="npm:@types/react@19"
  import * as React from "npm:react@19";

  // @ts-ignore - this is a hack to make the types work
  export = React;
}
