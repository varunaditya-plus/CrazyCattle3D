import { render } from "preact";
import "./index.css";
import { App } from "./app.jsx";
import { AppToaster } from "./components/toast.jsx";

render(
  <>
    <App />
    <AppToaster />
  </>,
  document.getElementById("root"),
);
