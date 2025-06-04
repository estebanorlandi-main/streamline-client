import { useCallback, useEffect, useState } from "react";
import styled, { css } from "styled-components";
import * as xlsx from "xlsx";
import { api } from "../../libs/axios/api";
import { useAuth } from "../auth/context";

const init = {
  file: null,
};

function Importer() {
  const auth = useAuth();
  const [state, setState] = useState({
    isLoading: false,
  });
  const [inputs, setInputs] = useState(init);
  const [fileData, setFileData] = useState(null);

  useEffect(() => {
    if (!inputs.file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const wb = xlsx.read(data, { type: "array" });
      setFileData({
        workbook: wb,
        pages: wb.SheetNames,
        page: wb.Sheets[wb.SheetNames[0]],
      });
    };
    reader.readAsArrayBuffer(inputs.file);
  }, [inputs.file]);

  const [archivos, setArchivos] = useState({ isLoading: true, data: null });
  const getFiles = useCallback(async () => {
    if (!auth.token) return null;

    setArchivos((old) => ({ ...old, isLoading: true }));
    try {
      const { data } = await api.get("/importer", {
        headers: `Bearer ${auth.token}`,
      });
      console.log(data.archivos);

      setArchivos((old) => ({ ...old, isLoading: false, data }));
    } catch (e) {
      setArchivos((old) => ({ ...old, isLoading: false }));
    }
  }, [auth.token]);

  useEffect(() => {
    getFiles();
  }, [getFiles]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const token = auth.token;
    if (state.isLoading || !token) return null;

    setState((old) => ({ ...old, isLoading: true }));

    try {
      const formData = new FormData();
      formData.append("file", inputs.file);
      const { data } = await api.post("/importer", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      getFiles();
      setState((old) => ({ isLoading: false, error: null }));
    } catch (e) {
      setState((old) => ({ isLoading: false, error: e.message }));
    }
  };

  return (
    <Container>
      <p>{state.isLoading ? "Enviando datos" : ""}</p>
      <form onSubmit={onSubmit}>
        <h2 className="title">Archivo de seguimiento</h2>
        <div className="file-container">
          <label htmlFor="file-input">
            {inputs.file ? (
              <div>
                <p>{inputs.file.name}</p>
              </div>
            ) : (
              <div>Cargar Archivo</div>
            )}
          </label>

          <input
            name="file-input"
            id="file-input"
            type="file"
            accept=".xls,.xlsx"
            onChange={({ target: { files } }) =>
              setInputs((old) => ({ ...old, file: files?.[0] || null }))
            }
          />
        </div>

        <div className="handlers">
          <button disabled={state.isLoading ? true : false} type="submit">
            Enviar
          </button>
          <button onClick={() => setInputs({ file: null })} type="reset">
            Cancelar
          </button>
        </div>
      </form>

      <Archivos>
        <Archivo $header>
          <p>Nombre usuario</p>
          <p>Archivo</p>
          <p>Fecha</p>
        </Archivo>
        {archivos?.data?.archivos?.map((a) => (
          <Archivo key={a.id}>
            <p className="">{a.display_name}</p>
            <a
              className="file"
              onClick={async () => {
                const response = await fetch(
                  `${import.meta.env.VITE_API_URL}/importer/${a.id}`,
                  {
                    headers: {
                      Authorization: `Bearer ${auth.token}`,
                    },
                  }
                );

                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = a.file_name;
                link.click();
                URL.revokeObjectURL(url);
              }}
            >
              {a.file_name}
            </a>
            <p>{printDate(a.created_at.toLocaleString("es-ES"))}</p>
          </Archivo>
        ))}
      </Archivos>
    </Container>
  );
}

function printDate(str) {
  const date = new Date(str);
  date.setHours(date.getHours() + 3);
  return date.toLocaleString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",

    hour: "2-digit",
    minute: "2-digit",
  });
}

const Archivos = styled.div`
  margin-top: 1em;

  > *:nth-child(2n) {
    background: #ddd;
  }
`;
const Archivo = styled.div`
  display: grid;
  grid-template-columns: minmax(100px, 150px) 1fr minmax(100px, 150px);
  gap: 1em;
  padding: 0.5em 0;

  & > * {
    white-space: nowrap;
    padding-right: 0.5em;
    padding-left: 0.5em;
  }

  .file {
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
    color: #33f;
    &:hover {
      color: #11a;
    }
  }

  ${({ $header }) =>
    $header
      ? css`
          font-weight: 600;
          font-size: 0.8em;
          border-bottom: 1px solid #d0d0d0;
          & > *:not(:last-child) {
            border-right: 1px solid #d0d0d0;
          }
        `
      : css``}
`;

export default Importer;

const Container = styled.div`
  max-width: 720px;
  margin: 0 auto;

  .title {
    text-align: center;
    margin: 1em 0 0.5em 0;
  }

  .file-container {
    position: relative;

    label {
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px dashed #d0d0d0;
      border-radius: 1rem;
      padding: 1rem;
      height: 10rem;
      cursor: pointer;
      transition: all 0.15s;
    }
    label:hover {
      border: 2px dashed #7eb628;
    }

    input[type="file"] {
      position: absolute;
      top: 0;
      left: 0;
      width: 0;
      height: 0;
      opacity: 0;
    }
  }

  .handlers {
    display: flex;
    justify-content: flex-end;
    gap: 1em;
    margin: 1em 0 0 0;
  }

  button[type="submit"],
  button[type="reset"] {
    padding: 0.5em 1em;
    border-radius: 5px;
    border: none;
    cursor: pointer;
  }

  button[type="submit"] {
    border: 1px solid #7eb628;
    color: #52781a;
  }

  button[type="reset"] {
    background: #f33;
    color: #fff;
  }
`;
