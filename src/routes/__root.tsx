import { StrictMode } from "react";

import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { DehydrateRouter } from "@tanstack/start";

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => <div>Not Found</div>
});

function RootComponent() {
  return (
    <StrictMode>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
      <DehydrateRouter />
    </StrictMode>
  );
}
