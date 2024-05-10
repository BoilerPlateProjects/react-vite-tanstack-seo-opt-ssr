import SuperJSON from "superjson";

import { createRouter as createReactRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";

export function createRouter() {
  return createReactRouter({
    routeTree,
    defaultPreload: "intent",
    transformer: SuperJSON
  });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
