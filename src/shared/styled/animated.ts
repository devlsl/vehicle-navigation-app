import { css } from "styled-components";

type Animated = "colors" | "movements";

const properiesForAnimation: Record<Animated, string[]> = {
  colors: ["color", "background-color", "border-color", "opacity"],
  movements: ["transform"],
};

export const animated = (what: Animated[]) => {
  return css`
    transition-timing-function: ease-in;
    transition-duration: var(--animation-time);
    transition-property: ${what
      .flatMap((el) => properiesForAnimation[el])
      .join(",")};
  `;
};
