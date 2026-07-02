const Button = ({ type = "button", children, border = "yes", ...props }) => {
  const b = border === "yes" ? "border border-stone-400" : "";
  return (
    <button 
      type={type}
      className={`${b} px-4 py-2 hover:bg-stone-200 cursor-pointer`}
      {...props}
    >{children}</button>
  )
}

export default Button
