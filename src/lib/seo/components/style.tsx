import { ComponentProps, FC, useContext } from "react";

import { SSRContext } from "../context";

interface StyleProps
  extends Omit<ComponentProps<"script">, `on${string}` | `aria-${string}` | "children" | "src"> {}

export const Style: FC<StyleProps> = ({ dangerouslySetInnerHTML, ...props }) => {
  const ssrContext = useContext(SSRContext);

  if (ssrContext && typeof window === "undefined") {
    ssrContext.styles ||= [];

    const attrs = Object.entries(props)
      .map(([name, value]) => `${name}="${value}"`)
      .join(" ");

    ssrContext.styles.push(
      `<style${attrs ? ` ${attrs}` : ""}>${dangerouslySetInnerHTML?.__html.toString().trim() || ""}</style>`
    );
  }

  return null;
};
