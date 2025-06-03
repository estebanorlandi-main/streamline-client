import { Route, Routes } from "react-router";
import { useAuth } from "./features/auth/context";
import Login from "./features/auth/login";
import LayoutWithSession from "./features/ui/layouts/with_session";
import LayoutWithoutSession from "./features/ui/layouts/without_session";
import Home from "./features/home";
import styled from "styled-components";

function App() {
  const auth = useAuth();

  if (auth.isLoading)
    return (
      <SessionLoader>
        <p>Validando sesion...</p>
      </SessionLoader>
    );
  if (!auth.session)
    return (
      <LayoutWithoutSession>
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      </LayoutWithoutSession>
    );

  return (
    <LayoutWithSession>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </LayoutWithSession>
  );
}

export default App;

const SessionLoader = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  display: grid;
  place-items: center;

  font-size: 1.5em;
  font-weight: 600;
  color: #fff;

  background: #7eb628;
`;
