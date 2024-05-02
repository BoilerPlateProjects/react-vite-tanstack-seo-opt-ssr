import { renderToString } from "react-dom/server";

import { createMemoryHistory } from "@tanstack/react-router";
import { StartServer } from "@tanstack/react-router-server/server";

import "./fetch-polyfill";
import { SSRContextProvider, UserManifest } from "./lib/ssr/context";
import { createRouter } from "./router";

export async function render(url: string) {
  const router = createRouter();
  const memoryHistory = createMemoryHistory({ initialEntries: [url] });
  router.update({ history: memoryHistory, context: { ...router.options.context } });
  await router.load();

  const manifest: UserManifest = {};

  const html = renderToString(
    <SSRContextProvider manifest={manifest} router={router}>
      <StartServer router={router} />
    </SSRContextProvider>
  );

  const meta = Object.entries(manifest.meta || {}).reduce(
    (acc, [name, value]) => acc + `<meta name="${name}" content="${value}" />`,
    ""
  );

  return { html, meta, title: manifest.title, scripts: manifest.script?.join("") || "" };
}
