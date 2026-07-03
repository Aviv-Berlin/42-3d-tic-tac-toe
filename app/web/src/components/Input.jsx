const normalize = (name) => {
  return name
          .replace(/([A-Z])/g, (c) => ` ${c}`)
          .replace(/^./, (c) => c.toUpperCase())
}

const Input = ({name, value, handler, validate, message, submit}) => {
  const label = normalize(name);
  const type = (name.toLowerCase().includes("password")) ? "password" : "text";
  return (
    <div className="flex flex-col">
      <label className="flex flex-col">
        {label}
        <input className="border border-stone-400 focus:outline-none focus:border-stone-800 p-2" type={type} name={name} onChange={handler} />
        {(submit && !value && "This field cannot be empty") ||
          (validate && value && !validate() && message) ||
          '\u00A0'}
      </label>
    </div>
  )
}

export default Input
