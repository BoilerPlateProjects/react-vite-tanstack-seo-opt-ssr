import { FC, PropsWithChildren } from "react";

import { Context } from "@tanstack/react-cross-context";
import { getRouterContext } from "@tanstack/react-router";

import { createRouter } from "../../../router";

const hydrationContext = Context.get("TanStackRouterHydrationContext", {});
const routerContext = getRouterContext();

export const RouterProvider: FC<PropsWithChildren<{ router: ReturnType<typeof createRouter> }>> = ({
  router,
  children
}) => {
  const hydrationCtxValue = {
    router: router.dehydrate(),
    payload: router.options.dehydrate?.()
  };

  return (
    <hydrationContext.Provider value={hydrationCtxValue}>
      <routerContext.Provider value={router}>{children}</routerContext.Provider>
    </hydrationContext.Provider>
  );
};
