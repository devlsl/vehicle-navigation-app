import styled from "styled-components";
import { ObjectDto } from "./schemas/object";
import { Link } from "react-router";
import { useLoading } from "./hooks/useLoading";
import { getObjectById } from "./api/getObjectById";
import { useSocketInstance } from "./socketContext/useSocketInstance";

const Wrapper = styled.div`
  border: 1px solid aqua;
  border-radius: 6px;
  padding: 10px;
`;

type Props = { object: ObjectDto };

export const ObjectItem = (props: Props) => {
  const {
    object: { id, name },
  } = props;
  const socket = useSocketInstance();
  const { data, status } = useLoading(
    () => getObjectById(socket, { id }),
    [id]
  );
  if (status === "success") {
    return (
      <Wrapper>
        <div>{name}</div>
        <Link to={`/object/${id}`}>Подробнее</Link>
      </Wrapper>
    );
  }
};
