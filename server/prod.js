import fs from "node:fs/promises";

import compression from "compression";
import express from "express";
import sirv from "sirv";

const port = process.env.PORT || 5173;
const base = process.env.BASE || "/";
const templateHtml = await fs.readFile("./build/client/index.html", "utf-8");
const app = express();

app
  .use(compression())
  .use(base, sirv("./build/client", { extensions: [] }))
  .use("*", async (req, res) => {
    try {
      const url = req.originalUrl.replace(base, "");

      const template = templateHtml;
      const renderSSR = (await import("../build/server/entry-server.js")).render;

      const html = await renderSSR(url, template);
      res.end(html);
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.stack);
        res.status(500).end(e.stack);
      }
    }
  })
  .listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
  });
