import { useState } from "react";
import { BiHide, BiShowAlt } from "react-icons/bi";

const PasswordInput = ({ label = "Contraseña", ...props }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="group">
      {label && <label>{label}</label>}

      <div className="input-container">
        <input type={show ? "text" : "password"} {...props} />
        <button type="button" onClick={() => setShow(!show)} tabIndex={-1}>
          {show ? <BiHide /> : <BiShowAlt />}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
