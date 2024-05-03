import { ComponentProps, FC, useContext } from "react";

import { SSRContext } from "../context";

interface MetaProps extends Omit<ComponentProps<"meta">, "name" | "content"> {
  name: string;
  value: string;
}

export const Meta: FC<MetaProps> = ({ name, value }) => {
  const ssrContext = useContext(SSRContext);

  if (ssrContext && typeof window === "undefined") {
    ssrContext.meta ||= {};

    if (name) {
      ssrContext.meta[name] = value;
    }
  }

  return null;
};
