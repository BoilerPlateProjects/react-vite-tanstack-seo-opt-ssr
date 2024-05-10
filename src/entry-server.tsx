import { Transform } from "node:stream";

import { StrictMode } from "react";
import { renderToPipeableStream } from "react-dom/server";

import { createMemoryHistory } from "@tanstack/react-router";
import { StartServer } from "@tanstack/start/server";

import { createRouter } from "./router";

const ABORT_DELAY = 10000;

export async function render(url: string) {
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
            resolve(html);
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
