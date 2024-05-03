import { parse } from "node-html-parser";
import { Children, ComponentProps, FC, ReactNode, useContext } from "react";
import { renderToString } from "react-dom/server";

import { SSRContext } from "../context";
import { TagBuilder } from "../utils/tag-builder";
import { RouterProvider } from "./router-provider";

interface ScriptProps extends Omit<ComponentProps<"script">, `on${string}` | `aria-${string}`> {
  children?: ReactNode | ReactNode[];
  head?: boolean;
}

export const Script: FC<ScriptProps> = ({ children, head, dangerouslySetInnerHTML, ...props }) => {
  const ssrContext = useContext(SSRContext);

  if (ssrContext && typeof window === "undefined") {
    ssrContext.scripts ||= [];
    ssrContext.headScripts ||= [];

    const tagBuilder = new TagBuilder("script").addAttributes(props);

    const scripts = head ? ssrContext.headScripts : ssrContext.scripts;

    if (children) {
      Children.map(children, child => {
        const clone = tagBuilder.clone();
        const content = renderToString(
          <RouterProvider router={ssrContext.router}>{child}</RouterProvider>
        );
        const scriptElement = parse(content).querySelector("script")!;
        clone.addAttributes(scriptElement.attributes);
        clone.addContent(scriptElement.textContent);
        scripts.push(clone.toString());
      });
    } else {
      scripts.push(tagBuilder.addContent(dangerouslySetInnerHTML?.__html.toString()).toString());
    }
  }

  return null;
};
