export const devHtmlTemplate = ({
	displayName,
	relativePath,
	require,
}: {
	displayName: string;
	relativePath: string;
	require: string;
}) => `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>${displayName}</title>
    <script>${require}</script>
  </head>

  <body>
    <div id="root"></div>
    <script>
      window.location.href = [window.location.origin, '${relativePath}'].join("/");
    </script>
  </body>
</html>`;
