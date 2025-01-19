import { FullPage } from "../../shared/uikit/Center";

export const NotFoundPage = ({ entityName }: { entityName: string }) => (
  <FullPage>{entityName} not found</FullPage>
);
