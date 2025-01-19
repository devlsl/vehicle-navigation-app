import { Button } from "../../shared/uikit/Button";
import { Center } from "../../shared/uikit/Center";
import { Link } from "../../shared/uikit/Link";

export const MainPage = () => {
  return (
    <Center>
      <Link to="/objects">
        <Button>Посмотреть объекты</Button>
      </Link>
    </Center>
  );
};
