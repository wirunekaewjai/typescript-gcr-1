export const GET = async () => {
  const html = (
    <html lang="th">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preload" href="public/style.css" as="style" />
        <link rel="stylesheet" href="public/style.css" />
        <link rel="preload" href="public/favicon.ico" as="image" />
        <link rel="icon" href="public/favicon.ico" type="image/x-icon" sizes="any" />
        <title>Typescript GCR Template 1</title>
        <script type="module" src="public/scripts/home.ts" />
      </head>
      <body class="font-mono text-center p-4">
        This is a book !!!
      </body>
    </html>
  );

  return new Response(html, {
    headers: {
      "Content-Type": "text/html",
    },
  });
};