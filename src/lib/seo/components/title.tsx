import { FC, useContext } from "react";

import { SSRContext } from "../context";

interface TitleProps {
  title: string;
}

export const Title: FC<TitleProps> = ({ title }) => {
  const ssrContext = useContext(SSRContext);

  if (ssrContext && typeof window === "undefined") {
    ssrContext.title = title;
  }

  return null;
};
