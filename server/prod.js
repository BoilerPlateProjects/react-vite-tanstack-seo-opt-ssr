import compression from "compression";
import express from "express";
import sirv from "sirv";

const port = process.env.PORT || 5173;
const base = process.env.BASE || "/";

express()
  .use(compression())
  .use(base, sirv("./build/client", { extensions: [] }))
  .use("*", async (req, res) => {
    try {
      const url = req.originalUrl.replace(base, "");
      const { render } = await import("../build/server/entry-server.js");
      const html = await render(url);
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
