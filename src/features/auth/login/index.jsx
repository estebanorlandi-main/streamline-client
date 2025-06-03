import { useState } from "react";
import { useAuth } from "../context";
import PasswordInput from "../../ui/inputs/PasswordInput";
import styled from "styled-components";

const init = {
  username: "",
  password: "",
};
function Login() {
  const { login } = useAuth();
  const [inputs, setInputs] = useState(init);

  const onChange = ({ target: { name, value } }) => {
    setInputs((old) => ({ ...old, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!inputs.username || !inputs.password) return;
    await login(inputs.username, inputs.password);
    setInputs(init);
  };

  return (
    <Container>
      <div>
        <h1>Importador StreamLine</h1>
        <form onSubmit={onSubmit}>
          <div className="groups">
            <div className="group">
              <label>Usuario</label>

              <div className="input-container">
                <input
                  name="username"
                  value={inputs.username}
                  type="text"
                  placeholder="Usuario"
                  onChange={onChange}
                />
              </div>
            </div>

            <div className="group">
              <PasswordInput
                label="Contraseña"
                name="password"
                value={inputs.password}
                placeholder="Contraseña"
                onChange={onChange}
              />
            </div>
          </div>

          <button type="submit">Iniciar sesion </button>
        </form>
      </div>
    </Container>
  );
}

export default Login;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: #f0f0f0;

  display: grid;
  place-items: center;

  & > div {
    padding: 2em;
    background: #fff;
    box-shadow: 0 5px 10px #0005;
  }

  h1 {
  }

  form {
    display: flex;
    flex-flow: column;
  }

  .groups {
    display: flex;
    flex-flow: column;
    gap: 1em;
    margin: 1em 0;

    .group {
      display: flex;
      flex-flow: column;
      gap: 0.25em;
    }
  }

  .group {
    label {
      font-weight: 600;
      font-size: 0.85em;
    }
  }

  .input-container {
    height: 2.5em;
    display: grid;
    grid-template-columns: 1fr auto;
    border: 1px solid #d0d0d0;
    border-radius: 5px;
    overflow: hidden;

    button {
      display: grid;
      place-items: center;
      aspect-ratio: 1/1;
      background: transparent;
      border: none;
      border-left: 1px solid #d0d0d0;
    }

    input {
      border: none;
      background: #fff;
      width: 100%;
      padding: 0 1em;
    }
    input:focus {
      outline: none;
    }

    &:focus-within {
      border: 1px solid #7eb628;
    }
  }
`;
