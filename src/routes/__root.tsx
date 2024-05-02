import { StrictMode } from "react";

import { Script } from "@/lib/ssr";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { DehydrateRouter } from "@tanstack/react-router-server/client";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import { Meta } from "../lib/ssr/components/meta";
import { Title } from "../lib/ssr/components/title";
import { RouterContext } from "../router-context";

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent
});

function RootComponent() {
  return (
    <StrictMode>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />

      <Meta name="charset" value="utf-8" />
      <Meta name="description" value="about site" />
      <Title title="some-title" />
      <Script>
        <DehydrateRouter />
      </Script>
    </StrictMode>
  );
}
