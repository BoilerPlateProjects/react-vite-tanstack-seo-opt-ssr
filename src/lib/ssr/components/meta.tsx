import { FC, useContext } from "react";

import { SSRContext } from "../context";

interface MetaProps {
  name: string;
  value: string;
}

export const Meta: FC<MetaProps> = ({ name, value }) => {
  const ssrContext = useContext(SSRContext);

  if (ssrContext && typeof window === "undefined") {
    ssrContext.meta ||= {};

    ssrContext.meta[name] = value;
  }

  return null;
};
