import { hydrateRoot } from "react-dom/client";

import { StartClient } from "@tanstack/react-router-server/client";

import { createRouter } from "./router";

import "./index.css";

const router = createRouter();

hydrateRoot(document.getElementById("app")!, <StartClient router={router} />);
