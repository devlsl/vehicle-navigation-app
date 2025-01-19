import styled from "styled-components";

export const VerticalSpace = styled.div<{ $size: string }>`
  height: ${({ $size }) => $size};
`;
