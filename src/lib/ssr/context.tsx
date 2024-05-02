import { FC, PropsWithChildren, createContext } from "react";
import { PartialDeep } from "type-fest";

import { createRouter } from "../../router";

interface SSRContextProps {
  title: string;
  script: string[];
  meta: Record<string, string>;
  router: ReturnType<typeof createRouter>;
}
export type UserManifest = PartialDeep<SSRContextProps>;
interface SSRContextProviderProps {
  manifest: UserManifest;
  router: ReturnType<typeof createRouter>;
}

export const SSRContext = createContext<SSRContextProps>(null!);
export const SSRContextProvider: FC<PropsWithChildren<SSRContextProviderProps>> = ({
  children,
  manifest = {},
  router
}) => {
  manifest.router = router;
  return <SSRContext.Provider value={manifest as SSRContextProps}>{children}</SSRContext.Provider>;
};
