import styled from "styled-components";
import { rounded } from "../../../shared/styled/rounded";

export const ItemWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  gap: 20px;
  ${rounded("m")}
  background-color: var(--foreground-color);
  border: 2px solid var(--line-color);
`;
