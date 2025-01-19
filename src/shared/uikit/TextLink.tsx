import { Link as RouterLink } from "react-router";
import styled from "styled-components";

export const TextLink = styled(RouterLink)`
  color: inherit;
  text-decoration: none;
  font-size: 1.6rem;

  &:hover {
    text-decoration: underline;
  }
`;
