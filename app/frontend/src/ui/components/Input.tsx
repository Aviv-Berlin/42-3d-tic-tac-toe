const normalize = (name: string) => {
  return name
          .replace(/([A-Z])/g, (c) => ` ${c}`)
          .replace(/^./, (c) => c.toUpperCase())
}

interface InputProps {
  name: string;
  value: string;
  handler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validate?: () => boolean;
  message?: string;
  submit?: boolean;
}

const Input = ({name, value, handler, validate, message, submit}: InputProps) => {
  const label = normalize(name);
  const type = (name.toLowerCase().includes("password")) ? "password" : "text";
  return (
    <div className="flex flex-col">
      <label className="flex flex-col">
        {label}
        <input className="border focus:outline-none border-dark-grey p-2" type={type} name={name} onChange={handler} />
        <p className="text-sm text-dark-orange min-h-5">
          {submit && !value && "This field cannot be empty"}
          {!(submit && !value) && validate && value && !validate() && message}
        </p>
      </label>
    </div>
  )
}

export default Input
