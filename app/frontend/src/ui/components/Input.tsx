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
        <input className="border rounded-md border-stone-400 focus:outline-none focus:border-stone-800 p-2" type={type} name={name} onChange={handler} />
        <p className="text-sm text-stone-600 min-h-[20px]">
          {submit && !value && "This field cannot be empty"}
          {!(submit && !value) && validate && value && !validate() && message}
        </p>
      </label>
    </div>
  )
}

export default Input
