import { StrictMode } from "react";

import { Meta, Script, Style, Title } from "@/lib/seo";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { DehydrateRouter } from "@tanstack/react-router-server/client";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

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
      <Style
        rel="stylesheet"
        dangerouslySetInnerHTML={{
          __html: `
      .abc {width: 200px}
      `
        }}
      />
      <Title title="some-title" />
      <Script head src="https://cdn.tailwindcss.com" />
      <Script
        head
        dangerouslySetInnerHTML={{
          __html: `    tailwind.config = {
      theme: {
        extend: {
          colors: {
            clifford: '#da373d',
          }
        }
      }
    }`
        }}
      />
      <Script>
        <DehydrateRouter />
      </Script>
      <Script src="https://gist.github.com/MDReal32/ce3de7edd83b445459390f43b6f55ab1.js" />
    </StrictMode>
  );
}
