import { Button } from "../../shared/uikit/Button";
import { Link } from "../../shared/uikit/Link";
import { FullPage } from "../../shared/uikit/FullPage";

export const MainPage = () => (
  <FullPage>
    <Link to="/objects">
      <Button>Посмотреть объекты</Button>
    </Link>
  </FullPage>
);
