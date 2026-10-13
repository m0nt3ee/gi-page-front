import { Outlet, Scripts } from "react-router";

import "./index.css";

export default function App() {
  return (
    <html lang="en">
      <head>
        <title>Bartosz Janicki</title>
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}
