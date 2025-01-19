import { css } from "styled-components";

type RoundingSize = "s" | "m" | "l" | "max" | "circle";

export const rounded = (size: RoundingSize) => css`
  border-radius: var(--rounding-radius-${size});
`;
