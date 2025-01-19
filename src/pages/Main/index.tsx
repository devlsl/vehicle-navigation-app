import { Button } from "../../shared/uikit/Button";
import { Link } from "../../shared/uikit/Link";
import { FullPage } from "../../shared/uikit/Center";

export const MainPage = () => (
  <FullPage>
    <Link to="/objects">
      <Button>Посмотреть объекты</Button>
    </Link>
  </FullPage>
);
