import { minify } from "html-minifier";
import { HTMLElement, parse } from "node-html-parser";
import { format, resolveConfig, resolveConfigFile } from "prettier";
import { JSX } from "react";
import { renderToString } from "react-dom/server";

import { type createRouter } from "../../../router";
import { SSRContextProvider, UserManifest } from "../context";

const isDev = process.env.NODE_ENV === "development";
export const renderTemplate = async (
  template: string,
  router: ReturnType<typeof createRouter>,
  element: JSX.Element
) => {
  const manifest: UserManifest = {};
  const html = renderToString(
    <SSRContextProvider manifest={manifest} router={router}>
      {element}
    </SSRContextProvider>
  );

  const root = parse(template.replace("<!--app-html-->", html), {
    lowerCaseTagName: true,
    comment: true
  });
  const title = root.querySelector("title")!;

  title.textContent = title.textContent.replace("#{title}", manifest.title || "");

  Object.entries(manifest.meta || {}).forEach(([name, content]) => {
    const meta = new HTMLElement("meta", {}, `${name}="${content}"`);
    root.querySelector("head")?.appendChild(meta);
  });

  manifest.styles?.forEach(style => {
    root.querySelector("head")!.innerHTML += style;
  });

  manifest.headScripts?.forEach(script => {
    root.querySelector("head")!.innerHTML += script;
  });

  manifest.scripts?.forEach(script => {
    root.querySelector("body")!.innerHTML += script;
  });

  const minifiedHtml = minify(root.toString(), {
    removeComments: false,
    html5: true,
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: true,
    minifyURLs: true
  });

  if (isDev) {
    const configFile = await resolveConfigFile();
    if (!configFile) return format(minifiedHtml, { parser: "html" });
    const config = await resolveConfig(configFile);
    return format(minifiedHtml, { parser: "html", ...config });
  }
  return minifiedHtml;
};
