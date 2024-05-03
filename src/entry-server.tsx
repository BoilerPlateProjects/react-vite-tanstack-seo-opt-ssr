import { renderTemplate } from "@/lib/seo";
import { createMemoryHistory } from "@tanstack/react-router";
import { StartServer } from "@tanstack/react-router-server/server";

import "./fetch-polyfill";
import { createRouter } from "./router";

export async function render(url: string, template: string) {
  const router = createRouter();
  const memoryHistory = createMemoryHistory({ initialEntries: [url] });
  router.update({ history: memoryHistory, context: { ...router.options.context } });
  await router.load();

  return renderTemplate(template, router, <StartServer router={router} />);
}
