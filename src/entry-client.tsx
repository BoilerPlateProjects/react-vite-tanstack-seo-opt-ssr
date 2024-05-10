import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

import { StartClient } from "@tanstack/start";

import { createRouter } from "./router.ts";

import "./index.css";

const router = createRouter();

hydrateRoot(
  document,
  <StrictMode>
    <StartClient router={router} />
  </StrictMode>
);
