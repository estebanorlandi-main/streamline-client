import styled from "styled-components";
import { useAuth } from "../../auth/context";
import { BiLogOutCircle } from "react-icons/bi";

function LayoutWithSession({ children }) {
  const { logout, session } = useAuth();
  return (
    <>
      <Header>
        <div className="nav-container">
          <h1>StreamLine</h1>

          <div className="right">
            <p className="user">{session?.display_name}</p>
            <button className="logout" onClick={logout}>
              <BiLogOutCircle size={20} />
            </button>
          </div>
        </div>
      </Header>
      <Main>
        <div className="container">{children}</div>
      </Main>
    </>
  );
}

export default LayoutWithSession;

const nav_size = 3;
const Header = styled.header`
  position: relative;
  height: ${nav_size}em;
  background: #7eb628;
  box-shadow: 0 5px 10px #7eb628aa;
  z-index: 2;
  display: flex;
  align-items: center;

  h1 {
    font-size: 0.9em;
    color: #fff;
  }

  .nav-container {
    margin: 0 auto;
    width: 95%;
    max-width: 1800px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .nav-container > .right {
    display: flex;
    align-items: center;
    gap: 1em;

    .user {
      color: #fff;
      font-size: 0.85em;
      font-weight: 600;
    }

    .logout {
      padding: 5px;
      display: flex;
      color: #fff;
      aspect-ratio: 1/1;
      background: #f33;
      border: none;
      border-radius: 5px;
    }
  }
`;

const Main = styled.main`
  height: calc(100vh - ${nav_size}em);
  background: #f0f0f0;

  & > .container {
    width: 95%;
    max-width: 1800px;

    margin: 0 auto;
    padding: 1em 0 0 0;
  }
`;

const Footer = styled.footer``;
