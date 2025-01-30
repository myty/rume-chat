import { define } from "../utils.ts";

export default define.page(({ Component }) => {
  return (
    <html lang="en" class="h-full bg-white">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Fresh Chat</title>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body class="h-full">
        <Component />
      </body>
    </html>
  );
});
