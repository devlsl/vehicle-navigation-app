import { Center } from "../../shared/uikit/Center";

export const NotFoundPage = ({ entityName }: { entityName: string }) => {
  return <Center>{entityName} not found</Center>;
};
