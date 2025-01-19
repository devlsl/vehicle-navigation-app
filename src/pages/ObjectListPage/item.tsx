import styled from "styled-components";
import { ObjectDto } from "../../shared/api/schemas/object";
import { rounded } from "../../shared/styled/rounded";
import { Link } from "../../shared/uikit/Link";
import { Button } from "../../shared/uikit/Button";

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  gap: 20px;
  ${rounded("m")}
  border: 2px solid var(--line-color);
  background-color: var(--foreground-color);
`;

const ObjectItemName = styled.span`
  font-size: 1.5rem;
  text-transform: capitalize;
`;

type Props = { object: ObjectDto };

export const ObjectItem = (props: Props) => {
  const {
    object: { id, name },
  } = props;

  return (
    <Wrapper>
      <ObjectItemName>{name}</ObjectItemName>
      <Link to={`/object/${id}`}>
        <Button>Подробнее</Button>
      </Link>
    </Wrapper>
  );
};
