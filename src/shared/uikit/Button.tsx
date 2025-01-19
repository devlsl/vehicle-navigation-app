import { forwardRef } from "react";
import styled from "styled-components";
import { animated } from "../styled/animated";
import { rounded } from "../styled/rounded";

const StyledButton = styled.button`
  background-color: var(--accent-color);
  align-items: center;
  ${rounded("s")}
  border-style: none;
  box-shadow: rgba(255, 255, 255, 0.26) 0 1px 2px inset;

  display: inline-flex;
  color: #fff;
  cursor: pointer;
  flex-shrink: 0;
  font-size: 1.4rem;
  padding: 10px 20px;
  text-align: center;

  ${animated(["colors", "movements"])}

  &:active {
    opacity: 0.1;
    transform: translateY(1px);
  }

  &:hover {
    opacity: 0.9;
  }
`;

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const { children, ...otherProps } = props;
  return (
    <StyledButton ref={ref} role="button" {...otherProps}>
      {children}
    </StyledButton>
  );
});
