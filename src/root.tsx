import { Outlet, Scripts } from "react-router";
import Navbar from "./components/root-domain/Navbar/Navbar";

import "./index.css";

export default function App() {
  return (
    <html lang="en">
      <head>
        <title>Bartosz Janicki</title>
      </head>
      <body className="bg-neutral-900">
        <Navbar />
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}
