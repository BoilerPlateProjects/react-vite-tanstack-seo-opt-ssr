import { Children, FC, JSX, useContext } from "react";
import { renderToString } from "react-dom/server";

import { Context } from "@tanstack/react-cross-context";
import { getRouterContext } from "@tanstack/react-router";

import { SSRContext } from "../context";

interface ScriptProps {
  src?: string;
  children?: JSX.Element | JSX.Element[];
}

const hydrationContext = Context.get("TanStackRouterHydrationContext", {});
const routerContext = getRouterContext();

export const Script: FC<ScriptProps> = ({ src, children }) => {
  const ssrContext = useContext(SSRContext);

  if (ssrContext && typeof window === "undefined") {
    ssrContext.script ||= [];

    if (src) {
      ssrContext.script.push(`<script src="${src}"></script>`);
    }

    if (children) {
      const hydrationCtxValue = {
        router: ssrContext.router.dehydrate(),
        payload: ssrContext.router.options.dehydrate?.()
      };

      Children.map(children, child => {
        const scriptHtml = renderToString(
          <hydrationContext.Provider value={hydrationCtxValue}>
            <routerContext.Provider value={ssrContext.router}>{child}</routerContext.Provider>
          </hydrationContext.Provider>
        );

        ssrContext.script.push(scriptHtml);
      });
    }
  }

  return null;
};
