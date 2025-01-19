import { useLoading } from "../../shared/hooks/useLoading.ts";
import { useSocketInstance } from "../../shared/modules/socket/context/useSocketInstance.ts";
import { LoadingPage } from "../LoadingPage.tsx";
import styled from "styled-components";
import { PageTitle } from "../../shared/uikit/PageTitle.tsx";
import { getObjects } from "../../shared/api/endpoints/getObjects.ts";
import { ObjectItem } from "./item.tsx";
import { stretch } from "../../shared/styled/stretch.ts";
import { container } from "../../shared/styled/container.ts";
import { TextLink } from "../../shared/uikit/TextLink.tsx";

const Wrapper = styled.div`
  ${stretch}
  ${container}
  padding-top: 40px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 10px;
`;

export const ObjectListPage = () => {
  const socket = useSocketInstance();
  const { data, status } = useLoading(() => getObjects(socket), []);

  if (status === "loading") {
    return <LoadingPage />;
  }

  if (status === "success") {
    const List = data.data.objects.map((item) => (
      <ObjectItem key={item.id} object={item} />
    ));

    return (
      <Wrapper>
        <TextLink to="/">{"Назад"}</TextLink>

        <PageTitle>Объекты</PageTitle>
        <ListWrapper>{List}</ListWrapper>
      </Wrapper>
    );
  }

  if (status === "error") {
    <div>Something went wrong...</div>;
  }

  return null;
};
