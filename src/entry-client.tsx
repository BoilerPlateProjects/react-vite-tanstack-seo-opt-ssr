import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

import { createBrowserHistory } from "@tanstack/react-router";
import { StartClient } from "@tanstack/start";

import { createRouter } from "./router";

import "./index.css";

const router = createRouter();
const history = createBrowserHistory();
router.update({ history });
await router.load();

hydrateRoot(
  document.querySelector("#app")!,
  <StrictMode>
    <StartClient router={router} />
  </StrictMode>
);
