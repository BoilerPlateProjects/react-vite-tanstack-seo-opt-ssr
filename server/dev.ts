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
      const { render } = await vite!.ssrLoadModule("/src/entry-server.tsx");
      const html = await render(url);
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
