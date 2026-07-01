const normalize = (name) => {
  return name
          .replace(/([A-Z])/g, (c) => ` ${c}`)
          .replace(/^./, (c) => c.toUpperCase())
}

const Input = ({name, value, handler, validate, message, submit}) => {
  const label = normalize(name);
  const type = (name.toLowerCase().includes("password")) ? "password" : "text";
  return (
    <div className="input-container">
      <label>{label}
        <div><input className="input-field" type={type} name={name} onChange={handler} /></div>
      </label>
      <div className="invalid-input-message">
        {(submit && !value && "This field cannot be empty") ||
          (validate && value && !validate() && message)}
      </div>
    </div>
  )
}

export default Input
