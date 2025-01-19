import { FullPage } from "../../shared/uikit/FullPage";

export const NotFoundPage = ({ entityName }: { entityName: string }) => (
  <FullPage>{entityName} not found</FullPage>
);
