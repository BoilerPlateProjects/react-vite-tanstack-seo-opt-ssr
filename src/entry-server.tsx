import { Transform } from "node:stream";

import { HTMLElement, parse } from "node-html-parser";
import { StrictMode } from "react";
import { renderToPipeableStream } from "react-dom/server";

import { createMemoryHistory } from "@tanstack/react-router";
import { StartServer } from "@tanstack/start/server";

import { createRouter } from "./router";

const ABORT_DELAY = 10000;

export async function render(url: string, template: string) {
  const router = createRouter();
  const memoryHistory = createMemoryHistory({ initialEntries: [url] });
  router.update({ history: memoryHistory });
  await router.load();

  return new Promise<string>((resolve, reject) => {
    const { pipe, abort } = renderToPipeableStream(
      <StrictMode>
        <StartServer router={router} />
      </StrictMode>,
      {
        onShellError() {
          reject(new Error("Shell error"));
        },
        onShellReady() {
          let html = "";

          const transformStream = new Transform({
            transform(chunk, _encoding, callback) {
              html += chunk.toString();
              callback();
            }
          });

          transformStream.on("finish", () => {
            const root = parse(template);
            const app = new HTMLElement("div", { id: "app" });
            app.set_content(html);
            const body = root.querySelector("body");
            if (!body) {
              reject(new Error("No body element"));
              return;
            }
            const bodyContent = body.innerHTML;
            body.set_content(app.toString() + bodyContent);
            const transformedHtml = root.toString();
            resolve(transformedHtml);
          });

          pipe(transformStream);
        },
        onError(error) {
          reject(error);
        }
      }
    );

    setTimeout(() => {
      abort();
    }, ABORT_DELAY);
  });
}
