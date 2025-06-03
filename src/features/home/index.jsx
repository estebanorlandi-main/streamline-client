import { useAuth } from "../auth/context";
import Importer from "../importer";

function Home() {
  const { session } = useAuth();

  return (
    <div>
      <Importer />
    </div>
  );
}

export default Home;
