import fs from "node:fs/promises";

import express from "express";
import { createServer } from "vite";

const port = process.env.PORT || 5173;
const base = process.env.BASE || "/";

const app = express();

const vite = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
  base
});

app
  .use(vite.middlewares)
  .use("*", async (req, res) => {
    try {
      const url = req.originalUrl.replace(base, "");
      const templateCode = await fs.readFile("./index.html", "utf-8");
      const template = await vite!.transformIndexHtml(url, templateCode);
      const renderSSR = (await vite!.ssrLoadModule("/src/entry-server.tsx")).render;
      const html = await renderSSR(url, template);
      res.end(html);
    } catch (e) {
      if (e instanceof Error) {
        vite?.ssrFixStacktrace(e);
        console.log(e.stack);
        res.status(500).end(e.stack);
      }
    }
  })
  .listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
  });
