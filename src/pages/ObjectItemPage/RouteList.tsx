import { Button } from "../../shared/uikit/Button";
import { ListWrapper } from "./components/ListWrapper";
import { ListTitle } from "./components/ListTitle";
import { ItemWrapper } from "./components/ItemWrapper";
import { Route } from "./types/Route";
import styled from "styled-components";
import { rounded } from "../../shared/styled/rounded";

const RouteInfoWrapper = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
`;

const RouteInfoText = styled.span`
  font-size: 1.3rem;
`;

const mapRouteStatusToColor: Record<Route["status"], string> = {
  done: "var(--success-color)",
  execution: "var(--warning-color)",
};

const RouteStatusLabel = styled.span<{ $status: Route["status"] }>`
  font-size: 1.5rem;
  background-color: ${({ $status }) => mapRouteStatusToColor[$status]};
  text-align: center;
  padding: 4px 8px;
  ${rounded("s")}
  color: #fff;
`;

type Props = {
  onToggleIsShownRoute: (id: Route["id"]) => void;
  routes: Route[];
};

export const RouteList = (props: Props) => {
  const { routes, onToggleIsShownRoute } = props;

  return (
    <>
      <ListTitle>Маршруты</ListTitle>
      <ListWrapper>
        {routes.map((route) => (
          <ItemWrapper key={route.id}>
            <RouteInfoWrapper>
              <RouteInfoText>Номер: {route.id}</RouteInfoText>
              <RouteInfoText>Точки: {route.path.length} шт.</RouteInfoText>
              <RouteStatusLabel $status={route.status}>
                {route.status === "done" ? "Выполнен" : " Выполняется"}
              </RouteStatusLabel>
            </RouteInfoWrapper>

            <Button onClick={() => onToggleIsShownRoute(route.id)}>
              {route.isShown ? "Скрыть" : "Показать"}
            </Button>
          </ItemWrapper>
        ))}
      </ListWrapper>
    </>
  );
};
