import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { DehydrateRouter } from "@tanstack/start";

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => <div>Not Found</div>
});

function RootComponent() {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vite App</title>
        <script src="https://cdn.tailwindcss.com" />
        <script
          type="module"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              import RefreshRuntime from "/@react-refresh"
              RefreshRuntime.injectIntoGlobalHook(window)
              window.$RefreshReg$ = () => {}
              window.$RefreshSig$ = () => (type) => type
              window.__vite_plugin_react_preamble_installed__ = true
            `
          }}
        />
        <script type="module" src="/@vite/client" />
        <script type="module" src="/src/entry-client.tsx" />
      </head>
      <body>
        <Outlet />
        <TanStackRouterDevtools position="bottom-right" />
        <DehydrateRouter />
      </body>
    </html>
  );
}
