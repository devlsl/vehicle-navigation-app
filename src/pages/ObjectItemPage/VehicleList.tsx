import styled, { css } from "styled-components";
import { VehicleDto } from "../../shared/api/schemas/vehicle";
import { rounded } from "../../shared/styled/rounded";
import { Button } from "../../shared/uikit/Button";
import { animated } from "../../shared/styled/animated";
import { ItemWrapper } from "./components/ItemWrapper";
import { ListWrapper } from "./components/ListWrapper";
import { ListTitle } from "./components/ListTitle";

const VehicleItemWrapper = styled(ItemWrapper)<{ $isSelected: boolean }>`
  ${animated(["colors"])}
  border: 2px solid
    ${({ $isSelected }) =>
    $isSelected ? css`var(--accent-color)` : css`var(--line-color)`};
`;

const VehicleInfoWrapper = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
`;

const VehicleItemName = styled.span`
  font-size: 1.5rem;
  text-transform: capitalize;
`;

const mapVehicleStatusToColor: Record<VehicleStatus, string> = {
  idle: "var(--success-color)",
  onRoute: "var(--warning-color)",
};

const VehicleStatusLabel = styled.span<{ $status: VehicleStatus }>`
  font-size: 1.5rem;
  background-color: ${({ $status }) => mapVehicleStatusToColor[$status]};
  text-align: center;
  padding: 4px 8px;
  ${rounded("s")}
  color: #fff;
`;

type VehicleStatus = "onRoute" | "idle";

export type VehicleListItem = VehicleDto & {
  status: VehicleStatus;
};

type Props = {
  onSelectVehicle: (id: VehicleListItem["id"]) => void;
  selectedVehicle: VehicleListItem["id"] | null;
  vehicles: VehicleListItem[];
};

export const VehicleList = (props: Props) => {
  const { onSelectVehicle, selectedVehicle, vehicles } = props;

  return (
    <>
      <ListTitle>Техника</ListTitle>
      <ListWrapper>
        {vehicles.map((vehicle) => (
          <VehicleItemWrapper
            key={vehicle.id}
            $isSelected={selectedVehicle === vehicle.id}
          >
            <VehicleInfoWrapper>
              <VehicleItemName>{vehicle.name}</VehicleItemName>
              <VehicleStatusLabel $status={vehicle.status}>
                {vehicle.status === "onRoute" ? "в пути" : "свободно"}
              </VehicleStatusLabel>
            </VehicleInfoWrapper>
            <Button onClick={() => onSelectVehicle(vehicle.id)}>Выбрать</Button>
          </VehicleItemWrapper>
        ))}
      </ListWrapper>
    </>
  );
};
