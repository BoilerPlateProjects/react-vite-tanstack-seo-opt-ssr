import { readFile } from "node:fs/promises";

import express from "express";
import { createServer } from "vite";

const port = process.env.PORT || 5173;
const base = process.env.BASE || "/";

const vite = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
  base
});

express()
  .use(vite.middlewares)
  .use("*", async (req, res) => {
    try {
      const url = req.originalUrl.replace(base, "");
      const template = await readFile("index.html", "utf-8");
      const { render } = await vite.ssrLoadModule("/src/entry-server.tsx");
      const transformedHtml = await render(url, template);
      const html = await vite.transformIndexHtml(url, transformedHtml);
      res.end(html);
    } catch (e) {
      if (e instanceof Error) {
        vite.ssrFixStacktrace(e);
        console.log(e.stack);
        res.status(500).end(e.stack);
      }
    }
  })
  .listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
  });
